# Repository Guidance

## Embedded App Hosting

- Treat embedded Svelte app pages as hosts for compiled bundles. Change app behavior, routes, and app-scoped styles in the source repo, rebuild/upload compiled bundle artifacts, and keep Jekyll pages as lightweight shell pages plus host-page CSS; do not patch generated bundle behavior or duplicate route content directly in Jekyll.

## Host Page Styling

- `full-width: true` uses the site's full-width Jekyll/Bootstrap layout. Keep embedded tools full-width, and scope page-local alignment overrides to surrounding page furniture rather than the chart unless requested.
- Embedded frontend Tailwind bundles are scoped under each app's wrapper class, so Tailwind utility classes on Jekyll wrapper elements outside that app scope will not apply. Use page CSS, inline CSS, or global site CSS for Jekyll wrapper elements.

## Documentation

- Keep README link behavior intentional and consistent. Use standard Markdown links by default, and use HTML anchors with `target="_blank"` and `rel="noopener noreferrer"` only when links should explicitly open in a new tab.
- When site styling or functionality changes deviate from Beautiful Jekyll, update the README's `Deviations From Beautiful Jekyll` section in the same change.

## Site Styling

- For site-local Jekyll links and asset paths, use the `relative_url` filter instead of concatenating `site.url`. Reserve `absolute_url` for metadata, feeds, canonical URLs, or other places that require a fully qualified URL.
