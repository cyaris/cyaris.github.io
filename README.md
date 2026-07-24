Welcome to my website! I hope you enjoy your stay.

## Development

This repository tracks updates from:

https://github.com/daattali/beautiful-jekyll

To configure:

git remote add upstream https://github.com/daattali/beautiful-jekyll.git

To refresh project repository dates before a build:

npm run update:github-repos

The GitHub Actions build runs this automatically before Jekyll builds the site. The generated `_data/github_repos.yml` file is ignored locally.

## Asset Generation

- `assets/img/firework-launcher-demo.png`
  - Generated as a transparent APNG rather than a GIF so the firework particles can fade smoothly with real alpha transparency.
  - Created with temporary Node tooling outside the repo using `pngjs` for preview PNGs and `upng-js` for APNG encoding.
  - Current animation settings: `360x360`, ten synthetic fireworks, deterministic particle seeds, `284` frames, `50ms` per frame, and launches spaced `20` frames apart.
  - The first and last fireworks launch from the center; the intermediate launches use wider side positions so the thumbnail feels active without showing the website, navbar, or browser chrome.

## Deviations From Beautiful Jekyll

- `404.html`
  - Uses custom 404 copy.
  - Uses `assets/img/evil_bialy.png` for the 404 image.
  - Uses the `image_404` class for local responsive image sizing.
- `assets/css/custom.css`
  - Overrides global typography, intro header heading spacing, emphasis opacity, and link colors.
  - Defines the reusable `.center` alignment utility.
  - Styles full-width embedded tool hosts inside Bootstrap breakpoints.
  - Customizes navbar sizing, avatar placement, toggler styling, dropdown behavior, responsive mobile/desktop launcher visibility, and firework cursor/image animations.
  - Adds horizontal image-scroll styling for the About Me page.
  - Adds contact form, Turnstile, status, honeypot, and mobile contact-page styles.
  - Customizes footer borders, link states, social icon sizing, Tableau icon placement, and responsive footer spacing.
  - Customizes post preview metadata, thumbnail sizing, title hover colors, and preview borders.
  - Places project page GitHub action pills and repository metadata pills in a left-aligned header stack.
  - Hides tags on Blog and Projects listing pages.
  - Shows linked repository creation and latest default-branch commit date pills from generated GitHub repository metadata.
  - Keeps post preview thumbnails left of the title and subtitle on portrait mobile with smaller heading text.
  - Defines shared button styling for `.btn-group` and contact form buttons, including local focus-state overrides.
  - Customizes tag link, tags-page, and pagination styling, including desktop/mobile pagination text visibility.
  - Customizes social-share icon focus behavior.
  - Disables text selection on interactive site controls, social-share controls, and footer areas.
- `assets/css/beautifuljekyll.css`
  - Removes inactive upstream Disqus comment styling.
  - Removes inactive upstream navbar search overlay styling.
- `assets/js/beautifuljekyll.js`
  - Removes the inactive upstream navbar search initializer.
- `_config.yml`
  - Renames the navbar text color setting to `navbar-link-col`.
  - Adds site-specific color variables for the navbar, page, links, post titles, footer, and social links.
  - Removes inactive upstream navbar search, comment-provider, and Matomo configuration stubs.
- `_includes/footer.html`
  - Removes the bullet before the pretty URL.
  - Puts the pretty URL on a new line.
  - Removes the inactive Matomo opt-out link.
  - Opens the edit-page link in a new tab.
  - Opens the Beautiful Jekyll attribution link in a new tab.
- `_includes/github-action-pills.html`
  - Adds site-native linked GitHub action pills for follow, star, watch, and fork actions.
  - Renders compact icon-only action pills with GitHub icons, action icons, accessible labels, and star counts from generated repository metadata.
- `_includes/github-repo-pills.html`
  - Renders linked repository creation and latest default-branch commit date pills from generated GitHub repository metadata.
- `_includes/head.html`
  - Adds `favicon.ico` links for shortcut, browser, and Apple touch icons.
  - Removes inactive MathJax, Matomo, and Staticman stylesheet hooks.
- `_includes/header.html`
  - Simplifies header image class assignment.
  - Removes the "posted on" label from post dates.
  - Removes the inactive read-time include hook.
  - Shows linked generated repository date pills instead of the post date on project page headers when GitHub repository metadata is available.
- `_includes/nav.html`
  - Replaces the title/logo brand link with desktop and mobile firework launch controls.
  - Changes dropdown parent links to lowercase relative URLs.
  - Removes the right-aligned dropdown menu class.
  - Routes blank navbar links to the site root with `relative_url`.
  - Removes the inactive upstream navbar search link and overlay include.
- `_includes/project_button.html`
  - Adds a centered project link button for legacy project posts.
- `_includes/s3_asset.html`
  - Emits S3-hosted stylesheet and script tags with optional bundle path rewriting and cache busting.
- `_includes/s3_url.html`
  - Builds S3 asset URLs, including bundle prefix substitution and build-time cache busting.
- `_includes/social-networks-links.html`
  - Limits footer social networks to the configured set.
  - Routes email to the local contact page.
  - Opens external social links in new tabs.
  - Uses custom icons for Kaggle and Instagram.
  - Uses a CSS-colorable inline Tableau icon.
  - Keeps the footer Tableau icon inline so CSS can recolor it; a colored standalone version lives at `assets/img/tableau-logo-color.svg`.
- `_includes/social-share.html`
  - Opens share links in new tabs.
  - Customizes LinkedIn, Facebook, and Twitter/X share icons.
- `_includes/tableau_dashboards/cook_county_court_sentencing.html`
  - Embeds the Cook County Court Sentencing Tableau dashboard.
- `_includes/tableau_dashboards/maryland_traffic_violations.html`
  - Embeds the Maryland Traffic Violations Tableau dashboard.
- `_includes/tableau_gallery.html`
  - Adds a reusable Tableau gallery section that includes the local dashboard embeds.
- `_layouts/home.html`
  - Forces home-page refreshes back to the top of the page.
  - Filters listed posts by `page.type`.
  - Renders a single left-aligned post thumbnail beside the post title and subtitle.
  - Supports optional per-post `thumbnail-fit`, `thumbnail-position`, and `thumbnail-size` (`small` or `extra-small`) front matter for thumbnail crops and sizing.
  - Removes the "Posted on" label from post dates.
  - Hides tags on Blog and Projects listing pages.
  - Shows generated repository dates on Projects listings when GitHub repository metadata is available.
- `_layouts/page.html`
  - Adds the shared `github-action-pills.html` include to pages.
  - Adds the social-share include when `social-share` is enabled.
  - Removes the inactive upstream comments include.
- `_layouts/post.html`
  - Adds the shared `github-action-pills.html` include to posts.
  - Uses separate desktop and mobile pagination labels.
  - Labels pagination links with `page.type`.
  - Restricts previous/next pagination to posts with the same `type` as the current post.
  - Removes the inactive upstream comments include.
- `beautiful-jekyll-theme.gemspec`
  - Stops packaging the removed Staticman configuration.
- Removed inactive upstream integration files
  - Deletes `_includes/commentbox.html`, `_includes/comments.html`, `_includes/disqus.html`, `_includes/fb-comment.html`, `_includes/giscus-comment.html`, `_includes/mathjax.html`, `_includes/matomo.html`, `_includes/readtime.html`, `_includes/search.html`, `_includes/staticman-comment.html`, `_includes/staticman-comments.html`, and `_includes/utterances-comment.html`.
  - Deletes `assets/css/staticman.css`, `assets/data/searchcorpus.json`, `assets/js/staticman.js`, and `staticman.yml`.
- Removed inactive upstream minimal layout files
  - Deletes `_layouts/minimal.html`, `_includes/footer-minimal.html`, and `assets/css/beautifuljekyll-minimal.css`.
- `scripts/update-github-repo-dates.mjs`
  - Generates repository metadata for all content files with `gh-repo` front matter.
  - Stores repository creation dates, latest default-branch commit dates, default branches, follower counts, and star counts.
- `.gitignore`
  - Ignores generated GitHub repository metadata.
- `.github/workflows/ci.yml`
  - Generates GitHub repository metadata before the Jekyll build.
- `tags.html`
  - Removes the tag index.
  - Removes tag counts from tag headings.
