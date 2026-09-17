let cleanup: (() => void) | null = null;

export function initToc() {
  cleanup?.();
  cleanup = null;

  const content = document.querySelector<HTMLElement>("[data-toc-content]");
  const entries = Array.from(
    document.querySelectorAll<HTMLAnchorElement>("[data-toc-link]")
  ).flatMap((link) => {
    const heading = document.getElementById(link.dataset.tocLink ?? "");
    return heading ? [{ link, heading }] : [];
  });

  if (!content || entries.length === 0) return;

  let frame = 0;

  function update() {
    frame = 0;

    const offset = window.innerHeight * 0.25;
    const atEnd = content!.getBoundingClientRect().bottom <= window.innerHeight;
    let active = entries[0];

    if (atEnd) {
      active = entries[entries.length - 1];
    } else {
      for (const entry of entries) {
        if (entry.heading.getBoundingClientRect().top > offset) break;
        active = entry;
      }
    }

    for (const { link } of entries) {
      if (link === active.link) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    }
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(update);
  }

  update();
  document.addEventListener("scroll", schedule, {
    capture: true,
    passive: true,
  });
  window.addEventListener("resize", schedule, { passive: true });

  cleanup = () => {
    cancelAnimationFrame(frame);
    document.removeEventListener("scroll", schedule, { capture: true });
    window.removeEventListener("resize", schedule);
  };
}
