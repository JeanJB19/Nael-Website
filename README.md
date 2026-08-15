# Nael Jean-Baptiste — Website

Single-page freelance/consultancy site. Built with HTML + Tailwind CSS v4 (compiled locally, not the CDN build).

## Project structure

```
index.html               ← the page itself — open this file directly, or deploy as-is
src/input.css            ← Tailwind entry point (@import "tailwindcss";) + design system + motion CSS
dist/styles.css          ← compiled, minified CSS the page actually loads (generated, do not hand-edit)
assets/                  ← images (headshot, etc.) + main.js (page behavior, loaded with `defer`)
tools/                   ← standalone Tailwind CLI binary (gitignored, see below)
```

## Before deploying — replace the placeholder domain

`index.html` has `https://your-domain-here.com` in the Open Graph/Twitter `<meta>` tags
(search for that string). Open Graph and Twitter Card images/URLs must be absolute — replace every
occurrence with the site's real, final URL once you have one, or link previews on social media/chat
apps will fail to resolve the image.

## Rebuilding the CSS

Whenever you add/change Tailwind classes in the HTML, the compiled `dist/styles.css` needs to be
regenerated — it only contains the classes actually used in the page (that's what keeps it small).

### Option A — if you have Node.js installed
```
npm install -D tailwindcss @tailwindcss/cli
npx @tailwindcss/cli -i src/input.css -o dist/styles.css --minify
```

### Option B — no Node.js needed (what was used to build this site)
Download the standalone Tailwind CLI binary for Windows (no install required) and run it directly:
```
# one-time download (~110MB, not committed to git — see .gitignore)
curl -sL -o tools/tailwindcss.exe https://github.com/tailwindlabs/tailwindcss/releases/latest/download/tailwindcss-windows-x64.exe

# rebuild
./tools/tailwindcss.exe -i src/input.css -o dist/styles.css --minify
```

## Deploying

This is a fully static site — `index.html`, `dist/styles.css`, and `assets/` are all you need to
upload to any static host (Netlify, GitHub Pages, Vercel, etc.). The entry file is already named
`index.html`, so most hosts will serve it at the site's root with no extra configuration.
