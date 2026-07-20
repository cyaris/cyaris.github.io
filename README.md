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
- `_includes/social-share.html`
  - Opens share links in new tabs.
  - Customizes LinkedIn, Facebook, and Twitter/X share icons.
- `_layouts/home.html`
  - Forces home-page refreshes back to the top of the page.
  - Filters listed posts by `page.type`.
  - Removes the "Posted on" label from post dates.
  - Formats tag links with non-breaking spaces and hyphens.
- `_layouts/page.html`
  - Adds the shared `github-badges.html` include to pages.
  - Adds the social-share include when `social-share` is enabled.
- `_layouts/post.html`
  - Adds the shared `github-badges.html` include to posts.
  - Uses separate desktop and mobile pagination labels.
  - Labels pagination links with `page.type`.
- `tags.html`
  - Removes the tag index.
  - Removes tag counts from tag headings.
