import React from 'react';
import { Story } from '../types';
import { appStore } from '../services/store';
import { Plus } from 'lucide-react';

interface StoriesBarProps {
  stories: Story[];
  onSelectStory: (index: number) => void;
  onOpenCreate: () => void;
}

export const StoriesBar: React.FC<StoriesBarProps> = ({
  stories,
  onSelectStory,
  onOpenCreate
}) => {
  const user = appStore.currentUser;

  return (
    <div className="flex items-center gap-3 overflow-x-auto py-2.5 px-3 border-b border-purple-50 scrollbar-none bg-white">
      {/* Create My Story Avatar */}
      <button
        onClick={onOpenCreate}
        className="flex flex-col items-center flex-shrink-0 group focus:outline-none"
      >
        <div className="relative w-14 h-14 rounded-full p-0.5 border border-dashed border-purple-300 group-hover:border-purple-600 transition-colors">
          <img
            src={user.avatar}
            alt="My Profile"
            className="w-full h-full rounded-full object-cover"
          />
          <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-purple-700 text-white flex items-center justify-center border-2 border-white shadow">
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        </div>
        <span className="text-[10px] font-semibold text-gray-700 mt-1 max-w-[56px] truncate">
          Your Story
        </span>
      </button>

      {/* Stories list */}
      {stories.map((story, index) => (
        <button
          key={story.id}
          onClick={() => onSelectStory(index)}
          className="flex flex-col items-center flex-shrink-0 group focus:outline-none"
        >
          <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 group-hover:scale-105 transition-transform shadow-sm">
            <div className="w-full h-full rounded-full p-0.5 bg-white">
              <img
                src={story.author.avatar}
                alt={story.author.displayName}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
          <span className="text-[10px] font-semibold text-gray-700 mt-1 max-w-[56px] truncate">
            {story.author.displayName.split(' ')[0]}
          </span>
        </button>
      ))}
    </div>
  );
};
