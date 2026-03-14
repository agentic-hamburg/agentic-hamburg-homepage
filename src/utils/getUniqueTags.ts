import type { CollectionEntry } from "astro:content";
import { slugifyStr } from "./slugify";

interface TagInfo {
  tag: string;
  tagName: string;
}

const getUniqueTags = (posts: CollectionEntry<"news">[]): TagInfo[] => {
  const tags: Map<string, string> = new Map();

  posts
    .filter(({ data }) => import.meta.env.DEV || !data.draft)
    .flatMap(post => post.data.tags)
    .forEach(tag => {
      const slug = slugifyStr(tag);
      if (!tags.has(slug)) {
        tags.set(slug, tag);
      }
    });

  return Array.from(tags, ([tag, tagName]) => ({ tag, tagName })).sort((a, b) =>
    a.tag.localeCompare(b.tag)
  );
};

export default getUniqueTags;
