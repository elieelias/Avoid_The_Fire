'use client';

import React, { useEffect, useState } from 'react';
import RainingElements from '@/components/ui/RainingElements';
import { Trophy, Medal, Crown } from 'lucide-react';

interface LeaderboardEntry {
    player_name: string;
    score: number;
    played_at: string;
}

export default function LeaderboardPage() {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLeaderboard = async () => {
        try {
            const res = await fetch('/api/leaderboard');
            const data = await res.json();
            if (data.data) {
                setLeaderboard(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch leaderboard:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaderboard();
        // Update every 60 seconds to keep it live but not overload the server
        const interval = setInterval(fetchLeaderboard, 60000);
        return () => clearInterval(interval);
    }, []);

    const getRankIcon = (index: number) => {
        switch (index) {
            case 0:
                return <Crown className="w-12 h-12 text-yellow-400 fill-yellow-400 animate-pulse" />;
            case 1:
                return <Medal className="w-10 h-10 text-slate-300 fill-slate-300" />;
            case 2:
                return <Medal className="w-10 h-10 text-amber-600 fill-amber-600" />;
            default:
                return <span className="text-4xl font-bold text-slate-500 font-mono">#{index + 1}</span>;
        }
    };

    const getRowStyle = (index: number) => {
        switch (index) {
            case 0:
                return "bg-yellow-500/10 border-yellow-500/50 scale-105 z-10 my-4 shadow-lg shadow-yellow-500/20";
            case 1:
                return "bg-slate-200/50 border-slate-300 my-2";
            case 2:
                return "bg-amber-700/10 border-amber-700/30 my-2";
            default:
                return "bg-white/40 border-slate-200/50 hover:bg-white/60";
        }
    };

    return (
        <div className="relative w-full min-h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
            <RainingElements />

            <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-12 flex flex-col h-screen">
                <header className="text-center mb-12 animate-fade-in-down">
                    <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500 drop-shadow-sm tracking-tight pb-4">
                        All time Top Players
                    </h1>
                    <p className="text-2xl text-slate-500 font-medium uppercase tracking-wide">
                        Live Leaderboard
                    </p>
                </header>

                <div className="flex-1 overflow-hidden relative rounded-3xl backdrop-blur-xl bg-white/30 border border-white/50 shadow-2xl">
                    <div className="absolute inset-0 overflow-y-auto hide-scrollbar p-6 space-y-3">
                        {loading && leaderboard.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-slate-400 text-2xl animate-pulse">
                                Loading scores...
                            </div>
                        ) : leaderboard.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
                                <Trophy className="w-24 h-24 text-slate-300 opacity-50" />
                                <span className="text-3xl font-light">No records yet today</span>
                                <span className="text-xl">Be the first to play!</span>
                            </div>
                        ) : (
                            leaderboard.map((entry, index) => (
                                <div
                                    key={`${entry.player_name}-${entry.played_at}`}
                                    className={`
                                        flex items-center justify-between p-6 rounded-2xl border transition-all duration-500 ease-out
                                        ${getRowStyle(index)}
                                    `}
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="flex items-center gap-8">
                                        <div className="w-20 flex justify-center">
                                            {getRankIcon(index)}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className={`text-3xl font-bold truncate max-w-[400px] ${index === 0 ? 'text-slate-900' : 'text-slate-800'}`}>
                                                {entry.player_name}
                                            </span>
                                            <span className="text-sm text-slate-500 font-mono opacity-60">
                                                {new Date(entry.played_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className={`
                                            px-6 py-2 rounded-xl font-mono text-4xl font-black
                                            ${index === 0 ? 'text-yellow-600 bg-yellow-400/20' : 'text-slate-700 bg-slate-200/50'}
                                        `}>
                                            {entry.score.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}

                        {/* Empty spacing for scrolling safely */}
                        <div className="h-20" />
                    </div>
                </div>
            </div>
        </div>
    );
}