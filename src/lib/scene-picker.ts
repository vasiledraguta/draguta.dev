import { getScene, getVideo, scenes, showScene } from "@/lib/video";

let watching = false;
const pending = new WeakMap<HTMLElement, symbol>();

function activeScene() {
  const video = getVideo();
  return video?.paused ? getScene()?.id : undefined;
}

function render() {
  const active = activeScene();
  const shown = active ?? scenes[0]?.id;

  for (const root of document.querySelectorAll<HTMLElement>(
    "[data-scene-picker]"
  )) {
    root.toggleAttribute("data-active", active !== undefined);

    for (const img of root.querySelectorAll<HTMLElement>("[data-thumb]")) {
      img.hidden = img.dataset.thumb !== shown;
    }

    root
      .querySelector("[data-scene-toggle]")
      ?.setAttribute(
        "aria-label",
        active ? `background: ${active}` : "background"
      );

    for (const button of root.querySelectorAll<HTMLElement>("[data-scene]")) {
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.scene === active)
      );
    }

    for (const item of root.querySelectorAll<HTMLElement>(
      "[data-scene-item]"
    )) {
      item.toggleAttribute("data-shown", item.dataset.sceneItem === shown);
    }

    if (!root.hasAttribute("data-open")) arrange(root);
  }
}

function arrange(root: HTMLElement) {
  const list = root.querySelector<HTMLElement>(".scene-list");
  if (!list) return;

  const active = activeScene();
  const order = [
    ...scenes.filter((scene) => scene.id === active),
    ...scenes.filter((scene) => scene.id !== active),
  ];

  order.forEach((scene, index) => {
    const item = list.querySelector<HTMLElement>(
      `[data-scene-item="${scene.id}"]`
    );
    if (!item) return;
    item.style.setProperty("--i", String(index));
    list.append(item);
  });
}

function settled(list: HTMLElement) {
  return Promise.allSettled(
    list.getAnimations({ subtree: true }).map((animation) => animation.finished)
  );
}

function retarget(list: HTMLElement, change: () => void) {
  const moving = Array.from(list.children).some(
    (item) => item.getAnimations().length > 0
  );

  if (!moving) {
    change();
    return;
  }

  list.setAttribute("data-instant", "");
  change();
  void list.offsetWidth;
  list.removeAttribute("data-instant");
}

function setOpen(root: HTMLElement, open: boolean, onClosed?: () => void) {
  const list = root.querySelector<HTMLElement>(".scene-list");
  if (!list) return;

  root
    .querySelector("[data-scene-toggle]")
    ?.setAttribute("aria-expanded", String(open));

  const token = Symbol();

  if (open) {
    if (list.hasAttribute("data-ending-style")) {
      pending.set(root, token);
      retarget(list, () => list.removeAttribute("data-ending-style"));
      return;
    }

    if (root.hasAttribute("data-open")) return;

    pending.set(root, token);
    list.setAttribute("data-starting-style", "");
    root.setAttribute("data-open", "");
    void list.offsetWidth;
    list.removeAttribute("data-starting-style");
    return;
  }

  if (!root.hasAttribute("data-open") || list.hasAttribute("data-ending-style"))
    return;

  pending.set(root, token);
  retarget(list, () => list.setAttribute("data-ending-style", ""));

  void settled(list).then(() => {
    if (pending.get(root) !== token) return;
    list.removeAttribute("data-ending-style");
    root.removeAttribute("data-open");
    arrange(root);
    onClosed?.();
  });
}

function initPicker(root: HTMLElement) {
  const toggle = root.querySelector<HTMLElement>("[data-scene-toggle]");
  if (!toggle) return;

  root.dataset.ready = "";
  let hovering = false;

  root.addEventListener("pointerenter", (e) => {
    if (e.pointerType !== "mouse") return;
    hovering = true;
    setOpen(root, true);
  });

  root.addEventListener("pointerleave", (e) => {
    if (e.pointerType !== "mouse") return;
    hovering = false;
    setOpen(root, false);
  });

  toggle.addEventListener("click", () => {
    if (hovering) return;
    setOpen(root, true);
    const target =
      root.querySelector<HTMLElement>('[data-scene][aria-pressed="true"]') ??
      root.querySelector<HTMLElement>("[data-scene]");
    target?.focus();
  });

  root.addEventListener("keydown", (e) => {
    if (e.key !== "Escape" || !root.hasAttribute("data-open")) return;
    setOpen(root, false, () => toggle.focus());
  });

  root.addEventListener("focusout", (e) => {
    if (hovering || root.contains(e.relatedTarget as Node | null)) return;
    setOpen(root, false);
  });

  for (const button of root.querySelectorAll<HTMLElement>("[data-scene]")) {
    const scene = scenes.find((s) => s.id === button.dataset.scene);
    if (!scene) continue;

    button.addEventListener("click", () => {
      if (activeScene() !== scene.id) showScene(scene);

      if (hovering) return;
      setOpen(root, false, () => toggle.focus());
    });
  }
}

export function initScenePicker() {
  for (const root of document.querySelectorAll<HTMLElement>(
    "[data-scene-picker]:not([data-ready])"
  )) {
    initPicker(root);
  }

  if (!watching) {
    watching = true;
    window.addEventListener("scene-change", render);
    getVideo()?.addEventListener("play", render);
    getVideo()?.addEventListener("pause", render);

    document.addEventListener("click", (e) => {
      for (const root of document.querySelectorAll<HTMLElement>(
        "[data-scene-picker][data-open]"
      )) {
        if (!root.contains(e.target as Node | null)) setOpen(root, false);
      }
    });
  }

  render();
}
