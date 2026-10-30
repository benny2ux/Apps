import React from 'react';
import { CreatorLeague } from '../types';

interface LeagueBadgeProps {
  league: CreatorLeague;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export const LeagueBadge: React.FC<LeagueBadgeProps> = ({
  league,
  size = 'md',
  showDetails = false
}) => {
  const isA = league.startsWith('A');
  const isB = league.startsWith('B');
  const isC = league.startsWith('C');

  let colors = {
    bg: 'from-blue-600 to-cyan-500',
    border: 'border-blue-400',
    text: 'text-white',
    fragmentColor: 'bg-blue-400',
    name: 'Sapphire League'
  };

  if (isA) {
    colors = {
      bg: 'from-purple-800 via-violet-700 to-fuchsia-600',
      border: 'border-violet-300',
      text: 'text-white',
      fragmentColor: 'bg-purple-400',
      name: 'Mythic League'
    };
  } else if (isB) {
    colors = {
      bg: 'from-amber-600 via-yellow-500 to-amber-400',
      border: 'border-amber-200',
      text: 'text-amber-950 font-bold',
      fragmentColor: 'bg-amber-400',
      name: 'Gold League'
    };
  } else if (isC) {
    colors = {
      bg: 'from-rose-600 to-red-500',
      border: 'border-rose-300',
      text: 'text-white',
      fragmentColor: 'bg-rose-400',
      name: 'Ruby League'
    };
  }

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-xs px-2 py-0.5',
    lg: 'text-sm px-3 py-1'
  };

  return (
    <div
      title={`Creator League ${league} (${colors.name})`}
      className={`inline-flex items-center gap-1 rounded-md bg-gradient-to-r ${colors.bg} ${colors.text} ${colors.border} border shadow-sm ${sizeClasses[size]} select-none`}
    >
      <span className="font-black tracking-tight">{league}</span>
      {showDetails && (
        <span className="text-[10px] opacity-90 hidden sm:inline">
          · {colors.name}
        </span>
      )}
    </div>
  );
};
