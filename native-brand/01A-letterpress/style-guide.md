# Native — Direction 01·A · Letterpress

> The canonical style guide for Native (NativeBuilt.com) — Direction 01·A.
> Source of truth for brand identity, design tokens, components, and voice.
> Read this before designing or implementing any Native interface.

---

## 1 · Identity

**Name:** Native
**Domain:** nativebuilt.com
**Wordmark:** `Native.` — title case, brass period
**Tagline:** *Strategic operators for AI-Native companies.*

**One-line positioning:**
Native is the operator team that builds AI-Native companies — and makes the ones you already run native too.

**Two front doors:**

1. **Build with us** — venture studio for industry-native operators launching new AI-Native companies.
2. **Modernize & scale** — embedded operator team for growing 7–9 figure businesses going native at the pace they can absorb.

---

## 2 · Voice & tone

Native sounds like a senior operator who has done the work, not a consultant pitching it. Quiet, confident, literary, declarative.

**Voice attributes:**

- **Operator, not advisor** — we install, we don't recommend
- **Editorial, not corporate** — sentences breathe, italics carry meaning
- **Specific, not aspirational** — "20x in 3 years" beats "drive transformative growth"
- **Declarative, not hedged** — "the order is the product" beats "we believe order matters"
- **Warm, not clinical** — first person plural, contractions, dry humor

**Sentence shape:**  
Short. Then long enough to mean something. Italics for emphasis, never bold mid-sentence. No Em-dashes.

**Voice samples:**

  
✅ *"Stop waiting for bandwidth. Start building for scale."*

❌ *"Native leverages cutting-edge AI capabilities to deliver transformative outcomes."*
❌ *"Our holistic methodology empowers organizations to unlock value."*

**Words we use:** *operator, embed, scale.*

**Words we avoid:** *leverage, synergize, holistic, transformative, empower, ecosystem, solution, journey, unlock.*

---

## 3 · Logo system

### Primary wordmark

`**Native.`** — Playfair Display, weight 500, letter-spacing −0.015em. Forest ink, brass period.

```
Native.
^^^^^^^^
Forest  Brass
#0B3D2E #B08848
```

**Use when:** Header lockups, footer lockups, signature lines, anywhere the brand name appears.

### Display wordmark

`**Native.`** — Playfair Display, weight 400, letter-spacing −0.028em, sized 3rem+. Italic period in brass.

**Use when:** Hero logos, marketing one-pagers, large-format brand expressions.

### Mark — square N

A 56–64px square in forest, radius 10px. Cap "N" in Playfair Display 500. Brass underline at the baseline (1.5px, 12px from each edge, opacity 0.85).

**Use when:** Favicons, social avatars, app icons, profile photos. Anywhere the wordmark won't fit.

### Monogram — engraved circle

Inline SVG circular crest, 110px. Outer ring 0.8px forest. Inner dashed ring 0.5px brass. Cap "N" in Playfair Display 500. "EST · MMXXVI" arched along the top, "NATIVEBUILT.COM" along the bottom. Brass tick marks at 9 and 3 o'clock.

**Use when:** Letterhead, embossed materials, premium print, footer seals, "about" pages where the heritage matters.

```svg
<!-- Standard monogram, simplified -->
<svg viewBox="0 0 110 110">
  <circle cx="55" cy="55" r="52" fill="none" stroke="#0B3D2E" stroke-width="0.8"/>
  <circle cx="55" cy="55" r="46" fill="none" stroke="#B08848" stroke-width="0.5" stroke-dasharray="1.5 2"/>
  <text x="55" y="68" text-anchor="middle"
        font-family="Playfair Display, serif" font-weight="500"
        font-size="48" fill="#0B3D2E" letter-spacing="-2">N</text>
  <text x="55" y="22" text-anchor="middle"
        font-family="Inter, sans-serif" font-weight="600"
        font-size="6.5" fill="#0B3D2E" letter-spacing="3">EST · MMXXVI</text>
  <text x="55" y="98" text-anchor="middle"
        font-family="Inter, sans-serif" font-weight="600"
        font-size="6.5" fill="#0B3D2E" letter-spacing="3">NATIVEBUILT.COM</text>
  <line x1="20" y1="55" x2="30" y2="55" stroke="#B08848" stroke-width="0.6"/>
  <line x1="80" y1="55" x2="90" y2="55" stroke="#B08848" stroke-width="0.6"/>
</svg>
```

### Clear space

Minimum padding around any logo = the height of the cap "N". Never crowd, never overprint, never recolor outside the system.

### Don't

- ❌ Don't drop the period — it's part of the mark.
- ❌ Don't replace the brass period with forest — it loses the accent.
- ❌ Don't use the wordmark below 14px on screen — use the mark or monogram.
- ❌ Don't apply gradients, drop shadows, or 3D effects to the mark.
- ❌ Don't recolor the monogram crest — it stays forest + brass on light grounds.

---

## 4 · Color

The Letterpress palette is five tokens. No more. Use semantic roles, not raw hex, in code.

### Tokens


| Role            | Hex       | Use                                                |
| --------------- | --------- | -------------------------------------------------- |
| `--ink`         | `#0B0A07` | Primary text on light surfaces                     |
| `--bone`        | `#F1EBDD` | Default page background                            |
| `--paper`       | `#FAF6EC` | Card / panel surfaces (one tone lighter than bone) |
| `--paper-deep`  | `#F5F0E0` | Hero gradients, recessed surfaces                  |
| `--forest`      | `#0B3D2E` | Brand primary, headings, primary buttons           |
| `--forest-deep` | `#062116` | Button hover, deep backgrounds                     |
| `--forest-soft` | `#436D5E` | Quiet emphasis, secondary brand text               |
| `--sage`        | `#9BB2A2` | Underline rules, dim text on dark, tertiary        |
| `--brass`       | `#B08848` | The accent. Period, italic emphasis, kicker glyphs |
| `--brass-deep`  | `#83602E` | Brass hover / pressed                              |


### Opacity scale (ink on light)

```
--ink-80: rgba(11,10,7,0.82)   /* Body text */
--ink-60: rgba(11,10,7,0.62)   /* Lede, secondary text */
--ink-40: rgba(11,10,7,0.40)   /* Captions, placeholders */
--ink-22: rgba(11,10,7,0.22)   /* Borders, dividers */
--ink-10: rgba(11,10,7,0.10)   /* Hairlines on cards */
```

### When to use

- **Forest** is the brand anchor. Use it for: headings, primary buttons, brand mark, logos, kickers, links.
- **Brass** is the *accent*, not a secondary brand. Use it for: the wordmark period, italic emphasis in display type, kicker glyphs (§ ❦), drop caps, decorative ticks. **Never** use brass for body copy or buttons.
- **Bone vs Paper:** Bone is the page; Paper is anything that sits on top of the page (cards, panels, hero surfaces). Always use Paper for cards so the page-vs-surface distinction is felt without a hard border.
- **Sage** is the quiet utility — borders, secondary marks, sage-on-forest text in dark sections.

### Contrast & accessibility

- Body text: `--ink` on `--bone` → 18:1 ✓ AAA
- Forest on bone: 8.6:1 ✓ AAA
- Brass on bone: 4.6:1 ✓ AA (use only for non-body emphasis or 18px+)
- Brass on forest: 4.7:1 ✓ AA
- Sage on forest: 5.2:1 ✓ AA

**Never** put brass-on-bone for paragraph text — it fails AAA. Brass is for accents only.

### Don't

- ❌ Don't introduce new accent colors — brass is the only warm.
- ❌ Don't use forest below ~24% lightness in compositions; pair with bone or paper.
- ❌ Don't use pure black (#000) anywhere — always `--ink` (#0B0A07).
- ❌ Don't use pure white anywhere — always `--paper` (#FAF6EC).

---

## 5 · Typography

### Type families


| Family               | Use                                                     | Weights                         |
| -------------------- | ------------------------------------------------------- | ------------------------------- |
| **Playfair Display** | Display, headings, wordmark, drop caps, italic emphasis | 300, 400, 500 (italic 400, 500) |
| **Inter**            | Body, lede, UI labels, captions                         | 300, 400, 500, 600              |
| **JetBrains Mono**   | Kickers, metadata tags, mono labels, dates              | 400, 500, 600                   |


**Google Fonts import:**

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap">
```

### Type ladder


| Token         | Family / Weight     | Size                           | Line-height | Letter-spacing   | Use                             |
| ------------- | ------------------- | ------------------------------ | ----------- | ---------------- | ------------------------------- |
| `--t-display` | Playfair 400        | 3rem (48px) → clamp to 4.25rem | 1.0         | −0.02em          | Hero / page-leading display     |
| `--t-h2`      | Playfair 500        | 1.875rem (30px)                | 1.1         | −0.015em         | Section heading                 |
| `--t-h3`      | Playfair 500        | 1.5rem (24px)                  | 1.15        | −0.01em          | Subsection / card heading       |
| `--t-lede`    | Inter 400           | 1.0625rem (17px)               | 1.65        | normal           | Hero lede / opening paragraph   |
| `--t-body`    | Inter 400           | 0.9375rem (15px)               | 1.65        | normal           | Body                            |
| `--t-caption` | Playfair italic 400 | 1rem (16px)                    | 1.4         | normal           | Pull quotes, marginalia         |
| `--t-kicker`  | JetBrains Mono 500  | 0.6875rem (11px)               | 1.2         | 0.16em UPPERCASE | Section labels, dates, metadata |


### Italic discipline

Italics carry meaning in this brand. Reserve them for:

- Emphasis in display copy: *"Start building native."*
- The brass period after the wordmark: `Native.`
- Captions and pull quotes
- Brand vocabulary words: *the order, the loop, the strategic core*

**Never** italicize: paragraph body copy at large, navigation labels, button text.

### Drop caps

Long-form editorial paragraphs lead with a Playfair italic drop cap in brass.

```css
.ed-body::first-letter {
  font-family: 'Playfair Display', serif;
  font-weight: 400;
  font-style: italic;
  font-size: 5rem;
  line-height: 0.9;
  float: left;
  margin: 0.05em 0.625rem 0 0;
  color: var(--brass);
}
```

Use in: editorial detail panels, blog posts, the manifesto, press pages. Never in UI panels or dashboards.

### Line length

- Body copy: 60–75ch max
- Lede: 50–55ch max
- Display: 16–20ch max (force linebreaks for rhythm)

---

## 6 · Components

### Buttons

**Primary** — forest pill, paper text. The default CTA.

```html
<a class="btn-primary">
  Map your growth plan
  <svg class="arrow" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" stroke-width="2"
       stroke-linecap="round" stroke-linejoin="round">
    <path d="M5 12h14M13 5l7 7-7 7"/>
  </svg>
</a>
```

```css
.btn-primary {
  display: inline-flex; align-items: center; gap: 0.5rem;
  background: var(--forest); color: var(--paper);
  padding: 0.8125rem 1.375rem;
  border-radius: 999px;
  font-family: 'Inter', sans-serif;
  font-size: 0.8125rem; font-weight: 500;
  letter-spacing: 0.005em;
  transition: background 180ms ease, transform 180ms ease;
}
.btn-primary:hover {
  background: var(--forest-deep);
  transform: translateY(-1px);
}
```

**Ghost** — bone background, ink-22 hairline border, ink text. The secondary CTA.

```css
.btn-ghost {
  padding: 0.8125rem 1.375rem;
  border-radius: 999px;
  border: 1px solid var(--ink-22);
  color: var(--ink);
  background: transparent;
  font-size: 0.8125rem; font-weight: 500;
  transition: border-color 180ms ease, background 180ms ease;
}
.btn-ghost:hover {
  border-color: var(--forest);
  background: rgba(11,61,46,0.05);
}
```

**Link** — italic Playfair, sage underline. The editorial link.

```css
.btn-link {
  color: var(--forest);
  font-family: 'Playfair Display', serif;
  font-style: italic;
  font-size: 1.0625rem; font-weight: 500;
  border-bottom: 1px solid var(--sage);
  padding-bottom: 3px;
}
```

### Pills

Compact rounded labels with a leading dot. Used for tags, modes, badges.

```html
<span class="pill">Build with us</span>
<span class="pill">Modernize & scale</span>
<span class="pill brass">On the cap table</span>
```

```css
.pill {
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  border-radius: 999px;
  background: rgba(11,61,46,0.08);
  color: var(--forest);
  font-size: 0.75rem; font-weight: 500;
}
.pill::before {
  content: ''; width: 6px; height: 6px;
  border-radius: 999px;
  background: var(--forest);
}
.pill.brass { background: rgba(176,136,72,0.14); color: var(--brass-deep); }
.pill.brass::before { background: var(--brass); }
```

### Cards

Paper background, ink-22 hairline border, 14px radius. Padding 1.75rem on desktop, 1.5rem on mobile.

```css
.card {
  background: var(--paper);
  border: 1px solid var(--ink-22);
  border-radius: 14px;
  padding: 1.75rem;
}
```

### Mode card (the "two ways we work" composition)

Forest-on-paper card with editorial padding. Tag in sage, big number in low-opacity bone, h3 in Playfair italic, ul with brass tick marks, link in italic brass.

See `native-brand-v4.html` `#a .inuse` for the canonical implementation.

### Case study card

Paper card. Logo in Playfair 500. Big metric in Playfair 400 with brass italic numerals (`<em>20</em>x`). Mono caption underneath. Description in body italic for the metric callout.

---

## 7 · Texture & ornament

This is what separates Letterpress from a generic editorial template.

### Paper grain (the texture)

Every light surface gets a subtle SVG noise overlay applied via `mix-blend-mode: multiply`. Tuneable via `baseFrequency`.

```css
.tex-paper::before {
  content: '';
  position: absolute; inset: 0;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.65 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>");
  background-size: 220px 220px;
  opacity: 0.55;
  mix-blend-mode: multiply;
  pointer-events: none;
  z-index: 0;
}
```

**Apply to:** page background, swatch chips, hero panels, in-use cards. Always behind content with `z-index: 1` on children.

**Don't apply to:** dashboard surfaces, dense data tables, inputs, popovers — texture should never compete with information density.

### Scotch rule (section divider)

Three parallel horizontal lines — thick, thin, thick — the classic editorial divider.

```css
.scotch {
  height: 12px;
  border-top: 2px solid var(--forest);
  border-bottom: 2px solid var(--forest);
  position: relative;
}
.scotch::after {
  content: '';
  position: absolute;
  left: 0; right: 0; top: 50%;
  height: 1px; background: var(--forest);
  transform: translateY(-0.5px);
  opacity: 0.85;
}
```

**Use to:** divide major sections inside long-form content, separate hero from body, mark the end of an editorial piece.

### Hairline rule

A single 1px line at 18% opacity. The quiet divider.

```css
.hairline { height: 1px; background: var(--ink); opacity: 0.18; border: none; }
```

### Ornament rule (centered glyph)

Two thin lines flanking a centered ornament glyph. Used for chapter breaks and standalone moments.

```html
<div class="ornament-rule"><span class="glyph">❦</span></div>
```

```css
.ornament-rule {
  display: flex; align-items: center; gap: 1.25rem;
  font-family: 'Playfair Display', serif;
  font-style: italic; font-size: 1.125rem;
  color: var(--ink-22);
}
.ornament-rule::before, .ornament-rule::after {
  content: ''; flex: 1; height: 1px; background: currentColor;
  opacity: 0.35;
}
.ornament-rule .glyph { color: var(--brass); }
```

### Approved ornaments

Use sparingly. One glyph per page section, never more.


| Glyph | Name            | Use                                  |
| ----- | --------------- | ------------------------------------ |
| `§`   | Section mark    | Kicker prefixes, the "official" feel |
| `❦`   | Floral heart    | Chapter breaks, editorial endings    |
| `✦`   | Four-point star | Heritage / partnership moments       |
| `—`   | Em dash         | Editorial rhythm, attribution        |


**Don't use:** emoji, stars (★), arrows-as-decoration, geometric shapes that aren't on this list.

---

## 8 · Motion

Native moves slowly and on purpose. The whole system exhales.

### Duration scale


| Token        | Value | Use                                    |
| ------------ | ----- | -------------------------------------- |
| `--d-fast`   | 120ms | Color transitions on small UI elements |
| `--d-base`   | 180ms | Default — buttons, links, hover states |
| `--d-slow`   | 220ms | Card hovers, larger surfaces           |
| `--d-reveal` | 360ms | Scroll reveals, fade-ups               |


### Easing

Default: `ease-out` (cubic-bezier(0, 0, 0.2, 1)).
Use `ease` for two-way transitions (open/close).
Never linear — that's UI debt.

### Patterns

- **Hover lift:** 1px translate, never more. `transform: translateY(-1px)`.
- **No hard shadows.** Lift is from translation, not shadow inflation.
- **Scroll reveals:** `opacity: 0 → 1` and `translateY(8px) → 0`, 360ms ease-out, threshold 10%.
- **Reduced motion:** Respect `prefers-reduced-motion: reduce` — show all reveals immediately, drop translate transforms, keep color transitions.

### Don't

- ❌ Don't bounce (no spring-physics on UI elements — this isn't a consumer app).
- ❌ Don't animate width/height (use transform/opacity only).
- ❌ Don't autoplay anything that moves > 200ms by default.
- ❌ Don't animate the wordmark.

---

## 9 · Layout & spacing

### Spacing scale (4pt-derived)

```
--space-1: 0.25rem    /* 4px */
--space-2: 0.5rem     /* 8px */
--space-3: 0.75rem    /* 12px */
--space-4: 1rem       /* 16px */
--space-5: 1.25rem    /* 20px */
--space-6: 1.5rem     /* 24px */
--space-8: 2rem       /* 32px */
--space-10: 2.5rem    /* 40px */
--space-12: 3rem      /* 48px */
--space-16: 4rem      /* 64px */
--space-20: 5rem      /* 80px */
```

### Container

```
--container: 1320px
--gutter: clamp(1.25rem, 3vw, 2.5rem)
```

### Breakpoints

```
sm: 640px
md: 768px
lg: 1000px   /* Most layout pivots happen here */
xl: 1280px
```

### Grid rhythm

- Section vertical padding: `clamp(4rem, 9vw, 7rem)` — sections breathe at all sizes.
- Card grids: `gap: 1.75rem` desktop, `1rem` mobile.
- Two-column layout: `1.35fr 1fr` (the longer column reads first).

### Radius scale

```
--radius-xs: 2px       /* Tags, monospace badges */
--radius-sm: 4px       /* Inputs (if used) */
--radius-md: 10px      /* Logo mark */
--radius-lg: 14px      /* Cards, panels */
--radius-xl: 16px      /* Hero, large surfaces */
--radius-pill: 999px   /* Buttons, pills */
```

---

## 10 · Accessibility

- Every meaningful image needs alt text. Decorative images use `alt=""`.
- Focus rings: `outline: 2px solid currentColor; outline-offset: 3px; border-radius: 3px;`
- Tab order matches visual order. Never use `tabindex` > 0.
- Touch targets ≥ 44 × 44 CSS pixels.
- Color contrast verified — see § 4.
- Headings ladder: h1 → h2 → h3, no skipped levels.
- Icon-only buttons need `aria-label`.
- Respect `prefers-reduced-motion` and `prefers-color-scheme` (dark mode is a future deliverable, not in scope here).

---

## 11 · Do / Don't summary

### Do

- ✅ Lead with editorial copy, then explain it with body
- ✅ Reserve italics for emphasis and accent
- ✅ Use `--paper` for cards on a `--bone` page — never the same color
- ✅ Apply paper grain texture to every light surface
- ✅ Use scotch rules between major sections, hairlines for minor
- ✅ Pair the wordmark with NativeBuilt.com tag in mono caps when the URL helps
- ✅ Treat brass as accent, never as a button or body color
- ✅ Quote operator credentials with em dashes: *— Wharton, Harvard, Stanford*

### Don't

- ❌ Don't introduce new fonts or color tokens
- ❌ Don't use emoji as icons
- ❌ Don't drop the brass period from the wordmark
- ❌ Don't put body copy in italic
- ❌ Don't use hard drop shadows
- ❌ Don't apply texture to data-dense surfaces (tables, dashboards, inputs)
- ❌ Don't write in the corporate voice — "leverage", "synergize", "transformative" are banned

---

## 12 · Tokens (machine-readable)

Drop the block below into your global stylesheet. Then reference tokens (never raw hex) in components.

```css
:root {
  /* === Color === */
  --ink: #0B0A07;
  --ink-80: rgba(11,10,7,0.82);
  --ink-60: rgba(11,10,7,0.62);
  --ink-40: rgba(11,10,7,0.40);
  --ink-22: rgba(11,10,7,0.22);
  --ink-10: rgba(11,10,7,0.10);

  --bone: #F1EBDD;
  --paper: #FAF6EC;
  --paper-deep: #F5F0E0;

  --forest: #0B3D2E;
  --forest-deep: #062116;
  --forest-soft: #436D5E;
  --sage: #9BB2A2;

  --brass: #B08848;
  --brass-deep: #83602E;

  /* === Typography === */
  --font-display: 'Playfair Display', ui-serif, Georgia, serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, 'SF Mono', monospace;

  --t-display-size: clamp(2.5rem, 5vw, 4.25rem);
  --t-h2-size: 1.875rem;
  --t-h3-size: 1.5rem;
  --t-lede-size: 1.0625rem;
  --t-body-size: 0.9375rem;
  --t-caption-size: 1rem;
  --t-kicker-size: 0.6875rem;

  /* === Spacing === */
  --space-1: 0.25rem; --space-2: 0.5rem; --space-3: 0.75rem;
  --space-4: 1rem;    --space-5: 1.25rem; --space-6: 1.5rem;
  --space-8: 2rem;    --space-10: 2.5rem; --space-12: 3rem;
  --space-16: 4rem;   --space-20: 5rem;

  /* === Radius === */
  --radius-xs: 2px;
  --radius-sm: 4px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-xl: 16px;
  --radius-pill: 999px;

  /* === Motion === */
  --d-fast: 120ms;
  --d-base: 180ms;
  --d-slow: 220ms;
  --d-reveal: 360ms;
  --easing: cubic-bezier(0, 0, 0.2, 1);

  /* === Layout === */
  --container: 1320px;
  --gutter: clamp(1.25rem, 3vw, 2.5rem);
}
```

---

## 13 · Quick reference card

Print this. Stick it on a wall. Or paste it into a Claude conversation when you don't want to load the whole spec.

> **Native · Letterpress** — Forest #0B3D2E + Bone #F1EBDD + Brass #B08848. Playfair Display + Inter + JetBrains Mono. The wordmark is `Native.` with a brass period. Buttons are forest pills with 1px hover lift. Cards are paper-on-bone with paper-grain texture and a 14px radius. Italics carry meaning. The brass accent is reserved for emphasis, periods, drop caps, and ornaments — never body or buttons. Sections divide with scotch rules (thick-thin-thick). Voice is operator, not advisor. The order is the product.

---

## 14 · How to use this with Claude

### With Claude Code

1. Save this file as `brand/style-guide.md` at your project root.
2. Save the companion CSS as `brand/tokens.css`.
3. Add to your project's `CLAUDE.md`:
  ```markdown
   ## Brand
   Native's brand system is defined in `brand/style-guide.md`.
   Read it before designing or implementing any UI.
   Tokens live in `brand/tokens.css` — import once globally and reference
   tokens (never raw hex) in components.
  ```
4. That's it. Every Claude Code conversation in this project will inherit the brand context.

### With Claude Design / web Claude

Paste this entire file into the conversation (or upload it as a project knowledge file). Then ask for designs in plain language — "design the pricing page using the Native Letterpress system" — and Claude will quote the rules verbatim.

### When to update this file

Update on a real change, not a one-off. New token? Add it here first, then in `tokens.css`, then in code. Never the other way around.

---

*Last revised: April 26, 2026 · Maintainer: Native team · v1.0 · Direction 01·A*