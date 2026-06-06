# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Agentic Hamburg community website - a meetup group for developers interested in AI coding tools. Built with Astro 5, deployed on Netlify.

## Design System

Brand colors and design tokens are documented in `design-system/colors.md`. Key colors:
- **Salmon** `#FB9DA1` — banner backgrounds, cards, promotional materials
- **Teal** `#244043` — text, headings, logo, UI elements

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Type-check + build (astro check && astro build)
npm run typecheck    # Type-check only (astro check)
npm run lint         # ESLint
npm run lint:fix     # ESLint with auto-fix
npm run format       # Prettier format all files
npm run format:check # Prettier check without writing
npm run ci           # Full CI check (typecheck + lint + format:check)
```

## Architecture

### Tech Stack

- **Framework**: Astro 5 with TypeScript (strict mode)
- **Styling**: Tailwind CSS 3 with custom CSS variables in `src/styles/global.css`
- **Font**: Quicksand (via @fontsource)
- **Deployment**: Netlify with SSR adapter for API routes
- **Analytics**: PostHog
- **Newsletter**: ConvertKit API

### Directory Structure

- `src/pages/` - Astro pages (file-based routing)
- `src/pages/api/` - Server-side API endpoints (prerender = false)
- `src/components/` - Reusable Astro components
- `src/layouts/Layout.astro` - Base HTML layout with meta tags
- `src/lib/i18n/` - Internationalization (currently English only)
- `src/data/news/blog/YYYY/<post-slug>/index.mdx` - Blog posts (subdirectory per post, co-located images)
- `src/content.config.ts` - Content collection schema definition
- `content/<post-folder>/post.md` - Source content for the content pipeline
- `tools/bannergenerator/` - Go CLI for generating banner images via Gemini Imagen
- `tools/contentmachine/` - Go CLI for distributing content to blog + social media

### Key Patterns

- Path alias: `@/*` maps to `./src/*`
- API routes use `export const prerender = false` for SSR
- CSS variables defined in `:root` for theming (see `global.css`)
- Components use Astro's scoped `<style>` blocks

### Environment Variables

Required for newsletter functionality:

- `CONVERTKIT_API_KEY`
- `CONVERTKIT_FORM_ID`

Required for content pipeline:

- `GOOGLE_API_KEY` - Gemini API key for banner generation
- `BLOG_CONTENT_PATH` - Path to blog content directory (default: `src/data/news/blog`)
- `BLOG_BASE_URL` - Base URL of the blog (default: `https://agentic.hamburg`)

Optional for Buffer social publishing:

- `BUFFER_API_TOKEN` - Buffer GraphQL API token
- `BUFFER_ORGANIZATION_ID` - Buffer organization ID used when listing channels
- `BUFFER_CHANNEL_IDS` - Comma-separated Buffer channel IDs to post to, e.g. LinkedIn and Bluesky
- `BUFFER_MODE` - Buffer publish mode (default: `addToQueue`)
- `BUFFER_MEDIA_URL` - Optional public image URL to attach; local banner files cannot be uploaded directly

## Content Workflow

### Creating a new blog post

1. Create a folder in `content/`: `content/<post-folder>/post.md`
2. Write content with YAML frontmatter (see `content/example-post/post.md` for format)
3. Generate banner: `cd tools/bannergenerator && go run main.go --post <post-folder> --prompt "description" --count 4`
4. Pick the best banner, rename to `banner.png` in the post folder
5. Distribute: `./distribute-post.sh <post-folder>` (or `--dry-run` to preview)
6. The content machine creates the blog post in `src/data/news/blog/YYYY/<slug>/index.mdx` and outputs social media text
7. Optional Buffer publishing:
   - Discover organizations/channels: `./distribute-post.sh --list-buffer-channels`
   - Queue social posts: `./distribute-post.sh <post-folder> --publish-social`
   - Override channels per run: `./distribute-post.sh <post-folder> --publish-social --buffer-channel-ids "linkedin_id,bluesky_id"`
   - Queue standalone social copy: `./distribute-post.sh --publish-text "Standalone LinkedIn copy"`

Buffer uses the current GraphQL API at `https://api.buffer.com`. The default workflow only prints social copy; it will not call Buffer unless `--publish-social` is passed. Image posts require a public media URL via `BUFFER_MEDIA_URL` or `--buffer-media-url`; the local `content/<post-folder>/banner.png` file is not uploaded by the content machine.

LinkedIn/Buffer post style:

- Do not add hashtags to Agentic Hamburg LinkedIn posts unless the user explicitly asks for them.
- Prefer a short final CTA such as `Join us on June 9 in Hamburg.` over generic lines like `More details soon.`

### Post format (`content/<post-folder>/post.md`)

```yaml
---
title: "Post Title"
description: "Short summary for blog listing and social media"
author: Stefan Munz
pubDatetime: 2026-03-01T10:00:00+01:00
tags: [meetup, recap]
featured: false
draft: false
socialMediaHashtags: "#AgenticHamburg #AICoding"
---
```

Body is plain markdown. Images referenced as `![alt](./image.png)` are converted to Astro Image components.

### Banner guidelines

See `BANNER_GUIDELINES.md` for image generation style guide.

### Sponsor spotlight banners

Sponsor banners use a **two-step process** — Gemini generates the layout, then ImageMagick composites the Agentic logo:

1. Generate with only the sponsor logo (one `--images` arg, no agentic logo):
   ```bash
   cd tools/bannergenerator
   go run main.go --post sponsor-<name> \
     --images "/absolute/path/to/sponsor-logo.png" \
     --prompt 'Sponsor spotlight banner. Solid salmon pink background. Place the image (sponsor logo) large and centered. Add text "Sponsor Spotlight" above the logo in dark teal color. Add text "<Sponsor Name>" below the logo in dark teal color. Bottom left text in dark teal: "Agentic Conf Hamburg - March 22, 2026". Bottom right text in dark teal: "https://agentic.hamburg". All text must be dark teal. Clean minimal design, no shadows, no overlays. Leave the top right corner empty.' \
     --count 1
   ```
2. Composite the Agentic logo into the top-right corner with ImageMagick:
   ```bash
   magick content/sponsor-<name>/banner.png \
     \( content/sponsors/agentic-conf-logo.png -resize x90 \) \
     -gravity NorthEast -geometry +30+20 -composite \
     content/sponsor-<name>/banner.png
   ```

Key details:
- The Agentic logo is at `content/sponsors/agentic-conf-logo.png` (beehive dots + "agentic conf hamburg" text)
- Brand colors: salmon pink background, dark teal text (`#2c3e3a`)
- Do NOT pass the agentic logo to Gemini — it renders it poorly. Always composite afterwards.
- Sponsor logos are in `content/sponsors/`
- The bannergenerator must run from `tools/bannergenerator/` (Go module resolution)
- Use absolute paths for image files with special characters (e.g. `&` in filenames)

## Linting Rules

- `no-console` is an error (except `console.error` and `console.warn` in API routes)
