import React, { useState, useRef, useEffect } from 'react';
import { appStore } from '../services/store';
import {
  Camera,
  Video,
  Sparkles,
  Music,
  Smile,
  Type,
  X,
  Check,
  RotateCcw,
  Upload,
  Play,
  Square,
  Sliders
} from 'lucide-react';

interface CreatorStudioProps {
  isOpen: boolean;
  onClose: () => void;
  onPublished?: () => void;
}

export type FaceFilterType =
  | 'none'
  | 'big_eyes'
  | 'small_mouth'
  | 'stretched_face'
  | 'dog'
  | 'cat'
  | 'rabbit'
  | 'cartoon'
  | 'alien'
  | 'crown'
  | 'glasses'
  | 'beauty'
  | 'makeup'
  | 'sparkles';

interface FilterOption {
  id: FaceFilterType;
  name: string;
  emoji: string;
  category: 'funny' | 'animal' | 'beauty' | 'accessory';
}

export const FACE_FILTERS: FilterOption[] = [
  { id: 'none', name: 'Normal', emoji: '✨', category: 'beauty' },
  { id: 'big_eyes', name: 'Big Eyes', emoji: '👀', category: 'funny' },
  { id: 'small_mouth', name: 'Small Mouth', emoji: '🤐', category: 'funny' },
  { id: 'stretched_face', name: 'Stretch Face', emoji: '🤪', category: 'funny' },
  { id: 'dog', name: 'Dog Ears & Nose', emoji: '🐶', category: 'animal' },
  { id: 'cat', name: 'Cat Whiskers', emoji: '🐱', category: 'animal' },
  { id: 'rabbit', name: 'Rabbit Ears', emoji: '🐰', category: 'animal' },
  { id: 'cartoon', name: 'Cartoon Comic', emoji: '🎨', category: 'funny' },
  { id: 'alien', name: 'Alien Glow', emoji: '👽', category: 'funny' },
  { id: 'crown', name: 'Golden Crown', emoji: '👑', category: 'accessory' },
  { id: 'glasses', name: 'Thug Glasses', emoji: '🕶️', category: 'accessory' },
  { id: 'beauty', name: 'Beauty Glow', emoji: '💖', category: 'beauty' },
  { id: 'makeup', name: 'Glam Makeup', emoji: '💄', category: 'beauty' },
  { id: 'sparkles', name: 'Star Sparkles', emoji: '🌟', category: 'accessory' }
];

const CURATED_MUSIC = [
  'Afro-Beats Elevation (Official TIME UP Mix)',
  'Cyber Dreamscape 2026',
  'Nairobi Nights & Saxophone',
  'Acoustic Soul & 808',
  'High Energy Club Anthem'
];

export const CreatorStudio: React.FC<CreatorStudioProps> = ({ isOpen, onClose, onPublished }) => {
  const [activeFilter, setActiveFilter] = useState<FaceFilterType>('none');
  const [mode, setMode] = useState<'photo' | 'video'>('photo');
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [capturedMedia, setCapturedMedia] = useState<string | null>(null);
  const [targetDestination, setTargetDestination] = useState<'feed' | 'story'>('feed');
  const [caption, setCaption] = useState('');
  const [selectedMusic, setSelectedMusic] = useState(CURATED_MUSIC[0]);
  const [showMusicPicker, setShowMusicPicker] = useState(false);
  const [stickers, setStickers] = useState<string[]>([]);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize camera stream
  useEffect(() => {
    if (!isOpen) return;

    let activeStream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        setCameraError(null);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: isFrontCamera ? 'user' : 'environment',
            width: { ideal: 720 },
            height: { ideal: 1280 }
          },
          audio: false
        });
        activeStream = stream;
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      } catch (err) {
        console.warn('Camera access fallback to simulated feed:', err);
        setCameraError('Camera preview (simulated studio feed active)');
      }
    };

    startCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(t => t.stop());
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isOpen, isFrontCamera]);

  // Canvas render loop for Face Effects
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const render = () => {
      time += 0.05;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Draw video frame or simulated studio portrait
      const video = videoRef.current;
      if (video && video.readyState >= 2 && !cameraError) {
        ctx.save();
        if (isFrontCamera) {
          ctx.translate(width, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(video, 0, 0, width, height);
        ctx.restore();
      } else {
        // Fallback simulated studio background
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#3b0764');
        grad.addColorStop(0.5, '#581c87');
        grad.addColorStop(1, '#1e1b4b');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Draw animated stylized face model
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.arc(width / 2, height / 2 - 20, 100, 0, Math.PI * 2);
        ctx.fill();

        // Default eyes
        ctx.fillStyle = '#1e1b4b';
        ctx.beginPath();
        ctx.arc(width / 2 - 35, height / 2 - 40, 12, 0, Math.PI * 2);
        ctx.arc(width / 2 + 35, height / 2 - 40, 12, 0, Math.PI * 2);
        ctx.fill();

        // Default smile
        ctx.strokeStyle = '#1e1b4b';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(width / 2, height / 2 - 10, 50, 0.2 * Math.PI, 0.8 * Math.PI);
        ctx.stroke();
      }

      // --- APPLY REAL-TIME FACE FILTERS & EFFECTS ---
      const cx = width / 2;
      const cy = height / 2 - 20;

      switch (activeFilter) {
        case 'big_eyes': {
          // Magnify eyes region
          ctx.font = '70px serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('👀', cx, cy - 40);
          break;
        }

        case 'small_mouth': {
          // Shrink mouth
          ctx.fillStyle = '#be123c';
          ctx.beginPath();
          ctx.ellipse(cx, cy + 45, 8, 4, 0, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'stretched_face': {
          // Ripple / wavy distortion simulation
          ctx.fillStyle = 'rgba(168, 85, 247, 0.2)';
          ctx.beginPath();
          ctx.ellipse(cx + Math.sin(time * 3) * 20, cy, 140 + Math.cos(time * 2) * 25, 100, 0, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'dog': {
          // Dog Ears + Snout
          ctx.font = '85px serif';
          ctx.textAlign = 'center';
          ctx.fillText('🐶', cx, cy - 50);
          ctx.font = '50px serif';
          ctx.fillText('👅', cx, cy + 45 + Math.sin(time * 4) * 5);
          break;
        }

        case 'cat': {
          // Cat ears + whiskers
          ctx.font = '90px serif';
          ctx.textAlign = 'center';
          ctx.fillText('🐱', cx, cy - 55);
          break;
        }

        case 'rabbit': {
          // Twitching Rabbit ears
          ctx.font = '95px serif';
          ctx.textAlign = 'center';
          ctx.fillText('🐰', cx, cy - 70 + Math.sin(time * 5) * 4);
          break;
        }

        case 'alien': {
          // Green glowing alien eyes & skin tint
          ctx.fillStyle = 'rgba(74, 222, 128, 0.35)';
          ctx.fillRect(0, 0, width, height);
          ctx.font = '95px serif';
          ctx.textAlign = 'center';
          ctx.fillText('👽', cx, cy - 35);
          break;
        }

        case 'cartoon': {
          // Posterize / cartoon comic vibe overlay
          ctx.fillStyle = 'rgba(234, 179, 8, 0.15)';
          ctx.fillRect(0, 0, width, height);
          ctx.lineWidth = 10;
          ctx.strokeStyle = '#000000';
          ctx.strokeRect(10, 10, width - 20, height - 20);
          break;
        }

        case 'crown': {
          // Floating animated royal crown with sparkling gems
          const crownY = cy - 140 + Math.sin(time * 2) * 8;
          ctx.font = '80px serif';
          ctx.textAlign = 'center';
          ctx.fillText('👑', cx, crownY);
          // Sparkle stars
          ctx.font = '28px serif';
          ctx.fillText('✨', cx - 60, crownY + 10);
          ctx.fillText('✨', cx + 60, crownY + 10);
          break;
        }

        case 'glasses': {
          // Pixelated cool shades
          ctx.font = '85px serif';
          ctx.textAlign = 'center';
          ctx.fillText('🕶️', cx, cy - 40);
          break;
        }

        case 'beauty': {
          // Soft pink skin glow & warm ambient light
          const bGrad = ctx.createRadialGradient(cx, cy, 50, cx, cy, 250);
          bGrad.addColorStop(0, 'rgba(251, 207, 232, 0.25)');
          bGrad.addColorStop(1, 'rgba(168, 85, 247, 0.15)');
          ctx.fillStyle = bGrad;
          ctx.fillRect(0, 0, width, height);
          break;
        }

        case 'makeup': {
          // Glowing blush & red lips
          ctx.fillStyle = 'rgba(244, 63, 94, 0.3)';
          ctx.beginPath();
          ctx.arc(cx - 70, cy + 5, 25, 0, Math.PI * 2);
          ctx.arc(cx + 70, cy + 5, 25, 0, Math.PI * 2);
          ctx.fill();
          ctx.font = '36px serif';
          ctx.textAlign = 'center';
          ctx.fillText('💋', cx, cy + 42);
          break;
        }

        case 'sparkles': {
          // Star sparkles floating
          for (let i = 0; i < 7; i++) {
            const sx = (Math.sin(time + i * 1.5) * 0.4 + 0.5) * width;
            const sy = (Math.cos(time * 0.8 + i) * 0.4 + 0.5) * height;
            ctx.font = `${20 + (i % 3) * 8}px serif`;
            ctx.fillText('✨', sx, sy);
          }
          break;
        }

        default:
          break;
      }

      // Render any active user placed stickers
      stickers.forEach((sticker, idx) => {
        ctx.font = '50px serif';
        ctx.fillText(sticker, 60 + (idx * 50) % 200, 100 + idx * 40);
      });

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isOpen, activeFilter, cameraError, isFrontCamera, stickers]);

  // Handle capture
  const handleSnap = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setCapturedMedia(dataUrl);
  };

  // Video recording simulation timer
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordDuration(d => {
          if (d >= 15) {
            handleStopRecording();
            return 15;
          }
          return d + 1;
        });
      }, 1000);
    } else {
      setRecordDuration(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    handleSnap(); // Snapshot frame as video thumbnail
  };

  const handlePublish = () => {
    if (!capturedMedia) return;

    if (targetDestination === 'story') {
      appStore.publishStory(capturedMedia, mode, caption, activeFilter !== 'none' ? activeFilter : undefined);
    } else {
      appStore.publishPost({
        userId: appStore.currentUser.id,
        type: mode,
        mediaUrl: capturedMedia,
        caption: caption || 'Created with TIME UP Face Effects ✨',
        tags: ['TimeUpCreate', activeFilter, mode],
        musicTitle: selectedMusic
      });
    }

    onPublished?.();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4">
      {/* Hidden webcam element */}
      <video ref={videoRef} playsInline muted className="hidden" />

      <div className="relative w-full max-w-md h-full sm:h-[88vh] bg-[#120724] sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col justify-between text-white border border-purple-500/20">
        {/* Top Floating Controls */}
        <div className="absolute top-0 inset-x-0 z-30 p-4 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent">
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Music Tag */}
          <button
            onClick={() => setShowMusicPicker(!showMusicPicker)}
            className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-xs font-semibold flex items-center gap-1.5 hover:bg-black/60 transition-colors max-w-[200px] truncate"
          >
            <Music className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
            <span className="truncate">{selectedMusic}</span>
          </button>

          {/* Flip camera */}
          <button
            onClick={() => setIsFrontCamera(!isFrontCamera)}
            className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Music Picker Dropdown */}
        {showMusicPicker && (
          <div className="absolute top-16 inset-x-4 z-40 bg-purple-950/95 backdrop-blur-md rounded-2xl border border-purple-500/30 p-3 shadow-xl space-y-1">
            <span className="text-xs font-bold text-purple-300 block mb-1">
              Select Authorized Track:
            </span>
            {CURATED_MUSIC.map(m => (
              <button
                key={m}
                onClick={() => {
                  setSelectedMusic(m);
                  setShowMusicPicker(false);
                }}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                  selectedMusic === m ? 'bg-purple-600 text-white' : 'text-purple-200 hover:bg-purple-900/60'
                }`}
              >
                <span>{m}</span>
                {selectedMusic === m && <Check className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>
        )}

        {/* Live Canvas Viewport */}
        <div className="relative flex-1 w-full bg-black flex items-center justify-center overflow-hidden">
          {!capturedMedia ? (
            <canvas
              ref={canvasRef}
              width={720}
              height={1280}
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={capturedMedia}
              alt="Captured"
              className="w-full h-full object-cover"
            />
          )}

          {/* Recording Timer */}
          {isRecording && (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-white" />
              <span>00:{recordDuration < 10 ? `0${recordDuration}` : recordDuration}</span>
            </div>
          )}
        </div>

        {/* Bottom Filter & Capture Tray */}
        {!capturedMedia ? (
          <div className="relative z-30 p-4 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col gap-3">
            {/* Horizontal Face Filters Carousel */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {FACE_FILTERS.map(f => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`flex-shrink-0 flex flex-col items-center justify-center p-2 rounded-2xl border transition-all ${
                    activeFilter === f.id
                      ? 'border-purple-400 bg-purple-600/40 scale-110 shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                      : 'border-white/20 bg-black/40 hover:bg-black/60'
                  }`}
                >
                  <span className="text-2xl">{f.emoji}</span>
                  <span className="text-[10px] font-semibold mt-0.5 text-purple-200">
                    {f.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Mode switch (Photo vs Video) */}
            <div className="flex items-center justify-center gap-6 text-xs font-bold uppercase tracking-wider">
              <button
                onClick={() => setMode('photo')}
                className={`transition-colors ${mode === 'photo' ? 'text-white border-b-2 border-purple-500 pb-0.5' : 'text-gray-400'}`}
              >
                Photo
              </button>
              <button
                onClick={() => setMode('video')}
                className={`transition-colors ${mode === 'video' ? 'text-white border-b-2 border-purple-500 pb-0.5' : 'text-gray-400'}`}
              >
                Video (15s)
              </button>
            </div>

            {/* Shutter / Record Button */}
            <div className="flex items-center justify-around py-2">
              {/* Add sticker */}
              <button
                onClick={() => setStickers(s => [...s, '🔥', '👑'])}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white"
                title="Add Sticker"
              >
                <Smile className="w-5 h-5" />
              </button>

              {/* Shutter */}
              {mode === 'photo' ? (
                <button
                  onClick={handleSnap}
                  className="w-16 h-16 rounded-full border-4 border-white p-1 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-purple-500/30"
                >
                  <div className="w-full h-full rounded-full bg-white" />
                </button>
              ) : (
                <button
                  onClick={isRecording ? handleStopRecording : handleStartRecording}
                  className={`w-16 h-16 rounded-full border-4 border-white p-1 flex items-center justify-center hover:scale-105 active:scale-95 transition-all ${
                    isRecording ? 'border-red-500' : ''
                  }`}
                >
                  <div className={`rounded-full bg-red-600 transition-all ${isRecording ? 'w-6 h-6 rounded-md' : 'w-full h-full'}`} />
                </button>
              )}

              {/* Upload fallback button */}
              <label className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer">
                <Upload className="w-5 h-5" />
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setCapturedMedia(url);
                    }
                  }}
                />
              </label>
            </div>
          </div>
        ) : (
          /* Post Publishing Options */
          <div className="relative z-30 p-4 bg-black/90 backdrop-blur-md flex flex-col gap-3">
            {/* Caption Input */}
            <div>
              <input
                type="text"
                value={caption}
                onChange={e => setCaption(e.target.value)}
                placeholder="Add caption & hashtags #TimeUp #Vibes..."
                className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Destination Toggle (Feed vs 24h Story) */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTargetDestination('feed')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                  targetDestination === 'feed'
                    ? 'bg-purple-600 text-white border-purple-400'
                    : 'bg-white/10 text-gray-300 border-white/20'
                }`}
              >
                Post to Feed
              </button>
              <button
                onClick={() => setTargetDestination('story')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                  targetDestination === 'story'
                    ? 'bg-purple-600 text-white border-purple-400'
                    : 'bg-white/10 text-gray-300 border-white/20'
                }`}
              >
                24h Story
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setCapturedMedia(null)}
                className="px-4 py-2 rounded-xl bg-white/10 text-xs font-semibold text-gray-300 hover:bg-white/20"
              >
                Retake
              </button>
              <button
                onClick={handlePublish}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-500 text-white font-bold text-sm shadow-md hover:brightness-110 active:scale-95 transition-all text-center"
              >
                Share {targetDestination === 'story' ? 'Story' : 'Post'} →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
