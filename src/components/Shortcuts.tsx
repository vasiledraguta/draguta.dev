import { useSyncExternalStore } from "react";
import { shortcuts } from "@/lib/keyboard";
import { getPreference } from "@/lib/theme";
import AnimatedText from "@/components/AnimatedText";

const RESTING: Record<string, string> = { p: "playing", t: "dark" };

const getVideo = () =>
  document.getElementById("bg-video") as HTMLVideoElement | null;

const subscribeTheme = (onChange: () => void) => {
  window.addEventListener("theme-change", onChange);
  return () => window.removeEventListener("theme-change", onChange);
};

const subscribeVideo = (onChange: () => void) => {
  const video = getVideo();
  video?.addEventListener("play", onChange);
  video?.addEventListener("pause", onChange);

  return () => {
    video?.removeEventListener("play", onChange);
    video?.removeEventListener("pause", onChange);
  };
};

const videoSnapshot = () => {
  const video = getVideo();
  if (!video) return null;
  return video.paused ? "paused" : "playing";
};

const serverSnapshot = () => null;

const Shortcuts = () => {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getPreference,
    serverSnapshot
  );
  const video = useSyncExternalStore(
    subscribeVideo,
    videoSnapshot,
    serverSnapshot
  );

  const live: Record<string, string | null> = { t: theme, p: video };

  return (
    <ul className="flex flex-col gap-1 text-muted">
      {shortcuts.map(({ key, label, run }) => {
        const value = live[key] ?? label;

        return (
          <li key={key}>
            <button
              type="button"
              onClick={run}
              className="group inline-flex items-baseline gap-2.5 hover:text-foreground transition-colors cursor-pointer tap"
            >
              <kbd className="font-mono text-xs text-muted group-hover:text-foreground transition-colors">
                {key}
              </kbd>
              <AnimatedText
                value={value}
                direction={RESTING[key] === value ? "down" : "up"}
                ready={live[key] !== null}
              />
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default Shortcuts;
