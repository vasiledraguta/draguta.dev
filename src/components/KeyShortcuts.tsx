import { useEffect, useState } from "react";
import { shortcuts } from "@/lib/keyboard";
import { getPreference } from "@/lib/theme";

const KeyShortcuts = () => {
  const [state, setState] = useState<Record<string, string>>({});

  useEffect(() => {
    const video = document.getElementById(
      "bg-video"
    ) as HTMLVideoElement | null;

    const update = () => {
      const next: Record<string, string> = { t: getPreference() };
      if (video) next.p = video.paused ? "paused" : "playing";
      setState(next);
    };
    update();

    window.addEventListener("theme-change", update);
    video?.addEventListener("play", update);
    video?.addEventListener("pause", update);
    return () => {
      window.removeEventListener("theme-change", update);
      video?.removeEventListener("play", update);
      video?.removeEventListener("pause", update);
    };
  }, []);

  return (
    <ul className="flex flex-col gap-1 text-muted">
      {shortcuts.map((s) => (
        <li key={s.key}>
          <button
            type="button"
            onClick={s.run}
            className="group inline-flex items-baseline gap-2.5 hover:text-foreground transition-colors cursor-pointer tap"
          >
            <kbd className="font-mono text-xs text-muted group-hover:text-foreground transition-colors">
              {s.key}
            </kbd>
            <span>{state[s.key] ?? s.label}</span>
          </button>
        </li>
      ))}
    </ul>
  );
};

export default KeyShortcuts;
