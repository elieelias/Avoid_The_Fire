import React, { useState } from 'react';
import { PlayerProfile } from '../lib/types';
import { Gift, Play, HelpCircle } from 'lucide-react';

interface RegistrationProps {
    onComplete: (profile: PlayerProfile) => void;
    onShowTutorial: () => void;
}

const Registration: React.FC<RegistrationProps> = ({ onComplete, onShowTutorial }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [errors, setErrors] = useState<{ name?: string, phone?: string }>({});

    const handleSubmit = () => {
        const newErrors: { name?: string, phone?: string } = {};
        if (!name.trim()) newErrors.name = 'Name is required';
        if (!phone.trim()) newErrors.phone = 'Phone is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onComplete({ name, phone });
    };

    return (
        <div className="flex flex-col h-full w-full max-w-md mx-auto p-6 relative z-10">
            {/* Header */}
            <div className="flex flex-col items-center mt-6 mb-8 space-y-4">
                <div className="relative">
                    <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full"></div>
                    <Gift className="w-24 h-24 text-red-500 relative z-10 drop-shadow-2xl" />
                    <div className="absolute -top-2 -right-4 text-4xl animate-bounce" style={{ animationDuration: '2s' }}>🎅</div>
                </div>
                <h1 className="text-4xl font-bold text-center text-yellow-400 drop-shadow-[0_2px_10px_rgba(251,191,36,0.5)]">
                    Join the Festival<br />Leaderboard!
                </h1>
            </div>

            {/* Form */}
            <div className="flex-1 space-y-6">
                <div className="space-y-2">
                    <label className="block text-xs font-bold text-green-400 uppercase tracking-widest ml-1">
                        Your Name
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            setErrors(prev => ({ ...prev, name: undefined }));
                        }}
                        autoFocus
                        className={`w-full px-5 py-4 rounded-2xl text-lg outline-none transition-all glass-input placeholder-white/30 ${errors.name ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                        placeholder="e.g. Elf Buddy"
                    />
                    {errors.name && <p className="text-red-400 text-sm ml-1">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                    <label className="block text-xs font-bold text-green-400 uppercase tracking-widest ml-1">
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            setPhone(val);
                            setErrors(prev => ({ ...prev, phone: undefined }));
                        }}
                        className={`w-full px-5 py-4 rounded-2xl text-lg outline-none transition-all glass-input placeholder-white/30 ${errors.phone ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                        placeholder="e.g. 555 123 4567"
                    />
                    {errors.phone && <p className="text-red-400 text-sm ml-1">{errors.phone}</p>}
                </div>

                <button
                    onClick={onShowTutorial}
                    className="flex items-center text-sm text-gray-300 hover:text-white mt-2 transition-colors ml-1"
                >
                    <HelpCircle className="w-4 h-4 mr-1" />
                    How to play?
                </button>
            </div>

            {/* Sticky CTA */}
            <div className="mt-auto pb-6 pt-4">
                <button
                    onClick={handleSubmit}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white font-bold py-4 rounded-2xl text-xl shadow-[0_0_20px_rgba(34,197,94,0.4)] transform active:scale-[0.98] transition-all flex items-center justify-center space-x-2 border border-green-400/30"
                >
                    <span>Start Game</span>
                    <Play className="w-6 h-6 fill-current" />
                </button>
            </div>
        </div>
    );
};

export default Registration;