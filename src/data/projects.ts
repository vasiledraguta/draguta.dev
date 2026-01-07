export interface Project {
  title: string;
  description: string;
  url?: string;
  image?: string;
}

export const projects: Project[] = [
  {
    title: "mimir",
    description:
      "chrome extension for ai-powered context on any highlighted text.",
    url: "https://github.com/vasiledraguta/mimir",
    image: "/projects/mimir.png",
  },
  {
    title: "pygmalion",
    description:
      "ai agent that builds next.js apps from prompts in isolated sandboxes.",
    url: "https://github.com/vasiledraguta/pygmalion",
    image: "/projects/pygmalion.png",
  },
  {
    title: "docs-clone",
    description:
      "collaborative document editor with real-time editing and live cursors.",
    url: "https://github.com/vasiledraguta/docs-clone",
    image: "/projects/docs-clone.png",
  },
  {
    title: "dacic zero",
    description:
      "archaeological site management with maps and 3d artifact scanning.",
    url: "https://dacic-zero.ro/",
    image: "/projects/dacic-zero.png",
  },
  {
    title: "faceit finder discord bot",
    description:
      "discord bot for fetching faceit player stats and match history.",
    url: "https://github.com/vasiledraguta/faceit-finder-discord-bot",
    image: "/projects/faceit-finder-bot.png",
  },
  {
    title: "cshell",
    description:
      "custom unix shell in c with pipes, redirections, and builtins.",
    url: "https://github.com/vasiledraguta/CShell",
    image: "/projects/cshell.png",
  },
];
