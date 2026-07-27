# cyaris.github.io

Welcome to my website! I hope you enjoy your stay.

## Development

### Upstream Theme

This repository tracks updates from [Beautiful Jekyll](https://github.com/daattali/beautiful-jekyll).

To configure:

```sh
git remote add upstream https://github.com/daattali/beautiful-jekyll.git
```

### Repository Metadata

To refresh project repository dates before a build:

```sh
npm run update:github-repos
```

The GitHub Actions build runs this automatically before Jekyll builds the site. The generated `_data/github_repos.yml` file is ignored locally.

## GitHub Actions Workflows

### `.github/workflows/ci.yml`

The `Beautiful Jekyll CI` workflow runs on pushes, pull requests, and manual dispatch. It installs Ruby dependencies
with Bundler and Appraisal, configures the GitHub Pages base path, generates `_data/github_repos.yml` from repository
front matter, builds the Jekyll site with `JEKYLL_ENV=production`, and uploads the Pages artifact.

The workflow can be dispatched from the GitHub Actions UI with **Actions > Beautiful Jekyll CI > Run workflow**. Manual
dispatch has no custom inputs. It can also be dispatched from the command line or GitHub API against `master`:

```sh
gh workflow run .github/workflows/ci.yml --ref master
```

### `.github/workflows/auto-release.yml`

The `Auto release` workflow runs after a pull request is closed and delegates to the shared
`cyaris/svelte-lib/.github/workflows/auto-release.yml` workflow only when that pull request was merged. It evaluates the
merge commit against `.github/release-policy.yml`, asks the configured OpenAI model whether the merge warrants a
release, publishes a GitHub release when warranted, and comments the outcome on the pull request.

The workflow can also be dispatched from the GitHub Actions UI with **Actions > Auto release > Run workflow**. Manual
dispatch accepts optional `release-sha`, `pr-number`, and `svelte-lib-ref` inputs; when `release-sha` is blank, it
evaluates the workflow SHA. Release runs require `OPENAI_API_KEY`; `RELEASE_TOKEN` and `CHECKOUT_TOKEN` can be provided
when the default token cannot create releases or read private repositories.

It can also be dispatched from the command line or GitHub API against `master`:

```sh
gh workflow run .github/workflows/auto-release.yml --ref master \
  -f release-sha=<commit-sha> \
  -f pr-number=<pull-request-number> \
  -f svelte-lib-ref=<ref>
```

## Additional Features

These site-local features are layered on top of Beautiful Jekyll. The `_includes` files listed here are not present in upstream Beautiful Jekyll.

- GitHub repository badges and dates
  - `_includes/github-repo-badges.html` renders linked follow, star, watch, and fork badges with accessible labels, GitHub icons, optional counts, repository creation dates, and latest default-branch commit dates.
  - `scripts/update-github-repo-dates.mjs` generates repository metadata for content files with `gh-repo` front matter.
  - `.github/workflows/ci.yml` refreshes the repository metadata before the Jekyll build, and `.gitignore` keeps the generated `_data/github_repos.yml` file local.
- S3-hosted app and document assets
  - `_includes/s3_url.html` builds S3 asset URLs from `site.s3_bucket`, supports bundle prefix substitution through `site.s3_bundle_prefix`, and adds build-time cache busting when configured.
  - `_includes/s3_asset.html` emits stylesheet and script tags for S3-hosted bundles, with optional runtime cache busting for mutable app bundles.
- Legacy project launch buttons
  - `_includes/project_button.html` renders a centered project link button for legacy project posts, deriving the target URL from the post title.
- Tableau gallery and dashboard embeds
  - `_includes/tableau_gallery.html` renders the reusable Tableau gallery and includes the local dashboard embeds.
  - `_includes/tableau_dashboards/cook_county_court_sentencing.html` embeds the Cook County Court Sentencing Tableau dashboard.
  - `_includes/tableau_dashboards/maryland_traffic_violations.html` embeds the Maryland Traffic Violations Tableau dashboard.

## Deviations From Beautiful Jekyll

- `404.html`
  - Uses custom 404 copy.
  - Uses `assets/img/evil_bialy.png` for the 404 image.
  - Uses the `image_404` class for local responsive image sizing.
  - Lazily decodes the 404 image.
- `assets/css/custom.css`
  - Overrides global typography, intro header heading spacing, emphasis opacity, and link colors.
  - Reads site colors through CSS variables emitted by `assets/css/beautifuljekyll.css` so the file remains valid plain CSS for editor tooling and Prettier.
  - Defines the reusable `.center` alignment utility.
  - Styles full-width embedded tool hosts inside Bootstrap breakpoints.
  - Customizes navbar sizing, avatar placement, toggler styling, dropdown behavior, responsive mobile/desktop launcher visibility, and firework cursor/image animations.
  - Adds horizontal image-scroll styling for the About Me page.
  - Adds contact form, Turnstile, status, honeypot, and mobile contact-page styles.
  - Customizes footer borders, link states, social icon sizing, Tableau icon placement, and responsive footer spacing.
  - Customizes post preview metadata, thumbnail sizing, title hover colors, and preview borders.
  - Aligns tag link styling and the post tag label with GitHub repo badges while keeping tag backgrounds transparent.
  - Places project page GitHub action badges and repository metadata badges in one left-aligned header row when space allows.
  - Shows tag pills on Blog and Projects listing pages.
  - Shows linked repository creation and latest default-branch commit date badges from generated GitHub repository metadata.
  - Keeps post preview thumbnails left of the title and subtitle on portrait mobile with smaller heading text.
  - Defines shared button styling for `.btn-group` and contact form buttons, including local focus-state overrides.
  - Customizes tag link, tags-page, and pagination styling, including desktop/mobile pagination text visibility.
  - Customizes social-share icon focus behavior.
  - Disables text selection on interactive site controls, social-share controls, and footer areas.
- `assets/css/beautifuljekyll.css`
  - Emits the site-specific color palette as CSS custom properties for downstream stylesheets.
  - Removes inactive upstream Disqus comment styling.
  - Removes inactive upstream navbar search overlay styling.
  - Removes inactive upstream GitHub button header styling.
- `assets/js/beautifuljekyll.js`
  - Removes the inactive upstream navbar search initializer.
- `_config.yml`
  - Renames the navbar text color setting to `navbar-link-col`.
  - Adds site-specific color variables for the navbar, page, links, post titles, footer, and social links.
  - Removes inactive upstream navbar search, comment-provider, and Matomo configuration stubs.
  - Excludes build-only repository scripts from the generated site.
- `_includes/footer.html`
  - Removes the bullet before the pretty URL.
  - Puts the pretty URL on a new line.
  - Removes the inactive Matomo opt-out link.
  - Opens the edit-page link in a new tab with `noopener noreferrer`.
  - Opens the Beautiful Jekyll attribution link in a new tab with `noopener noreferrer`.
- `_includes/head.html`
  - Adds PNG favicon links for shortcut and browser icons, plus a dedicated Apple touch icon.
  - Loads global firework launcher styles inside the document head.
  - Falls back to the site RSS description when generated page-description text still contains raw Liquid tags.
  - Removes inactive MathJax, Matomo, and Staticman stylesheet hooks.
- `_includes/header.html`
  - Simplifies header image class assignment.
  - Removes the "posted on" label from post dates.
  - Removes the inactive read-time include hook.
  - Shows GitHub action badges on project page headers whenever repository front matter is present, plus linked generated repository date badges when GitHub repository metadata is available.
- `_includes/nav.html`
  - Replaces the title/logo brand link with desktop and mobile firework launch controls.
  - Changes dropdown parent links to lowercase relative URLs.
  - Removes the right-aligned dropdown menu class.
  - Routes blank navbar links to the site root with `relative_url`.
  - Removes the inactive upstream navbar search link and overlay include.
- `_includes/social-networks-links.html`
  - Limits footer social networks to the configured set.
  - Routes email to the local contact page.
  - Opens external social links in new tabs with `noopener noreferrer`.
  - Uses custom icons for Kaggle and Instagram.
  - Uses a CSS-colorable inline Tableau icon.
  - Keeps the footer Tableau icon inline so CSS can recolor it; a colored standalone version lives at `assets/img/tableau-logo-color.svg`.
- `_includes/social-share.html`
  - Opens share links in new tabs with `noopener noreferrer`.
  - Customizes LinkedIn, Facebook, and Twitter/X share icons.
- `_layouts/base.html`
  - Loads global firework launcher scripts at the end of the body while their styles are emitted from `_includes/head.html`.
- `_layouts/home.html`
  - Forces home-page refreshes back to the top of the page.
  - Filters listed posts by `page.type`.
  - Renders a single left-aligned post thumbnail beside the post title and subtitle.
  - Lazily loads and asynchronously decodes post preview thumbnails.
  - Supports optional per-post `thumbnail-fit`, `thumbnail-position`, and `thumbnail-size` (`small` or `extra-small`) front matter for thumbnail crops and sizing.
  - Removes the "Posted on" label from post dates.
  - Shows tag pills on Blog and Projects listing pages.
  - Shows GitHub action badges on Projects listings whenever repository front matter is present, plus generated repository star counts and dates when GitHub repository metadata is available.
- `_layouts/page.html`
  - Adds the shared `github-repo-badges.html` include to pages.
  - Adds the social-share include when `social-share` is enabled.
  - Removes the inactive upstream comments include.
- `_layouts/post.html`
  - Adds the shared `github-repo-badges.html` include to posts.
  - Uses separate desktop and mobile pagination labels.
  - Labels pagination links with `page.type`.
  - Restricts previous/next pagination to posts with the same `type` as the current post.
  - Removes the inactive upstream comments include.
- `beautiful-jekyll-theme.gemspec`
  - Stops packaging the removed Staticman configuration.
  - Adds `bigdecimal` as an explicit runtime dependency for future Ruby compatibility.
- Removed inactive upstream integration files
  - Deletes `_includes/commentbox.html`, `_includes/comments.html`, `_includes/disqus.html`, `_includes/fb-comment.html`, `_includes/giscus-comment.html`, `_includes/mathjax.html`, `_includes/matomo.html`, `_includes/readtime.html`, `_includes/search.html`, `_includes/staticman-comment.html`, `_includes/staticman-comments.html`, and `_includes/utterances-comment.html`.
  - Deletes `assets/css/staticman.css`, `assets/data/searchcorpus.json`, `assets/js/staticman.js`, and `staticman.yml`.
- Removed inactive upstream minimal layout files
  - Deletes `_layouts/minimal.html`, `_includes/footer-minimal.html`, and `assets/css/beautifuljekyll-minimal.css`.
- `.gitignore`
  - Ignores generated GitHub repository metadata.
- `.github/workflows/ci.yml`
  - Generates GitHub repository metadata before the Jekyll build.
- `tags.html`
  - Removes the tag index.
  - Removes tag counts from tag headings.
