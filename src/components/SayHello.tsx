import { useRef, useState, useSyncExternalStore } from "react";
import AnimatedText from "@/components/AnimatedText";

type Status = "idle" | "copied" | "failed";

const getEmail = () =>
  ["hello", "draguta", "dev"].join("@").replace("@dev", ".dev");

const subscribe = () => () => {};

const LABELS: Record<Status, string> = {
  idle: "",
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

const SayHello = () => {
  const email = useSyncExternalStore(subscribe, getEmail, () => "");
  const [status, setStatus] = useState<Status>("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const copy = async () => {
    if (!email) return;

    let next: Status = "copied";

    try {
      await writeToClipboard(email);
    } catch (error) {
      console.error("Failed to copy email:", error);
      next = "failed";
    }

    setStatus(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(
      () => setStatus("idle"),
      next === "copied" ? 1200 : 2400
    );
  };

  const label = status === "idle" ? email || "loading..." : LABELS[status];

  return (
    <>
      <button
        type="button"
        onClick={copy}
        aria-disabled={!email}
        aria-label={
          email ? `Copy email address ${email}` : "Copy email address"
        }
        className="link-item tap cursor-pointer"
      >
        <AnimatedText
          value={label}
          direction={status === "idle" ? "down" : "up"}
          ready={Boolean(email)}
        />
      </button>
      <span className="sr-only" aria-live="polite">
        {MESSAGES[status]}
      </span>
    </>
  );
};

export default SayHello;
