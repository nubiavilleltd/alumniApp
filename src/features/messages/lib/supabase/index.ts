import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { MessagesSupabaseDatabase } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY ?? import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseClient: SupabaseClient<MessagesSupabaseDatabase> | null = null;

export function isMessagesSupabaseConfigured() {
  return Boolean(supabaseUrl && supabasePublishableKey);
}

export function getMessagesSupabaseClient() {
  if (!isMessagesSupabaseConfigured()) {
    throw new Error(
      'Messages Supabase is not configured. Add the Supabase URL and publishable key.',
    );
  }

  if (!supabaseClient) {
    supabaseClient = createClient<MessagesSupabaseDatabase>(
      supabaseUrl as string,
      supabasePublishableKey as string,
    );
  }

  return supabaseClient;
}
