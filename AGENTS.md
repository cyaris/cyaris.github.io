# Repository Guidance

## Embedded App Hosting

- Treat embedded Svelte app pages as hosts for compiled bundles. Change app behavior, routes, and app-scoped styles in the source repo, rebuild/upload compiled bundle artifacts, and keep Jekyll pages as lightweight shell pages plus host-page CSS; do not patch generated bundle behavior or duplicate route content directly in Jekyll.

## Host Page Styling

- `full-width: true` uses the site's full-width Jekyll/Bootstrap layout. Keep embedded tools full-width, and scope page-local alignment overrides to surrounding page furniture rather than the chart unless requested.
- Embedded frontend Tailwind bundles are scoped under each app's wrapper class, so Tailwind utility classes on Jekyll wrapper elements outside that app scope will not apply. Use page CSS, inline CSS, or global site CSS for Jekyll wrapper elements.

## Documentation

- Keep README link behavior intentional and consistent. Use standard Markdown links by default, and use HTML anchors with `target="_blank"` and `rel="noopener noreferrer"` only when links should explicitly open in a new tab.
- When changes to Beautiful Jekyll files, site styling, or site functionality deviate from upstream Beautiful Jekyll, document the affected files and behavior in the README's `Deviations From Beautiful Jekyll` section in the same change.

## Content

- Keep all tags alphabetized.

## Firework GIF Thumbnails

- To create a firework thumbnail like `assets/img/firework-launcher-demo.gif`, generate an explosion-only GIF rather than recording the website. The existing thumbnail was synthesized with a temporary Node script, not captured from the live page, so it contains no homepage, navbar, or vertical rocket launch trail.
- Use temporary tooling outside the repo, for example `npm install --prefix /private/tmp/cyaris-gif-capture pngjs omggif`, to avoid changing site dependencies.
- Generate indexed GIF frames directly with `omggif`; use palette index `0` as transparent black, pass `transparent: 0`, and use `disposal: 2` for each frame. Use `pngjs` only for optional preview PNGs.
- The current thumbnail parameters are `360x360`, `34` frames, `70ms` per frame, transparent background, seeded particle positions, about `150` circular particles, and a bright palette matching the fireworks project. Output goes to `assets/img/firework-launcher-demo.gif`.
- Keep future firework thumbnails focused on the explosion itself. Do not include the full website background or the rocket traveling up the screen unless explicitly requested.

## Site Styling

- For site-local Jekyll links and asset paths, use the `relative_url` filter instead of concatenating `site.url`. Reserve `absolute_url` for metadata, feeds, canonical URLs, or other places that require a fully qualified URL.
