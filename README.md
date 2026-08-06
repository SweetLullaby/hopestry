# Mainframe — full-screen hero landing page

Stack: React + TypeScript + Vite + Tailwind CSS.

## Setup

```bash
npm install
npm run dev
```

## Before running — 2 URLs need to be completed

The brief you gave me truncated two URLs with "…". Fill these in before the
page will look/behave correctly:

1. `index.html` — the two `<link rel="stylesheet">` webfont URLs
   (`db.onlinewebfonts.com/c/5ac3fe7c6abd...` and
   `db.onlinewebfonts.com/c/1aa3377e4898...`).
2. `src/components/BackgroundVideo.tsx` — the `VIDEO_SRC` constant
   (`d8j0ntlcm91z4.cloudfront.net/user_38xzZboKV...`).

## Structure

```
index.html                        font <link> tags
src/
  main.tsx                        React entry
  index.css                       Tailwind directives, CSS vars, @keyframes blink
  App.tsx                         composes video + navbar + hero
  hooks/
    useTypewriter.ts              character-by-character text reveal
    useScrubVideo.ts              mousemove -> video.currentTime scrubbing
  components/
    BackgroundVideo.tsx           fixed full-screen <video>, z-0
    Navbar.tsx                    fixed nav, z-10, mobile hamburger + overlay (z-9)
    Hero.tsx                      blurred intro, typewriter line, pill buttons
    CopyIcon.tsx                  12x12 inline SVG used in the email pill
```
