import { NextRequest, NextResponse } from 'next/server';
import { getServerClient, isSupabaseConfigError } from '@/utils/supabaseServer';

export async function POST(request: NextRequest) {
    try {
        const { qr_token, player_name, phone_number, score } = await request.json();

        const supabase = getServerClient();

        let dbError;

        if (qr_token) {
            // Update the record with the score and mark as used
            const { error } = await supabase
                .from('main')
                .update({
                    is_used: true,
                    player_name,
                    phone_number: phone_number || '',
                    score,
                    played_at: new Date().toISOString()
                })
                .eq('qr_token', qr_token);
            dbError = error;
        } else {
            // Insert a new record
            const { error } = await supabase
                .from('main')
                .insert([{
                    is_used: true,
                    player_name,
                    phone_number: phone_number || '',
                    score,
                    played_at: new Date().toISOString()
                }]);
            dbError = error;
        }

        if (dbError) {
            console.error('Error saving score:', dbError);
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
