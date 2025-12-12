'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Medal, Trophy } from 'lucide-react';
import { AppState, LeaderboardEntry, Player } from '@/lib/types';
import { createClient } from '@/utils/supabaseClient';

interface Props {
  player: Player;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  setPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
}

type LeaderboardRow = {
  player_name: string | null;
  score: number | null;
  played_at: string | null;
};

const GameOver: React.FC<Props> = ({ player, setAppState: _setAppState, setPlayer }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoadingBoard, setIsLoadingBoard] = useState(true);
  const [boardError, setBoardError] = useState<string | null>(null);
  const [isBoardExpanded, setIsBoardExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const saveScore = useCallback(async () => {
    if (!player.qr_token) {
      console.warn('No QR token found for player');
      return;
    }

    try {
      const { error } = await createClient()
        .from('main')
        .update({
          is_used: true,
          player_name: player.name,
          phone_number: player.phone,
          score: player.score,
          played_at: new Date().toISOString()
        })
        .eq('qr_token', player.qr_token);

      if (error) {
        console.error('Error saving score:', error);
      }
    } catch (err) {
      console.error('Error saving score:', err);
    }
  }, [player]);

  const loadLeaderboard = useCallback(async () => {
    setIsLoadingBoard(true);
    setBoardError(null);

    try {
      const client = createClient();
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);

      const { data, error } = await client
        .from('main')
        .select('player_name, score, played_at')
        .gte('played_at', start.toISOString())
        .lt('played_at', end.toISOString())
        .order('score', { ascending: false })
        .limit(50);

      if (error) {
        throw error;
      }

      const rows: LeaderboardRow[] = data ?? [];

      let entries: LeaderboardEntry[] = rows
        .filter((row) => row.score !== null)
        .map((row) => ({
          rank: 0,
          name: row.player_name || 'Anonymous Player',
          score: row.score || 0,
          isCurrentUser: row.player_name === player.name && row.score === player.score,
        }))
        .sort((a, b) => b.score - a.score);

      const hasPlayer = entries.some(
        (entry) => entry.name === player.name && entry.score === player.score
      );

      if (!hasPlayer) {
        entries = [
          {
            rank: 0,
            name: player.name,
            score: player.score,
            isCurrentUser: true,
          },
          ...entries,
        ].sort((a, b) => b.score - a.score);
      }

      entries = entries.map((entry, idx) => ({ ...entry, rank: idx + 1 }));
      setLeaderboard(entries);
    } catch (err) {
      console.error('Error loading leaderboard:', err);
      setBoardError('Unable to load today’s leaderboard.');
      setLeaderboard([
        {
          rank: 1,
          name: player.name,
          score: player.score,
          isCurrentUser: true,
        },
      ]);
    } finally {
      setIsLoadingBoard(false);
    }
  }, [player]);

  useEffect(() => {
    saveScore().finally(loadLeaderboard);
  }, [saveScore, loadLeaderboard]);

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;

    const handleScroll = () => {
      setIsBoardExpanded(node.scrollTop > 20);
    };

    node.addEventListener('scroll', handleScroll);
    return () => node.removeEventListener('scroll', handleScroll);
  }, []);

  const topThree = useMemo(() => leaderboard.slice(0, 3), [leaderboard]);
  const rest = useMemo(() => leaderboard.slice(3, 10), [leaderboard]);

  return (
    <div className="flex flex-col h-full bg-slate-50 animate-fadeIn overflow-hidden">
      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar relative">
        {/* Header / Score (sits above leaderboard by default) */}
        <div className="bg-white p-6 pb-8 rounded-b-[2.5rem] shadow-sm text-center border-b border-slate-100 relative z-10">
          <h2 className="text-4xl font-black text-slate-800 mb-1">Game Over!</h2>
          <div className="text-slate-500 mb-4">You did great!</div>

          <div className="inline-block bg-green-50 px-8 py-4 rounded-3xl border-2 border-green-100 mb-4">
            <div className="text-sm font-bold text-green-700 uppercase tracking-widest">Your Score</div>
            <div className="text-5xl font-black text-green-600">{player.score}</div>
          </div>
        </div>

        <div className="p-6">
          <p className="text-xs text-center text-slate-400">
            Winner announced on Day 6. Good luck!
          </p>
        </div>

        {/* Festival Leaderboard (sticky and expandable) */}
        <div
          className={`sticky top-0 transition-all duration-300 ${
            isBoardExpanded ? 'z-30 h-[90dvh] shadow-2xl bg-white' : 'z-0 bg-white/95 backdrop-blur'
          } border-b border-slate-100`}
        >
          <div className="p-6 pb-4 flex items-center justify-center gap-2">
            <div className="h-[1px] bg-slate-300 w-12"></div>
            <h3 className="text-slate-500 font-bold uppercase text-xs tracking-widest flex items-center gap-2">
              <span className="text-yellow-500">✨</span> Festival Leaderboard
            </h3>
            <div className="h-[1px] bg-slate-300 w-12"></div>
          </div>

          <div className="px-6 pb-6 overflow-y-auto no-scrollbar h-[calc(100%-64px)]">
            {isLoadingBoard ? (
              <div className="text-center text-slate-400 text-sm">Loading leaderboard...</div>
            ) : boardError ? (
              <div className="text-center text-red-500 text-sm">{boardError}</div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-3 mb-6 items-end">
                  {/* Silver */}
                  {topThree[1] && (
                    <div className="flex flex-col items-center bg-white p-3 rounded-2xl shadow-sm border-b-4 border-slate-200 order-1">
                      <Medal className="text-slate-400 mb-2" size={24} />
                      <div className="text-sm font-bold text-slate-800 truncate w-full text-center">
                        {topThree[1].name}
                      </div>
                      <div className="text-lg font-black text-slate-400">{topThree[1].score}</div>
                    </div>
                  )}

                  {/* Gold */}
                  {topThree[0] && (
                    <div className="flex flex-col items-center bg-gradient-to-b from-yellow-50 to-white p-3 pt-6 rounded-2xl shadow-md border-b-4 border-yellow-200 order-2 transform -translate-y-4">
                      <Trophy className="text-yellow-500 mb-2" fill="currentColor" size={32} />
                      <div className="text-sm font-bold text-slate-800 truncate w-full text-center">
                        {topThree[0].name}
                      </div>
                      <div className="text-xl font-black text-yellow-600">{topThree[0].score}</div>
                    </div>
                  )}

                  {/* Bronze */}
                  {topThree[2] && (
                    <div className="flex flex-col items-center bg-white p-3 rounded-2xl shadow-sm border-b-4 border-amber-700/20 order-3">
                      <Medal className="text-amber-700 mb-2" size={24} />
                      <div className="text-sm font-bold text-slate-800 truncate w-full text-center">
                        {topThree[2].name}
                      </div>
                      <div className="text-lg font-black text-amber-800">{topThree[2].score}</div>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  {rest.map((entry) => (
                    <div
                      key={entry.rank}
                      className={`flex items-center p-4 border-b border-slate-50 last:border-0 ${entry.isCurrentUser ? 'bg-green-50' : ''}`}
                    >
                      <div className="w-8 font-bold text-slate-400">#{entry.rank}</div>
                      <div className={`flex-1 font-medium ${entry.isCurrentUser ? 'text-green-700 font-bold' : 'text-slate-700'}`}>
                        {entry.name} {entry.isCurrentUser && '(You)'}
                      </div>
                      <div className="font-bold text-slate-900">{entry.score}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-4 border-t border-slate-100 z-10">
        <p className="text-xs text-center text-slate-400">
          Made with ❤️ by the Fruishy Team
        </p>
      </div>
    </div>
  );
};

export default GameOver;