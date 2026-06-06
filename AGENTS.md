# AGENTS.md

Codex guidance for this repository. Keep this file aligned with `CLAUDE.md` when workflow details change.

## Project

Agentic Hamburg community homepage, built with Astro 5 and deployed on Netlify.

## Commands

```bash
npm run dev          # Start Netlify dev server
npm run dev:astro    # Start Astro dev server
npm run build        # astro check && astro build
npm run typecheck    # Astro type-check
npm run lint         # ESLint
npm run format:check # Prettier check
npm run ci           # typecheck + lint + format:check
```

## Content Pipeline

Source posts live in `content/<post-folder>/post.md`.

Preview distribution:

```bash
./distribute-post.sh <post-folder> --dry-run
```

Create the Astro blog post and print social copy:

```bash
./distribute-post.sh <post-folder>
```

Optional Buffer support:

```bash
./distribute-post.sh --list-buffer-channels
./distribute-post.sh <post-folder> --publish-social
./distribute-post.sh <post-folder> --publish-social --buffer-channel-ids "linkedin_id,bluesky_id"
./distribute-post.sh --publish-text "Standalone LinkedIn copy"
```

Buffer publishing is off by default. It requires `BUFFER_API_TOKEN` and `BUFFER_CHANNEL_IDS`. Channel discovery uses `BUFFER_ORGANIZATION_ID`; if that is missing, the list command prints organizations first.

Image posts need `BUFFER_MEDIA_URL` or `--buffer-media-url` with a public image URL. The CLI does not upload local banner files directly.

Use `--publish-text` for standalone LinkedIn posts that are not tied to a blog post.

LinkedIn/Buffer post style:

- Do not add hashtags to Agentic Hamburg LinkedIn posts unless the user explicitly asks for them.
- Prefer a short final CTA such as `Join us on June 9 in Hamburg.` over generic lines like `More details soon.`

## Environment

Optional for content distribution:

- `BLOG_CONTENT_PATH`
- `BLOG_BASE_URL`

Required for banner generation:

- `GOOGLE_API_KEY`

Optional for social publishing:

- `BUFFER_API_TOKEN`
- `BUFFER_ORGANIZATION_ID`
- `BUFFER_CHANNEL_IDS`
- `BUFFER_MODE`
- `BUFFER_MEDIA_URL`
