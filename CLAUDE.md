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
- `src/data/news/` - MDX blog posts (content collection)
- `src/content.config.ts` - Content collection schema definition

### Key Patterns
- Path alias: `@/*` maps to `./src/*`
- API routes use `export const prerender = false` for SSR
- CSS variables defined in `:root` for theming (see `global.css`)
- Components use Astro's scoped `<style>` blocks

### Environment Variables
Required for newsletter functionality:
- `CONVERTKIT_API_KEY`
- `CONVERTKIT_FORM_ID`

## Linting Rules
- `no-console` is an error (except `console.error` and `console.warn` in API routes)
