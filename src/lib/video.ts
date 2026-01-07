export function initVideo() {
  const video = document.getElementById("bg-video") as HTMLVideoElement | null;
  if (!video) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  const handleReducedMotion = (e: MediaQueryList | MediaQueryListEvent) => {
    if (e.matches) {
      video.pause();
    } else {
      video.play();
    }
  };

  handleReducedMotion(prefersReducedMotion);

  prefersReducedMotion.addEventListener("change", handleReducedMotion);

  const savedTime = localStorage.getItem("video-time");
  if (savedTime) {
    video.currentTime = parseFloat(savedTime);
  }

  setInterval(() => {
    localStorage.setItem("video-time", video.currentTime.toString());
  }, 500);

  window.addEventListener("beforeunload", () => {
    localStorage.setItem("video-time", video.currentTime.toString());
  });
}
