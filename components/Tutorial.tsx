import React from 'react';
import { ArrowLeft, Gift, Snowflake, Zap, Move } from 'lucide-react';

interface TutorialProps {
    onBack: () => void;
}

const Tutorial: React.FC<TutorialProps> = ({ onBack }) => {
    return (
        <div className="flex flex-col h-full p-6 animate-fade-in max-w-md mx-auto relative z-10">
            <div className="flex items-center mb-6">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
                    <ArrowLeft className="w-6 h-6 text-white" />
                </button>
                <h1 className="text-3xl font-bold ml-2 text-white">How to Play</h1>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto pb-20 custom-scrollbar">
                {/* Card 1 */}
                <div className="glass-panel p-6 rounded-3xl border-l-4 border-l-green-500 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-bl-full -mr-4 -mt-4"></div>
                    <div className="flex items-start space-x-4">
                        <div className="bg-green-500 w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-500/30">
                            <Move className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-1 text-green-300">Fly Everywhere</h3>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                Santa can fly freely! Drag anywhere on the screen to move Santa up, down, left, or right.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="glass-panel p-6 rounded-3xl border-l-4 border-l-red-500 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/10 rounded-bl-full -mr-4 -mt-4"></div>
                    <div className="flex items-start space-x-4">
                        <div className="bg-red-500 w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-500/30">
                            <Snowflake className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-1 text-red-300">Avoid Hazards</h3>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                Dodge the snowmen and ice patches falling from the sky. One hit and it's game over!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="glass-panel p-6 rounded-3xl border-l-4 border-l-yellow-500 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/10 rounded-bl-full -mr-4 -mt-4"></div>
                    <div className="flex items-start space-x-4">
                        <div className="bg-yellow-500 w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-yellow-500/30">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-1 text-yellow-400">Speed Up</h3>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                The game gets faster with every gift you collect. Stay sharp!
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-auto sticky bottom-6 pt-4">
                <button
                    onClick={onBack}
                    className="w-full bg-white text-slate-900 font-extrabold py-4 rounded-2xl text-lg shadow-xl active:scale-[0.98] transition-transform"
                >
                    Got it! Let's Play
                </button>
            </div>
        </div>
    );
};

export default Tutorial;