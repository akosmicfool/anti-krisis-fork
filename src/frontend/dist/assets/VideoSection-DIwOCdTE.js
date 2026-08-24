import { K as useVideo, r as reactExports, j as jsxRuntimeExports } from "./index-D3Low12Q.js";
function VideoSection() {
  const { isMuted, videoRef } = useVideo();
  reactExports.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted, videoRef]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-4 bg-background", "data-ocid": "overview.video_section", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-4xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "video",
    {
      ref: videoRef,
      src: "/assets/homepage-video.mp4",
      autoPlay: true,
      loop: true,
      playsInline: true,
      muted: isMuted,
      className: "w-full h-auto block sm:scale-100 scale-[1.35] origin-center",
      "data-ocid": "overview.video_player"
    }
  ) }) }) });
}
export {
  VideoSection as V
};
