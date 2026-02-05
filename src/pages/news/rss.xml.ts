import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import getSortedPosts from "@/utils/getSortedPosts";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const posts = await getCollection("news", ({ data }) => !data.draft);
  const sortedPosts = getSortedPosts(posts);

  return rss({
    title: "Agentic Hamburg News",
    description:
      "News and updates from Agentic Hamburg - Hamburg's Agentic Coding Meetup community",
    site: context.site ?? "https://agentic.hamburg",
    items: sortedPosts.map(post => ({
      title: post.data.title,
      pubDate: post.data.pubDatetime,
      description: post.data.description,
      link: `/news/${post.id}/`,
      categories: post.data.tags,
      author: post.data.author,
    })),
    customData: `<language>en-us</language>`,
  });
}
