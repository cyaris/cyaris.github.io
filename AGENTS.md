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

## Animated Thumbnail Assets

- Prefer focused, subject-only animations for thumbnails. Avoid recording the whole website, navbar, browser chrome, or long setup motion unless the user explicitly asks for that context.
- Use temporary tooling outside the repo, for example `npm install --prefix /private/tmp/<task-name> pngjs omggif upng-js`, to avoid changing site dependencies when generating one-off animation assets.
- Prefer APNG or WebP when smooth alpha fades over transparent backgrounds are important. GIF transparency is binary, so fading particles can become spotty even with more frames.
- For synthetic GIF animations, generate indexed frames directly with `omggif`; reserve palette index `0` for transparent black, pass `transparent: 0`, and use `disposal: 2` for each frame. Use `pngjs` for optional preview PNGs.
- Keep animated thumbnails small and reusable: square dimensions, short loops, deterministic seeds where randomness is involved, and output under `assets/img/` with a descriptive filename.
- When adapting an interactive effect into a thumbnail, capture or synthesize only the meaningful part of the effect, and make the loop long enough for the final event to finish before it resets. For example, `assets/img/firework-launcher-demo.png` shows ten firework launches and bursts without the homepage, navbar, or browser chrome.

## Site Styling

- For site-local Jekyll links and asset paths, use the `relative_url` filter instead of concatenating `site.url`. Reserve `absolute_url` for metadata, feeds, canonical URLs, or other places that require a fully qualified URL.
