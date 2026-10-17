# Repository Guidance

## Shared Conventions

- Inherit README and Markdown style, link verification, GitHub Actions, reusable workflow, release policy, dispatch,
  pull-request review and merge authorization, workflow failure, commit, release-management, and code style rules from
  the shared topics in `../shared-automation/agents/`, which `CLAUDE.md` imports:
  - `code-style.md`
  - `documentation.md`
  - `git-and-pull-requests.md`
  - `workflows.md`

## Embedded App Hosting

- `full-width: true` selects the site's full-width Jekyll/Bootstrap layout. Keep embedded tools full-width and scope
  page-local alignment overrides to surrounding page furniture unless the task targets the chart.

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

- Apply `../svelte-lib/agents/web-pages.md` to Jekyll and GitHub Pages, and record each adaptation in README
  `Search Metadata And Hosting`. Treat a gap with `../fantasy_playtime`'s search indexing, which follows the same
  topic, as an inconsistency to fix here, or to raise as a decision when the hosting difference makes it inapplicable.
- Keep `_config.yml`'s `url` set to the canonical `https://charlieyaris.com` origin so every canonical, `og:url`,
  `og:image`, sitemap, and `robots.txt` URL is absolute, and keep `scripts/test-seo.mjs` passing in the Pages build.
- Give project subpages titles that name their subpage. Write descriptions in the site owner's first-person voice,
  never as a third-person "Charlie Yaris is…" summary, since page titles already carry the name. Keep a page out of
  search with `sitemap: false`, which also emits `noindex, follow`, as for Mastermind's individual levels.
- Keep homepage `WebSite` and `Person` structured data and post `BlogPosting` structured data consistent with visible
  content and `_config.yml`.

## Content

- Keep all tags alphabetized and lowercase.

## JavaScript And HTML

- Follow `../svelte-lib/agents/javascript.md` for site JavaScript, Node scripts, embedded JavaScript, and HTML/Liquid
  templates, `../svelte-lib/agents/jekyll-hosting.md` for the shell pages that host embedded bundles, and
  `../svelte-lib/agents/web-pages.md` for search metadata and visible copy. `CLAUDE.md` imports all three. Repository-local rules override them.

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
