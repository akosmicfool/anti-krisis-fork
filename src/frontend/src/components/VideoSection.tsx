import { useEffect } from "react";
import { useVideo } from "../context/VideoContext";

export function VideoSection() {
  const { isMuted, videoRef } = useVideo();

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted, videoRef]);

  return (
    <section className="px-4 bg-background" data-ocid="overview.video_section">
      <div className="max-w-4xl mx-auto">
        <div className="overflow-hidden w-full">
          <video
            ref={videoRef}
            src="/assets/homepage-video.mp4"
            autoPlay
            loop
            playsInline
            muted={isMuted}
            className="w-full h-auto block sm:scale-100 scale-[1.35] origin-center"
            data-ocid="overview.video_player"
          />
        </div>
      </div>
    </section>
  );
}
