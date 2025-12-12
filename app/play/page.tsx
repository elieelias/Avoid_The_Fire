'use client';

import React, { useEffect, useState } from 'react';
import Snowfall from '@/components/ui/Snowfall';
import QRValidation from '@/components/QRValidation';
import Registration from '@/components/Registration';
import Tutorial from '@/components/Tutorial';
import GameCanvas from '@/components/GameCanvas';
import GameOver from '@/components/GameOver';
import { AppState, Player } from '@/lib/types';

export default function Play() {
  const [appState, setAppState] = useState<AppState>(AppState.VALIDATING_QR);
  const [player, setPlayer] = useState<Player | null>(null);
  const [qrToken, setQrToken] = useState<string | null>(null);

  // Extract token from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    setQrToken(token);
  }, []);

  const handleUpdateScore = (score: number) => {
    if (player) {
      setPlayer({ ...player, score });
    }
  };

  const renderScreen = () => {
    switch (appState) {
      case AppState.VALIDATING_QR:
      case AppState.INVALID_QR:
        return <QRValidation setAppState={setAppState} qrToken={qrToken} />;

      case AppState.REGISTRATION:
        return (
          <Registration
            setAppState={setAppState}
            setPlayer={setPlayer}
            qrToken={qrToken}
          />
        );

      case AppState.TUTORIAL:
        return <Tutorial setAppState={setAppState} />;

      case AppState.PLAYING:
        return (
          <GameCanvas
            setAppState={setAppState}
            updateScore={handleUpdateScore}
          />
        );

      case AppState.GAME_OVER:
        if (!player) return null;
        return (
          <GameOver
            player={player}
            setAppState={setAppState}
            setPlayer={setPlayer}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative w-full h-[100dvh] bg-slate-50 flex flex-col overflow-hidden max-w-md mx-auto shadow-2xl">
      {/* Background Snow Effect (Global) */}
      <Snowfall />

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 h-full">
        {renderScreen()}
      </main>
    </div>
  );
};
