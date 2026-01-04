import { NextRequest, NextResponse } from 'next/server';
import { getServerClient, isSupabaseConfigError } from '@/utils/supabaseServer';

export async function GET(request: NextRequest) {
    try {
        const supabase = getServerClient();

        const { data, error } = await supabase
            .from('main')
            .select('player_name, score, played_at')
            .order('score', { ascending: false })
            .limit(50);

        if (error) {
            console.error('Error fetching leaderboard:', error);
            return NextResponse.json(
                { error: 'Failed to fetch leaderboard' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { data: data || [] },
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

        console.error('Error fetching leaderboard:', err);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
