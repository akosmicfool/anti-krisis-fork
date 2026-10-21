/**
 * Homepage background video — permanently silent.
 *
 * The mp4 asset carries no audio track at all (stripped with `-c:v copy -an`),
 * so it can never make sound regardless of element state; `muted` stays on as
 * belt-and-braces. The header mute toggle controls the background music
 * instead (see context/VideoContext.tsx).
 */
export function VideoSection() {
  return (
    <section className="px-4 bg-transparent" data-ocid="overview.video_section">
      <div className="max-w-4xl mx-auto">
        <div className="overflow-hidden w-full">
          <video
            src="/assets/homepage-video.mp4"
            autoPlay
            loop
            playsInline
            muted
            className="w-full h-auto block sm:scale-100 scale-[1.35] origin-center"
            data-ocid="overview.video_player"
          />
        </div>
      </div>
    </section>
  );
}
