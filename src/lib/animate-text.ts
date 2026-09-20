type Direction = "up" | "down";

const EXIT_MS = 80;

const timers = new WeakMap<HTMLElement, ReturnType<typeof setTimeout>>();

function span(value: string, direction?: Direction): HTMLElement {
  const el = document.createElement("span");
  el.textContent = value;
  el.className = direction ? "animated-text" : "inline-block";
  if (direction) el.dataset.direction = direction;
  return el;
}

export function setText(
  host: HTMLElement,
  value: string,
  direction: Direction = "up",
  animate = true
): void {
  const current = host.firstElementChild as HTMLElement | null;
  if (current?.textContent === value) return;

  clearTimeout(timers.get(host));

  if (!current || !animate) {
    host.replaceChildren(span(value));
    return;
  }

  current.className = "animated-text";
  current.dataset.direction = direction;
  current.dataset.exiting = "";

  timers.set(
    host,
    setTimeout(() => host.replaceChildren(span(value, direction)), EXIT_MS)
  );
}
