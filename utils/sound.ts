// Sound synthesizer for realistic card effects
let audioCtx: AudioContext | null = null;

const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

// Helper to create noise buffer
const createNoiseBuffer = (ctx: AudioContext, duration: number) => {
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
};

export const playShuffleSound = () => {
  const ctx = initAudio();
  if (!ctx) return;

  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.connect(ctx.destination);
  masterGain.gain.value = 0.4;

  // Simulate "Riffle" shuffle (many small snaps rapidly)
  const numberOfCards = 15;
  const duration = 0.6; // seconds total

  for (let i = 0; i < numberOfCards; i++) {
    // Stagger slightly random times
    const startTime = now + (i * (duration / numberOfCards)) + (Math.random() * 0.01);
    
    const noise = ctx.createBufferSource();
    noise.buffer = createNoiseBuffer(ctx, 0.05); // Short bursts

    // Filter to sound like stiff paper
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 1;
    filter.frequency.value = 1000 + (Math.random() * 500); // Vary pitch slightly

    const cardGain = ctx.createGain();
    cardGain.gain.setValueAtTime(0, startTime);
    cardGain.gain.linearRampToValueAtTime(1, startTime + 0.005); // Attack
    cardGain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.04); // Decay

    noise.connect(filter);
    filter.connect(cardGain);
    cardGain.connect(masterGain);

    noise.start(startTime);
    noise.stop(startTime + 0.05);
  }

  // Add a final "Bridge" snap sound
  setTimeout(() => {
    if(ctx.state !== 'running') return;
    const snapNode = ctx.createBufferSource();
    snapNode.buffer = createNoiseBuffer(ctx, 0.1);
    const snapFilter = ctx.createBiquadFilter();
    snapFilter.type = 'lowpass';
    snapFilter.frequency.value = 600;
    const snapGain = ctx.createGain();
    snapGain.gain.setValueAtTime(0, ctx.currentTime);
    snapGain.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 0.01);
    snapGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    
    snapNode.connect(snapFilter);
    snapFilter.connect(snapGain);
    snapGain.connect(ctx.destination);
    snapNode.start();
  }, duration * 1000);
};

export const playFlipSound = () => {
  const ctx = initAudio();
  if (!ctx) return;

  const t = ctx.currentTime;
  
  // Sliding friction sound (pink noise-ish)
  const noise = ctx.createBufferSource();
  noise.buffer = createNoiseBuffer(ctx, 0.3);

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(400, t);
  filter.frequency.linearRampToValueAtTime(1200, t + 0.15); // Sweep up simulation friction

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.5, t + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  
  noise.start(t);
  noise.stop(t + 0.3);
};
