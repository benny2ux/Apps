import React from 'react';
import { getGifterBadgeColor, getDiamondFragmentsCount } from '../services/store';

interface DiamondBadgeProps {
  level: number;
  size?: 'sm' | 'md' | 'lg';
  showFragmentsModal?: boolean;
}

export const DiamondBadge: React.FC<DiamondBadgeProps> = ({
  level,
  size = 'md'
}) => {
  const color = getGifterBadgeColor(level);
  const fragments = getDiamondFragmentsCount(level); // 1 to 10

  // Color schemes according to section 11
  const styles = {
    blue: {
      bg: 'from-blue-700 via-indigo-600 to-blue-500',
      border: 'border-blue-400',
      text: 'text-blue-100',
      glow: 'shadow-[0_0_12px_rgba(59,130,246,0.5)]',
      diamondFill: '#60a5fa'
    },
    gold: {
      bg: 'from-amber-600 via-yellow-500 to-amber-400',
      border: 'border-amber-300',
      text: 'text-amber-950 font-bold',
      glow: 'shadow-[0_0_15px_rgba(245,158,11,0.6)]',
      diamondFill: '#fef08a'
    },
    red: {
      bg: 'from-rose-700 via-red-600 to-rose-500',
      border: 'border-rose-300',
      text: 'text-white font-bold',
      glow: 'shadow-[0_0_15px_rgba(239,68,68,0.6)]',
      diamondFill: '#fda4af'
    },
    purple: {
      bg: 'from-purple-900 via-violet-600 to-fuchsia-500',
      border: 'border-violet-300',
      text: 'text-white font-bold',
      glow: 'shadow-[0_0_18px_rgba(168,85,247,0.7)]',
      diamondFill: '#e9d5ff'
    }
  };

  const currentStyle = styles[color];

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 gap-1',
    md: 'text-xs px-2 py-0.5 gap-1.5',
    lg: 'text-sm px-3 py-1 gap-2'
  };

  return (
    <div
      title={`Gifter Level ${level} (${fragments}/10 Diamond Fragments)`}
      className={`inline-flex items-center rounded-full bg-gradient-to-r ${currentStyle.bg} ${currentStyle.text} ${currentStyle.border} border ${currentStyle.glow} ${sizeClasses[size]} select-none transition-transform hover:scale-105`}
    >
      {/* Dynamic Diamond SVG showing fragment completion */}
      <svg
        viewBox="0 0 24 24"
        className={`${size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-3.5 h-3.5' : 'w-4 h-4'}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Diamond Outline */}
        <polygon
          points="12,2 22,9 12,22 2,9"
          stroke="currentColor"
          strokeWidth="1.5"
          fill={level === 50 ? currentStyle.diamondFill : 'transparent'}
        />

        {/* Facet Lines (gradually filled depending on fragments count) */}
        {fragments >= 2 && <line x1="2" y1="9" x2="22" y2="9" stroke="currentColor" strokeWidth="1" />}
        {fragments >= 4 && <line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" strokeWidth="1" />}
        {fragments >= 6 && <line x1="7" y1="5.5" x2="7" y2="15.5" stroke="currentColor" strokeWidth="0.75" />}
        {fragments >= 8 && <line x1="17" y1="5.5" x2="17" y2="15.5" stroke="currentColor" strokeWidth="0.75" />}
        {fragments >= 10 && (
          <circle cx="12" cy="12" r="2.5" fill="#ffffff" className="animate-pulse" />
        )}
      </svg>

      <span className="font-extrabold tracking-tight">Lv.{level}</span>
    </div>
  );
};
