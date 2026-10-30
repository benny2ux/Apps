import React, { useState } from 'react';
import { VirtualGift, LiveGuest } from '../types';
import { GIFTS_CATALOG, appStore } from '../services/store';
import { soundManager } from '../services/soundEffects';
import confetti from 'canvas-confetti';
import { Coins, Sparkles, X, ChevronRight } from 'lucide-react';

interface GiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId?: string;
  isLive?: boolean;
  liveGuests?: LiveGuest[];
  hostName?: string;
  onGiftSent?: (gift: VirtualGift, targetName: string) => void;
  onOpenRecharge: () => void;
}

export const GiftModal: React.FC<GiftModalProps> = ({
  isOpen,
  onClose,
  postId,
  isLive = false,
  liveGuests = [],
  hostName = 'Host',
  onGiftSent,
  onOpenRecharge
}) => {
  const [selectedGift, setSelectedGift] = useState<VirtualGift>(GIFTS_CATALOG[0]);
  const [selectedTarget, setSelectedTarget] = useState<number>(0); // 0 = Host, 1-9 = guest position
  const [filterTier, setFilterTier] = useState<string>('all');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const user = appStore.currentUser;

  const filteredGifts = GIFTS_CATALOG.filter(g => {
    if (filterTier === 'all') return true;
    return g.tier === filterTier;
  });

  const handleSend = () => {
    setErrorMsg(null);
    if (user.walletCoins < selectedGift.coins) {
      setErrorMsg(`You need ${selectedGift.coins - user.walletCoins} more coins to send ${selectedGift.name}.`);
      return;
    }

    soundManager.playCoinClink();

    if (selectedGift.coins >= 1000) {
      soundManager.playVipFanfare();
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 }
      });
    }

    if (isLive) {
      const res = appStore.sendGiftInLive(selectedGift, selectedTarget === 0 ? undefined : selectedTarget);
      if (!res.success) {
        setErrorMsg(res.message);
        return;
      }
      const targetName = selectedTarget === 0 
        ? hostName 
        : (liveGuests.find(g => g.position === selectedTarget)?.user.displayName || `Guest ${selectedTarget}`);
      onGiftSent?.(selectedGift, targetName);
    } else if (postId) {
      const res = appStore.sendGiftOnPost(postId, selectedGift);
      if (!res.success) {
        setErrorMsg(res.message);
        return;
      }
      onGiftSent?.(selectedGift, 'Post Creator');
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-purple-100 flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-purple-100 bg-purple-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">Send Virtual Gift</h3>
              <p className="text-xs text-purple-700">Support creators & level up your Diamond Badge</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Target Selector (Host vs Guest 1-9) */}
        {isLive && (
          <div className="px-5 py-3 bg-purple-50/80 border-b border-purple-100">
            <span className="text-xs font-semibold text-purple-900 block mb-2">
              Select Recipient (Platform 30%, Host 10%, Guest 60% split applied):
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setSelectedTarget(0)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedTarget === 0
                    ? 'bg-purple-700 text-white shadow-md'
                    : 'bg-white text-gray-700 border border-purple-200 hover:bg-purple-100'
                }`}
              >
                👑 {hostName} (Host · 65%)
              </button>
              {liveGuests.map(guest => (
                <button
                  key={guest.position}
                  onClick={() => setSelectedTarget(guest.position)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    selectedTarget === guest.position
                      ? 'bg-purple-700 text-white shadow-md'
                      : 'bg-white text-gray-700 border border-purple-200 hover:bg-purple-100'
                  }`}
                >
                  Seat {guest.position}: {guest.user.displayName.split(' ')[0]} (60%)
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 px-5 pt-3 pb-1 border-b border-gray-100 text-xs">
          {[
            { id: 'all', label: 'All Gifts' },
            { id: 'ordinary', label: 'Classic' },
            { id: 'animated', label: 'Animated' },
            { id: 'premium', label: 'Premium' },
            { id: 'special', label: 'Legendary' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterTier(tab.id)}
              className={`px-3 py-1 rounded-full font-medium transition-colors ${
                filterTier === tab.id
                  ? 'bg-purple-100 text-purple-800 font-semibold'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Gifts Grid */}
        <div className="p-4 grid grid-cols-4 sm:grid-cols-5 gap-3 overflow-y-auto max-h-64 sm:max-h-72">
          {filteredGifts.map(gift => {
            const isSelected = selectedGift.id === gift.id;
            const canAfford = user.walletCoins >= gift.coins;

            return (
              <button
                key={gift.id}
                onClick={() => setSelectedGift(gift)}
                className={`relative flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all ${
                  isSelected
                    ? 'border-purple-600 bg-purple-50 shadow-md ring-2 ring-purple-400/40 scale-105'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                }`}
              >
                <span className="text-3xl sm:text-4xl filter drop-shadow mb-1 animate-bounce duration-1000">
                  {gift.icon}
                </span>
                <span className="text-xs font-semibold text-gray-800 text-center line-clamp-1">
                  {gift.name}
                </span>
                <div className="flex items-center gap-1 mt-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-amber-600 inline-block" />
                  <span className={`text-[11px] font-bold ${canAfford ? 'text-amber-700' : 'text-red-500'}`}>
                    {gift.coins}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {errorMsg && (
          <div className="mx-4 mb-2 p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
            {errorMsg}
          </div>
        )}

        {/* Footer with Balance & Send Button */}
        <div className="p-4 border-t border-purple-100 bg-gray-50 flex items-center justify-between gap-3">
          {/* Wallet Balance + Quick Recharge */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 font-bold text-xs shadow-sm">
              <Coins className="w-4 h-4 text-amber-500" />
              <span>{user.walletCoins.toLocaleString()} Coins</span>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenRecharge();
              }}
              className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-0.5"
            >
              Recharge <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <button
            onClick={handleSend}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-700 to-violet-600 text-white font-bold text-sm shadow-lg shadow-purple-500/30 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
          >
            <span>Send {selectedGift.name}</span>
            <span className="text-purple-200 font-normal">({selectedGift.coins} 🪙)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
