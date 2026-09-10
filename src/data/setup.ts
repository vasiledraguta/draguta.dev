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
        description: "my main machine",
      },
    ],
  },
  {
    title: "development",
    items: [
      {
        name: "vscode",
        description: "ide",
        link: "https://code.visualstudio.com",
      },
      {
        name: "ghostty",
        description: "terminal",
        link: "https://ghostty.org",
      },
    ],
  },
  {
    title: "apps",
    items: [
      {
        name: "helium",
        description: "browser",
        link: "https://helium.computer/",
      },
      {
        name: "spotify",
        description: "music",
        link: "https://spotify.com",
      },
      {
        name: "hermes",
        description: "ai agent",
        link: "https://hermes-agent.nousresearch.com/",
      },
    ],
  },
];
