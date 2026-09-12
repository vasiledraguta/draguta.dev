export type SwapDirection = "up" | "down";

const EXIT_MS = 80;

const timers = new WeakMap<HTMLElement, ReturnType<typeof setTimeout>>();

export function setText(
  host: HTMLElement,
  value: string,
  direction: SwapDirection = "up",
  animate = true
): void {
  const current = host.firstElementChild as HTMLElement | null;
  if (current?.textContent === value) return;

  if (!current || !animate) {
    clearTimeout(timers.get(host));
    host.replaceChildren(plain(value));
    return;
  }

  current.className = "animated-text";
  current.dataset.direction = direction;
  current.dataset.exiting = "";

  clearTimeout(timers.get(host));
  timers.set(
    host,
    setTimeout(() => {
      const next = document.createElement("span");
      next.className = "animated-text";
      next.dataset.direction = direction;
      next.textContent = value;
      host.replaceChildren(next);
    }, EXIT_MS)
  );
}

function plain(value: string): HTMLElement {
  const span = document.createElement("span");
  span.className = "inline-block";
  span.textContent = value;
  return span;
}
