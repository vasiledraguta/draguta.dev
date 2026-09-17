import { readStorage, writeStorage } from "@/lib/storage";

const KEY = "video-time";

export interface Scene {
  id: string;
  time: number;
}

export const scenes: Scene[] = [
  { id: "meadow", time: 1 },
  { id: "sunset", time: 6 },
  { id: "water", time: 8.75 },
  { id: "wheat", time: 20.1 },
  { id: "village", time: 23 },
];

let currentScene: Scene | null = null;

export const getVideo = () =>
  document.getElementById("bg-video") as HTMLVideoElement | null;

export function getScene(): Scene | null {
  return currentScene;
}

function setScene(scene: Scene | null) {
  if (currentScene === scene) return;
  currentScene = scene;
  window.dispatchEvent(new Event("scene-change"));
}

export function showScene(scene: Scene) {
  const video = getVideo();
  if (!video) return;

  video.pause();
  video.currentTime = scene.time;
  setScene(scene);
}

export function toggleVideo() {
  const video = getVideo();
  if (!video) return;

  if (video.paused) void video.play().catch(() => {});
  else video.pause();
  setScene(null);
}

export function initVideo() {
  const video = getVideo();
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

  video.addEventListener("play", () => setScene(null));

  const save = () => writeStorage(KEY, video.currentTime.toString());

  window.addEventListener("pagehide", save);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") save();
  });
}
