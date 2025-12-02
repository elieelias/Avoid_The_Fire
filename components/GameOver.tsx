import React, { useEffect, useState } from 'react';
import { PlayerProfile, LeaderboardEntry } from '../lib/types';
import { LEADERBOARD_MOCK_DATA } from '../lib/constants';
import { Trophy, RefreshCw, MessageCircle, Star, Sparkles } from 'lucide-react';
import { getSantaMessage } from '../lib/geminiService';

interface GameOverProps {
    score: number;
    profile: PlayerProfile;
    onRestart: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ score, profile, onRestart }) => {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [santaMessage, setSantaMessage] = useState<string>("");

    useEffect(() => {
        // Merge current score into leaderboard mock
        const newEntry: LeaderboardEntry = {
            rank: 0, // calc later
            name: profile.name,
            score: score,
            isCurrentUser: true,
        };

        const combined = [...LEADERBOARD_MOCK_DATA, newEntry]
            .sort((a, b) => b.score - a.score)
            .map((item, index) => ({ ...item, rank: index + 1 }));

        setLeaderboard(combined);

        // Get Static Message
        setSantaMessage(getSantaMessage(profile.name, score));
    }, [score, profile.name]);

    const renderRankCard = (entry: LeaderboardEntry) => {
        const isTop3 = entry.rank <= 3;

        let bgClass = "glass-panel";
        let borderClass = "border-white/10";
        let textClass = "text-white";
        let rankBadge = <span className="text-gray-400 text-sm font-bold">#{entry.rank}</span>;

        if (entry.rank === 1) {
            bgClass = "bg-gradient-to-r from-yellow-500/20 to-amber-600/20";
            borderClass = "border-yellow-500/50";
            rankBadge = <Trophy className="w-5 h-5 text-yellow-400 fill-current" />;
        } else if (entry.rank === 2) {
            bgClass = "bg-gradient-to-r from-slate-300/20 to-slate-400/20";
            borderClass = "border-slate-400/50";
            rankBadge = <Trophy className="w-5 h-5 text-slate-300 fill-current" />;
        } else if (entry.rank === 3) {
            bgClass = "bg-gradient-to-r from-orange-700/20 to-orange-800/20";
            borderClass = "border-orange-600/50";
            rankBadge = <Trophy className="w-5 h-5 text-orange-400 fill-current" />;
        }

        // Highlight current user
        if (entry.isCurrentUser) {
            bgClass = "bg-gradient-to-r from-green-600/40 to-emerald-600/40";
            borderClass = "border-green-400";
            textClass = "text-green-300 font-bold";
        }

        return (
            <div key={`${entry.name}-${entry.rank}`} className={`flex items-center justify-between p-4 rounded-2xl border ${borderClass} ${bgClass} mb-3 shadow-md backdrop-blur-sm`}>
                <div className="flex items-center space-x-4">
                    <div className="w-8 flex justify-center">
                        {rankBadge}
                    </div>
                    <span className={`text-lg ${textClass}`}>
                        {entry.name} {entry.isCurrentUser && '(You)'}
                    </span>
                </div>
                <span className="font-bold text-2xl font-display tracking-wider">{entry.score}</span>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full w-full p-4 overflow-hidden animate-fade-in relative z-10">

            {/* Header Area */}
            <div className="text-center mt-6 mb-4">
                <h1 className="text-5xl font-bold text-white drop-shadow-[0_2px_4px_rgba(220,38,38,0.8)] mb-2">Game Over!</h1>
                <div className="inline-block relative">
                    <div className="absolute inset-0 bg-red-500 blur-2xl opacity-20 rounded-full"></div>
                    <div className="glass-panel rounded-3xl px-10 py-6 border border-white/20 relative">
                        <p className="text-xs text-red-200 uppercase tracking-widest mb-1 font-bold">Your Score</p>
                        <p className="text-7xl font-bold text-white drop-shadow-lg font-display">{score}</p>
                    </div>
                </div>
            </div>

            {/* Santa's Message (Static) */}
            <div className="mb-6 mx-2">
                <div className="glass-panel bg-red-950/40 border-red-500/30 rounded-2xl p-5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                        <Sparkles className="w-16 h-16 text-white" />
                    </div>
                    <div className="flex items-start space-x-3">
                        <div className="bg-red-600 rounded-full p-2 shadow-lg shadow-red-600/40">
                            <MessageCircle className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xs font-bold text-red-300 uppercase mb-2 tracking-wider">Message from Santa</h3>
                            <p className="text-lg italic text-white leading-tight font-serif">"{santaMessage}"</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Leaderboard */}
            <div className="flex-1 overflow-hidden flex flex-col glass-panel rounded-t-3xl border-b-0 mx-2 p-4 pb-0">
                <div className="flex items-center space-x-2 mb-4 px-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <h2 className="text-xl font-bold text-yellow-400">Top Elves</h2>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 pb-24 custom-scrollbar">
                    {leaderboard.map(renderRankCard)}
                </div>
            </div>

            {/* Sticky Restart */}
            <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent">
                <button
                    onClick={onRestart}
                    className="w-full bg-white text-red-600 font-extrabold py-4 rounded-2xl text-xl shadow-[0_0_25px_rgba(255,255,255,0.3)] flex items-center justify-center space-x-2 hover:bg-gray-50 active:scale-[0.98] transition-all"
                >
                    <RefreshCw className="w-6 h-6" />
                    <span>Play Again</span>
                </button>
                <p className="text-center text-xs text-white/30 mt-4">Winner announced on Day 6. Good luck!</p>
            </div>
        </div>
    );
};

export default GameOver;