export interface SetupItem {
  name: string;
  description?: string;
  link?: string;
}

export interface SetupCategory {
  title: string;
  items: SetupItem[];
}

export const setup: SetupCategory[] = [
  {
    title: "hardware",
    items: [
      {
        name: 'macbook pro 16" m3 pro',
        description: "my main machine for development.",
      },
    ],
  },
  {
    title: "development",
    items: [
      {
        name: "cursor",
        description: "ai-powered ide.",
        link: "https://cursor.com",
      },
      {
        name: "ghostty",
        description: "fast, native terminal emulator.",
        link: "https://ghostty.org",
      },
      {
        name: "fish",
        description: "user friendly shell with great defaults.",
        link: "https://fishshell.com",
      },
    ],
  },
  {
    title: "apps",
    items: [
      {
        name: "helium",
        description: "my browser of choice.",
        link: "https://helium.computer/",
      },
      {
        name: "spotify",
        description: "music.",
        link: "https://spotify.com",
      },
    ],
  },
];
