import React, { useEffect, useState } from 'react';
import { QrCode, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface QRValidationProps {
    onValid: () => void;
}

const QRValidation: React.FC<QRValidationProps> = ({ onValid }) => {
    const [status, setStatus] = useState<'checking' | 'valid' | 'invalid'>('checking');
    const [validationId, setValidationId] = useState("");

    // Generate validation ID only on the client
    useEffect(() => {
        setValidationId(Math.random().toString(36).substring(7).toUpperCase());
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setStatus('valid');
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (status === 'valid') {
            const timer = setTimeout(() => {
                onValid();
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [status, onValid]);

    return (
        <div className="flex flex-col items-center justify-center h-full w-full p-6 text-center space-y-8 animate-fade-in relative z-10">

            <div className="glass-panel p-8 rounded-full shadow-[0_0_30px_rgba(251,191,36,0.2)]">
                <QrCode className="w-16 h-16 text-white drop-shadow-lg" />
            </div>

            <div className="space-y-4">
                <h1 className="text-4xl font-bold text-yellow-400 drop-shadow-lg">Scan Validation</h1>

                {status === 'checking' && (
                    <div className="flex flex-col items-center space-y-3">
                        <Loader2 className="w-8 h-8 animate-spin text-green-400" />
                        <p className="text-xl font-light text-white/80">Checking your QR code...</p>
                    </div>
                )}

                {status === 'valid' && (
                    <div className="flex flex-col items-center space-y-3 animate-bounce">
                        <CheckCircle className="w-12 h-12 text-green-400 drop-shadow-lg" />
                        <p className="text-2xl font-bold text-green-400">QR Verified 🎄</p>
                        <p className="text-sm text-white/70">Entering the workshop...</p>
                    </div>
                )}

                {status === 'invalid' && (
                    <div className="flex flex-col items-center space-y-3">
                        <XCircle className="w-12 h-12 text-red-500 drop-shadow-lg" />
                        <div className="glass-panel bg-red-900/40 border-red-500/50 p-6 rounded-2xl">
                            <p className="text-xl font-bold text-red-300">QR Already Used</p>
                            <p className="text-sm mt-1 text-white/70">Each cup can only be used once.</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="absolute bottom-8 w-full text-center text-white/30 text-xs tracking-widest uppercase">
                Validation ID: {validationId}
            </div>
        </div>
    );
};

export default QRValidation;
