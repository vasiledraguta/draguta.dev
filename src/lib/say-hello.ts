import { setText } from "@/lib/animate-text";

export const EMAIL = "hello@draguta.dev";

type Status = "idle" | "copied" | "failed";

const LABELS: Record<Status, string> = {
  idle: EMAIL,
  copied: "copied!",
  failed: "copy failed",
};

const MESSAGES: Record<Status, string> = {
  idle: "",
  copied: "Email address copied to clipboard",
  failed: "Could not copy the email address",
};

const writeToClipboard = async (text: string) => {
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
  document.body.removeChild(textarea);

  if (!copied) throw new Error("execCommand returned false");
};

export function initSayHello(): void {
  const button = document.getElementById("say-hello");
  if (!button || button.dataset.ready !== undefined) return;

  const host = button.querySelector<HTMLElement>(".animated-host");
  const status = document.getElementById("say-hello-status");
  if (!host || !status) return;

  button.dataset.ready = "";
  let timer: ReturnType<typeof setTimeout> | undefined;

  const render = (state: Status) => {
    setText(host, LABELS[state], state === "idle" ? "down" : "up");
    status.textContent = MESSAGES[state];
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
    timer = setTimeout(() => render("idle"), next === "copied" ? 1200 : 2400);
  });
}
