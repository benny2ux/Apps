import React, { useState } from 'react';
import { appStore } from '../services/store';
import { DiamondBadge } from './DiamondBadge';
import { soundManager } from '../services/soundEffects';
import { Sparkles, Shield, EyeOff, Check, X, Lock, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

interface EnigmaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRecharge: () => void;
}

export const EnigmaModal: React.FC<EnigmaModalProps> = ({ isOpen, onClose, onOpenRecharge }) => {
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const user = appStore.currentUser;
  const isEligible = user.gifterLevel >= 25;
  const isPurchased = user.isEnigmaPurchased;
  const isActive = user.isEnigmaActive;

  const handlePurchase = () => {
    const res = appStore.purchaseEnigma();
    setFeedback(res.message);
    if (res.success) {
      soundManager.playVipFanfare();
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.6 }
      });
    }
  };

  const handleToggle = () => {
    appStore.toggleEnigma();
    setFeedback(`ENIGMA Mode is now ${!isActive ? 'ACTIVE (Identity Cloaked)' : 'DEACTIVATED (Showing Username)'}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-md bg-[#120826] rounded-3xl shadow-[0_0_50px_rgba(139,92,246,0.5)] border border-violet-500/40 text-white overflow-hidden flex flex-col">
        {/* Header with dark violet aura */}
        <div className="relative p-6 text-center overflow-hidden bg-gradient-to-b from-purple-900/60 to-transparent">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 text-gray-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 p-1 mx-auto shadow-[0_0_25px_rgba(168,85,247,0.8)] animate-pulse">
            <div className="w-full h-full rounded-full bg-[#16062d] flex items-center justify-center">
              <EyeOff className="w-8 h-8 text-violet-300" />
            </div>
          </div>

          <h2 className="font-display text-2xl font-black tracking-widest uppercase mt-3 bg-gradient-to-r from-violet-300 via-purple-100 to-fuchsia-300 bg-clip-text text-transparent">
            ENIGMA MODE
          </h2>
          <p className="text-xs text-purple-300/80 mt-1">
            Exclusive Cloaked Identity for Elite VIP Gifters (Lv.25–50)
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {feedback && (
            <div className="p-3 bg-violet-900/60 border border-violet-400 rounded-xl text-xs text-violet-100">
              {feedback}
            </div>
          )}

          {/* Current Status Card */}
          <div className="p-4 rounded-2xl bg-white/5 border border-purple-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DiamondBadge level={user.gifterLevel} size="md" />
              <div>
                <span className="text-xs text-gray-400 block">Your Gifter Rank</span>
                <span className="text-sm font-bold">
                  {isEligible ? 'Eligible for ENIGMA' : 'Requires Level 25+'}
                </span>
              </div>
            </div>
            {isPurchased && (
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase ${
                isActive ? 'bg-violet-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.8)]' : 'bg-gray-700 text-gray-300'
              }`}>
                {isActive ? 'ACTIVE' : 'OFF'}
              </span>
            )}
          </div>

          {/* Perks list */}
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2 text-purple-200">
              <Check className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
              <span>Hides public username during LIVE entry & chat (Displays <strong>✦ ENIGMA ✦</strong>)</span>
            </div>
            <div className="flex items-start gap-2 text-purple-200">
              <Check className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
              <span>Retains all VIP Diamond Gifter privileges and Fan Club roles</span>
            </div>
            <div className="flex items-start gap-2 text-purple-200">
              <Check className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
              <span>Mysterious pulsating dark-violet aura around comments and gifts</span>
            </div>
            <div className="flex items-start gap-2 text-purple-300/80 bg-violet-950/40 p-2.5 rounded-xl border border-violet-800/40">
              <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Safety Compliance:</strong> Identity remains visible to authorized TIME UP administrators and safety systems for fraud & integrity checks.
              </span>
            </div>
          </div>

          {/* Action button */}
          {!isPurchased ? (
            <div className="pt-2">
              {isEligible ? (
                <button
                  onClick={handlePurchase}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:brightness-110 active:scale-95 text-white font-extrabold text-sm shadow-[0_0_20px_rgba(168,85,247,0.6)] transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Unlock ENIGMA (4,999 Coins)</span>
                </button>
              ) : (
                <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-center text-xs text-red-200 flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4 text-red-400" />
                  <span>Reach Gifter Level 25 to unlock ENIGMA membership</span>
                </div>
              )}
            </div>
          ) : (
            <div className="pt-2">
              <button
                onClick={handleToggle}
                className={`w-full py-3 rounded-2xl font-extrabold text-sm transition-all flex items-center justify-center gap-2 ${
                  isActive
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-600'
                    : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.6)]'
                }`}
              >
                <EyeOff className="w-4 h-4" />
                <span>{isActive ? 'Deactivate ENIGMA Mode' : 'Activate ENIGMA Cloak'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
