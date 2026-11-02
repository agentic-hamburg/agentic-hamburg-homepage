# Brand Colors

The source of truth is the Agentic design system (`agentic-hamburg/design-system`, `tokens/tokens.json`).
The site mirrors its tokens as CSS variables in `src/styles/global.css`.

| Token | Hex | Usage |
|-------|-----|-------|
| `--slate` | `#244043` | Text, headings, logo, hero surfaces, buttons |
| `--salmon` | `#FB9DA1` | Accents: numerals, rules, dots, button fills on slate. Never body text on paper (1.8:1 contrast) |
| `--paper` | `#F7F3EE` | Page ground, ink on slate |

Muted text is slate at 65% opacity (`--ink-muted-opacity`). No other hues, gradients or tints.

Type: display face Canela, with Rufina 700 as the loaded stand-in for titles, names, dates and numerals. Body text uses Helvetica Neue.

Logos live in `src/assets/brand/`, copied as SVG from the design system's `assets/logos/`. Never rasterise, redraw or recolor them.
