# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Agentic Hamburg community website - a meetup group for developers interested in AI coding tools. Built with Astro 5, deployed on Netlify.

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

## Content Workflow

### Creating a new blog post

1. Create a folder in `content/`: `content/<post-folder>/post.md`
2. Write content with YAML frontmatter (see `content/example-post/post.md` for format)
3. Generate banner: `cd tools/bannergenerator && go run main.go --post <post-folder> --prompt "description" --count 4`
4. Pick the best banner, rename to `banner.png` in the post folder
5. Distribute: `./distribute-post.sh <post-folder>` (or `--dry-run` to preview)
6. The content machine creates the blog post in `src/data/news/blog/YYYY/<slug>/index.mdx` and outputs social media text

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

## Linting Rules
- `no-console` is an error (except `console.error` and `console.warn` in API routes)
