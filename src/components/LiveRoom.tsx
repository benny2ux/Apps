import React, { useState, useEffect, useRef } from 'react';
import { LiveRoom, LiveGuest, VirtualGift, User } from '../types';
import { appStore, getGifterBadgeColor } from '../services/store';
import { soundManager } from '../services/soundEffects';
import { DiamondBadge } from './DiamondBadge';
import { LeagueBadge } from './LeagueBadge';
import { GiftModal } from './GiftModal';
import confetti from 'canvas-confetti';
import {
  Users,
  Heart,
  MessageCircle,
  Share2,
  Gift,
  Volume2,
  VolumeX,
  Camera,
  CameraOff,
  Mic,
  MicOff,
  UserPlus,
  ShieldAlert,
  X,
  Swords,
  Coins,
  Send,
  Sparkles,
  Crown,
  Eye,
  AlertTriangle
} from 'lucide-react';

interface LiveRoomViewProps {
  room: LiveRoom;
  onClose: () => void;
  onOpenRecharge: () => void;
}

export const LiveRoomView: React.FC<LiveRoomViewProps> = ({ room: initialRoom, onClose, onOpenRecharge }) => {
  const [room, setRoom] = useState<LiveRoom>(initialRoom);
  const [currentUser, setCurrentUser] = useState<User>(appStore.currentUser);
  const [chatInput, setChatInput] = useState('');
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [showSoundboard, setShowSoundboard] = useState(false);
  const [showHostControls, setShowHostControls] = useState(false);
  const [showPkBattle, setShowPkBattle] = useState(false);
  const [activeGiftAnimation, setActiveGiftAnimation] = useState<{
    gift: VirtualGift;
    senderName: string;
    targetName: string;
    id: number;
  } | null>(null);
  const [vipEntrance, setVipEntrance] = useState<{
    name: string;
    level: number;
    isEnigma: boolean;
  } | null>(null);

  const [activeStrikeWarning, setActiveStrikeWarning] = useState<string | null>(null);

  // Guest seat taken by current user if they joined
  const [myGuestPosition, setMyGuestPosition] = useState<number | null>(null);
  const [myCameraOn, setMyCameraOn] = useState(true);
  const [myMicOn, setMyMicOn] = useState(true);

  const hostVideoRef = useRef<HTMLVideoElement | null>(null);
  const guestVideoRef = useRef<HTMLVideoElement | null>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  const isHost = currentUser.id === room.hostId;

  // Sync store updates
  useEffect(() => {
    const unsub = appStore.subscribe(() => {
      setCurrentUser({ ...appStore.currentUser });
      if (appStore.liveRooms[0]) {
        setRoom({ ...appStore.liveRooms[0] });
      }
    });
    return unsub;
  }, []);

  // VIP Join Announcement Trigger for Level 25+ / ENIGMA
  useEffect(() => {
    if (currentUser.gifterLevel >= 25) {
      soundManager.playVipFanfare();
      const displayName = currentUser.isEnigmaActive ? '✦ ENIGMA ✦' : currentUser.displayName;
      setVipEntrance({
        name: displayName,
        level: currentUser.gifterLevel,
        isEnigma: currentUser.isEnigmaActive
      });

      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.3 }
      });

      const timer = setTimeout(() => {
        setVipEntrance(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  // WebCam setup for host or guest
  useEffect(() => {
    let localStream: MediaStream | null = null;
    const initCam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStream = stream;
        if (isHost && hostVideoRef.current) {
          hostVideoRef.current.srcObject = stream;
          hostVideoRef.current.play().catch(() => {});
        } else if (myGuestPosition && guestVideoRef.current) {
          guestVideoRef.current.srcObject = stream;
          guestVideoRef.current.play().catch(() => {});
        }
      } catch (err) {
        console.warn('Real webcam not accessible; simulated live feed will be shown:', err);
      }
    };

    initCam();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(t => t.stop());
      }
    };
  }, [isHost, myGuestPosition]);

  // Scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [appStore.liveComments.length]);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const isEnigma = currentUser.isEnigmaActive;
    appStore.liveComments.push({
      id: `chat_${Date.now()}`,
      roomId: room.id,
      userId: currentUser.id,
      user: currentUser,
      text: chatInput.trim(),
      timestamp: Date.now(),
      isEnigma
    });

    setChatInput('');
    appStore.notify();
  };

  const handleTriggerSound = (soundName: string) => {
    soundManager.playSoundByName(soundName);
    // Broadcast notification in chat
    appStore.liveComments.push({
      id: `sound_${Date.now()}`,
      roomId: room.id,
      userId: room.hostId,
      user: room.host,
      text: `🔊 played Sound Effect: ${soundName}!`,
      timestamp: Date.now()
    });
    appStore.notify();
  };

  // Join a guest slot (1-9)
  const handleRequestGuestSeat = (pos: number) => {
    if (myGuestPosition !== null) return;
    const newGuest: LiveGuest = {
      position: pos,
      userId: currentUser.id,
      user: currentUser,
      isCameraOn: myCameraOn,
      isMicOn: myMicOn,
      isMutedByHost: false,
      cameraDisabledByHost: false,
      coinsEarnedInLive: 0
    };
    room.guests.push(newGuest);
    setMyGuestPosition(pos);
    appStore.notify();
  };

  const handleLeaveGuestSeat = () => {
    if (myGuestPosition === null) return;
    room.guests = room.guests.filter(g => g.position !== myGuestPosition);
    setMyGuestPosition(null);
    appStore.notify();
  };

  // Host Moderation / 3-Strike Live Violations test
  const handleHostIssueStrike = () => {
    const res = appStore.issueLiveStrike(room.hostId, 'Violating LIVE safety terms');
    setActiveStrikeWarning(res.message);
    if (res.strikeCount >= 3) {
      setTimeout(() => {
        onClose();
      }, 3500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 text-white select-none overflow-hidden">
      {/* VIP Entrance Announcement Overlay (Section 12) */}
      {vipEntrance && (
        <div className="absolute top-20 inset-x-0 z-50 flex justify-center pointer-events-none px-4">
          <div className="max-w-md w-full bg-gradient-to-r from-purple-950 via-purple-900 to-violet-950 border-2 border-amber-400 rounded-3xl p-4 shadow-[0_0_40px_rgba(245,158,11,0.8)] flex items-center gap-3.5 animate-bounce">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-2xl shadow-md border border-white">
              👑
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-black text-sm uppercase tracking-wider text-amber-300">
                  {vipEntrance.isEnigma ? '✦ ENIGMA ✦' : vipEntrance.name}
                </span>
                <DiamondBadge level={vipEntrance.level} size="sm" />
              </div>
              <p className="text-xs font-bold text-white mt-0.5">
                DIAMOND VIP GIFTER HAS ENTERED THE LIVE ROOM! ✨
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Full Screen Gift Animation Overlay */}
      {activeGiftAnimation && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center pointer-events-none">
          <div className="animate-float-gift flex flex-col items-center">
            <span className="text-8xl filter drop-shadow-[0_10px_25px_rgba(168,85,247,0.8)]">
              {activeGiftAnimation.gift.icon}
            </span>
            <div className="mt-4 px-6 py-2 rounded-full bg-purple-900/90 border border-purple-400 text-white font-extrabold text-lg shadow-2xl backdrop-blur-md">
              {activeGiftAnimation.senderName} sent {activeGiftAnimation.gift.name} to {activeGiftAnimation.targetName}!
            </div>
          </div>
        </div>
      )}

      {/* Three Strike Warning Modal */}
      {activeStrikeWarning && (
        <div className="absolute top-16 inset-x-4 z-50 max-w-md mx-auto p-4 bg-red-950/95 border-2 border-red-500 rounded-2xl shadow-2xl flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5 animate-pulse" />
          <div className="flex-1">
            <h4 className="font-black text-red-200 text-sm">LIVE Safety Warning</h4>
            <p className="text-xs text-red-100 mt-1">{activeStrikeWarning}</p>
          </div>
          <button
            onClick={() => setActiveStrikeWarning(null)}
            className="text-red-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="relative w-full h-full max-w-4xl flex flex-col justify-between">
        {/* Top Header Bar */}
        <div className="p-3 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between z-20">
          {/* Host Info */}
          <div className="flex items-center gap-2.5 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
            <img
              src={room.host.avatar}
              alt={room.host.displayName}
              className="w-9 h-9 rounded-full object-cover border border-purple-400"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs">{room.host.displayName}</span>
                <LeagueBadge league={room.host.creatorLeague} size="sm" />
              </div>
              <div className="flex items-center gap-2 text-[10px] text-purple-300">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3 text-red-400" /> {room.viewerCount.toLocaleString()}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1 text-amber-300">
                  <Coins className="w-3 h-3" /> {room.totalGiftsReceived.toLocaleString()}
                </span>
              </div>
            </div>
            <button className="ml-1 px-3 py-1 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] shadow">
              Follow
            </button>
          </div>

          {/* Action buttons on Top Right */}
          <div className="flex items-center gap-2">
            {/* PK Battle Toggle */}
            <button
              onClick={() => setShowPkBattle(!showPkBattle)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border transition-all ${
                showPkBattle
                  ? 'bg-rose-600 border-rose-400 text-white shadow-[0_0_15px_rgba(244,63,94,0.6)]'
                  : 'bg-black/40 border-white/20 text-gray-300 hover:bg-black/60'
              }`}
            >
              <Swords className="w-4 h-4 text-amber-400" />
              <span>PK Battle</span>
            </button>

            {/* Close Live */}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black/50 hover:bg-black/80 border border-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PK Battle Bar if active */}
        {showPkBattle && (
          <div className="px-4 py-2 bg-gradient-to-r from-purple-900/90 via-pink-900/90 to-blue-900/90 border-y border-pink-500/40 flex items-center justify-between z-20">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xs text-purple-300">HOST: 4,820 pts</span>
            </div>
            <div className="flex-1 mx-4 h-3 bg-black/60 rounded-full overflow-hidden flex border border-white/20">
              <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 w-[55%]" />
              <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 w-[45%]" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xs text-cyan-300">CHALLENGER: 3,940 pts</span>
            </div>
          </div>
        )}

        {/* 10-PERSON STAGE GRID (1 Host + up to 9 Guests = 10 People Total) */}
        <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-2 justify-center">
          {/* Main Host Stage */}
          <div className="relative w-full h-44 sm:h-56 bg-purple-950/70 rounded-2xl overflow-hidden border-2 border-purple-500/50 shadow-lg flex items-center justify-center">
            {isHost ? (
              <video ref={hostVideoRef} playsInline muted className="w-full h-full object-cover" />
            ) : (
              <div className="relative w-full h-full">
                <img
                  src={room.host.avatar}
                  alt={room.host.displayName}
                  className="w-full h-full object-cover filter brightness-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
              </div>
            )}

            {/* Host Badge & Live Mic Indicator */}
            <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-purple-700/80 backdrop-blur-md border border-purple-400 text-[11px] font-extrabold flex items-center gap-1.5 shadow">
              <Crown className="w-3.5 h-3.5 text-amber-300" />
              <span>LIVE Host · {room.host.displayName}</span>
            </div>

            <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Speaking
              </span>
            </div>
          </div>

          {/* 9 Guests Stage Slots (Positions 1 to 9) */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(pos => {
              const guest = room.guests.find(g => g.position === pos);
              const isMe = myGuestPosition === pos;

              return (
                <div
                  key={pos}
                  className="relative aspect-square sm:aspect-video bg-black/60 rounded-xl overflow-hidden border border-white/20 flex flex-col items-center justify-center text-center group"
                >
                  {guest ? (
                    <>
                      {isMe && myCameraOn ? (
                        <video ref={guestVideoRef} playsInline muted className="w-full h-full object-cover" />
                      ) : (
                        <img
                          src={guest.user.avatar}
                          alt={guest.user.displayName}
                          className="w-full h-full object-cover filter brightness-90"
                        />
                      )}
                      {/* Guest slot details */}
                      <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-bold text-purple-300">
                        #{pos}
                      </div>

                      <div className="absolute bottom-1 inset-x-1 flex items-center justify-between text-[9px] bg-black/60 px-1 rounded">
                        <span className="truncate font-semibold">{guest.user.displayName.split(' ')[0]}</span>
                        <span className="text-amber-300 font-bold">{guest.coinsEarnedInLive}🪙</span>
                      </div>
                    </>
                  ) : (
                    /* Empty Guest Seat */
                    <button
                      onClick={() => handleRequestGuestSeat(pos)}
                      disabled={myGuestPosition !== null}
                      className="w-full h-full flex flex-col items-center justify-center p-2 hover:bg-white/10 transition-colors disabled:opacity-40"
                    >
                      <UserPlus className="w-5 h-5 text-purple-400 mb-1" />
                      <span className="text-[10px] font-bold text-gray-300">Seat #{pos}</span>
                      <span className="text-[9px] text-purple-300/80">Join Guest</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sound Effects Board Drawer */}
        {showSoundboard && (
          <div className="mx-3 mb-2 p-3 bg-purple-950/95 border border-purple-500/40 rounded-2xl backdrop-blur-md shadow-2xl z-30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-purple-400" />
                Live Sound Effects Board (Web Audio Synthesizer)
              </span>
              <button onClick={() => setShowSoundboard(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 text-xs">
              {[
                { name: 'Air Horn', icon: '📯' },
                { name: 'Applause', icon: '👏' },
                { name: 'Cheering', icon: '🎉' },
                { name: 'Funny Laughter', icon: '😂' },
                { name: 'Cartoon Boing', icon: '🎈' },
                { name: 'Drum Rolls', icon: '🥁' },
                { name: 'Dramatic', icon: '⚡' },
                { name: 'Funny Scream', icon: '😱' },
                { name: 'Animal', icon: '🐶' }
              ].map(snd => (
                <button
                  key={snd.name}
                  onClick={() => handleTriggerSound(snd.name)}
                  className="px-2 py-2 rounded-xl bg-purple-800/60 hover:bg-purple-700 border border-purple-400/30 font-bold text-[11px] flex items-center justify-center gap-1.5 active:scale-95 transition-all text-white shadow-sm"
                >
                  <span>{snd.icon}</span>
                  <span className="truncate">{snd.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Host Management Drawer */}
        {showHostControls && isHost && (
          <div className="mx-3 mb-2 p-3 bg-gray-900/95 border border-purple-500/40 rounded-2xl backdrop-blur-md shadow-2xl z-30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-300 uppercase">
                Host Room Controls (10-Person Management)
              </span>
              <button onClick={() => setShowHostControls(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                onClick={handleHostIssueStrike}
                className="px-3 py-1.5 rounded-lg bg-red-800/70 border border-red-500 text-red-200 font-bold flex items-center gap-1.5"
              >
                <ShieldAlert className="w-3.5 h-3.5" /> Test Strike Warning (Policy 22)
              </button>
              <button
                onClick={() => {
                  room.guests = [];
                  appStore.notify();
                }}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 font-medium"
              >
                Clear All Guest Seats
              </button>
            </div>
          </div>
        )}

        {/* Live Chat Stream */}
        <div className="px-3 py-1 max-h-36 overflow-y-auto space-y-1.5 scrollbar-none z-20">
          {appStore.liveComments.map(c => {
            const isGift = c.isGiftNotice;
            const isEnigma = c.isEnigma;
            const senderName = isEnigma ? '✦ ENIGMA ✦' : c.user.displayName;

            return (
              <div
                key={c.id}
                className={`text-xs px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 max-w-[90%] backdrop-blur-md ${
                  isGift
                    ? 'bg-purple-900/80 border border-amber-400 text-amber-200'
                    : isEnigma
                    ? 'bg-purple-950/90 border border-violet-500 text-violet-200'
                    : 'bg-black/40 text-gray-200'
                }`}
              >
                {!isEnigma && <DiamondBadge level={c.user.gifterLevel} size="sm" />}
                {isEnigma && (
                  <span className="px-1.5 py-0.5 rounded-full bg-violet-800 text-[9px] font-black tracking-wider text-violet-200">
                    ENIGMA
                  </span>
                )}
                <span className="font-bold text-white">{senderName}:</span>
                <span className={isGift ? 'font-black text-amber-300' : 'text-gray-100'}>
                  {c.text}
                </span>
              </div>
            );
          })}
          <div ref={chatBottomRef} />
        </div>

        {/* Bottom Interaction Bar */}
        <div className="p-3 bg-gradient-to-t from-black via-black/80 to-transparent flex items-center gap-2 z-20">
          {/* Chat Form */}
          <form onSubmit={handleSendChat} className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              placeholder={currentUser.isEnigmaActive ? 'Comment as ✦ ENIGMA ✦...' : 'Say something in LIVE...'}
              className="flex-1 px-3 py-2 rounded-full bg-white/15 border border-white/20 text-xs text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="p-2 rounded-full bg-purple-600 hover:bg-purple-500 text-white"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Soundboard Button */}
          <button
            onClick={() => setShowSoundboard(!showSoundboard)}
            className="p-2 rounded-full bg-purple-900/60 hover:bg-purple-800 border border-purple-400 text-purple-200 transition-colors"
            title="Sound Effects"
          >
            <Volume2 className="w-5 h-5" />
          </button>

          {/* Host Controls button if Host */}
          {isHost && (
            <button
              onClick={() => setShowHostControls(!showHostControls)}
              className="p-2 rounded-full bg-amber-600/60 hover:bg-amber-600 border border-amber-400 text-amber-200 transition-colors"
              title="Host Controls"
            >
              <Crown className="w-5 h-5" />
            </button>
          )}

          {/* Guest self controls if occupying seat */}
          {myGuestPosition !== null && (
            <div className="flex items-center gap-1 bg-black/60 p-1 rounded-full border border-purple-400/50">
              <button
                onClick={() => setMyMicOn(!myMicOn)}
                className={`p-1.5 rounded-full ${myMicOn ? 'text-emerald-400' : 'text-red-400'}`}
              >
                {myMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setMyCameraOn(!myCameraOn)}
                className={`p-1.5 rounded-full ${myCameraOn ? 'text-emerald-400' : 'text-red-400'}`}
              >
                {myCameraOn ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
              </button>
              <button
                onClick={handleLeaveGuestSeat}
                className="px-2 py-1 rounded-full bg-red-600 text-[10px] font-bold text-white hover:bg-red-500"
              >
                Leave
              </button>
            </div>
          )}

          {/* Gift Trigger Button */}
          <button
            onClick={() => setIsGiftModalOpen(true)}
            className="px-3 py-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-amber-950 font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all"
          >
            <Gift className="w-4 h-4" />
            <span>Gift</span>
          </button>
        </div>
      </div>

      {/* Gift Modal */}
      <GiftModal
        isOpen={isGiftModalOpen}
        onClose={() => setIsGiftModalOpen(false)}
        isLive={true}
        liveGuests={room.guests}
        hostName={room.host.displayName}
        onOpenRecharge={onOpenRecharge}
        onGiftSent={(gift, targetName) => {
          setActiveGiftAnimation({
            gift,
            senderName: currentUser.isEnigmaActive ? '✦ ENIGMA ✦' : currentUser.displayName,
            targetName,
            id: Date.now()
          });
          setTimeout(() => {
            setActiveGiftAnimation(null);
          }, 3200);
        }}
      />
    </div>
  );
};
