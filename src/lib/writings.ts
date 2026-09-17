import { getCollection } from "astro:content";

export async function getWritings() {
  const writings = await getCollection(
    "writings",
    ({ data }) => import.meta.env.DEV || !data.draft
  );

  return writings.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
