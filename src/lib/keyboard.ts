export function initKeyboardShortcuts() {
  document.addEventListener("keydown", (e) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

    const video = document.getElementById(
      "bg-video"
    ) as HTMLVideoElement | null;

    switch (e.key.toLowerCase()) {
      case "m":
        if (video) {
          video.muted = !video.muted;
          window.dispatchEvent(
            new CustomEvent("sound-toggle", {
              detail: { muted: video.muted },
            })
          );
        }
        break;

      case "p":
        if (video) {
          if (video.paused) {
            video.play();
          } else {
            video.pause();
          }
        }
        break;

      case "t":
        const isDark = document.documentElement.classList.toggle("dark");
        localStorage.setItem("theme", isDark ? "dark" : "light");
        const audio = new Audio("/light-switch.mp3");
        audio.volume = 0.5;
        audio.play();
        window.dispatchEvent(
          new CustomEvent("theme-toggle", {
            detail: { theme: isDark ? "dark" : "light" },
          })
        );
        break;

      case "z":
        const content = document.getElementById("site-content");
        const videoEl = document.getElementById("bg-video");
        const overlay = document.getElementById("video-overlay");
        const isZen = document.body.classList.toggle("zen-mode");

        if (content) {
          content.style.opacity = isZen ? "0" : "1";
          content.style.pointerEvents = isZen ? "none" : "auto";
        }
        if (videoEl) videoEl.style.opacity = isZen ? "1" : "";
        if (overlay) overlay.style.opacity = isZen ? "0" : "";
        break;
    }
  });
}
