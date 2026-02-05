import type { CollectionEntry } from "astro:content";
import getSortedPosts from "./getSortedPosts";
import { slugifyStr } from "./slugify";

const getPostsByTag = (
  posts: CollectionEntry<"news">[],
  tag: string
): CollectionEntry<"news">[] => {
  return getSortedPosts(posts).filter(post =>
    post.data.tags.some(t => slugifyStr(t) === tag)
  );
};

export default getPostsByTag;
