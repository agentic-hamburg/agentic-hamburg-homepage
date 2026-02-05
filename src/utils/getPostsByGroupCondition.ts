import type { CollectionEntry } from "astro:content";
import getSortedPosts from "./getSortedPosts";

export interface PostGroup {
  year: number;
  month: number;
  monthName: string;
  posts: CollectionEntry<"news">[];
}

const getPostsByGroupCondition = (
  posts: CollectionEntry<"news">[]
): PostGroup[] => {
  const sortedPosts = getSortedPosts(posts);
  const groupedPosts: Map<string, PostGroup> = new Map();

  const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "long" });

  sortedPosts.forEach(post => {
    const date = post.data.pubDatetime;
    const year = date.getFullYear();
    const month = date.getMonth();
    const key = `${year}-${month}`;

    if (!groupedPosts.has(key)) {
      groupedPosts.set(key, {
        year,
        month,
        monthName: monthFormatter.format(date),
        posts: [],
      });
    }

    groupedPosts.get(key)!.posts.push(post);
  });

  // Return sorted by year (desc), then month (desc)
  return Array.from(groupedPosts.values()).sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    return b.month - a.month;
  });
};

export default getPostsByGroupCondition;
