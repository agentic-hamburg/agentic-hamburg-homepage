// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import netlify from "@astrojs/netlify";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  // In Astro 5, hybrid mode is now part of static mode
  // Pages with `export const prerender = false` are automatically server-rendered
  adapter: netlify(),
  integrations: [
    tailwind(),
    mdx({
      optimize: true,
    }),
  ],
  image: {
    remotePatterns: [{ protocol: "https" }],
    service: {
      entrypoint: "astro/assets/services/sharp",
      config: {
        limitInputPixels: false,
      },
    },
  },
  build: {
    // Inline all CSS to eliminate render-blocking requests
    inlineStylesheets: "always",
  },
  vite: {
    build: {
      // Control CSS inlining threshold (2KB = 2048 bytes)
      assetsInlineLimit: 2048,
      rollupOptions: {
        output: {
          // Better CSS code splitting and deduplication
          manualChunks: id => {
            // Group Tailwind CSS and other framework CSS into a shared chunk
            if (id.includes("tailwindcss") || id.includes("global.css")) {
              return "shared-styles";
            }
          },
        },
      },
    },
  },
});
