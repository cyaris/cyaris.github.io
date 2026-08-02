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

### S3 Asset Versions

To refresh S3 asset versions for a local build without AWS access:

```sh
npm run update:s3-assets
```

The local command writes stable fallback versions derived from each S3 object key. The fallback keeps repeated local and pull-request builds deterministic, but it does not prove that an S3 object exists and does not reflect object replacements.

To query S3 metadata instead, run the same command in AWS mode:

```sh
S3_ASSET_VERSION_MODE=aws npm run update:s3-assets
```

For a staged bundle build, pass the testing filename prefix as an environment variable:

```sh
S3_BUNDLE_PREFIX=test_ S3_ASSET_VERSION_MODE=aws npm run update:s3-assets
```

The AWS-mode command reads `s3_bucket` and `s3_bundle_prefix` from `_config.yml` unless `S3_BUCKET`, `AWS_REGION`, `AWS_PROFILE`, or `S3_BUNDLE_PREFIX` override those values. The generated `_data/generated_s3_assets.yml` file is ignored locally.

## Additional Features

These site-local features are layered on top of Beautiful Jekyll. The `_includes` files listed here are not present in upstream Beautiful Jekyll.

### GitHub Repository Badges And Dates

- `_includes/github-repo-badges.html` renders linked follow, star, watch, and fork badges with accessible labels, GitHub icons, optional counts, repository creation dates, and latest default-branch commit dates.
- `scripts/update-github-repo-dates.mjs` generates repository metadata for content files with `gh-repo` front matter.
- `.github/workflows/pages.yml` refreshes the repository metadata before the Jekyll build and deploys `master` builds to GitHub Pages, while `.gitignore` keeps the generated `_data/github_repos.yml` file local.

### S3-Hosted App And Document Assets

`_includes/s3_asset.html` builds S3 asset URLs from `site.s3_bucket`, supports bundle prefix substitution through `site.s3_bundle_prefix`, appends object-version cache busting from `_data/generated_s3_assets.yml`, and emits stylesheet or script tags when a page passes a `type`.

`scripts/generate-s3-asset-versions.mjs` discovers literal `{% include s3_asset.html %}` calls in the Jekyll source, resolves the exact S3 object key that the include will serve, and writes each key's current version data before Jekyll builds. The generated data uses S3 as the source of truth and never queries upstream app repositories. No manually registered assets are currently required; a future dynamic include path should be converted to a literal include path or paired with an explicit registry in the generator instead of being silently omitted.

The version value comes from the strongest S3 metadata field available:

- `VersionId` when bucket versioning returns a current object version
- `ETag` when `VersionId` is absent or `null`
- `LastModified` plus `ContentLength` when neither S3 versioning nor ETag metadata is available

Version values are normalized for URL query strings before Jekyll reads them. Production bundles such as `mastermind/bundle.js` and testing bundles such as `mastermind/test_bundle.js` are separate S3 keys because `test_` is a filename prefix, not a directory prefix.

Jekyll cannot rely on S3 cache metadata alone because a browser or intermediary cache may keep serving an unchanged URL until its cache lifetime expires. The site appends `?v=<s3-object-version>` so the HTML URL changes when the S3 object changes, while unchanged objects keep identical URLs across daily builds.

The daily Pages build remains enabled so manually uploaded S3 files, such as `pdf/resume/Charlie_Yaris_Resume.pdf` and certification PDFs, are detected even when no upstream GitHub workflow runs. After an urgent manual upload, dispatch the `Pages` workflow from **Actions > Pages > Run workflow** or with:

```sh
gh workflow run .github/workflows/pages.yml --ref master
```

AWS-mode generation needs permission to read object metadata for the referenced keys in `s3://cyaris.github.io`, such as `s3:GetObject` for `arn:aws:s3:::cyaris.github.io/*`, through the same OIDC role or static AWS access-key fallback used by the S3 upload workflows. Missing production objects fail before the Jekyll build and identify the missing key.

Versioned S3 assets may use long-lived cache metadata, for example `Cache-Control: public, max-age=31536000, immutable`, because the page URL changes on object replacement. Rollup callers can pass that value through the shared `cache-control` input while preserving `bundle.js`, `bundle.css`, `test_bundle.js`, and `test_bundle.css` names. Directly uploaded PDFs, images, and APNG files should have their S3 metadata refreshed during upload or with an in-place `aws s3 cp` metadata replacement, but successful cache invalidation still depends on the generated query version rather than cache headers alone.

### Legacy Project Launch Buttons

`_includes/project_button.html` renders a centered project link button for legacy project posts, deriving the target URL from the post title.

### Animated Project Thumbnails

Project listing thumbnails can render generated square APNG assets under `assets/img/`; `assets/img/networks-war-demo.png` animates the Networks of War project card while the legacy `assets/img/networks-war-globe-thumbnail.png` remains preserved in the repository.

### Tableau Gallery And Dashboard Embeds

- `_includes/tableau_gallery.html` renders the reusable Tableau gallery and includes the local dashboard embeds.
- `_includes/tableau_dashboards/cook_county_court_sentencing.html` embeds the Cook County Court Sentencing Tableau dashboard.
- `_includes/tableau_dashboards/maryland_traffic_violations.html` embeds the Maryland Traffic Violations Tableau dashboard.

## Deviations From Beautiful Jekyll

### `404.html`

- Customizes 404 copy
- Displays `assets/img/evil_bialy.png` for the 404 image
- Applies the `image_404` class for local responsive image sizing
- Lazily decodes the 404 image

### `assets/css/custom.css`

- Overrides global typography, intro header heading spacing, emphasis opacity, and link colors
- Reads site colors through CSS variables emitted by `assets/css/beautifuljekyll.css` so the file remains valid plain CSS for editor tooling and Prettier
- Defines the reusable `.center` alignment utility
- Styles full-width embedded tool hosts inside Bootstrap breakpoints
- Customizes navbar sizing, avatar placement, toggler styling, dropdown behavior, responsive mobile/desktop launcher visibility, and firework cursor/image animations
- Adds horizontal image-scroll styling for the About Me page
- Adds contact form, Turnstile, status, honeypot, and mobile contact-page styles
- Customizes footer borders, link states, social icon sizing, Tableau icon placement, and responsive footer spacing
- Customizes post preview metadata, thumbnail sizing, title hover colors, and preview borders
- Aligns tag link styling, tag label styling, and tag pill vertical spacing with GitHub repo badges using shared preview pill color variables
- Places project page GitHub action badges and repository metadata badges in one left-aligned header row when space allows
- Shows tag pills on Blog and Projects listing pages on desktop and hides post/listing tag pills on mobile
- Shows linked repository creation and latest default-branch commit date badges from generated GitHub repository metadata
- Keeps post preview thumbnails left of the title and subtitle on portrait mobile with smaller heading text
- Defines shared button styling for `.btn-group` and contact form buttons, including local focus-state overrides
- Customizes tag link, tags-page, and pagination styling, including desktop/mobile pagination text visibility
- Customizes social-share icon focus behavior
- Disables text selection on interactive site controls, social-share controls, and footer areas

### `assets/css/beautifuljekyll.css`

- Emits the site-specific color palette as CSS custom properties for downstream stylesheets
- Removes inactive upstream Disqus comment styling
- Removes inactive upstream navbar search overlay styling
- Removes inactive upstream GitHub button header styling

### `assets/js/beautifuljekyll.js`

`assets/js/beautifuljekyll.js` removes the inactive upstream navbar search initializer.

### `_config.yml`

- Renames the navbar text color setting to `navbar-link-col`
- Adds site-specific color variables for the navbar, page, links, post titles, preview pills, footer, and social links
- Removes inactive upstream navbar search, comment-provider, and Matomo configuration stubs
- Excludes build-only repository scripts from the generated site

### `_includes/footer.html`

- Removes the bullet before the pretty URL
- Puts the pretty URL on a new line
- Removes the inactive Matomo opt-out link
- Opens the edit-page link in a new tab with `noopener noreferrer`
- Opens the Beautiful Jekyll attribution link in a new tab with `noopener noreferrer`

### `_includes/head.html`

- Adds PNG favicon links for shortcut and browser icons, plus a dedicated Apple touch icon
- Loads global firework launcher styles inside the document head
- Falls back to the site RSS description when generated page-description text still contains raw Liquid tags
- Removes inactive MathJax, Matomo, and Staticman stylesheet hooks

### `_includes/header.html`

- Simplifies header image class assignment
- Removes the "posted on" label from post dates
- Removes the inactive read-time include hook
- Shows GitHub action badges on project page headers whenever repository front matter is present, plus linked generated repository date badges when GitHub repository metadata exists

### `_includes/nav.html`

- Replaces the title/logo brand link with desktop and mobile firework launch controls
- Changes dropdown parent links to lowercase relative URLs
- Removes the right-aligned dropdown menu class
- Routes blank navbar links to the site root with `relative_url`
- Removes the inactive upstream navbar search link and overlay include

### `_includes/social-networks-links.html`

- Limits footer social networks to the configured set
- Routes email to the local contact page
- Opens external social links in new tabs with `noopener noreferrer`
- Adds custom icons for Kaggle and Instagram
- Adds a CSS-colorable inline Tableau icon
- Keeps the footer Tableau icon inline so CSS can recolor it; a colored standalone version lives at `assets/img/tableau-logo-color.svg`

### `_includes/social-share.html`

- Opens share links in new tabs with `noopener noreferrer`
- Customizes LinkedIn, Facebook, and Twitter/X share icons

### `_layouts/base.html`

`_layouts/base.html` loads global firework launcher scripts at the end of the body while their styles are emitted from `_includes/head.html`.

### `_layouts/home.html`

- Forces home-page refreshes back to the top of the page
- Filters listed posts by `page.type`
- Renders a single left-aligned post thumbnail beside the post title and subtitle
- Lazily loads and asynchronously decodes post preview thumbnails
- Supports optional per-post `thumbnail-fit`, `thumbnail-position`, and `thumbnail-size` (`small` or `extra-small`) front matter for thumbnail crops and sizing
- Removes the "Posted on" label from post dates
- Shows tag pills on Blog and Projects listing pages on desktop and hides post/listing tag pills on mobile
- Shows GitHub action badges on Projects listings whenever repository front matter is present, plus generated repository star counts and dates when GitHub repository metadata exists

### `_layouts/page.html`

- Adds the shared `github-repo-badges.html` include to pages
- Adds the social-share include when `social-share` is enabled
- Removes the inactive upstream comments include

### `_layouts/post.html`

- Adds the shared `github-repo-badges.html` include to posts
- Defines separate desktop and mobile pagination labels
- Labels pagination links with `page.type`
- Restricts previous/next pagination to posts with the same `type` as the current post
- Removes the inactive upstream comments include

### `beautiful-jekyll-theme.gemspec`

- Stops packaging the removed Staticman configuration
- Adds `bigdecimal` as an explicit runtime dependency for future Ruby compatibility

### Removed Inactive Upstream Integration Files

- Deletes `_includes/commentbox.html`, `_includes/comments.html`, `_includes/disqus.html`, `_includes/fb-comment.html`, `_includes/giscus-comment.html`, `_includes/mathjax.html`, `_includes/matomo.html`, `_includes/readtime.html`, `_includes/search.html`, `_includes/staticman-comment.html`, `_includes/staticman-comments.html`, and `_includes/utterances-comment.html`
- Deletes `assets/css/staticman.css`, `assets/data/searchcorpus.json`, `assets/js/staticman.js`, and `staticman.yml`

### Removed Inactive Upstream Minimal Layout Files

Deletes `_layouts/minimal.html`, `_includes/footer-minimal.html`, and `assets/css/beautifuljekyll-minimal.css`.

### `.gitignore`

`.gitignore` ignores generated GitHub repository metadata and generated S3 asset version data.

### `.github/workflows/pages.yml`

`.github/workflows/pages.yml` generates GitHub repository metadata and S3 asset version data before the Jekyll build, then deploys `master` builds to GitHub Pages with GitHub Actions.

### `tags.html`

- Removes the tag index
- Removes tag counts from tag headings

## GitHub Actions Workflows

Local wrappers that delegate to `cyaris/shared-automation` link to the
[shared-automation workflow reference](https://github.com/cyaris/shared-automation#workflows) for reusable workflow
behavior, inputs, and secrets.

### `.github/workflows/pages.yml`

The `Pages` workflow runs on pushes to `master`, pull requests, manual dispatch, and the daily 8:00 AM America/Chicago
schedule. It installs Ruby dependencies with Bundler and Appraisal, configures the GitHub Pages base path, generates
`_data/github_repos.yml` from repository front matter, generates `_data/generated_s3_assets.yml` from current S3 object
metadata or deterministic pull-request fallback data, builds the Jekyll site with `JEKYLL_ENV=production`, and uploads the
Pages artifact. Runs on `master` also deploy that artifact to GitHub Pages through `actions/deploy-pages`.

Scheduled and `master` builds require `AWS_ROLLUP_UPLOAD_ROLE_ARN` or the `AWS_ACCESS_KEY_ID` and
`AWS_SECRET_ACCESS_KEY` secrets so `scripts/generate-s3-asset-versions.mjs` can call `aws s3api head-object` for every
referenced S3 object. Pull-request builds use stable local fallback values to keep preview validation available without
AWS credentials.

The workflow can be dispatched from the GitHub Actions UI with **Actions > Pages > Run workflow**. Manual dispatch has no
custom inputs. It can also be dispatched from the command line or GitHub API against `master`:

```sh
gh workflow run .github/workflows/pages.yml --ref master
```

### `.github/workflows/auto-release.yml`

The `Auto release` workflow runs from manual dispatch only and calls the
[shared auto-release workflow](https://github.com/cyaris/shared-automation#githubworkflowsauto-releaseyml). This
repository contributes `.github/release-policy.yml` overrides to the shared release policy. Release creation or
existing-release updates require reviewing the generated plan and explicitly enabling publication for an approved run.

It can also be dispatched from the command line or GitHub API against `master`:

```sh
gh workflow run .github/workflows/auto-release.yml --ref master \
  -f release-sha=<commit-sha> \
  -f publish=true \
  -f update-existing=true
```

### `.github/workflows/workflow-validation.yml`

The `Workflow validation` workflow runs on local workflow and automation configuration changes, then calls the
[shared workflow-validation workflow](https://github.com/cyaris/shared-automation#githubworkflowsworkflow-validationyml)
to validate the repository-owned Pages workflow, release-policy configuration, and Renovate configuration.
