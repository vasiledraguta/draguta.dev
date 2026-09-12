import { setText } from "@/lib/animate-text";
import { shortcuts } from "@/lib/keyboard";
import { getPreference } from "@/lib/theme";

const RESTING: Record<string, string> = { p: "playing", t: "dark" };

let interacted = false;

const getVideo = () =>
  document.getElementById("bg-video") as HTMLVideoElement | null;

function liveValue(key: string): string | null {
  if (key === "t") return getPreference();

  if (key === "p") {
    const video = getVideo();
    return video ? (video.paused ? "paused" : "playing") : null;
  }

  return null;
}

function render(animate: boolean): void {
  const list = document.getElementById("shortcuts");
  if (!list) return;

  for (const button of list.querySelectorAll<HTMLElement>("[data-shortcut]")) {
    const key = button.dataset.shortcut;
    const host = button.querySelector<HTMLElement>(".animated-host");
    if (!key || !host) continue;

    const value = liveValue(key) ?? host.dataset.label ?? "";
    setText(host, value, RESTING[key] === value ? "down" : "up", animate);
  }
}

export function initShortcuts(): void {
  const list = document.getElementById("shortcuts");
  if (!list || list.dataset.ready !== undefined) return;

  list.dataset.ready = "";

  for (const button of list.querySelectorAll<HTMLElement>("[data-shortcut]")) {
    const shortcut = shortcuts.find((s) => s.key === button.dataset.shortcut);
    if (shortcut) button.addEventListener("click", shortcut.run);
  }

  render(false);
}

export function watchShortcuts(): void {
  const mark = () => {
    interacted = true;
  };

  document.addEventListener("pointerdown", mark, { capture: true, once: true });
  document.addEventListener("keydown", mark, { capture: true, once: true });

  const update = () => render(interacted);

  window.addEventListener("theme-change", update);

  const video = getVideo();
  video?.addEventListener("play", update);
  video?.addEventListener("pause", update);
}
