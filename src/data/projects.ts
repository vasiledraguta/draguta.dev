export interface Project {
  title: string;
  description: string;
  url?: string;
}

export const projects: Project[] = [
  {
    title: "mimir",
    description:
      "chrome extension for ai-powered context on any highlighted text",
    url: "https://github.com/vasiledraguta/mimir",
  },
  {
    title: "pygmalion",
    description:
      "ai agent that builds next.js apps from prompts in isolated sandboxes",
    url: "https://github.com/vasiledraguta/pygmalion",
  },
  {
    title: "faceit finder discord bot",
    description:
      "discord bot for fetching faceit player stats and match history",
    url: "https://github.com/vasiledraguta/faceit-finder-discord-bot",
  },
];
