Welcome to my website! I hope you enjoy your stay.

## Development

This repository tracks updates from:

https://github.com/daattali/beautiful-jekyll

To configure:

git remote add upstream https://github.com/daattali/beautiful-jekyll.git

## Deviations From Beautiful Jekyll

- `404.html`
  - Uses custom 404 copy.
  - Uses `assets/img/evil_bialy.png` for the 404 image.
  - Uses the `image_404` class for local responsive image sizing.
- `assets/css/custom.css`
  - Overrides global typography, intro header heading spacing, emphasis opacity, and link colors.
  - Defines the reusable `.center` alignment utility.
  - Styles full-width embedded tool hosts and aligns their GitHub badges inside Bootstrap breakpoints.
  - Customizes navbar sizing, avatar placement, toggler styling, dropdown behavior, responsive mobile/desktop launcher visibility, and firework cursor/image animations.
  - Adds horizontal image-scroll styling for the About Me page.
  - Adds contact form, Turnstile, status, honeypot, and mobile contact-page styles.
  - Customizes footer borders, link states, social icon sizing, Tableau icon placement, and responsive footer spacing.
  - Customizes post preview metadata, thumbnail sizing, title hover colors, and preview borders.
  - Defines shared button styling for `.btn-group` and contact form buttons, including local focus-state overrides.
  - Customizes tag link, tags-page, and pagination styling, including desktop/mobile pagination text visibility.
  - Customizes social-share icon focus behavior.
  - Disables text selection on interactive site controls, social-share controls, and footer areas.
- `_config.yml`
  - Renames the navbar text color setting to `navbar-link-col`.
  - Adds site-specific color variables for the navbar, page, links, post titles, footer, and social links.
- `_includes/footer.html`
  - Removes the bullet before the pretty URL.
  - Puts the pretty URL on a new line.
  - Opens the edit-page link in a new tab.
  - Opens the Beautiful Jekyll attribution link in a new tab.
- `_includes/github-badges.html`
  - Adds the `no_selection` class to GitHub badge iframes.
  - Widens the star badge iframe.
- `_includes/head.html`
  - Adds `favicon.ico` links for shortcut, browser, and Apple touch icons.
- `_includes/header.html`
  - Simplifies header image class assignment.
  - Removes the "posted on" label from post dates.
- `_includes/nav.html`
  - Replaces the title/logo brand link with desktop and mobile firework launch controls.
  - Changes dropdown parent links to lowercase relative URLs.
  - Removes the right-aligned dropdown menu class.
  - Routes blank navbar links to the site root with `relative_url`.
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
- `_layouts/home.html`
  - Forces home-page refreshes back to the top of the page.
  - Filters listed posts by `page.type`.
  - Renders a single left-aligned post thumbnail beside the post title and subtitle.
  - Supports optional per-post `thumbnail-fit`, `thumbnail-position`, and `thumbnail-size` (`small` or `extra-small`) front matter for thumbnail crops and sizing.
  - Removes the "Posted on" label from post dates.
  - Formats tag links with non-breaking spaces and hyphens.
- `_layouts/page.html`
  - Adds the shared `github-badges.html` include to pages.
  - Adds the social-share include when `social-share` is enabled.
- `_layouts/post.html`
  - Adds the shared `github-badges.html` include to posts.
  - Uses separate desktop and mobile pagination labels.
  - Labels pagination links with `page.type`.
  - Restricts previous/next pagination to posts with the same `type` as the current post.
- `tags.html`
  - Removes the tag index.
  - Removes tag counts from tag headings.
