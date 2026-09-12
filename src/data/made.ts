export interface Project {
  title: string;
  description: string;
  url?: string;
}

export const made: Project[] = [
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
    title: "thesis",
    description:
      "natural language drone control using llms and computer vision",
    url: "https://github.com/vasiledraguta/thesis",
  },
];
