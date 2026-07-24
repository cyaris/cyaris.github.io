# Repository Guidance

## Embedded App Hosting

- Treat embedded Svelte app pages as hosts for compiled bundles. Change app behavior, routes, and app-scoped styles in the source repo, rebuild/upload compiled bundle artifacts, and keep Jekyll pages as lightweight shell pages plus host-page CSS; do not patch generated bundle behavior or duplicate route content directly in Jekyll.

## Host Page Styling

- `full-width: true` uses the site's full-width Jekyll/Bootstrap layout. Keep embedded tools full-width, and scope page-local alignment overrides to surrounding page furniture rather than the chart unless requested.
- Embedded frontend Tailwind bundles are scoped under each app's wrapper class, so Tailwind utility classes on Jekyll wrapper elements outside that app scope will not apply. Use page CSS, inline CSS, or global site CSS for Jekyll wrapper elements.

## Documentation

- Keep README link behavior intentional and consistent. Use standard Markdown links by default, and use HTML anchors with `target="_blank"` and `rel="noopener noreferrer"` only when links should explicitly open in a new tab.
- When changes to Beautiful Jekyll files, site styling, or site functionality deviate from upstream Beautiful Jekyll, document the affected files and behavior in the README's `Deviations From Beautiful Jekyll` section in the same change.
- Before finishing changes that add or touch files in `_includes`, compare the include paths against upstream Beautiful Jekyll. Any current or future `_includes` file that is not present upstream must be documented in the README's `Deviations From Beautiful Jekyll` section.
- Keep `_includes` limited to files actually used by the site, based on features currently enabled in `_config.yml` plus integrations activated by visiting pages. The only include files that may remain present while unused by the active site are `_includes/social-networks-links.html`, `_includes/social-share.html`, `_includes/cloudflare_analytics.html`, `_includes/google_analytics.html`, `_includes/gtm_head.html`, and `_includes/gtm_body.html`. Delete any other unused include file together with its corresponding imports or integrations, and document each removal in the README's `Deviations From Beautiful Jekyll` section.

## Content

- Keep all tags alphabetized.

## Animated Thumbnail Assets

- Prefer focused, subject-only animations for thumbnails. Avoid recording the whole website, navbar, browser chrome, or long setup motion unless the user explicitly asks for that context.
- Use temporary tooling outside the repo, for example `npm install --prefix /private/tmp/<task-name> pngjs omggif upng-js`, to avoid changing site dependencies when generating one-off animation assets.
- Prefer APNG or WebP when smooth alpha fades over transparent backgrounds are important. GIF transparency is binary, so fading particles can become spotty even with more frames.
- For synthetic GIF animations, generate indexed frames directly with `omggif`; reserve palette index `0` for transparent black, pass `transparent: 0`, and use `disposal: 2` for each frame. Use `pngjs` for optional preview PNGs.
- Keep animated thumbnails small and reusable: square dimensions, short loops, deterministic seeds where randomness is involved, and output under `assets/img/` with a descriptive filename.
- When adapting an interactive effect into a thumbnail, capture or synthesize only the meaningful part of the effect, and make the loop long enough for the final event to finish before it resets.
- `assets/img/firework-launcher-demo.png` is generated as a transparent APNG rather than a GIF so the firework particles can fade smoothly with real alpha transparency.
- Create `assets/img/firework-launcher-demo.png` with temporary Node tooling outside the repo using `pngjs` for preview PNGs and `upng-js` for APNG encoding.
- Current `assets/img/firework-launcher-demo.png` animation settings: `360x360`, 20 synthetic fireworks, deterministic particle seeds, `284` frames, `50ms` per frame, and an evenly spaced launch schedule with seeded `+-35%` timing jitter.
- Use full-frame APNG replacement frames for `assets/img/firework-launcher-demo.png` while showing only the launcher effect, not the website, navbar, or browser chrome.
- For `assets/img/firework-launcher-demo.png`, treat margin as the horizontal no-launch zone only: explosions may enter the side regions, but intermediate firework launch centers must not. Use a `60px` no-launch margin on both sides of the `360px` canvas, launch the first and last fireworks from horizontal center x=`180`, and launch every intermediate firework at a seeded uniformly random x position from x=`60` through x=`300`.
- For `assets/img/firework-launcher-demo.png`, fire the first firework at frame `0`, calculate the last firework's launch frame so the final centered firework completes at the end of the loop, and place intermediate launches at evenly spaced frames with seeded `+-35%` jitter applied to each intermediate frame.

## Site Styling

- For site-local Jekyll links and asset paths, use the `relative_url` filter instead of concatenating `site.url`. Reserve `absolute_url` for metadata, feeds, canonical URLs, or other places that require a fully qualified URL.
- Prefer relative paths and `relative_url` for site-local links/assets over `site.*` values unless the output explicitly needs site configuration or a fully qualified URL.
- Keep color variables used in `assets/css/custom.css` aligned with the color variables defined in `_config.yml`. Prefer adding or updating the corresponding CSS custom property in `assets/css/beautifuljekyll.css` and referencing it with `var(...)` from `custom.css`, so `custom.css` remains valid plain CSS for editor tooling and Prettier.
