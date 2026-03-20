# Banner Image Generation Guidelines

## Style

- Aspect ratio: 16:9
- Photorealistic or editorial illustration style
- Warm, inviting tones with vibrant energy
- No text or watermarks in the image

## Branding context

- Agentic Hamburg is a developer community focused on AI coding tools
- Meetups, conferences, and tech talks in Hamburg, Germany
- The community vibe is collaborative, forward-looking, and hands-on

## What works well

- Abstract representations of the topic (AI, coding, collaboration)
- Clean compositions with a single focal point
- Subtle tech elements (code patterns, neural networks, circuit aesthetics) without being too literal
- Hamburg cityscape elements when relevant (Elbphilharmonie, harbor, bridges)
- Warm lighting suggesting community and connection

## What to avoid

- Text overlays or any written words
- Overly busy compositions
- Stock photo clichés (handshakes, suited people pointing at screens)
- Dark or moody atmospheres unless specifically requested
- Literal robot/AI depictions (no humanoid robots)

## Sponsor spotlight banners

Sponsor banners are an exception to the "no text" rule — they include text elements and logos.

**Two-step process:** Generate the banner with Gemini (sponsor logo only), then composite the Agentic logo with ImageMagick. Do NOT pass the Agentic logo to Gemini as a second image — it consistently renders it incorrectly.

See `CLAUDE.md` → "Sponsor spotlight banners" for the full workflow and commands.
