import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withText?: boolean;
  withTagline?: boolean;
  glow?: boolean;
  animated?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  withText = true,
  withTagline = false,
  glow = true,
  animated = false
}) => {
  const sizeMap = {
    sm: { box: 'w-7 h-7', text: 'text-lg', crown: 'scale-75' },
    md: { box: 'w-10 h-10', text: 'text-xl', crown: 'scale-90' },
    lg: { box: 'w-16 h-16', text: 'text-3xl', crown: 'scale-100' },
    xl: { box: 'w-24 h-24', text: 'text-4xl', crown: 'scale-125' }
  };

  const currentSize = sizeMap[size];

  return (
    <div className="flex items-center gap-3">
      <div className={`relative ${currentSize.box} flex items-center justify-center`}>
        {/* Glowing ring / energy aura */}
        {glow && (
          <div
            className={`absolute inset-0 rounded-full bg-gradient-to-tr from-purple-600 via-violet-500 to-fuchsia-500 blur-md opacity-75 ${
              animated ? 'animate-pulse' : ''
            }`}
          />
        )}

        {/* Outer Clock Dial Border with hour notches */}
        <svg
          viewBox="0 0 100 100"
          className={`relative z-10 w-full h-full drop-shadow-md ${
            animated ? 'animate-spin-slow' : ''
          }`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer circle */}
          <circle
            cx="50"
            cy="50"
            r="44"
            stroke="url(#purpleGrad)"
            strokeWidth="3.5"
            strokeDasharray="4 2"
          />

          {/* Clock ticks / compass marks */}
          <line x1="50" y1="8" x2="50" y2="15" stroke="#c084fc" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="92" y1="50" x2="85" y2="50" stroke="#c084fc" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="50" y1="92" x2="50" y2="85" stroke="#c084fc" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="8" y1="50" x2="15" y2="50" stroke="#c084fc" strokeWidth="2.5" strokeLinecap="round" />

          {/* Gradients */}
          <defs>
            <linearGradient id="purpleGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#9333ea" />
              <stop offset="0.5" stopColor="#7c3aed" />
              <stop offset="1" stopColor="#c084fc" />
            </linearGradient>
            <linearGradient id="crownGrad" x1="0" y1="0" x2="30" y2="20" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fbbf24" />
              <stop offset="1" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Emblem: Stylized T + Crown overlay */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
          {/* Imperial Crown on top of T */}
          <svg
            viewBox="0 0 24 16"
            className={`w-1/2 -mb-1 text-amber-400 drop-shadow ${currentSize.crown}`}
            fill="currentColor"
          >
            <path d="M2 13L4.5 4L9 8L12 2L15 8L19.5 4L22 13H2Z" />
            <circle cx="12" cy="1.5" r="1.5" fill="#fef08a" />
            <circle cx="4.5" cy="3.5" r="1.2" fill="#fef08a" />
            <circle cx="19.5" cy="3.5" r="1.2" fill="#fef08a" />
          </svg>

          {/* Stylized 'T' with clock hand diagonal flair */}
          <span className="font-display font-extrabold text-white tracking-tighter leading-none text-center drop-shadow-sm text-base md:text-lg">
            T
          </span>
        </div>
      </div>

      {withText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-display font-black tracking-wider ${currentSize.text} bg-gradient-to-r from-purple-900 via-purple-700 to-violet-600 bg-clip-text text-transparent`}
            >
              TIME UP
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-ping" />
          </div>
          {withTagline && (
            <span className="text-[10px] tracking-widest uppercase font-semibold text-purple-600/80 -mt-0.5">
              Connect. Create. Rise.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
