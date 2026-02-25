import type { CollectionEntry } from "astro:content";

const getSortedPosts = (posts: CollectionEntry<"news">[]) => {
  return posts
    .filter(({ data }) => import.meta.env.DEV || !data.draft)
    .sort(
      (a, b) =>
        Math.floor(
          new Date(b.data.modDatetime ?? b.data.pubDatetime).getTime() / 1000
        ) -
        Math.floor(
          new Date(a.data.modDatetime ?? a.data.pubDatetime).getTime() / 1000
        )
    );
};

export default getSortedPosts;
