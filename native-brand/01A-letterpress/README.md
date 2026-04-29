# Native — Direction 01·A · Letterpress

Brand kit for the AI-Native operator team behind nativebuilt.com.

## What's here

| File | What it is | Who reads it |
|---|---|---|
| **`style-guide.md`** | The canonical brand spec — voice, color, type, components, motion, do/don't. Written for humans and agents. | Designers, engineers, Claude Code, Claude Design |
| **`tokens.css`** | Drop-in CSS custom properties + base styles. Import once globally. | Engineers, build pipeline |
| **`README.md`** | This file — how to wire the kit into Claude tools and projects. | Anyone setting up a project |

## How to use it with Claude Code

Drop the brand folder into your project root and reference it from `CLAUDE.md`:

```
your-project/
├── CLAUDE.md
└── brand/
    ├── style-guide.md
    └── tokens.css
```

Then in `CLAUDE.md`:

```markdown
## Brand
Native's brand system is defined in `brand/style-guide.md`. Read it before
designing or implementing any UI. Tokens live in `brand/tokens.css` —
import once globally and reference tokens (never raw hex) in components.

The brass accent (#B08848) is reserved for emphasis, periods, drop caps,
and ornaments. Never use it for buttons or body copy.
```

Claude Code auto-loads `CLAUDE.md` at conversation start, so the brand
context is inherited everywhere — no per-prompt reminders needed.

## How to use it with Claude Design / web Claude

Two options:

1. **Project knowledge** — upload `style-guide.md` to the conversation's project
   knowledge. Best for ongoing design work.
2. **Paste inline** — paste the full markdown at the top of a fresh chat.
   Best for one-off comp generation.

Then prompt in plain language:

> *"Design the pricing page using the Native Letterpress system. Use the
> two-column hero treatment from § 6 with a scotch rule between the hero
> and the comparison table."*

Claude can quote sections by heading and apply rules verbatim because
the spec is structured for retrieval.

## How to apply the tokens to the website

```css
/* In your global stylesheet, before any component CSS */
@import "./brand/tokens.css";

/* In any component */
.hero {
  background: var(--paper);
  color: var(--ink);
  padding: var(--space-12) var(--gutter);
  border-radius: var(--radius-xl);
}
.hero h1 {
  font-family: var(--font-display);
  font-size: var(--t-display);
  letter-spacing: var(--ls-display);
}
```

## Updating

- Update `style-guide.md` first when the brand changes.
- Then update `tokens.css` to match.
- Then update component code.
- Bump `v1.0` → `v1.1` in the footer of `style-guide.md` and document the change.

Never the other way around.

## Sibling variants

Letterpress (this kit) is one of three variants of Direction 01:

- **01·A · Letterpress** — refined, hand-set (this kit)
- **01·B · Estate** — heritage house, oxblood + brass
- **01·C · Atelier** — couture studio, hairlines + pearl

See `../native-brand-v4.html` for the visual showcase. The other two
variants will get matching kits when one is selected.

---

*v1.0 · April 26, 2026*
