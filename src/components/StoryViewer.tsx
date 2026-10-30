import React, { useState, useEffect } from 'react';
import { Story } from '../types';
import { X, ChevronLeft, ChevronRight, Send, Heart, Sparkles } from 'lucide-react';
import { soundManager } from '../services/soundEffects';

interface StoryViewerProps {
  stories: Story[];
  initialIndex?: number;
  onClose: () => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({
  stories,
  initialIndex = 0,
  onClose
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [sentHeart, setSentHeart] = useState(false);

  const currentStory = stories[currentIndex];

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex(i => i + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return p + 2;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused, stories.length, onClose]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  };

  const handleHeart = () => {
    soundManager.playCoinClink();
    setSentHeart(true);
    setTimeout(() => setSentHeart(false), 1500);
  };

  if (!currentStory) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 select-none">
      <div className="relative w-full max-w-sm h-full sm:h-[85vh] sm:rounded-3xl overflow-hidden bg-black flex flex-col justify-between text-white shadow-2xl border border-purple-500/30">
        {/* Progress Bar Bars */}
        <div className="absolute top-3 inset-x-3 z-30 flex items-center gap-1.5">
          {stories.map((s, idx) => (
            <div key={s.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-100 ease-linear"
                style={{
                  width:
                    idx < currentIndex
                      ? '100%'
                      : idx === currentIndex
                      ? `${progress}%`
                      : '0%'
                }}
              />
            </div>
          ))}
        </div>

        {/* Top Story Header */}
        <div className="absolute top-6 inset-x-3 z-30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={currentStory.author.avatar}
              alt={currentStory.author.displayName}
              className="w-9 h-9 rounded-full object-cover border-2 border-purple-400"
            />
            <div>
              <span className="font-bold text-xs">{currentStory.author.displayName}</span>
              <div className="text-[10px] text-gray-300">
                {currentStory.filterApplied ? `Effect: ${currentStory.filterApplied} · ` : ''}24h Story
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Left & Right tap zones */}
        <div className="relative flex-1 w-full flex items-center justify-center">
          <button
            onClick={handlePrev}
            className="absolute left-0 top-0 bottom-0 w-1/3 z-20"
            aria-label="Previous"
          />
          <button
            onClick={handleNext}
            className="absolute right-0 top-0 bottom-0 w-1/3 z-20"
            aria-label="Next"
          />

          {/* Media */}
          <img
            src={currentStory.mediaUrl}
            alt="Story"
            className="w-full h-full object-cover"
            onMouseDown={() => setIsPaused(true)}
            onMouseUp={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          />

          {/* Floating Heart Burst */}
          {sentHeart && (
            <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none animate-ping">
              <Heart className="w-24 h-24 text-rose-500 fill-rose-500" />
            </div>
          )}

          {/* Caption */}
          {currentStory.caption && (
            <div className="absolute bottom-16 inset-x-4 z-20 p-3 rounded-2xl bg-black/60 backdrop-blur-md text-xs text-white text-center">
              {currentStory.caption}
            </div>
          )}
        </div>

        {/* Story Reply Form */}
        <div className="p-3 bg-gradient-to-t from-black via-black/80 to-transparent flex items-center gap-2 z-30">
          <input
            type="text"
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            placeholder="Reply to story..."
            className="flex-1 px-3 py-2 rounded-full bg-white/20 border border-white/20 text-xs text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleHeart}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-rose-400"
          >
            <Heart className="w-5 h-5 fill-rose-500/20" />
          </button>
          <button
            onClick={() => {
              if (replyText.trim()) {
                setReplyText('');
                handleHeart();
              }
            }}
            className="p-2 rounded-full bg-purple-600 hover:bg-purple-500 text-white"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
