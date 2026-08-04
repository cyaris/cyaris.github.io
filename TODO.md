# TODO

Follow-up items from the 2026-08-04 repository retrospective audit. These were left out of the initial
cleanup pass because each one is an externally observable (content, product, or UX) decision rather than a
mechanical fix, or because deleting files needs an explicit go-ahead first.

## Unreferenced image cleanup

Verified unreferenced anywhere in the repository (front matter, HTML, CSS, JS) and unreferenced since a very
old commit (`d53d5c4c`):

- `assets/img/pizza_cursor.png`
- `assets/img/topic_model_clusters_1.png`, `assets/img/topic_model_clusters_2.png`,
  `assets/img/topic_model_clusters_3.png`
- `assets/img/prophecy_topics_2.png` (`_1` and `_3` are referenced from `_posts/2018-11-18-post.md`; `_2` is
  not)
- `assets/img/bialy_2.png` (`bialy_1.png` is only referenced from a commented-out `_config.yml` line, so
  neither is currently live)
- `assets/img/kidpix_dynamite_eraser_2.png` (the plain, non-`_large` variant; `_1.png`, `_large_1.png`, and
  `_large_2.png` are all referenced)

Confirm none of these are needed before deleting.

## Needs a decision (externally observable behavior)

- **Twitter Card meta tags render an empty handle on every page.** `_includes/head.html:161-162` emits
  `<meta name="twitter:site" content="@">` and `<meta name="twitter:creator" content="@">` because
  `site.social-network-links.twitter` is never set in `_config.yml` (only `share-links-active.twitter: true`,
  a different setting, is set). Inherited unmodified from upstream Beautiful Jekyll. Decide whether to set a
  real handle or wrap both tags in `{% if site.social-network-links.twitter %}` to omit them.
- **Blank meta description on the two interactive tool pages.** `the_networks_of_war/tool.html` and
  `us_gun_violence_forecasting/tool.html` both set `description:` to an explicitly blank front-matter value,
  which renders `content=""` for `description`, `og:description`, and `twitter:description` in the built
  output (verified). Their sibling `index.html` pages render proper text (e.g. "A Svelte Network Analysis
  Tool"). This may have been intentional, to avoid `_includes/head.html`'s raw-Liquid-tag fallback path —
  confirm before writing real copy for these two pages.
- **Contact form silently reports success on a malformed response body.** `contact.html:248-255` catches a
  `JSON.parse` failure and falls back to `result = {}` with no logging or user-facing signal, then proceeds
  as if the submission succeeded (since the fallback only skips the `!response.ok` branch). Decide whether
  to surface a "something went wrong" error instead when the response body can't be parsed.
