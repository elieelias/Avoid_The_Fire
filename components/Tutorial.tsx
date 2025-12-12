'use client';

import React from 'react';
import { ArrowLeft, Flame, Clock, Gift } from 'lucide-react';
import { AppState } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface Props {
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
}

const Tutorial: React.FC<Props> = ({ setAppState }) => {
  return (
    <div className="flex flex-col h-full p-6 animate-fadeIn bg-white">
      <div className="flex items-center mb-6">
        <button
          onClick={() => setAppState(AppState.REGISTRATION)}
          className="p-2 -ml-2 rounded-full hover:bg-slate-100"
        >
          <ArrowLeft className="text-slate-600" />
        </button>
        <h2 className="text-xl font-bold ml-2">How to Play</h2>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pb-4">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border-2 border-purple-100 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-3 text-yellow-600">
            <Gift size={24} />
            </div>
          <h3 className="font-bold text-base mb-2">Collect Power-ups</h3>
          <div className="text-slate-600 text-xs space-y-1">
            <p><span className="font-semibold">🎁 2x Score | 👻 Invisible | ⏰ Slow-Mo</span></p>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border-2 border-slate-100 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3 text-red-600">
            <Flame size={24} />
          </div>
          <h3 className="font-bold text-base mb-1">Avoid Fire</h3>
          <p className="text-slate-500 text-xs">Dodge the falling fireballs! One touch and it's game over.</p>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border-2 border-slate-100 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3 text-green-600">
            <Clock size={24} />
          </div>
          <h3 className="font-bold text-base mb-1">Survive</h3>
          <p className="text-slate-500 text-xs">The longer you last, the higher your score.</p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <Button variant="primary" fullWidth onClick={() => setAppState(AppState.PLAYING)}>
          Start Game 🎮
        </Button>
        <Button variant="outline" fullWidth onClick={() => setAppState(AppState.REGISTRATION)}>
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default Tutorial;