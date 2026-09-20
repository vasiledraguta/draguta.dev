import { setText } from "@/lib/animate-text";
import { readStorage, writeStorage } from "@/lib/storage";
import { getVideo, toggleVideo } from "@/lib/video";

type Theme = "light" | "dark";

const THEME_KEY = "theme";
const RESTING: Record<string, string> = { p: "playing", t: "dark" };

let interacted = false;

function getTheme(): Theme {
  const stored = readStorage(THEME_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function toggleTheme() {
  const next: Theme = getTheme() === "dark" ? "light" : "dark";
  writeStorage(THEME_KEY, next);
  document.documentElement.classList.toggle("dark", next === "dark");
  render(interacted);
}

function toggleZen() {
  const zen = document.body.classList.toggle("zen");
  document.getElementById("site-content")?.toggleAttribute("inert", zen);
}

export const shortcuts = [
  { key: "t", label: "theme", run: toggleTheme },
  { key: "p", label: "video", run: toggleVideo },
  { key: "z", label: "zen", run: toggleZen },
];

function liveValue(key: string): string | null {
  if (key === "t") return getTheme();
  if (key !== "p") return null;

  const video = getVideo();
  return video ? (video.paused ? "paused" : "playing") : null;
}

function render(animate: boolean) {
  for (const button of document.querySelectorAll<HTMLElement>(
    "#shortcuts [data-shortcut]"
  )) {
    const key = button.dataset.shortcut ?? "";
    const host = button.querySelector<HTMLElement>(".animated-host");
    if (!host) continue;

    const value = liveValue(key) ?? host.dataset.label ?? "";
    setText(host, value, RESTING[key] === value ? "down" : "up", animate);
  }
}

function run(key: string | undefined) {
  shortcuts.find((shortcut) => shortcut.key === key)?.run();
}

export function initShortcuts() {
  const mark = () => {
    interacted = true;
  };

  document.addEventListener("pointerdown", mark, { capture: true, once: true });
  document.addEventListener("keydown", mark, { capture: true, once: true });

  document.addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;

    const target = e.target as HTMLElement;
    if (target.isContentEditable || target.matches?.("input, textarea")) return;

    run(e.key.toLowerCase());
  });

  document.addEventListener("click", (e) => {
    const target = e.target as Element | null;
    if (target?.closest("#zen-exit")) toggleZen();
    run(target?.closest<HTMLElement>("[data-shortcut]")?.dataset.shortcut);
  });

  const video = getVideo();
  const update = () => render(interacted);
  video?.addEventListener("play", update);
  video?.addEventListener("pause", update);

  render(false);
  document.addEventListener("astro:page-load", () => render(false));
}
