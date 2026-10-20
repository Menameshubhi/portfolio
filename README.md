# Shubhangi's World: Interactive Portfolio

An explorable, illustrated portfolio for Shubhangi Sharma, Product Designer.
It is plain HTML, CSS and JS with no build step, so it runs on GitHub Pages as-is.

## Edit content
All text, links and images live in **`js/content.js`**. Text in `[square brackets]` shows as a
dashed placeholder until you replace it. If a URL is empty, its button stays hidden. Put images in `assets/images/`.

## Preview locally
```
python3 -m http.server 8000   # then open http://localhost:8000
```
(Opening `index.html` directly also works.)

## Deploy to GitHub Pages
1. Push this folder to a GitHub repo.
2. Settings → Pages → Source: *Deploy from a branch* → `main` / root.
3. The site goes live at `https://<user>.github.io/<repo>/`. All paths are relative, and `.nojekyll` is included.

## Deep links
`#/home`, `#/visit-health`, `#/visit-health/2` (project 2), `#/interview-kickstart`, `#/affixious`, `#/future`.

## Files
- `js/art.js`: SVG illustrations (buildings, character, props)
- `js/ui.js`: shared components (project card, carousel, icons, empty state)
- `js/app.js`: world, walking, camera, windows, directory, sound, reduced motion
- `css/styles.css`: design tokens and all component states
