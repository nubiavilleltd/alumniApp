export interface ChatProfileRow {
  id: string;
  member_id: string;
  slug: string;
  full_name: string;
  graduation_year: number;
  avatar_url: string | null;
  initials: string;
  profile_href: string;
  created_at: string;
  updated_at: string;
}

export interface ChatProfileInsert {
  member_id: string;
  slug: string;
  full_name: string;
  graduation_year: number;
  avatar_url?: string | null;
  initials: string;
  profile_href: string;
}

export interface MessageThreadRow {
  id: string;
  created_at: string;
  type: 'direct' | 'group';
  title: string | null;
  created_by: string | null;
  updated_at: string | null;
  last_message_id: string | null;
  last_message_at: string | null;
  category: string | null;
  direct_key: string | null;
  last_message_preview: string | null;
  last_message_sender_name: string | null;
  attachment_enabled: boolean | null;
  audio_enabled: boolean | null;
}

export interface MessageThreadInsert {
  type: 'direct' | 'group';
  title?: string | null;
  created_by?: string | null;
  updated_at?: string | null;
  last_message_id?: string | null;
  last_message_at?: string | null;
  category?: string | null;
  direct_key?: string | null;
  last_message_preview?: string | null;
  last_message_sender_name?: string | null;
  attachment_enabled?: boolean | null;
  audio_enabled?: boolean | null;
}

export interface MessageThreadParticipantRow {
  thread_id: string;
  member_id: string;
  role: 'member' | 'moderator' | 'admin';
}

export interface MessageThreadParticipantInsert {
  thread_id: string;
  member_id: string;
  role: 'member' | 'moderator' | 'admin';
}

export interface MessageRow {
  id: string;
  created_at: string;
  thread_id: string | null;
  sender_member_id: string | null;
  body: string | null;
  updated_at: string | null;
  message_type: string | null;
  deleted_at: string | null;
  client_generated_id: string | null;
}

export interface MessageInsert {
  thread_id?: string | null;
  sender_member_id?: string | null;
  body?: string | null;
  updated_at?: string | null;
  message_type?: string | null;
  deleted_at?: string | null;
  client_generated_id?: string | null;
}

export interface MessageAttachmentRow {
  id: number;
  created_at: string;
  message_id: string | null;
  thread_id: string | null;
  kind: 'file' | 'image' | 'audio' | string | null;
  file_name: string | null;
  mime_type: string | null;
  size_in_bytes: number | string | null;
  storage_path: string | null;
  public_url: string | null;
  duration_seconds: number | string | null;
}

export interface MessageAttachmentInsert {
  message_id?: string | null;
  thread_id?: string | null;
  kind?: string | null;
  file_name?: string | null;
  mime_type?: string | null;
  size_in_bytes?: number | string | null;
  storage_path?: string | null;
  public_url?: string | null;
  duration_seconds?: number | string | null;
}

export interface MessagesSupabaseDatabase {
  public: {
    Tables: {
      chat_profiles: {
        Row: ChatProfileRow;
        Insert: ChatProfileInsert;
        Update: Partial<ChatProfileInsert>;
        Relationships: [];
      };
      message_threads: {
        Row: MessageThreadRow;
        Insert: MessageThreadInsert;
        Update: Partial<MessageThreadInsert>;
        Relationships: [];
      };
      message_thread_participants: {
        Row: MessageThreadParticipantRow;
        Insert: MessageThreadParticipantInsert;
        Update: Partial<MessageThreadParticipantInsert>;
        Relationships: [];
      };
      thread_participants: {
        Row: MessageThreadParticipantRow;
        Insert: MessageThreadParticipantInsert;
        Update: Partial<MessageThreadParticipantInsert>;
        Relationships: [];
      };
      messages: {
        Row: MessageRow;
        Insert: MessageInsert;
        Update: Partial<MessageInsert>;
        Relationships: [];
      };
      messages_attachments: {
        Row: MessageAttachmentRow;
        Insert: MessageAttachmentInsert;
        Update: Partial<MessageAttachmentInsert>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
