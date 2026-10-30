import React, { useState } from 'react';
import { Post, Comment, VirtualGift } from '../types';
import { appStore } from '../services/store';
import { DiamondBadge } from './DiamondBadge';
import { LeagueBadge } from './LeagueBadge';
import { GiftModal } from './GiftModal';
import { soundManager } from '../services/soundEffects';
import {
  Heart,
  MessageCircle,
  Share2,
  Repeat2,
  Gift,
  Bookmark,
  Music,
  CheckCircle,
  Send,
  MoreHorizontal,
  X,
  Volume2,
  VolumeX,
  Play,
  Pause,
  AlertTriangle,
  Flag
} from 'lucide-react';

interface FeedProps {
  onOpenLive: () => void;
  onOpenRecharge: () => void;
  onViewProfile: (userId: string) => void;
}

export const Feed: React.FC<FeedProps> = ({ onOpenLive, onOpenRecharge, onViewProfile }) => {
  const [feedTab, setFeedTab] = useState<'fyp' | 'following'>('fyp');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [selectedGiftPostId, setSelectedGiftPostId] = useState<string | null>(null);
  const [mutedVideos, setMutedVideos] = useState<Record<string, boolean>>({});
  const [reportModalPost, setReportModalPost] = useState<Post | null>(null);
  const [reportReason, setReportReason] = useState('Spam or Scam');
  const [reportSuccess, setReportSuccess] = useState(false);

  const posts = appStore.posts;

  const handleLike = (postId: string) => {
    soundManager.playCoinClink();
    appStore.toggleLike(postId);
  };

  const handleAddComment = (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    appStore.addComment(postId, commentText);
    setCommentText('');
  };

  const toggleMute = (postId: string) => {
    setMutedVideos(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleReportPost = () => {
    if (!reportModalPost) return;
    appStore.reports.unshift({
      id: `rep_${Date.now()}`,
      reporterId: appStore.currentUser.id,
      reportedUserId: reportModalPost.userId,
      reportedPostId: reportModalPost.id,
      reason: reportReason,
      details: 'Reported via Feed post actions.',
      status: 'pending',
      timestamp: Date.now()
    });
    setReportSuccess(true);
    setTimeout(() => {
      setReportModalPost(null);
      setReportSuccess(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col w-full pb-20">
      {/* Top Feed Navigation Tabs */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-purple-50 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setFeedTab('fyp')}
            className={`font-display text-sm font-extrabold pb-1 transition-all ${
              feedTab === 'fyp'
                ? 'text-purple-900 border-b-2 border-purple-700'
                : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            For You Page
          </button>
          <button
            onClick={() => setFeedTab('following')}
            className={`font-display text-sm font-extrabold pb-1 transition-all ${
              feedTab === 'following'
                ? 'text-purple-900 border-b-2 border-purple-700'
                : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            Following
          </button>
        </div>

        {/* Live Indicator Banner */}
        <button
          onClick={onOpenLive}
          className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-700 to-rose-600 text-white font-extrabold text-[11px] flex items-center gap-1.5 shadow-sm hover:brightness-110 active:scale-95 transition-all"
        >
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span>LIVE ROOM</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto px-4 py-2 border-b border-gray-100 scrollbar-none text-xs font-semibold">
        {['All', 'Trending', 'Creative', 'Comedy', 'Nairobi Beats', 'Dance', 'Gaming'].map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1 rounded-full transition-all flex-shrink-0 ${
              categoryFilter === cat
                ? 'bg-purple-100 text-purple-900 font-bold'
                : 'text-gray-500 hover:text-gray-900 bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts Stream */}
      <div className="flex flex-col divide-y divide-gray-100">
        {posts.map(post => {
          const isMuted = mutedVideos[post.id] ?? true;
          const commentsList = appStore.comments[post.id] || [];

          return (
            <article key={post.id} className="p-4 bg-white flex flex-col gap-3">
              {/* Post Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => onViewProfile(post.author.id)}
                    className="focus:outline-none"
                  >
                    <img
                      src={post.author.avatar}
                      alt={post.author.displayName}
                      className="w-10 h-10 rounded-full object-cover border border-purple-200"
                    />
                  </button>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onViewProfile(post.author.id)}
                        className="font-bold text-sm text-gray-900 hover:underline"
                      >
                        {post.author.displayName}
                      </button>
                      {post.author.isVerified && (
                        <CheckCircle className="w-3.5 h-3.5 text-blue-500 fill-blue-500 text-white" />
                      )}
                      <DiamondBadge level={post.author.gifterLevel} size="sm" />
                      <LeagueBadge league={post.author.creatorLeague} size="sm" />
                    </div>
                    <span className="text-[11px] text-gray-400">
                      @{post.author.username} · {post.createdAt}
                    </span>
                  </div>
                </div>

                {/* More / Report */}
                <button
                  onClick={() => setReportModalPost(post)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-600"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              {/* Post Caption & Tags */}
              <p className="text-sm text-gray-800 font-normal leading-relaxed">
                {post.caption}
              </p>
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 text-xs text-purple-700 font-semibold">
                  {post.tags.map(t => (
                    <span key={t}>#{t}</span>
                  ))}
                </div>
              )}

              {/* Music Banner */}
              {post.musicTitle && (
                <div className="flex items-center gap-1.5 text-xs text-purple-800 bg-purple-50/70 px-3 py-1 rounded-full w-fit">
                  <Music className="w-3.5 h-3.5 text-purple-600" />
                  <span className="font-medium truncate max-w-xs">{post.musicTitle}</span>
                </div>
              )}

              {/* Media Container (Photo or Video) */}
              <div className="relative w-full rounded-2xl overflow-hidden bg-black aspect-[4/5] sm:aspect-video flex items-center justify-center shadow-sm border border-gray-100">
                {post.type === 'video' ? (
                  <>
                    <video
                      src={post.mediaUrl}
                      playsInline
                      loop
                      autoPlay
                      muted={isMuted}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => toggleMute(post.id)}
                      className="absolute bottom-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 backdrop-blur-sm"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </>
                ) : (
                  <img
                    src={post.mediaUrl}
                    alt="Post media"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center justify-between pt-1 text-gray-600">
                <div className="flex items-center gap-5">
                  {/* Like Button */}
                  <button
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-1.5 hover:text-rose-600 transition-colors"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        post.isLiked ? 'text-rose-500 fill-rose-500' : 'text-gray-600'
                      }`}
                    />
                    <span className="text-xs font-bold">{post.likesCount.toLocaleString()}</span>
                  </button>

                  {/* Comment Drawer Toggle */}
                  <button
                    onClick={() =>
                      setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)
                    }
                    className="flex items-center gap-1.5 hover:text-purple-700 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-xs font-bold">{post.commentsCount.toLocaleString()}</span>
                  </button>

                  {/* Repost Button */}
                  <button
                    onClick={() => appStore.toggleRepost(post.id)}
                    className={`flex items-center gap-1.5 transition-colors ${
                      post.isReposted ? 'text-emerald-600 font-bold' : 'hover:text-emerald-600'
                    }`}
                  >
                    <Repeat2 className="w-5 h-5" />
                    <span className="text-xs font-bold">{post.repostsCount.toLocaleString()}</span>
                  </button>

                  {/* Send Virtual Gift on Post */}
                  <button
                    onClick={() => setSelectedGiftPostId(post.id)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-bold text-xs transition-colors"
                  >
                    <Gift className="w-4 h-4 text-amber-600" />
                    <span>Gift ({post.giftsTotalCoins} 🪙)</span>
                  </button>
                </div>

                {/* Save Bookmark */}
                <button
                  onClick={() => appStore.toggleSave(post.id)}
                  className="hover:text-purple-700 transition-colors"
                >
                  <Bookmark
                    className={`w-5 h-5 ${
                      post.isSaved ? 'text-purple-700 fill-purple-700' : 'text-gray-500'
                    }`}
                  />
                </button>
              </div>

              {/* Threaded Comments Section */}
              {activeCommentPostId === post.id && (
                <div className="mt-2 pt-3 border-t border-gray-100 space-y-3">
                  {/* Add comment form */}
                  <form
                    onSubmit={e => handleAddComment(e, post.id)}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={commentText}
                      onChange={e => setCommentText(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 px-3 py-1.5 rounded-full border border-gray-200 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="p-1.5 rounded-full bg-purple-700 text-white hover:bg-purple-800"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>

                  {/* Comments list */}
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {commentsList.map(comm => (
                      <div key={comm.id} className="text-xs space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-gray-900">{comm.author.displayName}</span>
                          <DiamondBadge level={comm.author.gifterLevel} size="sm" />
                          <span className="text-[10px] text-gray-400">{comm.createdAt}</span>
                        </div>
                        <p className="text-gray-700 pl-1">{comm.text}</p>

                        {/* Replies */}
                        {comm.replies && comm.replies.length > 0 && (
                          <div className="pl-4 border-l-2 border-purple-200 space-y-1.5 mt-1">
                            {comm.replies.map(reply => (
                              <div key={reply.id} className="text-xs">
                                <span className="font-bold text-purple-900">
                                  {reply.author.displayName}:{' '}
                                </span>
                                <span className="text-gray-700">{reply.text}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Gift Modal for Feed Post */}
      {selectedGiftPostId && (
        <GiftModal
          isOpen={true}
          onClose={() => setSelectedGiftPostId(null)}
          postId={selectedGiftPostId}
          onOpenRecharge={onOpenRecharge}
        />
      )}

      {/* Report Post Modal */}
      {reportModalPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-purple-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                <Flag className="w-4 h-4 text-red-500" /> Report Content
              </h3>
              <button
                onClick={() => setReportModalPost(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {reportSuccess ? (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl font-semibold text-center">
                Report submitted to TIME UP safety team.
              </div>
            ) : (
              <>
                <p className="text-xs text-gray-600">
                  Help maintain a safe community. Why are you reporting this post by @
                  {reportModalPost.author.username}?
                </p>

                <select
                  value={reportReason}
                  onChange={e => setReportReason(e.target.value)}
                  className="w-full p-2 rounded-xl border border-gray-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option>Spam or Scam</option>
                  <option>Harassment or Bullying</option>
                  <option>Prohibited Regulated Goods</option>
                  <option>Misleading Information</option>
                  <option>Inappropriate Content</option>
                </select>

                <div className="flex gap-2">
                  <button
                    onClick={() => setReportModalPost(null)}
                    className="flex-1 py-2 rounded-xl bg-gray-100 text-xs font-bold text-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReportPost}
                    className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-bold text-white shadow"
                  >
                    Submit Report
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
