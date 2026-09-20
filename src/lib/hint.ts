import { getArrow } from "perfect-arrows";

const GAP = 48;
const EDGE = 16;
const SPACE = 8;
const HEAD = 8;
const SPREAD = Math.PI / 6;
const WIDTH = 320;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), Math.max(min, max));

const point = (x: number, y: number) => `${x.toFixed(1)},${y.toFixed(1)}`;

function drawArrow(
  line: SVGPathElement,
  head: SVGPathElement,
  from: [number, number],
  to: [number, number]
) {
  const [sx, sy, cx, cy, ex, ey, angle] = getArrow(...from, ...to, {
    bow: 0.2,
    stretch: 0.5,
    straights: false,
    padStart: 4,
    padEnd: 4,
  });

  const wing = (turn: number) =>
    point(
      ex - HEAD * Math.cos(angle + turn),
      ey - HEAD * Math.sin(angle + turn)
    );

  line.setAttribute(
    "d",
    `M${point(sx, sy)} Q${point(cx, cy)} ${point(ex, ey)}`
  );
  head.setAttribute(
    "d",
    `M${wing(-SPREAD)} L${point(ex, ey)} L${wing(SPREAD)}`
  );
}

function scrollerOf(element: HTMLElement) {
  for (
    let parent = element.parentElement;
    parent && parent !== document.body;
    parent = parent.parentElement
  ) {
    const { overflowY } = getComputedStyle(parent);
    if (overflowY === "auto" || overflowY === "scroll") return parent;
  }

  return null;
}

function setup(root: HTMLElement) {
  const trigger = root.querySelector<HTMLButtonElement>("[data-hint-trigger]");
  const popover = root.querySelector<HTMLElement>("[data-hint-popover]");
  const card = root.querySelector<HTMLElement>("[data-hint-card]");
  const line = root.querySelector<SVGPathElement>("[data-hint-line]");
  const head = root.querySelector<SVGPathElement>("[data-hint-head]");
  if (!trigger || !popover || !card || !line || !head) return;

  root.dataset.ready = "";

  let frame = 0;
  let origin = 0;
  let listening: AbortController | null = null;
  const scroller = scrollerOf(root);

  const follow = () => {
    if (!scroller) return;
    const shift = Math.round(origin - scroller.scrollTop);
    popover.style.translate = `0 ${shift}px`;
  };

  const column = () =>
    (
      root.closest<HTMLElement>("[data-hint-column]") ?? root
    ).getBoundingClientRect();

  const choose = () => {
    const fits = window.innerWidth - column().right - GAP - EDGE >= WIDTH;
    const low = trigger.getBoundingClientRect().top > window.innerHeight * 0.4;
    popover.dataset.placement = fits ? "side" : low ? "above" : "below";
  };

  const setPx = (name: string, value: number) =>
    popover.style.setProperty(name, `${Math.round(value)}px`);

  const place = () => {
    frame = 0;

    if (!root.isConnected) {
      listening?.abort();
      return;
    }

    const rect = trigger.getBoundingClientRect();
    const scroll = window.scrollY;
    origin = scroller?.scrollTop ?? 0;
    popover.style.translate = "";
    delete popover.dataset.instant;

    if (popover.dataset.placement === "above") {
      setPx("--hint-top", scroll + rect.top - SPACE);
      setPx("--hint-max", rect.top - SPACE - EDGE);
      return;
    }

    if (popover.dataset.placement === "below") {
      setPx("--hint-top", scroll + rect.bottom + SPACE);
      setPx("--hint-max", window.innerHeight - rect.bottom - SPACE - EDGE);
      return;
    }

    const rects = trigger.getClientRects();
    const word = rects[rects.length - 1] ?? rect;
    const height = card.offsetHeight;
    const anchorY = word.top + word.height / 2;
    const left = column().right + GAP;
    const top = clamp(
      anchorY - height / 2,
      EDGE,
      window.innerHeight - height - EDGE
    );

    setPx("--hint-left", left);
    setPx("--hint-top", scroll + top);

    drawArrow(
      line,
      head,
      [word.right, scroll + word.top],
      [left, scroll + clamp(anchorY, top + EDGE, top + height - EDGE)]
    );
  };

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(place);
  };

  popover.addEventListener("beforetoggle", (e) => {
    if (e.newState === "open") {
      if (popover.getAnimations({ subtree: true }).length > 0) {
        popover.dataset.instant = "";
      }

      choose();
      listening = new AbortController();
      const { signal } = listening;
      scroller?.addEventListener("scroll", follow, { passive: true, signal });
      let width = window.innerWidth;
      window.addEventListener(
        "resize",
        () => {
          if (window.innerWidth === width) return;
          width = window.innerWidth;
          choose();
          schedule();
        },
        { passive: true, signal }
      );
      schedule();
      return;
    }

    listening?.abort();
    listening = null;
    cancelAnimationFrame(frame);
    frame = 0;
  });
}

export function initHints() {
  for (const root of document.querySelectorAll<HTMLElement>(
    "[data-hint]:not([data-ready])"
  )) {
    setup(root);
  }
}
