import { createClient } from '@supabase/supabase-js';

class SupabaseConfigError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'SupabaseConfigError';
    }
}

export const getServerClient = () => {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        throw new SupabaseConfigError(
            "Missing Supabase environment variables. Please configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment."
        );
    }

    return createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
};

export const isSupabaseConfigError = (error: unknown): error is SupabaseConfigError => {
    return error instanceof Error && error.name === 'SupabaseConfigError';
};
