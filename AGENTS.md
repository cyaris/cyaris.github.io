# Repository Guidance

## Embedded Project Pages

- `/us_gun_violence_forecasting/index.html` is a Jekyll host page for the compiled `us_gun_violence_forecasting` frontend bundle. Change chart/tool behavior in the source repo and rebuild/upload `frontend/dist/bundle.js` and `frontend/dist/bundle.css`; do not patch generated bundle behavior directly in Jekyll.
- Keep Tableau dashboard content split by dashboard under `_includes/tableau_dashboards/`. Each dashboard include should own its full `<section>`, heading text, descriptive copy, and iframe; `_includes/tableau_gallery.html` should only compose those dashboard includes.
- For embedded Svelte apps with simulated GitHub Pages routes, keep Jekyll pages as lightweight `.html` shell pages that mirror the source app routes and load the compiled bundle. Do not duplicate route content in Markdown or Jekyll; durable route content belongs in the source app repo.
- `full-width: true` uses the site's full-width Jekyll/Bootstrap layout. Keep embedded tools full-width, and scope page-local alignment overrides to surrounding page furniture rather than the chart unless requested.
- The embedded frontend's Tailwind bundle is scoped under `.us-gun-violence-forecasting`; Tailwind utility classes on Jekyll wrapper elements outside that app scope will not apply. Use page CSS, inline CSS, or global site CSS for Jekyll wrapper elements.
- Jekyll/Bootstrap idiosyncrasy overrides for embedded tools belong in the host page's `<style>` block when they do not affect the locally run Svelte app. Do not push host-only layout resets into the source Svelte component just to satisfy the Jekyll render.

## Documentation

- For README links that intentionally open a new tab, use an HTML anchor with `target="_blank"` and `rel="noopener noreferrer"`.

## Site Styling

- For site-local Jekyll links and asset paths, use the `relative_url` filter instead of concatenating `site.url`. Reserve `absolute_url` for metadata, feeds, canonical URLs, or other places that require a fully qualified URL.

## Legacy JavaScript Helpers

- Keep `assets/js/javascript_functions.js` and `assets/js/d3_functions.js` limited to helpers referenced by source pages or includes. Remove unused global helper definitions and stale commented-out calls instead of retaining dead helper code.
