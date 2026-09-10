export type ThemePreference = "light" | "dark";

const KEY = "theme";

const prefersDark = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches;

function readStored(): ThemePreference | null {
  try {
    const stored = localStorage.getItem(KEY);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    return null;
  }
}

function writeStored(pref: ThemePreference): void {
  try {
    localStorage.setItem(KEY, pref);
  } catch {
    return;
  }
}

export function getPreference(): ThemePreference {
  return readStored() ?? (prefersDark() ? "dark" : "light");
}

export function applyPreference(pref: ThemePreference): void {
  document.documentElement.classList.toggle("dark", pref === "dark");
}

export function setPreference(pref: ThemePreference): void {
  writeStored(pref);
  applyPreference(pref);
  window.dispatchEvent(new Event("theme-change"));
}

export function togglePreference(): ThemePreference {
  const next: ThemePreference = getPreference() === "dark" ? "light" : "dark";
  setPreference(next);
  return next;
}
