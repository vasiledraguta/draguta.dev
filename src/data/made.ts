export interface Project {
  title: string;
  description: string;
  url?: string;
}

export const made: Project[] = [
  {
    title: "porsche ui",
    description: "a porsche screen, but on the web",
    url: "https://porsche-ui.vercel.app",
  },
  {
    title: "mimir",
    description: "let the ai bring the context to you",
    url: "https://github.com/vasiledraguta/mimir",
  },
  {
    title: "thesis",
    description: "fly a drone by talking to it",
    url: "https://github.com/vasiledraguta/thesis",
  },
];
