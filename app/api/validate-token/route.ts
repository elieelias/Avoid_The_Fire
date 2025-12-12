import { NextRequest, NextResponse } from 'next/server';
import { getServerClient, isSupabaseConfigError } from '@/utils/supabaseServer';

export async function POST(request: NextRequest) {
    try {
        const { token } = await request.json();

        if (!token) {
            return NextResponse.json(
                { error: 'Token is required' },
                { status: 400 }
            );
        }

        const supabase = getServerClient();

        // Query the database to check if the token exists and is not used
        const { data, error } = await supabase
            .from('main')
            .select('*')
            .eq('qr_token', token)
            .single();

        if (error || !data) {
            return NextResponse.json(
                { valid: false, reason: 'Token not found' },
                { status: 200 }
            );
        }

        // Check if token is already used
        if (data.is_used) {
            return NextResponse.json(
                { valid: false, reason: 'Token already used' },
                { status: 200 }
            );
        }

        // Check if token is still valid (not expired)
        const validTill = new Date(data.valid_till);
        const now = new Date();

        if (now > validTill) {
            return NextResponse.json(
                { valid: false, reason: 'Token expired' },
                { status: 200 }
            );
        }

        // Token is valid!
        return NextResponse.json(
            { valid: true },
            { status: 200 }
        );
    } catch (err) {
        if (isSupabaseConfigError(err)) {
            console.error('Supabase configuration error:', err);
            return NextResponse.json(
                { error: 'Database configuration error' },
                { status: 500 }
            );
        }

        console.error('Error validating token:', err);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
