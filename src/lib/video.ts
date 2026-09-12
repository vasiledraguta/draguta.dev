import { readStorage, writeStorage } from "@/lib/storage";

const KEY = "video-time";

export function initVideo() {
  const video = document.getElementById("bg-video") as HTMLVideoElement | null;
  if (!video) return;

  const play = () => void video.play().catch(() => {});

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  const handleReducedMotion = (e: MediaQueryList | MediaQueryListEvent) => {
    if (e.matches) video.pause();
    else play();
  };

  handleReducedMotion(prefersReducedMotion);
  prefersReducedMotion.addEventListener("change", handleReducedMotion);

  const saved = Number.parseFloat(readStorage(KEY) ?? "");
  if (Number.isFinite(saved) && saved >= 0) {
    video.currentTime = saved;
  }

  const save = () => writeStorage(KEY, video.currentTime.toString());

  window.addEventListener("pagehide", save);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") save();
  });
}
