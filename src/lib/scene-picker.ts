import { getScene, getVideo, scenes, showScene } from "@/lib/video";

const pending = new WeakMap<HTMLElement, symbol>();
let watching = false;

const pickers = (filter = "") =>
  document.querySelectorAll<HTMLElement>(`[data-scene-picker]${filter}`);

const listOf = (root: HTMLElement) =>
  root.querySelector<HTMLElement>(".scene-list");

const activeScene = () => (getVideo()?.paused ? getScene()?.id : undefined);

function render() {
  const active = activeScene();
  const shown = active ?? scenes[0]?.id;

  for (const root of pickers()) {
    root.toggleAttribute("data-active", active !== undefined);

    root
      .querySelector("[data-scene-toggle]")
      ?.setAttribute(
        "aria-label",
        active ? `background: ${active}` : "background"
      );

    for (const img of root.querySelectorAll<HTMLElement>("[data-thumb]")) {
      img.hidden = img.dataset.thumb !== shown;
    }

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
  const list = listOf(root);
  if (!list) return;

  const active = activeScene();
  const rank = (item: HTMLElement) =>
    item.dataset.sceneItem === active
      ? -1
      : scenes.findIndex((scene) => scene.id === item.dataset.sceneItem);

  Array.from(list.querySelectorAll<HTMLElement>("[data-scene-item]"))
    .sort((a, b) => rank(a) - rank(b))
    .forEach((item, index) => {
      item.style.setProperty("--i", String(index));
      list.append(item);
    });
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

function setExpanded(root: HTMLElement, open: boolean) {
  root
    .querySelector("[data-scene-toggle]")
    ?.setAttribute("aria-expanded", String(open));
}

function open(root: HTMLElement) {
  const list = listOf(root);
  if (!list) return;

  setExpanded(root, true);

  if (list.hasAttribute("data-ending-style")) {
    pending.set(root, Symbol());
    retarget(list, () => list.removeAttribute("data-ending-style"));
    return;
  }

  if (root.hasAttribute("data-open")) return;

  list.setAttribute("data-starting-style", "");
  root.setAttribute("data-open", "");
  void list.offsetWidth;
  list.removeAttribute("data-starting-style");
}

function close(root: HTMLElement, onClosed?: () => void) {
  const list = listOf(root);
  if (!list) return;

  setExpanded(root, false);

  if (!root.hasAttribute("data-open") || list.hasAttribute("data-ending-style"))
    return;

  const token = Symbol();
  pending.set(root, token);
  retarget(list, () => list.setAttribute("data-ending-style", ""));

  const running = list
    .getAnimations({ subtree: true })
    .map((animation) => animation.finished);

  void Promise.allSettled(running).then(() => {
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
    open(root);
  });

  root.addEventListener("pointerleave", (e) => {
    if (e.pointerType !== "mouse") return;
    hovering = false;
    close(root);
  });

  toggle.addEventListener("click", () => {
    if (hovering) return;
    open(root);

    const selected = root.querySelector<HTMLElement>(
      '[data-scene][aria-pressed="true"]'
    );
    (selected ?? root.querySelector<HTMLElement>("[data-scene]"))?.focus();
  });

  root.addEventListener("keydown", (e) => {
    if (e.key !== "Escape" || !root.hasAttribute("data-open")) return;
    close(root, () => toggle.focus());
  });

  root.addEventListener("focusout", (e) => {
    if (hovering || root.contains(e.relatedTarget as Node | null)) return;
    close(root);
  });

  for (const button of root.querySelectorAll<HTMLElement>("[data-scene]")) {
    const scene = scenes.find(({ id }) => id === button.dataset.scene);
    if (!scene) continue;

    button.addEventListener("click", () => {
      if (activeScene() !== scene.id) showScene(scene);
      if (hovering) return;
      close(root, () => toggle.focus());
    });
  }
}

export function initScenePicker() {
  for (const root of pickers(":not([data-ready])")) initPicker(root);

  if (!watching) {
    watching = true;

    window.addEventListener("scene-change", render);
    getVideo()?.addEventListener("play", render);
    getVideo()?.addEventListener("pause", render);

    document.addEventListener("click", (e) => {
      for (const root of pickers("[data-open]")) {
        if (!root.contains(e.target as Node | null)) close(root);
      }
    });
  }

  render();
}
