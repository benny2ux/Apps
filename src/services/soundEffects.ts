/**
 * Real Web Audio API synthesizer for TIME UP Live Sound Effects
 * 100% original, zero external network dependency, ultra-responsive audio
 */

class SoundSynthesizer {
  private ctx: AudioContext | null = null;

  private initCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // 1. Cartoon Boing
  playBoing() {
    const ctx = this.initCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(750, now + 0.18);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.38);

    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.52);
  }

  // 2. Air Horn (classic reggae/stadium 3-burst brass blast)
  playAirHorn() {
    const ctx = this.initCtx();
    if (!ctx) return;
    const notes = [
      { freq: 466.16, time: 0 },
      { freq: 466.16, time: 0.18 },
      { freq: 466.16, time: 0.36 },
      { freq: 466.16, time: 0.54, duration: 0.45 }
    ];

    notes.forEach((item) => {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = ctx.currentTime + item.time;
      const dur = item.duration || 0.12;

      osc1.type = 'sawtooth';
      osc2.type = 'square';
      osc1.frequency.setValueAtTime(item.freq, start);
      osc2.frequency.setValueAtTime(item.freq * 1.5, start);

      gain.gain.setValueAtTime(0.35, start);
      gain.gain.exponentialRampToValueAtTime(0.01, start + dur);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(start);
      osc2.start(start);
      osc1.stop(start + dur);
      osc2.stop(start + dur);
    });
  }

  // 3. Applause (filtered noise simulator)
  playApplause() {
    const ctx = this.initCtx();
    if (!ctx) return;
    const bufferSize = ctx.sampleRate * 1.5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // Pink/Brownish shaped noise for natural clapping
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 1.4));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, ctx.currentTime);
    filter.Q.setValueAtTime(1.5, ctx.currentTime);

    const gain = ctx.createGain();
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 1.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
  }

  // 4. Cheering (harmonics chord swell)
  playCheering() {
    const ctx = this.initCtx();
    if (!ctx) return;
    const freqs = [330, 392, 493.88, 587.33, 659.25];
    const now = ctx.currentTime;

    freqs.forEach((f) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now);
      osc.frequency.linearRampToValueAtTime(f * 1.08, now + 1.2);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 1.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.5);
    });
    this.playApplause();
  }

  // 5. Funny Laughter (staccato descending cheerful chirp)
  playLaughter() {
    const ctx = this.initCtx();
    if (!ctx) return;
    const pitches = [520, 480, 560, 440, 520, 400, 460, 380];
    pitches.forEach((p, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = ctx.currentTime + idx * 0.12;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(p, start);
      osc.frequency.exponentialRampToValueAtTime(p * 0.7, start + 0.1);

      gain.gain.setValueAtTime(0.25, start);
      gain.gain.exponentialRampToValueAtTime(0.01, start + 0.11);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.12);
    });
  }

  // 6. Funny Scream (high slide pitch)
  playFunnyScream() {
    const ctx = this.initCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.3);
    osc.frequency.exponentialRampToValueAtTime(250, now + 0.9);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.95);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.98);
  }

  // 7. Animal Sounds (playful bark/chirp)
  playAnimalSound() {
    const ctx = this.initCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    [0, 0.16].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + offset;
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(450, start);
      osc.frequency.exponentialRampToValueAtTime(180, start + 0.12);

      gain.gain.setValueAtTime(0.4, start);
      gain.gain.exponentialRampToValueAtTime(0.01, start + 0.13);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.14);
    });
  }

  // 8. Drum Roll (fast snare build + impact cymbal crash)
  playDrumRoll() {
    const ctx = this.initCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const hits = 18;
    for (let i = 0; i < hits; i++) {
      const start = now + (i * 0.05);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180 + i * 5, start);

      const vol = 0.08 + (i / hits) * 0.35;
      gain.gain.setValueAtTime(vol, start);
      gain.gain.exponentialRampToValueAtTime(0.01, start + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.05);
    }

    // Cymbal crash at end
    const crashTime = now + hits * 0.05;
    const oscCrash = ctx.createOscillator();
    const gainCrash = ctx.createGain();
    oscCrash.type = 'square';
    oscCrash.frequency.setValueAtTime(900, crashTime);
    gainCrash.gain.setValueAtTime(0.4, crashTime);
    gainCrash.gain.exponentialRampToValueAtTime(0.01, crashTime + 0.6);
    oscCrash.connect(gainCrash);
    gainCrash.connect(ctx.destination);
    oscCrash.start(crashTime);
    oscCrash.stop(crashTime + 0.6);
  }

  // 9. Dramatic Sound (Inception / Cinematic brass impact)
  playDramatic() {
    const ctx = this.initCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';
    osc1.frequency.setValueAtTime(65.41, now); // C2
    osc2.frequency.setValueAtTime(66.2, now); // slight detune

    gain.gain.setValueAtTime(0.65, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 1.8);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 1.85);
    osc2.stop(now + 1.85);
  }

  // VIP Fanfare for Level 25+ Entrances
  playVipFanfare() {
    const ctx = this.initCtx();
    if (!ctx) return;
    const notes = [
      { f: 523.25, t: 0, d: 0.12 },
      { f: 659.25, t: 0.12, d: 0.12 },
      { f: 783.99, t: 0.24, d: 0.15 },
      { f: 1046.5, t: 0.42, d: 0.5 }
    ];
    const now = ctx.currentTime;
    notes.forEach((n) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + n.t;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, start);
      gain.gain.setValueAtTime(0.4, start);
      gain.gain.exponentialRampToValueAtTime(0.01, start + n.d);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + n.d);
    });
  }

  // Coin clink for gifting
  playCoinClink() {
    const ctx = this.initCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1760, now);
    osc.frequency.exponentialRampToValueAtTime(2637, now + 0.15);
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.26);
  }

  playSoundByName(name: string) {
    switch (name.toLowerCase()) {
      case 'laughter':
      case 'funny laughter':
        this.playLaughter();
        break;
      case 'boing':
      case 'cartoon boing':
        this.playBoing();
        break;
      case 'air horn':
      case 'airhorn':
        this.playAirHorn();
        break;
      case 'applause':
        this.playApplause();
        break;
      case 'cheering':
        this.playCheering();
        break;
      case 'scream':
      case 'funny scream':
      case 'screams':
        this.playFunnyScream();
        break;
      case 'animal':
      case 'animal sounds':
        this.playAnimalSound();
        break;
      case 'drum roll':
      case 'drum rolls':
        this.playDrumRoll();
        break;
      case 'dramatic':
      case 'dramatic sounds':
        this.playDramatic();
        break;
      default:
        this.playBoing();
    }
  }
}

export const soundManager = new SoundSynthesizer();
