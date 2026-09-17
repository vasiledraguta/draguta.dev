let controller: AbortController | null = null;

export function initToc() {
  controller?.abort();
  controller = null;

  const content = document.querySelector<HTMLElement>("[data-toc-content]");
  const entries = Array.from(
    document.querySelectorAll<HTMLAnchorElement>("[data-toc-link]")
  ).flatMap((link) => {
    const heading = document.getElementById(link.dataset.tocLink ?? "");
    return heading ? [{ link, heading }] : [];
  });

  if (!content || entries.length === 0) return;

  controller = new AbortController();
  const { signal } = controller;
  let frame = 0;

  const update = () => {
    frame = 0;

    const offset = window.innerHeight * 0.25;
    const atEnd = content.getBoundingClientRect().bottom <= window.innerHeight;
    const passed = entries.filter(
      ({ heading }) => heading.getBoundingClientRect().top <= offset
    );
    const active = (atEnd ? entries.at(-1) : passed.at(-1)) ?? entries[0];

    for (const { link } of entries) {
      if (link === active.link) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    }
  };

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };

  update();
  document.addEventListener("scroll", schedule, {
    capture: true,
    passive: true,
    signal,
  });
  window.addEventListener("resize", schedule, { passive: true, signal });
  signal.addEventListener("abort", () => cancelAnimationFrame(frame));
}
