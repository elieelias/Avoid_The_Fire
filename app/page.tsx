"use client";

import React, { useState } from "react";
import { AppState, PlayerProfile } from "../lib/types";
import QRValidation from "../components/QRValidation";
import Registration from "../components/Registration";
import Tutorial from "../components/Tutorial";
import GameCanvas from "../components/GameCanvas";
import GameOver from "../components/GameOver";

const App: React.FC = () => {
  const [currentState, setCurrentState] = useState<AppState>(
    AppState.SCAN_VALIDATION
  );
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [lastScore, setLastScore] = useState(0);

  // -- Handlers --

  const handleQRValid = () => {
    setCurrentState(AppState.REGISTRATION);
  };

  const handleRegistrationComplete = (newProfile: PlayerProfile) => {
    setProfile(newProfile);
    setCurrentState(AppState.TUTORIAL);
  };

  const handleTutorialComplete = () => {
    setCurrentState(AppState.GAME);
  };

  const handleBackToRegistration = () => {
    setCurrentState(AppState.REGISTRATION);
  };

  const handleGameOver = (score: number) => {
    setLastScore(score);
    setCurrentState(AppState.GAME_OVER);
  };

  const handleRestart = () => {
    setCurrentState(AppState.GAME);
  };

  // -- Render --

  return (
    <div className="w-full h-screen max-w-md mx-auto bg-slate-900 text-white relative shadow-2xl overflow-hidden">
      {currentState === AppState.SCAN_VALIDATION && (
        <QRValidation onValid={handleQRValid} />
      )}

      {currentState === AppState.REGISTRATION && (
        <Registration
          onComplete={handleRegistrationComplete}
          onShowTutorial={() => setCurrentState(AppState.TUTORIAL)}
        />
      )}

      {currentState === AppState.TUTORIAL && (
        <Tutorial
          onBack={
            profile ? handleTutorialComplete : handleBackToRegistration
          }
        />
      )}

      {currentState === AppState.GAME && (
        <GameCanvas onGameOver={handleGameOver} />
      )}

      {currentState === AppState.GAME_OVER && profile && (
        <GameOver
          score={lastScore}
          profile={profile}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
};

export default App;
