import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

export const NEWS_PATH = "src/data/news";

const news = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${NEWS_PATH}` }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default("Agentic Hamburg Team"),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["general"]),
      ogImage: image().or(z.string()).optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      timezone: z.string().optional(),
    }),
});

export const collections = { news };
