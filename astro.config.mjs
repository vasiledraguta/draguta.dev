// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: "https://draguta.dev",
  trailingSlash: "never",
  integrations: [
    sitemap({ filter: (page) => !page.includes("/preview/") }),
    mdx(),
  ],

  fonts: [
    {
      provider: fontProviders.google(),
      name: "Onest",
      cssVariable: "--font-onest",
      weights: ["400 600"],
      styles: ["normal"],
      subsets: ["latin", "latin-ext"],
      fallbacks: [
        "ui-sans-serif",
        "system-ui",
        "-apple-system",
        "BlinkMacSystemFont",
        "Segoe UI",
        "Roboto",
        "Helvetica Neue",
        "Arial",
        "sans-serif",
      ],
    },
    {
      provider: fontProviders.google(),
      name: "JetBrains Mono",
      cssVariable: "--font-jetbrains-mono",
      weights: ["400"],
      styles: ["normal"],
      subsets: ["latin", "latin-ext"],
      fallbacks: [
        "ui-monospace",
        "SFMono-Regular",
        "SF Mono",
        "Menlo",
        "Consolas",
        "monospace",
      ],
    },
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
