'use client';

import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { AppState, Player } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface Props {
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  setPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
  qrToken: string | null;
}

const Registration: React.FC<Props> = ({ setAppState, setPlayer, qrToken }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<{ name?: string, phone?: string }>({});

  const handleStart = () => {
    const newErrors: { name?: string, phone?: string } = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!phone.trim()) newErrors.phone = "Phone is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setPlayer({ name, phone, score: 0, qr_token: qrToken || undefined });
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
          Join the Festival<br /><span className="text-green-600">Leaderboard!</span>
        </h1>
        <p className="text-slate-500 text-center mb-8">Enter your details to compete for the grand prize.</p>

        <div className="w-full space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-500 bg-red-50' : 'border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200'} outline-none transition-all`}
              placeholder="Santa Claus"
              autoFocus
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number</label>
            <input
              type="tel"
              pattern="[0-9]*"
              inputMode="numeric"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-500 bg-red-50' : 'border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200'} outline-none transition-all`}
              placeholder="080 1234 5678"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
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
        <p className="text-xs text-center text-slate-400">
          Made with ❤️ by the Fruishy Team
        </p>
      </div>
    </div>
  );
};

export default Registration;