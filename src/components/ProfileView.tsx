import React, { useState } from 'react';
import { User, Post } from '../types';
import { appStore } from '../services/store';
import { DiamondBadge } from './DiamondBadge';
import { LeagueBadge } from './LeagueBadge';
import {
  CheckCircle,
  Coins,
  Shield,
  TrendingUp,
  Settings,
  Users,
  Grid,
  Bookmark,
  Heart,
  Share2,
  Lock,
  UserCheck,
  UserX,
  Flag,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface ProfileViewProps {
  userId?: string;
  onOpenCreatorDashboard: () => void;
  onOpenWallet: () => void;
  onOpenEnigma: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  userId,
  onOpenCreatorDashboard,
  onOpenWallet,
  onOpenEnigma
}) => {
  const [profileTab, setProfileTab] = useState<'posts' | 'saved' | 'liked'>('posts');
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyCategory, setVerifyCategory] = useState('Music & Live Performance');
  const [verifyStatusMsg, setVerifyStatusMsg] = useState<string | null>(null);

  const currentUser = appStore.currentUser;
  const targetUser: User = userId
    ? appStore.users.find(u => u.id === userId) || currentUser
    : currentUser;

  const isMe = targetUser.id === currentUser.id;
  const userPosts = appStore.posts.filter(p => p.userId === targetUser.id);
  const savedPosts = appStore.posts.filter(p => p.isSaved);
  const likedPosts = appStore.posts.filter(p => p.isLiked);

  const handleApplyVerification = (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyStatusMsg('Verification application submitted! Evaluators review authenticity, activity consistency, and guidelines compliance.');
    setTimeout(() => {
      setShowVerifyModal(false);
      setVerifyStatusMsg(null);
    }, 2500);
  };

  return (
    <div className="flex flex-col w-full pb-20 bg-white">
      {/* Top Bar */}
      <div className="p-4 border-b border-purple-50 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-20">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-base text-gray-900">@{targetUser.username}</span>
          {targetUser.isVerified && (
            <CheckCircle className="w-4 h-4 text-blue-500 fill-blue-500 text-white" />
          )}
        </div>

        {/* Switch test accounts helper */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-400 hidden sm:inline">Switch Test Account:</span>
          <select
            value={currentUser.id}
            onChange={e => appStore.switchUser(e.target.value)}
            className="text-xs bg-purple-50 text-purple-900 font-bold px-2 py-1 rounded-lg border border-purple-200 focus:outline-none"
          >
            {appStore.users.map(u => (
              <option key={u.id} value={u.id}>
                {u.displayName} ({u.username})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Profile Header */}
      <div className="p-5 flex flex-col items-center text-center">
        {/* Avatar with Badges */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-purple-700 via-violet-500 to-amber-400 shadow-xl">
            <img
              src={targetUser.avatar}
              alt={targetUser.displayName}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          {targetUser.isVerified && (
            <div className="absolute bottom-0 right-1 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center border-2 border-white shadow">
              <CheckCircle className="w-4 h-4 fill-white text-blue-500" />
            </div>
          )}
        </div>

        {/* Display Name & Badges */}
        <div className="mt-3 flex items-center gap-2 justify-center flex-wrap">
          <h2 className="font-display font-extrabold text-xl text-gray-900">
            {targetUser.displayName}
          </h2>
          <DiamondBadge level={targetUser.gifterLevel} size="md" />
          <LeagueBadge league={targetUser.creatorLeague} size="md" />
        </div>

        {/* Bio */}
        <p className="text-xs text-gray-600 max-w-sm mt-2 leading-relaxed">
          {targetUser.bio}
        </p>

        {/* Metric Counts */}
        <div className="flex items-center justify-center gap-6 mt-4 py-2 border-y border-purple-50 w-full max-w-sm text-center">
          <div>
            <div className="text-base font-black text-gray-900">
              {targetUser.followingCount.toLocaleString()}
            </div>
            <div className="text-[11px] text-gray-500">Following</div>
          </div>
          <div>
            <div className="text-base font-black text-gray-900">
              {targetUser.followersCount.toLocaleString()}
            </div>
            <div className="text-[11px] text-gray-500">Followers</div>
          </div>
          <div>
            <div className="text-base font-black text-gray-900">
              {targetUser.likesReceivedCount.toLocaleString()}
            </div>
            <div className="text-[11px] text-gray-500">Likes</div>
          </div>
        </div>

        {/* Action Buttons */}
        {isMe ? (
          <div className="flex items-center gap-2 mt-4 w-full max-w-sm">
            <button
              onClick={onOpenCreatorDashboard}
              className="flex-1 py-2 px-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Creator Hub & Earnings</span>
            </button>
            <button
              onClick={onOpenWallet}
              className="py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs shadow-sm transition-all flex items-center gap-1"
            >
              <Coins className="w-3.5 h-3.5 text-amber-600" />
              <span>{targetUser.walletCoins} 🪙</span>
            </button>
            <button
              onClick={onOpenEnigma}
              className="p-2 rounded-xl bg-violet-900 text-violet-200 hover:bg-violet-800"
              title="ENIGMA Mode"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 mt-4 w-full max-w-sm">
            <button className="flex-1 py-2 rounded-xl bg-purple-700 text-white font-bold text-xs shadow-md hover:bg-purple-800">
              Follow
            </button>
            <button className="py-2 px-4 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50">
              Message
            </button>
          </div>
        )}

        {/* Verification banner if not verified */}
        {isMe && !targetUser.isVerified && (
          <div className="mt-3 w-full max-w-sm p-2.5 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between text-left">
            <div>
              <span className="text-xs font-bold text-blue-900 block">Apply for Blue Badge</span>
              <span className="text-[10px] text-blue-700">Official creator verification</span>
            </div>
            <button
              onClick={() => setShowVerifyModal(true)}
              className="px-3 py-1 rounded-lg bg-blue-600 text-white text-[11px] font-bold"
            >
              Apply
            </button>
          </div>
        )}
      </div>

      {/* Profile Tabs */}
      <div className="flex items-center justify-around border-b border-gray-200 text-xs font-bold text-gray-500">
        <button
          onClick={() => setProfileTab('posts')}
          className={`flex-1 py-3 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
            profileTab === 'posts' ? 'border-purple-700 text-purple-900' : 'border-transparent'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>Posts ({userPosts.length})</span>
        </button>
        {isMe && (
          <>
            <button
              onClick={() => setProfileTab('saved')}
              className={`flex-1 py-3 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
                profileTab === 'saved' ? 'border-purple-700 text-purple-900' : 'border-transparent'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Saved ({savedPosts.length})</span>
            </button>
            <button
              onClick={() => setProfileTab('liked')}
              className={`flex-1 py-3 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
                profileTab === 'liked' ? 'border-purple-700 text-purple-900' : 'border-transparent'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Liked ({likedPosts.length})</span>
            </button>
          </>
        )}
      </div>

      {/* Grid of Posts */}
      <div className="grid grid-cols-3 gap-0.5 p-0.5">
        {(profileTab === 'posts' ? userPosts : profileTab === 'saved' ? savedPosts : likedPosts).map(
          p => (
            <div key={p.id} className="relative aspect-square bg-gray-900 overflow-hidden group">
              <img
                src={p.type === 'video' ? p.author.avatar : p.mediaUrl}
                alt="Post"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 text-white text-xs font-bold transition-opacity">
                <span className="flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 fill-white" /> {p.likesCount}
                </span>
              </div>
            </div>
          )
        )}
      </div>

      {/* Verification Application Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl border border-blue-100 space-y-4">
            <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-500 fill-blue-500 text-white" />
              Creator Verification Application
            </h3>
            {verifyStatusMsg ? (
              <div className="p-3 bg-blue-50 text-blue-900 text-xs rounded-xl font-semibold">
                {verifyStatusMsg}
              </div>
            ) : (
              <form onSubmit={handleApplyVerification} className="space-y-3 text-xs">
                <p className="text-gray-600">
                  Verification criteria: Authenticity, active presence, compliance with community guidelines, genuine engagement.
                </p>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Creator Category</label>
                  <select
                    value={verifyCategory}
                    onChange={e => setVerifyCategory(e.target.value)}
                    className="w-full p-2 rounded-xl border border-gray-300 font-semibold"
                  >
                    <option>Music & Live Performance</option>
                    <option>Comedy & Entertainment</option>
                    <option>Digital Art & Design</option>
                    <option>Dance & Choreography</option>
                    <option>Public Figure / Organization</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowVerifyModal(false)}
                    className="flex-1 py-2 rounded-xl bg-gray-100 font-bold text-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-blue-600 text-white font-bold shadow hover:bg-blue-700"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
