/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { appStore } from './services/store';
import { User, Story } from './types';
import { Logo } from './components/Logo';
import { OpeningAnimation } from './components/OpeningAnimation';
import { DeviceFrame } from './components/DeviceFrame';
import { StoriesBar } from './components/StoriesBar';
import { Feed } from './components/Feed';
import { LiveRoomView } from './components/LiveRoom';
import { CreatorStudio } from './components/CreatorStudio';
import { CreatorDashboard } from './components/CreatorDashboard';
import { WalletModal } from './components/WalletModal';
import { EnigmaModal } from './components/EnigmaModal';
import { StoryViewer } from './components/StoryViewer';
import { ProfileView } from './components/ProfileView';
import { MessagesView } from './components/MessagesView';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import {
  Home,
  Compass,
  PlusCircle,
  Radio,
  MessageSquare,
  User as UserIcon,
  Coins,
  ShieldAlert,
  Sparkles,
  Search,
  Bell
} from 'lucide-react';

export default function App() {
  const [showOpeningAnimation, setShowOpeningAnimation] = useState(true);
  const [currentUser, setCurrentUser] = useState<User>(appStore.currentUser);
  const [activeNav, setActiveNav] = useState<'home' | 'explore' | 'messages' | 'profile'>('home');

  // Modals
  const [isLiveOpen, setIsLiveOpen] = useState(false);
  const [isCreatorStudioOpen, setIsCreatorStudioOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isCreatorDashboardOpen, setIsCreatorDashboardOpen] = useState(false);
  const [isEnigmaOpen, setIsEnigmaOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);

  const [searchQuery, setSearchQuery] = useState('');

  // Sync store
  useEffect(() => {
    const unsub = appStore.subscribe(() => {
      setCurrentUser({ ...appStore.currentUser });
    });
    return unsub;
  }, []);

  return (
    <>
      {/* Opening Cinematic Animation (Section 2) */}
      {showOpeningAnimation && (
        <OpeningAnimation onComplete={() => setShowOpeningAnimation(false)} />
      )}

      {/* Main Responsive Device Frame (Android Phone View / Responsive Desktop View) */}
      <DeviceFrame>
        {/* App Top Header Bar */}
        <header className="px-4 py-2.5 bg-white border-b border-purple-100 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          {/* Logo with replay animation trigger */}
          <button
            onClick={() => setShowOpeningAnimation(true)}
            className="flex items-center gap-1 focus:outline-none hover:opacity-90 transition-opacity"
            title="Click to replay TIME UP opening animation"
          >
            <Logo size="sm" withText={true} />
          </button>

          {/* Top Right Quick Actions */}
          <div className="flex items-center gap-2">
            {/* Wallet Quick Pill */}
            <button
              onClick={() => setIsWalletOpen(true)}
              className="px-2.5 py-1 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-transform active:scale-95"
            >
              <Coins className="w-3.5 h-3.5 text-amber-600" />
              <span>{currentUser.walletCoins.toLocaleString()}</span>
            </button>

            {/* Admin Console Access */}
            <button
              onClick={() => setIsAdminDashboardOpen(true)}
              className="p-1.5 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 transition-colors"
              title="Central Admin & Safety Console"
            >
              <ShieldAlert className="w-4 h-4" />
            </button>

            {/* Notification / Auth button */}
            <button
              onClick={() => setIsAuthOpen(true)}
              className="w-7 h-7 rounded-full overflow-hidden border border-purple-200"
              title="Account / Session Management"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.displayName}
                className="w-full h-full object-cover"
              />
            </button>
          </div>
        </header>

        {/* Dynamic Main Body Content */}
        <div className="flex-1 overflow-y-auto bg-white flex flex-col">
          {activeNav === 'home' && (
            <>
              {/* 24-hr Stories Strip */}
              <StoriesBar
                stories={appStore.stories}
                onSelectStory={index => setSelectedStoryIndex(index)}
                onOpenCreate={() => setIsCreatorStudioOpen(true)}
              />

              {/* Feed: FYP + Following */}
              <Feed
                onOpenLive={() => setIsLiveOpen(true)}
                onOpenRecharge={() => setIsWalletOpen(true)}
                onViewProfile={() => setActiveNav('profile')}
              />
            </>
          )}

          {activeNav === 'explore' && (
            <div className="p-4 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search creators, hashtags, LIVE rooms..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Live Rooms Spotlight */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-1.5">
                    <Radio className="w-4 h-4 text-purple-700" />
                    Spotlight 10-Guest LIVE Rooms
                  </h3>
                  <button
                    onClick={() => setIsLiveOpen(true)}
                    className="text-xs font-bold text-purple-700 hover:underline"
                  >
                    Join Room →
                  </button>
                </div>
                <div
                  onClick={() => setIsLiveOpen(true)}
                  className="relative rounded-2xl overflow-hidden aspect-video bg-purple-950 cursor-pointer group shadow-md"
                >
                  <img
                    src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80"
                    alt="Live banner"
                    className="w-full h-full object-cover filter brightness-75 group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-4 flex flex-col justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white font-black text-[10px] w-fit flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" /> LIVE 10-STAGE
                    </span>
                    <div>
                      <h4 className="font-bold text-white text-base">
                        {appStore.liveRooms[0].title}
                      </h4>
                      <p className="text-xs text-purple-200 mt-0.5">
                        Hosted by {appStore.liveRooms[0].host.displayName} · 4,210 Viewers
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Creator League Highlights */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-100 space-y-2">
                <span className="text-xs font-bold text-purple-900 uppercase tracking-wider block">
                  Top Creator League Leaders
                </span>
                <div className="space-y-2">
                  {appStore.users.slice(0, 3).map((u, idx) => (
                    <div
                      key={u.id}
                      className="flex items-center justify-between p-2 rounded-xl bg-white border border-purple-100 text-xs shadow-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-black text-purple-700 w-4">#{idx + 1}</span>
                        <img src={u.avatar} alt={u.displayName} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <span className="font-bold text-gray-900">{u.displayName}</span>
                          <span className="text-[10px] text-gray-500 block">League {u.creatorLeague}</span>
                        </div>
                      </div>
                      <span className="font-extrabold text-amber-600">
                        {u.leagueCoinsReceived.toLocaleString()} 🪙
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeNav === 'messages' && <MessagesView />}

          {activeNav === 'profile' && (
            <ProfileView
              onOpenCreatorDashboard={() => setIsCreatorDashboardOpen(true)}
              onOpenWallet={() => setIsWalletOpen(true)}
              onOpenEnigma={() => setIsEnigmaOpen(true)}
            />
          )}
        </div>

        {/* Android-Friendly Bottom Navigation Bar */}
        <nav className="border-t border-purple-50 bg-white/95 backdrop-blur-md px-3 py-2 flex items-center justify-around z-30">
          <button
            onClick={() => setActiveNav('home')}
            className={`flex flex-col items-center gap-0.5 transition-colors ${
              activeNav === 'home' ? 'text-purple-700 font-extrabold' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px]">Home</span>
          </button>

          <button
            onClick={() => setActiveNav('explore')}
            className={`flex flex-col items-center gap-0.5 transition-colors ${
              activeNav === 'explore' ? 'text-purple-700 font-extrabold' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[10px]">Explore</span>
          </button>

          {/* Central CREATE button with Face Filters */}
          <button
            onClick={() => setIsCreatorStudioOpen(true)}
            className="flex flex-col items-center justify-center -mt-4 group focus:outline-none"
            title="Create Post or Story with Funny Face Filters"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-700 via-purple-600 to-violet-500 text-white flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 active:scale-95 transition-transform">
              <PlusCircle className="w-6 h-6 stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-bold text-purple-700 mt-0.5">Create</span>
          </button>

          {/* LIVE Room trigger */}
          <button
            onClick={() => setIsLiveOpen(true)}
            className="flex flex-col items-center gap-0.5 text-gray-400 hover:text-purple-700 transition-colors"
          >
            <div className="relative">
              <Radio className="w-5 h-5 text-purple-700" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            </div>
            <span className="text-[10px] font-bold text-purple-900">LIVE</span>
          </button>

          <button
            onClick={() => setActiveNav('messages')}
            className={`flex flex-col items-center gap-0.5 transition-colors ${
              activeNav === 'messages' ? 'text-purple-700 font-extrabold' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-[10px]">Inbox</span>
          </button>

          <button
            onClick={() => setActiveNav('profile')}
            className={`flex flex-col items-center gap-0.5 transition-colors ${
              activeNav === 'profile' ? 'text-purple-700 font-extrabold' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <UserIcon className="w-5 h-5" />
            <span className="text-[10px]">Profile</span>
          </button>
        </nav>
      </DeviceFrame>

      {/* 10-Person LIVE Room Modal */}
      {isLiveOpen && (
        <LiveRoomView
          room={appStore.liveRooms[0]}
          onClose={() => setIsLiveOpen(false)}
          onOpenRecharge={() => {
            setIsLiveOpen(false);
            setIsWalletOpen(true);
          }}
        />
      )}

      {/* Creator Studio & Face Effects */}
      <CreatorStudio
        isOpen={isCreatorStudioOpen}
        onClose={() => setIsCreatorStudioOpen(false)}
        onPublished={() => {
          setActiveNav('home');
        }}
      />

      {/* Coin Wallet & Recharge Modal */}
      <WalletModal isOpen={isWalletOpen} onClose={() => setIsWalletOpen(false)} />

      {/* Creator Studio & Earnings Dashboard */}
      {isCreatorDashboardOpen && (
        <CreatorDashboard onClose={() => setIsCreatorDashboardOpen(false)} />
      )}

      {/* Enigma VIP Modal */}
      <EnigmaModal
        isOpen={isEnigmaOpen}
        onClose={() => setIsEnigmaOpen(false)}
        onOpenRecharge={() => {
          setIsEnigmaOpen(false);
          setIsWalletOpen(true);
        }}
      />

      {/* Full-Screen Story Viewer */}
      {selectedStoryIndex !== null && (
        <StoryViewer
          stories={appStore.stories}
          initialIndex={selectedStoryIndex}
          onClose={() => setSelectedStoryIndex(null)}
        />
      )}

      {/* Admin & Safety Dashboard */}
      {isAdminDashboardOpen && (
        <AdminDashboard onClose={() => setIsAdminDashboardOpen(false)} />
      )}

      {/* Auth / Account Registration Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}
