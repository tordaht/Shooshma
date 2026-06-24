# SHOOSHMA — Web Experience Design Plan

A premium, immersive brand experience for a sleep-wellness house. Not a flat
scrolling page — a quiet, cinematic *night ritual* you move through.

---

## 1. Creative direction

**Concept — "Geceye Geçiş" (The Crossing Into Night).**
The whole experience is built like falling asleep: it opens in a dark, star-lit
night and gradually warms into ivory daylight calm, then returns to night at the
close. Deep Teal is the night sky; Warm Ivory is the breath of morning; Soft Gold
is the single guiding star — the same star that sits on the elephant's trunk in
the mark. The elephant is the calm, protective guardian of the night.

**Tone.** Slow, confident, sensory. Nothing shouts. Copy speaks the way you'd talk
in a dim room — short, warm, human. No "miracle promises," no marketing pressure.

**Benchmark.** The bar is a global agency case-study site (think Aesop × Loftie ×
a fragrance maison). Generous negative space, one strong serif voice, restrained
motion, every transition intentional.

---

## 2. Brand system applied

| Token | Hex | Role in the experience |
|---|---|---|
| Deep Teal | `#0E3D3D` | Night canvas, dark sections, footer |
| Warm Ivory | `#F7F4ED` | Daylight sections, paper, type on dark |
| Muted Sand | `#C6C1B6` | Secondary text, dividers, mist |
| Soft Gold | `#C8A45A` | The guiding star, accents, hairlines, hovers |
| Ink Charcoal | `#1A1A1A` | Deep contrast, fine print |

**Type.** A high-contrast display serif (Cormorant / "Fraunces"-like) for headlines
to echo the engraved wordmark; a clean humanist sans (Inter-like) for body. Big
type, tight leading, wide tracking on small labels.

**Logo usage — corrected.** This was the main fault in the old build:
- **On light/ivory backgrounds →** full-colour logo (`logo-color.svg`).
- **On deep-teal/dark backgrounds →** single-ink ivory knockout with the gold star
  preserved (`logo-ivory.svg`). The coloured teal logo is *never* placed on a teal
  field again.
- Header, preloader and footer (all dark) use the ivory mark; the identity section
  (light) uses the colour mark.
- In the **Identity / colour section** the right side shows **only the clean logo**
  (the live SVG, gently animated) — the palette already lives on the left, so the
  old duplicated brand-board image is dropped.

---

## 3. Section architecture

0. **Preloader** — black-teal screen; the elephant mark draws in, the gold star
   twinkles, a thin progress hairline fills, then the curtain lifts.
1. **Hero — night sky.** Three.js starfield + drifting mist, one bright gold star,
   subtle mouse parallax. Ivory wordmark, a single calm headline, scroll cue.
2. **Manifesto.** One large statement that reframes "good sleep" as a nightly ritual
   — warm, unhurried copy. Background warms from teal toward ivory here.
3. **Identity system.** Left: interactive colour palette (click-to-copy swatches).
   Right: the clean logo SVG only, slow float + star shimmer. (User's request.)
3b. **Brand system.** The four brand-guide spreads (Logo Construction, Brand
   Motifs, Web Layout System, Components & Applications) shown as framed boards
   on ivory; click any to open it full-screen in the lightbox for detail.
4. **Collection narrative.** "Sleep Recalibration" told as a feeling, with a hero
   product still and a soft pull-quote.
5. **Products.** The two heroes (Pillow Mist, Night Cream) as a refined,
   alternating editorial layout with spec detail revealed on scroll.
6. **The Nightly Ritual.** Interactive 4-step sequence (Mist → Breathe → Massage →
   Release); progress driven by scroll/hover, breathing animation on "Breathe".
7. **Packaging system.** Quiet 4-card grid — hierarchy, back copy, inserts,
   production notes.
8. **Gallery.** Filterable mockup grid (All / Product / Set / Print) with an elegant
   lightbox (keyboard + arrows).
9. **Closing.** Return to night; ivory mark, a soft line, `shooshma.com`.

A fixed top bar (ivory mark + minimal nav) and a gold scroll-progress hairline
thread the whole thing together.

---

## 4. Motion & mechanics (the "web app" layer)

- **Three.js night sky** — instanced particle starfield, a glowing guiding star
  sprite, slow drift + depth parallax to cursor. Pauses off-screen for performance.
- **Custom cursor** — soft gold halo that scales over interactive elements
  (pointer-fine devices only; untouched on touch).
- **Scroll-reveal** — IntersectionObserver fades/rises sections; respects
  `prefers-reduced-motion`.
- **Magnetic buttons & swatches** — subtle pull toward the cursor.
- **Breathing ring** — the "Breathe" ritual step animates a 4-in / 6-out ring.
- **Palette copy** — click a swatch to copy its hex, with a quiet toast.
- **Lightbox gallery** — filter chips + full-screen viewer with prev/next.
- **Theme drift** — section backgrounds move teal → ivory → teal to mirror the
  night-to-morning arc.

Performance budget: one Three.js scene (capped DPR, throttled), no heavy libraries
beyond it, lazy images, reduced-motion fallbacks. Token-light, GPU-light.

---

## 5. Copy strategy

Rewritten from "presentation deck" voice into brand voice — Turkish, calm, second
person, sensory. Each section earns one idea. Labels in small-caps English keep the
editorial, international feel; the speaking lines are Turkish and warm. No clinical
claims; the promise is *a calmer crossing into night*, not a cure.

---

## 6. Deliverables

```
webAPP/
├── index.html        # structure + inline logo SVG (identity section)
├── styles.css        # full design system + responsive + reduced-motion
├── app.js            # Three.js scene + all interactions
├── DESIGN-PLAN.md    # this document
└── assets/
    ├── brand/        # logo-color, logo-ivory, mark variants, brand-board
    └── mockups/      # product & set imagery (webp)
```
