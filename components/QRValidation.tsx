'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, QrCode } from 'lucide-react';
import { AppState } from '@/lib/types';
import { createClient } from '@/utils/supabaseClient';

interface Props {
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  qrToken: string | null;
}

const QRValidation: React.FC<Props> = ({ setAppState, qrToken }) => {
  const [status, setStatus] = useState<'checking' | 'valid' | 'invalid'>('checking');

  useEffect(() => {
    const validateToken = async () => {
        let extractedToken = qrToken;
    
    // Check if it's a full URL
    if (qrToken && qrToken.startsWith('http')) {
      try {
        const url = new URL(qrToken);
        extractedToken = url.searchParams.get('token');
      } catch (err) {
        console.error('Invalid URL:', err);
        setStatus('invalid');
        return;
      }
    }
    
    // Now use extractedToken instead of qrToken
    if (!extractedToken) {
      setStatus('invalid');
      return;
    }
      // If no token provided, show error
      if (!qrToken) {
        setStatus('invalid');
        return;
      }

      try {
        // Query the database to check if the token exists and is not used
        const { data, error } = await createClient()
          .from('main')
          .select('*')
          .eq('qr_token', qrToken)
          .single();

        if (error || !data) {
          // Token not found
          setStatus('invalid');
          return;
        }

        // Check if token is already used
        if (data.is_used) {
          setStatus('invalid');
          return;
        }

        // Check if token is still valid (not expired)
        const validTill = new Date(data.valid_till);
        const now = new Date();

        if (now > validTill) {
          setStatus('invalid');
          return;
        }

        // Token is valid!
        setStatus('valid');
        setTimeout(() => setAppState(AppState.REGISTRATION), 1500);
      } catch (err) {
        console.error('Error validating token:', err);
        setStatus('invalid');
      }
    };

    // Add a small delay to show the checking animation
    const timer = setTimeout(() => {
      validateToken();
    }, 1500);

    return () => clearTimeout(timer);
  }, [qrToken, setAppState]);

  if (status === 'invalid') {
    return (
      <div className="flex flex-col h-full w-full items-center text-center animate-fadeIn bg-white">
        <div className="pt-18 px-6">
          <h2 className="text-3xl font-black text-red-700 drop-shadow-sm">Nice try!</h2>
        </div>

        <div className="flex-1 flex items-center justify-center w-full px-4 py-1">
          <img
            src="/laughing_santa.jpg"
            alt="Laughing Santa"
            className="w-full max-w-5xl h-auto object-contain"
          />
        </div>

        <div className="px-6 pb-4 space-y-1 max-w-2xl">
          <p className="text-slate-700 text-sm md:text-base font-medium leading-snug pb-8">
            We knew you&apos;d love our game. Go grab a drink and scan a fresh code to play again!
          </p>
          <p className="text-xs text-slate-400">Made with ❤️ by the Fruishy Team</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="relative mb-8">
        {status === 'checking' ? (
          <Loader2 className="w-16 h-16 text-green-600 animate-spin" />
        ) : (
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 animate-bounce">
            <span className="text-3xl">🎄</span>
          </div>
        )}
      </div>

      <h2 className="text-2xl font-bold text-slate-800 mb-2">
        {status === 'checking' ? 'Checking your QR Code...' : 'QR Verified!'}
      </h2>
      <p className="text-slate-500">
        {status === 'checking' ? 'Please wait a moment.' : "Let's get you ready to play."}
      </p>
    </div>
  );
};

export default QRValidation;