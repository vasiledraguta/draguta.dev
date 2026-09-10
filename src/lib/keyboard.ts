import { togglePreference } from "@/lib/theme";

export interface Shortcut {
  key: string;
  label: string;
  run: () => void;
}

function toggleVideo() {
  const video = document.getElementById("bg-video") as HTMLVideoElement | null;
  if (!video) return;
  if (video.paused) video.play();
  else video.pause();
}

function toggleZen() {
  const zen = document.body.classList.toggle("zen");
  document.getElementById("site-content")?.toggleAttribute("inert", zen);
}

export const shortcuts: Shortcut[] = [
  { key: "t", label: "theme", run: togglePreference },
  { key: "p", label: "video", run: toggleVideo },
  { key: "z", label: "zen", run: toggleZen },
];

export function initKeyboardShortcuts() {
  document.addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;

    const target = e.target as HTMLElement;
    if (
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.isContentEditable
    ) {
      return;
    }

    const shortcut = shortcuts.find((s) => s.key === e.key.toLowerCase());
    if (shortcut) shortcut.run();
  });
}
