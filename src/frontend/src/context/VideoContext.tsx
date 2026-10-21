import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

/**
 * App-wide background music + the header mute toggle.
 *
 * The homepage video is permanently silent: its audio track is stripped from
 * the asset (homepage-video.mp4 is video-only) and the element stays muted.
 * This toggle controls the background music only.
 *
 * Loop: /assets/bg-music-loop.m4a is a sample-continuous 55.000 s wrap (the
 * wrap sample delta is 0 — both ends cut at zero crossings) and the AAC
 * round-trip decodes to exactly 2,640,000 frames @48 kHz, so an
 * AudioBufferSourceNode with loop=true repeats it with no gap. A plain
 * <audio loop> element re-enters the network/decode pipeline every cycle and
 * adds an audible gap (worst in Safari) — never use one for this.
 *
 * Autoplay: every major browser blocks audible autoplay without a gesture —
 * Chrome/Edge need prior interaction (or a high Media Engagement score),
 * Safari/iOS always block, Firefox blocks by default, and wallet in-app
 * browsers are stricter still. The app therefore defaults to MUTED and only
 * the speaker button starts playback; the user's choice is remembered, so a
 * returning visitor who unmuted once gets the loop at the first interaction.
 * Safari additionally requires resume() inside the gesture before any await —
 * start() honours that.
 */

const MUSIC_SRC = "/assets/bg-music-loop.m4a";
/** Exact loop period of the master (2,640,000 frames @ 48 kHz). */
const LOOP_PERIOD_S = 55;
/** Gain ramp time constant for mute/unmute (~30 ms, click-free). */
const GAIN_RAMP_S = 0.03;

interface VideoContextValue {
  isMuted: boolean;
  toggleMute: () => void;
}

/**
 * Fetch the loop as raw bytes, accepting both delivery shapes.
 *
 * Caffeine's asset pipeline base64-wraps binary mime types it has no mapping
 * for — observed on `.m4a` (served body is exactly 4/3 the file size and
 * starts with base64 text; the decoded bytes sha256-match the source). A raw
 * MP4 starts with a box length then "ftyp" at offset 4, so absence of that
 * signature means the body was wrapped; decode it back. Locally the asset
 * serves raw, so the same loader works in both environments.
 */
async function fetchMusicBytes(url: string): Promise<ArrayBuffer> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`background music fetch failed: ${res.status}`);
  }
  const raw = await res.arrayBuffer();
  const bytes = new Uint8Array(raw);
  const isMp4 =
    bytes.length >= 12 &&
    bytes[4] === 0x66 && // f
    bytes[5] === 0x74 && // t
    bytes[6] === 0x79 && // y
    bytes[7] === 0x70; // p
  if (isMp4) return raw;

  // Base64-wrapped by the asset pipeline: strip whitespace, then decode.
  const text = new TextDecoder().decode(bytes).replace(/\s+/g, "");
  const bin = atob(text);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out.buffer;
}

const MUTE_PREF_KEY = "akk.bgm.muted";

/** Stored mute choice; muted unless the user explicitly unmuted before. */
function readMutedPref(): boolean {
  try {
    return localStorage.getItem(MUTE_PREF_KEY) !== "0";
  } catch {
    return true; // storage blocked (private mode / embedded webview)
  }
}

function writeMutedPref(muted: boolean) {
  try {
    localStorage.setItem(MUTE_PREF_KEY, muted ? "1" : "0");
  } catch {
    // preference simply won't persist
  }
}

const VideoContext = createContext<VideoContextValue | null>(null);

export function VideoProvider({ children }: { children: ReactNode }) {
  // Muted by default (browser autoplay rules); the listener's choice sticks.
  const [isMuted, setIsMuted] = useState(readMutedPref);
  const isMutedRef = useRef(isMuted);

  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const loadRef = useRef<Promise<AudioBuffer | null> | null>(null);

  /**
   * Create the (suspended) graph and decode the loop once, ahead of the first
   * gesture. Safe to call repeatedly; failures retry on the next call.
   */
  const load = useCallback((): Promise<AudioBuffer | null> => {
    if (loadRef.current) return loadRef.current;
    loadRef.current = (async () => {
      try {
        if (!ctxRef.current) {
          const ctx = new AudioContext();
          const gain = ctx.createGain();
          gain.gain.value = 0;
          gain.connect(ctx.destination);
          ctxRef.current = ctx;
          gainRef.current = gain;
        }
        const ctx = ctxRef.current;
        if (bufferRef.current) return bufferRef.current;
        const bytes = await fetchMusicBytes(MUSIC_SRC);
        // decodeAudioData detaches its input, so decode a copy.
        const buffer = await ctx.decodeAudioData(bytes.slice(0));
        bufferRef.current = buffer;
        return buffer;
      } catch (err: unknown) {
        console.warn("background music unavailable:", err);
        loadRef.current = null; // allow a retry on the next gesture
        return null;
      }
    })();
    return loadRef.current;
  }, []);

  const rampTo = useCallback((target: number) => {
    const ctx = ctxRef.current;
    const gain = gainRef.current;
    if (!ctx || !gain) return;
    gain.gain.cancelScheduledValues(ctx.currentTime);
    gain.gain.setTargetAtTime(target, ctx.currentTime, GAIN_RAMP_S);
  }, []);

  const start = useCallback(async () => {
    const ctx0 = ctxRef.current;
    // Safari: resume must be requested inside the gesture, before any await.
    if (ctx0 && ctx0.state === "suspended") void ctx0.resume();
    const buffer = await load();
    const ctx = ctxRef.current;
    const gain = gainRef.current;
    if (!buffer || !ctx || !gain) return;
    await ctx.resume();
    if (!sourceRef.current) {
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      // Absorb any decoder priming/padding (engines differ by a few samples)
      // so every cycle is exactly LOOP_PERIOD_S long. The m4a decodes
      // sample-exact in Chrome; this is the safety net for other engines.
      const drift = buffer.duration - LOOP_PERIOD_S;
      source.loopStart = drift > 0 && drift < 0.25 ? drift : 0;
      source.loopEnd = Math.min(
        buffer.duration,
        source.loopStart + LOOP_PERIOD_S,
      );
      source.connect(gain);
      source.start(0);
      sourceRef.current = source;
    }
    // The user may have muted while the buffer was loading.
    if (!isMutedRef.current) rampTo(1);
  }, [load, rampTo]);

  const toggleMute = useCallback(() => {
    const next = !isMutedRef.current;
    isMutedRef.current = next;
    setIsMuted(next);
    writeMutedPref(next);
    if (next) {
      // Muted: fade out, keep the source running so unmute is instant.
      rampTo(0);
    } else {
      // Unmuted: resume the context inside this gesture and fade in.
      void start();
    }
  }, [rampTo, start]);

  useEffect(() => {
    // Always prefetch + decode so the first unmute is instant. Only start
    // automatically when the stored choice is "unmuted" (a returning visitor
    // who already turned the music on); the default stays silent.
    void load();
    if (!isMutedRef.current) void start();

    // Browsers only allow audible playback after a user gesture: the first
    // click/tap/key anywhere resumes the context (unless muted meanwhile).
    const onGesture = () => {
      if (!isMutedRef.current) void start();
    };
    // Returning to the tab after iOS suspends audio: resume if we should play.
    const onVisible = () => {
      if (document.visibilityState === "visible" && !isMutedRef.current) {
        void start();
      }
    };
    window.addEventListener("pointerdown", onGesture, { passive: true });
    window.addEventListener("keydown", onGesture);
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("keydown", onGesture);
      document.removeEventListener("visibilitychange", onVisible);
      sourceRef.current?.stop();
      sourceRef.current?.disconnect();
      sourceRef.current = null;
      gainRef.current?.disconnect();
      gainRef.current = null;
      void ctxRef.current?.close();
      ctxRef.current = null;
      bufferRef.current = null;
      loadRef.current = null;
    };
  }, [load, start]);

  return (
    <VideoContext.Provider value={{ isMuted, toggleMute }}>
      {children}
    </VideoContext.Provider>
  );
}

export function useVideo() {
  const ctx = useContext(VideoContext);
  if (!ctx) throw new Error("useVideo must be used within VideoProvider");
  return ctx;
}
