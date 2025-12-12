'use client';

import { createBrowserClient } from "@supabase/ssr";

class SupabaseConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SupabaseConfigError';
  }
}

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new SupabaseConfigError(
      "Missing Supabase environment variables. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your deployment settings."
    );
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
};

export const isSupabaseConfigError = (error: unknown): error is SupabaseConfigError => {
  return error instanceof Error && error.name === 'SupabaseConfigError';
};