import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './Logo';

interface OpeningAnimationProps {
  onComplete: () => void;
}

export const OpeningAnimation: React.FC<OpeningAnimationProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(1);

  useEffect(() => {
    // Step sequence across 3.5 seconds
    const t1 = setTimeout(() => setStep(2), 600);   // Glowing circular energy
    const t2 = setTimeout(() => setStep(3), 1400);  // Light rotating & logo reveal
    const t3 = setTimeout(() => setStep(4), 2200);  // "TIME UP" words reveal
    const t4 = setTimeout(() => setStep(5), 2800);  // Tagline: Connect. Create. Rise.
    const t5 = setTimeout(() => {
      onComplete();
    }, 4000); // Complete & transition

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#130722] overflow-hidden text-white select-none"
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/40 via-[#180a2c] to-[#0d0317] pointer-events-none" />

      {/* Rotating Energy Rays */}
      <AnimatePresence>
        {step >= 2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.8, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute w-80 h-80 rounded-full border border-violet-500/20 pointer-events-none"
          >
            {/* Pulsing light rings */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
              className="w-full h-full rounded-full border-t-2 border-r-2 border-violet-400 opacity-70 filter blur-[1px]"
            />
            <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-purple-700/30 to-violet-500/20 blur-xl animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logo Container */}
      <motion.div
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: step >= 2 ? 1 : 0.4, opacity: step >= 2 ? 1 : 0 }}
        transition={{ type: 'spring', damping: 15, stiffness: 120 }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="p-3 rounded-full bg-[#1e0a38]/80 border border-violet-500/40 shadow-[0_0_50px_rgba(139,92,246,0.6)]">
          <Logo size="xl" withText={false} glow={true} animated={step >= 3} />
        </div>

        {/* TIME UP Reveal */}
        <AnimatePresence>
          {step >= 4 && (
            <motion.div
              initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.5 }}
              className="mt-6 flex flex-col items-center"
            >
              <h1 className="font-display text-4xl sm:text-5xl font-black tracking-widest bg-gradient-to-r from-white via-purple-100 to-violet-300 bg-clip-text text-transparent drop-shadow-[0_4px_20px_rgba(168,85,247,0.7)]">
                TIME UP
              </h1>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tagline Reveal */}
        <AnimatePresence>
          {step >= 5 && (
            <motion.div
              initial={{ opacity: 0, letterSpacing: '0.1em' }}
              animate={{ opacity: 1, letterSpacing: '0.25em' }}
              transition={{ duration: 0.6 }}
              className="mt-3"
            >
              <p className="text-sm font-semibold uppercase text-violet-300 drop-shadow">
                Connect · Create · Rise
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Skip Button for returning users */}
      <div className="absolute bottom-10 z-20">
        <button
          onClick={onComplete}
          className="px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase text-purple-200/70 hover:text-white bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-purple-400/20 transition-all hover:scale-105 active:scale-95"
        >
          Skip Intro →
        </button>
      </div>
    </motion.div>
  );
};
