-- Seed data for the Supabase-backed messages prototype.
--
-- Important:
-- 1. This file seeds chat domain data with deterministic profile IDs.
-- 2. The auth_user_id column is intentionally nullable so you can seed first.
-- 3. After creating your Supabase Auth users, link them with statements like:
--
--    update public.chat_profiles
--    set auth_user_id = '<supabase-auth-user-uuid>'
--    where member_id = 'MBR-1998-143776';
--
-- 4. Once auth_user_id is linked, RLS will allow each tester to see only their
--    own threads and messages.

insert into public.chat_profiles (
  id,
  auth_user_id,
  member_id,
  slug,
  full_name,
  first_name,
  headline,
  location,
  graduation_year,
  avatar_url,
  initials,
  profile_href,
  presence
)
values
  (
    '11111111-1111-4111-8111-111111111111',
    null,
    'MBR-1998-143776',
    'adaeze-okonkwo',
    'Adaeze Chioma Okonkwo',
    'Adaeze',
    'Strategy consultant and alumni mentor',
    'Lagos, Nigeria',
    1998,
    'https://images.unsplash.com/photo-1573497161161-c3e73707e25c?w=200&q=80',
    'AO',
    '/alumni/adaeze-okonkwo',
    'online'
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    null,
    'MBR-2002-6cefa1',
    'ngozi-ibrahim',
    'Ngozi Blessing Ibrahim',
    'Ngozi',
    'Healthcare leader and mentorship partner',
    'Lagos, Nigeria',
    2002,
    'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&q=80',
    'NI',
    '/alumni/ngozi-ibrahim',
    'away'
  ),
  (
    '33333333-3333-4333-8333-333333333333',
    null,
    'MBR-2005-7b072d',
    'chidinma-eze',
    'Chidinma Sandra Eze',
    'Chidinma',
    'Software founder and community builder',
    'Abuja, Nigeria',
    2005,
    'https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=200&q=80',
    'CE',
    '/alumni/chidinma-eze',
    'online'
  ),
  (
    '44444444-4444-4444-8444-444444444444',
    null,
    'MBR-1990-319fa4',
    'precious-ojeka',
    'Precious Ojeka',
    'Precious',
    'Investment adviser and chapter volunteer',
    'Lagos, Nigeria',
    1990,
    null,
    'PO',
    '/alumni/precious-ojeka',
    'offline'
  )
on conflict (member_id) do update
set slug = excluded.slug,
    full_name = excluded.full_name,
    first_name = excluded.first_name,
    headline = excluded.headline,
    location = excluded.location,
    graduation_year = excluded.graduation_year,
    avatar_url = excluded.avatar_url,
    initials = excluded.initials,
    profile_href = excluded.profile_href,
    presence = excluded.presence;

insert into public.message_threads (
  id,
  type,
  category,
  title,
  subtitle,
  topic,
  description,
  avatar_url,
  initials,
  direct_key,
  is_archived,
  attachments_enabled,
  audio_enabled,
  last_message_at,
  last_message_preview,
  last_message_sender_name,
  created_by,
  created_at,
  updated_at
)
values
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
    'direct',
    'Mentorship',
    null,
    null,
    'Mentorship circle launch',
    'A warm direct mentorship thread between Adaeze and Ngozi.',
    null,
    null,
    'MBR-1998-143776__MBR-2002-6cefa1',
    false,
    true,
    true,
    '2026-03-31T08:12:00.000Z',
    'Absolutely. I recorded a quick note here with the structure I normally use.',
    'Adaeze Chioma Okonkwo',
    '11111111-1111-4111-8111-111111111111',
    '2026-03-29T07:00:00.000Z',
    '2026-03-31T08:12:00.000Z'
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2',
    'direct',
    'Marketplace',
    null,
    null,
    'Website refresh support',
    'A direct marketplace introduction thread.',
    null,
    null,
    'MBR-1990-319fa4__MBR-1998-143776',
    false,
    true,
    true,
    '2026-03-31T09:22:00.000Z',
    'You can connect us. I have added the draft workshop outline here too.',
    'Precious Ojeka',
    '11111111-1111-4111-8111-111111111111',
    '2026-03-30T09:00:00.000Z',
    '2026-03-31T09:22:00.000Z'
  ),
  (
    'cccccccc-cccc-4ccc-8ccc-ccccccccccc3',
    'group',
    'Community',
    'Lagos Chapter Mentors',
    '3 members',
    'Volunteer onboarding warm-up',
    'Small community thread for testing group chat, unread state, and receipts.',
    null,
    'LC',
    null,
    false,
    true,
    true,
    '2026-03-31T11:42:00.000Z',
    'That is exactly the part I was worried about. I can draft a gentler follow-up message today.',
    'Adaeze Chioma Okonkwo',
    '11111111-1111-4111-8111-111111111111',
    '2026-03-28T14:30:00.000Z',
    '2026-03-31T11:42:00.000Z'
  )
on conflict (id) do update
set category = excluded.category,
    topic = excluded.topic,
    description = excluded.description,
    last_message_at = excluded.last_message_at,
    last_message_preview = excluded.last_message_preview,
    last_message_sender_name = excluded.last_message_sender_name,
    updated_at = excluded.updated_at;

insert into public.message_thread_participants (
  thread_id,
  profile_id,
  member_id,
  role_in_thread,
  is_pinned,
  joined_at,
  last_delivered_message_id,
  last_read_message_id,
  last_read_at
)
values
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
    '11111111-1111-4111-8111-111111111111',
    'MBR-1998-143776',
    'admin',
    true,
    '2026-03-29T07:00:00.000Z',
    null,
    null,
    null
  ),
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
    '22222222-2222-4222-8222-222222222222',
    'MBR-2002-6cefa1',
    'member',
    true,
    '2026-03-29T07:00:00.000Z',
    null,
    null,
    null
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2',
    '11111111-1111-4111-8111-111111111111',
    'MBR-1998-143776',
    'admin',
    false,
    '2026-03-30T09:00:00.000Z',
    null,
    null,
    null
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2',
    '44444444-4444-4444-8444-444444444444',
    'MBR-1990-319fa4',
    'member',
    false,
    '2026-03-30T09:00:00.000Z',
    null,
    null,
    null
  ),
  (
    'cccccccc-cccc-4ccc-8ccc-ccccccccccc3',
    '11111111-1111-4111-8111-111111111111',
    'MBR-1998-143776',
    'admin',
    false,
    '2026-03-28T14:30:00.000Z',
    null,
    null,
    null
  ),
  (
    'cccccccc-cccc-4ccc-8ccc-ccccccccccc3',
    '22222222-2222-4222-8222-222222222222',
    'MBR-2002-6cefa1',
    'moderator',
    false,
    '2026-03-28T14:30:00.000Z',
    null,
    null,
    null
  ),
  (
    'cccccccc-cccc-4ccc-8ccc-ccccccccccc3',
    '33333333-3333-4333-8333-333333333333',
    'MBR-2005-7b072d',
    'member',
    false,
    '2026-03-28T14:30:00.000Z',
    null,
    null,
    null
  )
on conflict (thread_id, profile_id) do update
set role_in_thread = excluded.role_in_thread,
    is_pinned = excluded.is_pinned,
    joined_at = excluded.joined_at;

insert into public.message_messages (
  id,
  thread_id,
  sender_profile_id,
  sender_member_id,
  body,
  client_generated_id,
  created_at,
  deleted_at
)
values
  (
    'aaaaaaa1-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
    '11111111-1111-4111-8111-111111111111',
    'MBR-1998-143776',
    'Hi Ngozi, I enjoyed meeting you at the alumni mixer. I would love to stay in touch and support your next career move.',
    'seed-thread-1-message-1',
    '2026-03-31T07:41:00.000Z',
    null
  ),
  (
    'aaaaaaa2-aaaa-4aaa-8aaa-aaaaaaaaaaa2',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
    '22222222-2222-4222-8222-222222222222',
    'MBR-2002-6cefa1',
    'Thank you. I would really value a short mentoring rhythm around leadership and career clarity.',
    'seed-thread-1-message-2',
    '2026-03-31T07:56:00.000Z',
    null
  ),
  (
    'aaaaaaa3-aaaa-4aaa-8aaa-aaaaaaaaaaa3',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
    '11111111-1111-4111-8111-111111111111',
    'MBR-1998-143776',
    'Absolutely. I recorded a quick note here with the structure I normally use.',
    'seed-thread-1-message-3',
    '2026-03-31T08:12:00.000Z',
    null
  ),
  (
    'bbbbbbb1-bbbb-4bbb-8bbb-bbbbbbbbbbb1',
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2',
    '11111111-1111-4111-8111-111111111111',
    'MBR-1998-143776',
    'A fellow alumna needs help refreshing her organisation website and asked if I know anyone reliable.',
    'seed-thread-2-message-1',
    '2026-03-31T09:03:00.000Z',
    null
  ),
  (
    'bbbbbbb2-bbbb-4bbb-8bbb-bbbbbbbbbbb2',
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2',
    '44444444-4444-4444-8444-444444444444',
    'MBR-1990-319fa4',
    'You can connect us. I have added the draft workshop outline here too.',
    'seed-thread-2-message-2',
    '2026-03-31T09:22:00.000Z',
    null
  ),
  (
    'ccccccc1-cccc-4ccc-8ccc-ccccccccccc1',
    'cccccccc-cccc-4ccc-8ccc-ccccccccccc3',
    '11111111-1111-4111-8111-111111111111',
    'MBR-1998-143776',
    'Sharing the volunteer onboarding checklist here. I want us to tighten the first-week touchpoints.',
    'seed-thread-3-message-1',
    '2026-03-31T11:08:00.000Z',
    null
  ),
  (
    'ccccccc2-cccc-4ccc-8ccc-ccccccccccc2',
    'cccccccc-cccc-4ccc-8ccc-ccccccccccc3',
    '33333333-3333-4333-8333-333333333333',
    'MBR-2005-7b072d',
    'I like the warmth of it already. We could add one lighter personal touch on day three.',
    'seed-thread-3-message-2',
    '2026-03-31T11:22:00.000Z',
    null
  ),
  (
    'ccccccc3-cccc-4ccc-8ccc-ccccccccccc3',
    'cccccccc-cccc-4ccc-8ccc-ccccccccccc3',
    '11111111-1111-4111-8111-111111111111',
    'MBR-1998-143776',
    'That is exactly the part I was worried about. I can draft a gentler follow-up message today.',
    'seed-thread-3-message-3',
    '2026-03-31T11:42:00.000Z',
    null
  )
on conflict (id) do update
set body = excluded.body,
    created_at = excluded.created_at,
    deleted_at = excluded.deleted_at;

insert into public.message_attachments (
  id,
  message_id,
  thread_id,
  uploader_profile_id,
  kind,
  file_name,
  mime_type,
  size_in_bytes,
  duration_seconds,
  upload_state,
  storage_bucket,
  storage_path,
  public_url,
  waveform,
  created_at,
  updated_at
)
values
  (
    'ddddddd1-dddd-4ddd-8ddd-ddddddddddd1',
    'bbbbbbb2-bbbb-4bbb-8bbb-bbbbbbbbbbb2',
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2',
    '44444444-4444-4444-8444-444444444444',
    'file',
    'workshop-outline.pdf',
    'application/pdf',
    248000,
    null,
    'uploaded',
    'message-attachments',
    'threads/bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2/bbbbbbb2-bbbb-4bbb-8bbb-bbbbbbbbbbb2/workshop-outline.pdf',
    null,
    null,
    '2026-03-31T09:22:00.000Z',
    '2026-03-31T09:22:00.000Z'
  )
on conflict (id) do update
set message_id = excluded.message_id,
    file_name = excluded.file_name,
    mime_type = excluded.mime_type,
    size_in_bytes = excluded.size_in_bytes,
    upload_state = excluded.upload_state,
    storage_path = excluded.storage_path,
    updated_at = excluded.updated_at;

update public.message_thread_participants
set
  last_delivered_message_id = case
    when thread_id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1'::uuid and profile_id = '11111111-1111-4111-8111-111111111111'::uuid then 'aaaaaaa3-aaaa-4aaa-8aaa-aaaaaaaaaaa3'::uuid
    when thread_id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1'::uuid and profile_id = '22222222-2222-4222-8222-222222222222'::uuid then 'aaaaaaa3-aaaa-4aaa-8aaa-aaaaaaaaaaa3'::uuid
    when thread_id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2'::uuid and profile_id = '11111111-1111-4111-8111-111111111111'::uuid then 'bbbbbbb2-bbbb-4bbb-8bbb-bbbbbbbbbbb2'::uuid
    when thread_id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2'::uuid and profile_id = '44444444-4444-4444-8444-444444444444'::uuid then 'bbbbbbb2-bbbb-4bbb-8bbb-bbbbbbbbbbb2'::uuid
    when thread_id = 'cccccccc-cccc-4ccc-8ccc-ccccccccccc3'::uuid and profile_id = '11111111-1111-4111-8111-111111111111'::uuid then 'ccccccc3-cccc-4ccc-8ccc-ccccccccccc3'::uuid
    when thread_id = 'cccccccc-cccc-4ccc-8ccc-ccccccccccc3'::uuid and profile_id = '22222222-2222-4222-8222-222222222222'::uuid then 'ccccccc3-cccc-4ccc-8ccc-ccccccccccc3'::uuid
    when thread_id = 'cccccccc-cccc-4ccc-8ccc-ccccccccccc3'::uuid and profile_id = '33333333-3333-4333-8333-333333333333'::uuid then 'ccccccc3-cccc-4ccc-8ccc-ccccccccccc3'::uuid
    else last_delivered_message_id
  end,
  last_read_message_id = case
    when thread_id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1'::uuid and profile_id = '11111111-1111-4111-8111-111111111111'::uuid then 'aaaaaaa3-aaaa-4aaa-8aaa-aaaaaaaaaaa3'::uuid
    when thread_id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1'::uuid and profile_id = '22222222-2222-4222-8222-222222222222'::uuid then 'aaaaaaa2-aaaa-4aaa-8aaa-aaaaaaaaaaa2'::uuid
    when thread_id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2'::uuid and profile_id = '11111111-1111-4111-8111-111111111111'::uuid then 'bbbbbbb2-bbbb-4bbb-8bbb-bbbbbbbbbbb2'::uuid
    when thread_id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2'::uuid and profile_id = '44444444-4444-4444-8444-444444444444'::uuid then 'bbbbbbb2-bbbb-4bbb-8bbb-bbbbbbbbbbb2'::uuid
    when thread_id = 'cccccccc-cccc-4ccc-8ccc-ccccccccccc3'::uuid and profile_id = '11111111-1111-4111-8111-111111111111'::uuid then 'ccccccc3-cccc-4ccc-8ccc-ccccccccccc3'::uuid
    when thread_id = 'cccccccc-cccc-4ccc-8ccc-ccccccccccc3'::uuid and profile_id = '22222222-2222-4222-8222-222222222222'::uuid then 'ccccccc1-cccc-4ccc-8ccc-ccccccccccc1'::uuid
    when thread_id = 'cccccccc-cccc-4ccc-8ccc-ccccccccccc3'::uuid and profile_id = '33333333-3333-4333-8333-333333333333'::uuid then 'ccccccc3-cccc-4ccc-8ccc-ccccccccccc3'::uuid
    else last_read_message_id
  end,
  last_read_at = case
    when thread_id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1'::uuid and profile_id = '11111111-1111-4111-8111-111111111111'::uuid then '2026-03-31T08:12:00.000Z'::timestamptz
    when thread_id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1'::uuid and profile_id = '22222222-2222-4222-8222-222222222222'::uuid then '2026-03-31T07:56:00.000Z'::timestamptz
    when thread_id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2'::uuid and profile_id = '11111111-1111-4111-8111-111111111111'::uuid then '2026-03-31T09:22:00.000Z'::timestamptz
    when thread_id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2'::uuid and profile_id = '44444444-4444-4444-8444-444444444444'::uuid then '2026-03-31T09:22:00.000Z'::timestamptz
    when thread_id = 'cccccccc-cccc-4ccc-8ccc-ccccccccccc3'::uuid and profile_id = '11111111-1111-4111-8111-111111111111'::uuid then '2026-03-31T11:42:00.000Z'::timestamptz
    when thread_id = 'cccccccc-cccc-4ccc-8ccc-ccccccccccc3'::uuid and profile_id = '22222222-2222-4222-8222-222222222222'::uuid then '2026-03-31T11:08:00.000Z'::timestamptz
    when thread_id = 'cccccccc-cccc-4ccc-8ccc-ccccccccccc3'::uuid and profile_id = '33333333-3333-4333-8333-333333333333'::uuid then '2026-03-31T11:42:00.000Z'::timestamptz
    else last_read_at
  end
where thread_id in (
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1'::uuid,
  'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2'::uuid,
  'cccccccc-cccc-4ccc-8ccc-ccccccccccc3'::uuid
);
