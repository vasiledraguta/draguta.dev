import { readStorage, writeStorage } from "@/lib/storage";

const TIME_KEY = "video-time";

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

let pausedForReading = false;
let currentScene: Scene | null = null;

const isReadingPage = () => /^\/writings\/[^/]+\/?$/.test(location.pathname);

const play = (video: HTMLVideoElement) => void video.play().catch(() => {});

export const getVideo = () =>
  document.getElementById("bg-video") as HTMLVideoElement | null;

export const getScene = () => currentScene;

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

  if (video.paused) play(video);
  else video.pause();

  pausedForReading = false;
  setScene(null);
}

function syncWithPage(video: HTMLVideoElement, wasPlaying: boolean) {
  if (isReadingPage()) {
    if (wasPlaying) pausedForReading = true;
    video.pause();
    return;
  }

  if (!pausedForReading) return;
  pausedForReading = false;
  play(video);
}

export function initVideo() {
  const video = getVideo();
  if (!video) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const handleReducedMotion = () => {
    if (reducedMotion.matches) video.pause();
    else if (!isReadingPage()) play(video);
  };

  handleReducedMotion();
  reducedMotion.addEventListener("change", handleReducedMotion);

  const saved = Number.parseFloat(readStorage(TIME_KEY) ?? "");
  if (Number.isFinite(saved) && saved >= 0) video.currentTime = saved;

  video.addEventListener("play", () => setScene(null));

  syncWithPage(video, !reducedMotion.matches);
  document.addEventListener("astro:page-load", () => {
    if (reducedMotion.matches) pausedForReading = false;
    syncWithPage(video, !video.paused);
  });

  const save = () => writeStorage(TIME_KEY, video.currentTime.toString());

  window.addEventListener("pagehide", save);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") save();
  });
}
