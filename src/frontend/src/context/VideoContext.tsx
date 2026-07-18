import {
  type ReactNode,
  createContext,
  useContext,
  useRef,
  useState,
} from "react";

interface VideoContextValue {
  isMuted: boolean;
  toggleMute: () => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

const VideoContext = createContext<VideoContextValue | null>(null);

export function VideoProvider({ children }: { children: ReactNode }) {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      if (videoRef.current) {
        videoRef.current.muted = next;
      }
      return next;
    });
  };

  return (
    <VideoContext.Provider value={{ isMuted, toggleMute, videoRef }}>
      {children}
    </VideoContext.Provider>
  );
}

export function useVideo() {
  const ctx = useContext(VideoContext);
  if (!ctx) throw new Error("useVideo must be used within VideoProvider");
  return ctx;
}
