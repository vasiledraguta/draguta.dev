import { setText } from "@/lib/animate-text";

export const EMAIL = "hello@draguta.dev";

const STATES = {
  idle: { label: EMAIL, message: "", hold: 0 },
  copied: {
    label: "copied!",
    message: "Email address copied to clipboard",
    hold: 1200,
  },
  failed: {
    label: "copy failed",
    message: "Could not copy the email address",
    hold: 2400,
  },
};

type Status = keyof typeof STATES;

async function writeToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();

  const copied = document.execCommand("copy");
  textarea.remove();

  if (!copied) throw new Error("execCommand returned false");
}

export function initSayHello(): void {
  const button = document.getElementById("say-hello");
  if (!button || button.dataset.ready !== undefined) return;

  const host = button.querySelector<HTMLElement>(".animated-host");
  const status = document.getElementById("say-hello-status");
  if (!host || !status) return;

  button.dataset.ready = "";
  let timer: ReturnType<typeof setTimeout> | undefined;

  const render = (state: Status) => {
    setText(host, STATES[state].label, state === "idle" ? "down" : "up");
    status.textContent = STATES[state].message;
  };

  button.addEventListener("click", async () => {
    let next: Status = "copied";

    try {
      await writeToClipboard(EMAIL);
    } catch (error) {
      console.error("Failed to copy email:", error);
      next = "failed";
    }

    render(next);
    clearTimeout(timer);
    timer = setTimeout(() => render("idle"), STATES[next].hold);
  });
}
