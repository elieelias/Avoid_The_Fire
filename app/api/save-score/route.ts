import { NextRequest, NextResponse } from 'next/server';
import { getServerClient, isSupabaseConfigError } from '@/utils/supabaseServer';

export async function POST(request: NextRequest) {
    try {
        const { qr_token, player_name, phone_number, score } = await request.json();

        if (!qr_token) {
            return NextResponse.json(
                { error: 'QR token is required' },
                { status: 400 }
            );
        }

        const supabase = getServerClient();

        // Update the record with the score and mark as used
        const { error } = await supabase
            .from('main')
            .update({
                is_used: true,
                player_name,
                phone_number,
                score,
                played_at: new Date().toISOString()
            })
            .eq('qr_token', qr_token);

        if (error) {
            console.error('Error saving score:', error);
            return NextResponse.json(
                { error: 'Failed to save score' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success: true },
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

        console.error('Error saving score:', err);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
