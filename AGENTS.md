# Repository Guidance

## Shared Conventions

- Inherit README and Markdown style, GitHub Actions, reusable workflow, pull-request review, workflow failure, commit,
  and release-management rules from `../shared-automation/AGENTS.md`.

## Embedded App Hosting

- Treat embedded Svelte app pages as hosts for compiled bundles. Change behavior, routes, and app-scoped styles in the
  source repository, rebuild and upload the bundle, and keep Jekyll pages as lightweight shells with host-page CSS. Do
  not patch generated bundle behavior or duplicate route content in Jekyll.
- `full-width: true` selects the site's full-width Jekyll/Bootstrap layout. Keep embedded tools full-width and scope
  page-local alignment overrides to surrounding page furniture unless the task targets the chart.
- Frontend Tailwind bundles apply only below each app wrapper. Use page CSS, inline CSS, or global site CSS for Jekyll
  elements outside that scope.

## Documentation

- Preserve `NAVBAR-SESSION-NOTES.md` as an intentional historical recovery record for the reverted 2026-08-05
  navbar work. Keep it versioned but excluded from the generated site, and do not rewrite or remove it unless the user
  explicitly requests that change.
- After changing a Beautiful Jekyll-derived file or adding site behavior that differs from upstream, update the affected
  subsection under README `Deviations From Beautiful Jekyll` in the same change—even for a one-line fix.
- When adding or changing `_includes`, compare each path with upstream Beautiful Jekyll. Document site-only includes in
  README `Additional Features`; document changed or removed upstream includes and behaviors under `Deviations From
  Beautiful Jekyll`.
- Keep `_includes` limited to files the active configuration or a reachable integration uses. Only
  `social-networks-links.html`, `cloudflare_analytics.html`, `google_analytics.html`, `gtm_head.html`, and
  `gtm_body.html` may remain while inactive. Remove any other unused include with its imports or integration and record
  the removal under `Deviations From Beautiful Jekyll`.
- Keep S3 asset include paths literal so `scripts/generate-s3-asset-versions.mjs` can discover them. When a dynamic path
  is necessary, add it to an explicit generator registry rather than omitting it from version generation.

## Search Metadata

- Mirror `../fantasy_playtime`'s search-indexing approach, recorded in its `AGENTS.md` `Feature Overview And SEO`
  section and its README `Production hosting` section, adapted to Jekyll and GitHub Pages. Treat a gap between the two
  sites as an inconsistency to fix here, or to raise as a decision when the hosting difference makes it inapplicable,
  and update README `Search Metadata And Hosting` with each adaptation.
- Keep `_config.yml`'s `url` set to the canonical `https://charlieyaris.com` origin so every canonical, `og:url`,
  `og:image`, sitemap, and `robots.txt` URL is absolute, and keep `scripts/test-seo.mjs` passing in the Pages build.
- Give every indexable page a distinct title and a truthful description of its visible content, and give project
  subpages titles that name their subpage. Keep contact, error, and duplicate-variant pages, such as Mastermind's
  individual levels, out of search with `sitemap: false`, which also emits `noindex, follow`.
- Keep homepage `WebSite` and `Person` structured data and post `BlogPosting` structured data consistent with visible
  content and `_config.yml`.
- Never add hidden, transparent, off-screen, zero-size, or `sr-only` copy for search engines. Search copy for an
  embedded app's own content belongs in that app's source repository, per Embedded App Hosting.

## Content

- Keep all tags alphabetized and lowercase.

## JavaScript And HTML

- Follow the JavaScript- and HTML-relevant formatting, dependency-ownership, lightweight-shell, and single-use guidance
  from `../svelte-lib/AGENTS.md` for site JavaScript, Node scripts, embedded JavaScript, and HTML/Liquid templates.
  Repository-local rules override it. Apply Svelte, embedded-app, package-export, or library rules only to comparable
  code.

## Animated Thumbnail Assets

- Prefer focused, subject-only, square animations with short loops and deterministic behavior. Avoid the full website,
  navbar, browser chrome, or long setup motion unless the user asks for that context.
- Encode every APNG with an `acTL` play count of `0` so it loops infinitely, including conversions from finite source
  animations.
- Keep one-off generation dependencies outside the repository. Prefer APNG or WebP for smooth transparency; GIF alpha
  is binary. Store final thumbnails under `assets/img/` with descriptive names.
- Record reproducible source data or effects, tooling, dimensions, timing, seeds, animation phases, encoding,
  verification, preserved assets, and intentional source-app deviations in
  `docs/animated-thumbnail-generation.md`. Update that document whenever regenerating or adding an animated thumbnail.

## Site Styling

- Use relative paths and Jekyll's `relative_url` filter for site-local links and assets. Reserve `absolute_url` for
  metadata, feeds, canonical URLs, and other outputs that require a fully qualified URL.
- Keep Beautiful Jekyll-derived CSS and JavaScript aligned with the current upstream remote branch. Do not add
  site-specific CSS declarations to `assets/css/beautifuljekyll.css` or site-specific JavaScript behavior to
  `assets/js/beautifuljekyll.js` unless an upstream breaking change or another applicable `AGENTS.md` instruction
  requires the change. Put site-specific CSS, including config-backed runtime color fallbacks, in
  `assets/css/custom.css`, and put site-specific JavaScript in `assets/js/custom.js`; the custom files load after their
  Beautiful Jekyll counterparts. Removing upstream code made stale by an inactive integration remains allowed.
- Keep one-page CSS in that page. Move styles to `assets/css/custom.css` when more than one page needs them.
- Keep mobile blog tag links hidden unless the user approves showing them. Preserve compact mobile sizing and wrapping
  rules so removing `display: none` later yields usable tag pills.
- Keep `assets/css/custom.css` color variables aligned with `_config.yml`, including complete runtime theme definitions
  and their plain-CSS fallbacks.

## Local Workflow Ownership

- Keep the root `Pages` workflow local unless another Jekyll site begins sharing the same build behavior.
