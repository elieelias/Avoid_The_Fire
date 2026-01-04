'use client';

import React, { useState } from 'react';
import { Play, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AppState, Player } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface Props {
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  setPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
  qrToken: string | null;
}

const Registration: React.FC<Props> = ({ setAppState, setPlayer, qrToken }) => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [error, setError] = useState<string>('');

  const handleStart = () => {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    setPlayer({ name, phone: '', score: 0, qr_token: qrToken || undefined });
    setAppState(AppState.TUTORIAL);
  };

  return (
    <div className="flex flex-col h-full max-w-md mx-auto p-6 animate-fadeIn bg-white">
      <div className="flex-1 flex flex-col items-center pt-8">
        {/* Logo Container */}
        <div className="w-full h-40 relative mb-6 flex items-center justify-center overflow-hidden">
          {/* 
                Using absolute path string "/fruishy_logo.jpg" assuming file is served from root.
                This bypasses module import errors.
             */}
          <img
            src="/fruishy_logo.jpg"
            alt="Fruishy Christmas"
            className="w-full h-full object-contain object-center scale-125"
            onError={(e) => {
              // Fallback if image fails to load
              e.currentTarget.onerror = null;
              e.currentTarget.src = "https://placehold.co/600x400/DC2626/FFFFFF/png?text=FRUISHY\nchristmas+edition&font=roboto";
            }}
          />
        </div>

        <h1 className="text-3xl font-bold text-slate-900 text-center mb-2">
          Welcome to<br /><span className="text-green-600">Fruishy's Christmas Game</span>
        </h1>
        <p className="text-slate-500 text-center mb-8">Enjoy our Christmas game for free until next season!</p>

        <div className="w-full space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              className={`w-full px-4 py-3 rounded-xl border ${error ? 'border-red-500 bg-red-50' : 'border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200'} outline-none transition-all`}
              placeholder="Santa Claus"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleStart()}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-3 pb-6">
        <Button
          variant="primary"
          fullWidth
          onClick={handleStart}
          className="text-lg py-4"
        >
          Start Game <Play size={20} fill="currentColor" />
        </Button>

        <Button
          variant="outline"
          fullWidth
          onClick={() => router.push('/leaderboard')}
          className="text-lg py-4"
        >
          Leaderboard <Trophy size={20} className="text-yellow-500" />
        </Button>

        <p className="text-xs text-center text-slate-400">
          Made with ❤️ by the Fruishy Team
        </p>
      </div>
    </div>
  );
};

export default Registration;