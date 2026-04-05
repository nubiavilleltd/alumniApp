-- Messages prototype schema for a Supabase-backed implementation.
-- This is intentionally aligned to the current frontend contract so the UI can
-- switch from mock transport to a live transport with minimal churn.

create extension if not exists pgcrypto;

create schema if not exists private;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.chat_profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users (id) on delete set null,
  member_id text not null unique,
  slug text not null unique,
  full_name text not null,
  first_name text not null,
  headline text not null default '',
  location text not null default '',
  graduation_year integer not null,
  avatar_url text null,
  initials text not null,
  profile_href text not null,
  presence text not null default 'offline' check (presence in ('online', 'away', 'offline')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists set_chat_profiles_updated_at on public.chat_profiles;
create trigger set_chat_profiles_updated_at
before update on public.chat_profiles
for each row
execute function public.set_updated_at();

create table if not exists public.message_threads (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('direct', 'group')),
  category text not null check (category in ('Mentorship', 'Events', 'Marketplace', 'Community')),
  title text null,
  subtitle text null,
  topic text not null default '',
  description text null,
  avatar_url text null,
  initials text null,
  direct_key text null unique,
  is_archived boolean not null default false,
  attachments_enabled boolean not null default true,
  audio_enabled boolean not null default true,
  last_message_at timestamptz null,
  last_message_preview text not null default '',
  last_message_sender_name text null,
  created_by uuid not null references public.chat_profiles (id) on delete restrict,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists set_message_threads_updated_at on public.message_threads;
create trigger set_message_threads_updated_at
before update on public.message_threads
for each row
execute function public.set_updated_at();

create table if not exists public.message_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.message_threads (id) on delete cascade,
  sender_profile_id uuid not null references public.chat_profiles (id) on delete restrict,
  sender_member_id text not null,
  body text not null default '',
  client_generated_id text not null,
  created_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz null,
  constraint message_messages_client_generated_id_unique unique (thread_id, client_generated_id)
);

create table if not exists public.message_thread_participants (
  thread_id uuid not null references public.message_threads (id) on delete cascade,
  profile_id uuid not null references public.chat_profiles (id) on delete cascade,
  member_id text not null,
  role_in_thread text not null default 'member' check (role_in_thread in ('member', 'moderator', 'admin')),
  is_pinned boolean not null default false,
  joined_at timestamptz not null default timezone('utc', now()),
  last_delivered_message_id uuid null references public.message_messages (id) on delete set null,
  last_read_message_id uuid null references public.message_messages (id) on delete set null,
  last_read_at timestamptz null,
  primary key (thread_id, profile_id),
  constraint message_thread_participants_member_unique unique (thread_id, member_id)
);

create table if not exists public.message_attachments (
  id uuid primary key default gen_random_uuid(),
  message_id uuid null references public.message_messages (id) on delete set null,
  thread_id uuid not null references public.message_threads (id) on delete cascade,
  uploader_profile_id uuid not null references public.chat_profiles (id) on delete restrict,
  kind text not null check (kind in ('file', 'image', 'audio')),
  file_name text not null,
  mime_type text not null,
  size_in_bytes bigint not null check (size_in_bytes >= 0),
  duration_seconds integer null check (duration_seconds is null or duration_seconds >= 0),
  upload_state text not null default 'uploaded' check (upload_state in ('uploaded', 'processing')),
  storage_bucket text not null,
  storage_path text not null,
  public_url text null,
  waveform jsonb null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists set_message_attachments_updated_at on public.message_attachments;
create trigger set_message_attachments_updated_at
before update on public.message_attachments
for each row
execute function public.set_updated_at();

create index if not exists chat_profiles_auth_user_id_idx
  on public.chat_profiles (auth_user_id);

create index if not exists chat_profiles_member_id_idx
  on public.chat_profiles (member_id);

create index if not exists message_threads_last_message_at_idx
  on public.message_threads (last_message_at desc nulls last);

create index if not exists message_threads_direct_key_idx
  on public.message_threads (direct_key);

create index if not exists message_thread_participants_profile_thread_idx
  on public.message_thread_participants (profile_id, thread_id);

create index if not exists message_thread_participants_member_thread_idx
  on public.message_thread_participants (member_id, thread_id);

create index if not exists message_messages_thread_created_at_idx
  on public.message_messages (thread_id, created_at desc);

create index if not exists message_messages_sender_created_at_idx
  on public.message_messages (sender_profile_id, created_at desc);

create index if not exists message_attachments_thread_created_at_idx
  on public.message_attachments (thread_id, created_at desc);

create index if not exists message_attachments_message_id_idx
  on public.message_attachments (message_id);

create or replace function private.current_chat_profile_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select cp.id
  from public.chat_profiles cp
  where cp.auth_user_id = (select auth.uid())
  limit 1;
$$;

create or replace function private.is_thread_participant(target_thread_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.message_thread_participants mtp
    where mtp.thread_id = target_thread_id
      and mtp.profile_id = (select private.current_chat_profile_id())
  );
$$;

grant usage on schema private to authenticated;
grant execute on function private.current_chat_profile_id() to authenticated;
grant execute on function private.is_thread_participant(uuid) to authenticated;

alter table public.chat_profiles enable row level security;
alter table public.message_threads enable row level security;
alter table public.message_thread_participants enable row level security;
alter table public.message_messages enable row level security;
alter table public.message_attachments enable row level security;

drop policy if exists "Authenticated users can view chat profiles" on public.chat_profiles;
create policy "Authenticated users can view chat profiles"
on public.chat_profiles
for select
to authenticated
using (true);

drop policy if exists "Users can update their own claimed chat profile" on public.chat_profiles;
create policy "Users can update their own claimed chat profile"
on public.chat_profiles
for update
to authenticated
using (auth_user_id = (select auth.uid()))
with check (auth_user_id = (select auth.uid()));

drop policy if exists "Participants can view their threads" on public.message_threads;
create policy "Participants can view their threads"
on public.message_threads
for select
to authenticated
using ((select private.is_thread_participant(id)));

drop policy if exists "Participants can view participant rows in their threads" on public.message_thread_participants;
create policy "Participants can view participant rows in their threads"
on public.message_thread_participants
for select
to authenticated
using ((select private.is_thread_participant(thread_id)));

drop policy if exists "Users can update their own participant row" on public.message_thread_participants;
create policy "Users can update their own participant row"
on public.message_thread_participants
for update
to authenticated
using (profile_id = (select private.current_chat_profile_id()))
with check (profile_id = (select private.current_chat_profile_id()));

drop policy if exists "Participants can view messages in their threads" on public.message_messages;
create policy "Participants can view messages in their threads"
on public.message_messages
for select
to authenticated
using ((select private.is_thread_participant(thread_id)));

drop policy if exists "Participants can view attachments in their threads" on public.message_attachments;
create policy "Participants can view attachments in their threads"
on public.message_attachments
for select
to authenticated
using ((select private.is_thread_participant(thread_id)));

drop policy if exists "Participants can stage attachments in their threads" on public.message_attachments;
create policy "Participants can stage attachments in their threads"
on public.message_attachments
for insert
to authenticated
with check (
  uploader_profile_id = (select private.current_chat_profile_id())
  and (select private.is_thread_participant(thread_id))
);

-- Thread creation, participant insertion, and message writes are intentionally
-- not opened directly here yet. Add those write paths together with the
-- Supabase transport and RPC phase so the migration stays controlled.

drop policy if exists "Uploaders can update their staged attachments" on public.message_attachments;
create policy "Uploaders can update their staged attachments"
on public.message_attachments
for update
to authenticated
using (
  uploader_profile_id = (select private.current_chat_profile_id())
  and (select private.is_thread_participant(thread_id))
)
with check (
  uploader_profile_id = (select private.current_chat_profile_id())
  and (select private.is_thread_participant(thread_id))
);

drop policy if exists "Uploaders can delete their staged attachments" on public.message_attachments;
create policy "Uploaders can delete their staged attachments"
on public.message_attachments
for delete
to authenticated
using (
  uploader_profile_id = (select private.current_chat_profile_id())
  and message_id is null
  and (select private.is_thread_participant(thread_id))
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'message-attachments',
  'message-attachments',
  false,
  10485760,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
    'audio/mp4',
    'audio/mpeg',
    'audio/webm'
  ]
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Participants can read message attachment objects" on storage.objects;
create policy "Participants can read message attachment objects"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'message-attachments'
  and (storage.foldername(name))[1] = 'threads'
  and (storage.foldername(name))[2] ~* '^[0-9a-f-]{36}$'
  and (
    select private.is_thread_participant(((storage.foldername(name))[2])::uuid)
  )
);

drop policy if exists "Participants can upload message attachment objects" on storage.objects;
create policy "Participants can upload message attachment objects"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'message-attachments'
  and (storage.foldername(name))[1] = 'threads'
  and (storage.foldername(name))[2] ~* '^[0-9a-f-]{36}$'
  and (
    select private.is_thread_participant(((storage.foldername(name))[2])::uuid)
  )
);

drop policy if exists "Participants can update message attachment objects" on storage.objects;
create policy "Participants can update message attachment objects"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'message-attachments'
  and (storage.foldername(name))[1] = 'threads'
  and (storage.foldername(name))[2] ~* '^[0-9a-f-]{36}$'
  and (
    select private.is_thread_participant(((storage.foldername(name))[2])::uuid)
  )
)
with check (
  bucket_id = 'message-attachments'
  and (storage.foldername(name))[1] = 'threads'
  and (storage.foldername(name))[2] ~* '^[0-9a-f-]{36}$'
  and (
    select private.is_thread_participant(((storage.foldername(name))[2])::uuid)
  )
);

drop policy if exists "Participants can delete staged message attachment objects" on storage.objects;
create policy "Participants can delete staged message attachment objects"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'message-attachments'
  and (storage.foldername(name))[1] = 'threads'
  and (storage.foldername(name))[2] ~* '^[0-9a-f-]{36}$'
  and (
    select private.is_thread_participant(((storage.foldername(name))[2])::uuid)
  )
);
