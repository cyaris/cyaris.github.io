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

The GitHub Actions build runs this automatically before Jekyll builds the site. Git ignores the generated
`_data/github_repos.yml` file locally.

### S3 Asset Versions

To refresh S3 asset versions for a local build without AWS access:

```sh
npm run update:s3-assets
```

The local command writes stable fallback versions derived from each S3 object key. The fallback keeps repeated local and `dev` builds deterministic, but it does not prove that an S3 object exists and does not reflect object replacements.

To query S3 metadata instead, run the same command in AWS mode:

```sh
S3_ASSET_VERSION_MODE=aws npm run update:s3-assets
```

For a staged bundle build, pass the testing filename prefix as an environment variable:

```sh
S3_BUNDLE_PREFIX=test_ S3_ASSET_VERSION_MODE=aws npm run update:s3-assets
```

The AWS-mode command reads `s3_bucket` and `s3_bundle_prefix` from `_config.yml`. These environment variables can
override configuration or AWS selection:

- `S3_BUCKET`
- `AWS_REGION`
- `AWS_PROFILE`
- `S3_BUNDLE_PREFIX`

Git ignores the generated `_data/generated_s3_assets.yml` file locally.

## Additional Features

These site-local features are layered on top of Beautiful Jekyll. The `_includes` files listed here are not present in upstream Beautiful Jekyll.

### GitHub Repository Badges And Dates

- `_includes/github-repo-badges.html` renders repository badges and metadata:
  - accessible GitHub icons and labels
  - follow, fork, star, and watch links
  - latest default-branch commit dates
  - optional counts
  - repository creation dates
- The `badge-position` and `badge-alignment` front matter parameters (see [Custom Front Matter Parameters](#custom-front-matter-parameters)) control where the badge row sits on the page and how it's aligned.
- `scripts/update-github-repo-dates.mjs` generates repository metadata for content files with `gh-repo` front matter and project cards with `gh-repo` data.
- `.github/workflows/pages.yml` refreshes the repository metadata before the Jekyll build and deploys `master` builds to GitHub Pages, while `.gitignore` keeps the generated `_data/github_repos.yml` file local.

### S3-Hosted App And Document Assets

`_includes/s3_asset.html` handles these S3-hosted asset responsibilities:

- builds URLs from `site.s3_bucket`
- substitutes the bundle prefix from `site.s3_bundle_prefix`
- appends object-version cache busting from `_data/generated_s3_assets.yml`
- emits a stylesheet or script tag from the supplied `type`
- defers scripts so surrounding page controls remain available while a shared, accessible, reduced-motion-aware loading
  indicator tracks bundle completion or failure

Background-only scripts pass `loading=false` to suppress the indicator. The reveal delay prevents fast loads from ever
showing it, and the indicator is removed the instant the script finishes loading or fails so it never lingers over
already-rendered bundle content.

The reveal delay comes from the shared `loading_reveal_delay_ms` `_config.yml` parameter, which defaults to `200`
milliseconds.

`scripts/generate-s3-asset-versions.mjs` discovers literal `{% include s3_asset.html %}` calls in the Jekyll source,
resolves the exact S3 object key that each include serves, and writes current version data before Jekyll builds. The
generated data treats S3 as the source of truth and never queries upstream app repositories. All current include paths
are literal, so the generator needs no manually registered assets.

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

Versioned S3 assets may use long-lived cache metadata, for example
`Cache-Control: public, max-age=31536000, immutable`, because the page URL changes on object replacement. Rollup
callers can pass that value through the shared `cache-control` input while preserving these names:

- `bundle.js`
- `bundle.css`
- `test_bundle.js`
- `test_bundle.css`

Refresh S3 metadata for directly uploaded PDFs, images, and APNG files during upload or with an in-place `aws s3 cp`
metadata replacement. Successful invalidation still depends on the generated query version rather than cache headers.

### Content Image Loading Indicator

`_includes/content-image-loading.html` scans post/page body `<img>` elements once the surrounding content has rendered and, for any still loading, wraps it with the shared, accessible, reduced-motion-aware loading indicator until it loads or fails. Post preview thumbnails (`_layouts/home.html`) and full-width embedded tool hosts already manage their own loading state and are skipped.

The reveal delay prevents fast loads from ever showing the indicator and comes from the shared
`loading_reveal_delay_ms` `_config.yml` parameter, which defaults to `200` milliseconds.

### Project Cards And Tags

`_data/projects.yml` controls:

- Projects page card order and destinations
- project metadata and tags
- projects shown in the Projects navbar dropdown

### Animated Project Thumbnails

Project listing thumbnails can render generated square APNG assets under `assets/img/`; `assets/img/networks-war-demo.png` animates the Networks of War project card while the legacy `assets/img/networks-war-globe-thumbnail.png` remains preserved in the repository.

The thumbnail generation process derives `assets/img/profile-photo-thumbnail.png` from
`../profile_photo/frontend/src/lib/static/pixels.json`, so the Profile Photo project card shows the app's pixelated
overlay state.

### Tableau Gallery And Dashboard Embeds

- `_includes/tableau_gallery.html` renders the reusable Tableau gallery and includes the local dashboard embeds.
- `_includes/tableau_dashboards/cook_county_court_sentencing.html` embeds the Cook County Court Sentencing Tableau dashboard.
- `_includes/tableau_dashboards/maryland_traffic_violations.html` embeds the Maryland Traffic Violations Tableau dashboard.

### Homepage Action Buttons

`index.html` adds homepage portrait navigation buttons that reuse the site's shared `.btn-group` button styling.

## Custom Front Matter Parameters

These YAML front matter parameters are site-local additions layered on top of Beautiful Jekyll's own
[supported parameters](https://github.com/daattali/beautiful-jekyll#supported-parameters).

| Parameter | Description |
| - | - |
| `type` | Groups a blog post or a `layout: home` listing page into a content type. Each post in `_posts` sets `type: post`; `blog.html` sets `type: post` to list them, while `projects.html` sets `type: project` to list `_data/projects.yml` cards instead. `_layouts/post.html` also uses it to scope "previous/next" pagination to posts sharing the same type. |
| `project-id` | Links a `layout: page` project page to its matching `_data/projects.yml` entry. Enables "previous/next project" pagination in the same order as the Projects listing and applies the project header sizing class in `_includes/header.html`. |
| `description` | Optional per-page meta-description fallback that `_includes/head.html` reads after `share-description` and before `subtitle` when building the page's `<meta name="description">`, Open Graph, and Twitter description tags. |
| `badge-position` | Set alongside `gh-repo` to control whether `_includes/github-repo-badges.html` renders above (`top`) or below (`bottom`) the page content. Defaults to `top` for both project pages and blog posts. |
| `badge-alignment` | Set alongside `gh-repo` to control whether the GitHub badges row is left-aligned (`left`) or centered (`center`). Defaults to `center` on project pages and `left` on blog posts. |
| `thumbnail-fit` | Optional per-post CSS `object-fit` value (eg. `contain`, `cover`) for the blog listing thumbnail. Defaults to `contain`. |
| `thumbnail-position` | Optional per-post CSS `object-position` value for the blog listing thumbnail. Defaults to `center center`. |
| `thumbnail-size` | Optional per-post thumbnail size on the blog listing: `normal`, `small`, or `extra-small`. Defaults to `normal`. |

## Deviations From Beautiful Jekyll

### `404.html`

- Customizes 404 copy
- Displays `assets/img/evil_bialy.png` for the 404 image
- Applies the `image_404` class for local responsive image sizing
- Lazily decodes the 404 image

### `about_me.html`

- Defines page-local horizontal image-scroll styling for the About Me gallery

### `assets/css/custom.css`

- Disables horizontal edge-swipe browser back/forward navigation and double-tap-to-zoom site-wide, and clips intentional Profile Photo animation overflow at the viewport edge
- Matches page-header title/subtitle separators to the surrounding text color
- Overrides global typography, intro header title/subtitle/date sizing and spacing, emphasis opacity, and link colors
- Reads site colors through CSS variables emitted by `assets/css/beautifuljekyll.css` so the file remains valid plain CSS for editor tooling and Prettier
- Defines the reusable `.center` alignment utility
- Styles the shared asset-loading indicator, including S3 app-bundle, post-thumbnail, and body-content-image placement and reduced-motion states
- Styles full-width embedded tool hosts inside Bootstrap breakpoints
- Customizes navbar presentation and behavior:
  - avatar placement, crop scaling, expanded-menu movement, homepage-only expanded-menu fading, and ring border
  - dropdown behavior, including 40 px mobile touch rows with proportionally scaled type
  - firework cursor frame swaps and image animation styling, including reduced-motion handling
  - mobile expanded-menu scrolling and body scroll locking
  - navbar sizing and drop-shadow depth
  - responsive mobile/desktop launcher visibility
  - toggler styling
- Customizes footer borders, link states, social icon sizing, Tableau icon placement, and responsive footer spacing
- Customizes post preview title, subtitle, metadata, thumbnail sizing, title hover colors, and preview borders
- Aligns tag link styling, tag label styling, and tag pill vertical spacing with GitHub repo badges using shared preview pill color variables
- Places project page and blog post GitHub action badges and repository metadata badges in one row, with an optional centered layout for the `badge-alignment: center` modifier
- Shows tag pills on Blog and Projects listing pages on desktop and hides post/listing tag pills on mobile
- Shows linked repository creation and latest default-branch commit date badges from generated GitHub repository metadata
- Keeps post preview thumbnails left of the title and subtitle on portrait mobile with smaller heading text
- Defines shared button styling for `.btn-group`, including explicit 800 font weight and local focus-state overrides
- Customizes tag link and pagination styling, including desktop/mobile pagination text visibility, and anchors project/post pagination buttons to the bottom of the content column so they sit flush above the footer on short pages instead of floating below the content
- Disables text selection on interactive site controls and footer areas

### `assets/css/beautifuljekyll.css`

- Emits the site-specific color palette as CSS custom properties for downstream stylesheets
- Removes inactive upstream Disqus comment styling
- Removes inactive upstream navbar search overlay styling
- Removes inactive upstream GitHub button header styling
- Removes the upstream social media sharing section styling

### `assets/js/beautifuljekyll.js`

`assets/js/beautifuljekyll.js` removes the inactive upstream navbar search initializer, tracks the mobile navbar state for avatar movement and body scroll locking, and collapses an expanded mobile navbar after outside clicks or browser back/forward restoration.

### `_config.yml`

- Renames the navbar text color setting to `navbar-link-col`
- Adds site-specific color variables for the navbar, page, links, post titles, preview pills, footer, and social links
- Configures the shared reveal delay before S3 app and body content-image loading indicators are shown
- Keeps top-level navbar page links on trailing-slash pretty URLs
- Keeps the Projects navbar entry as a top-level link while `_data/projects.yml` controls project dropdown children
- Removes inactive upstream navbar search, comment-provider, and Matomo configuration stubs
- Removes upstream setup-era guidance and the obsolete `feed_show_tags` toggle; listing pages render tag pills
  unconditionally on desktop and hide them on mobile
- Groups Jekyll and custom settings under consistently formatted section headings
- Adds generated-site exclusions for build-only material:
  - `AGENTS.md` and `CLAUDE.md`
  - `docs/`
  - `NAVBAR-SESSION-NOTES.md`
  - `scripts/`

### `contact.html`

- Defines page-local contact form, Turnstile, status, honeypot, and mobile contact-page styles

### `fireworks.html`

- Defines page-local Firework Launcher spacing and launch-button cursor/sizing overrides

### `index.html`

- Loads the Auto Transition-only Profile Photo homepage bundle instead of the full interactive Profile Photo bundle
- Stacks the homepage action buttons at every viewport width and matches the project-page buttons' hover/focus underlines

### `_includes/footer.html`

- Removes the bullet before the pretty URL
- Puts the pretty URL on a new line
- Removes the inactive Matomo opt-out link
- Opens the edit-page link in a new tab with `noopener noreferrer`
- Opens the Beautiful Jekyll attribution link in a new tab with `noopener noreferrer`

### `_includes/head.html`

- Adds PNG favicon links for shortcut and browser icons, plus a dedicated Apple touch icon
- Preloads the locally hosted Open Sans normal variable font used by initial page content
- Loads global firework launcher styles inside the document head
- Falls back to the site RSS description when generated page-description text still contains raw Liquid tags
- Removes inactive MathJax, Matomo, and Staticman stylesheet hooks

### `_includes/header.html`

- Simplifies header image class assignment
- Adds a project header class for project-specific title and subtitle sizing
- Removes the "posted on" label from post dates
- Removes the inactive read-time include hook

### `_includes/nav.html`

- Replaces the title/logo brand link with desktop and mobile firework launch controls that render the local Kid Pix
  dynamite APNG
- Builds the Projects dropdown from `_data/projects.yml` entries with `navbar: true`
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

### `_layouts/base.html`

- Loads locally hosted Open Sans normal and italic variable fonts with `font-display: swap`, a metric-matched Arial
  fallback, and removes the unused Lora request
- Loads global firework launcher scripts at the end of the body while their styles are emitted from `_includes/head.html`
- Loads `_includes/content-image-loading.html` after the page content and footer scripts so it can scan rendered body images
- Removes the upstream `bootstrap-social.css` stylesheet load, since it only styled the removed social media sharing buttons

### `_layouts/home.html`

- Forces home-page refreshes back to the top of the page
- Filters listed posts by `page.type` and renders Projects page cards from `_data/projects.yml`
- Renders a single left-aligned post thumbnail beside the post title and subtitle
- Lazily loads and asynchronously decodes post preview thumbnails while displaying a reduced-motion-aware loading indicator until each image loads or fails
- Supports the optional per-post thumbnail crop and sizing front matter described in
  [Custom Front Matter Parameters](#custom-front-matter-parameters)
- Removes the "Posted on" label from post dates
- Shows tag pills on Blog and Projects listing pages on desktop and hides post/listing tag pills on mobile
- Shows GitHub action badges on Projects listings whenever repository front matter is present, plus generated repository star counts and dates when GitHub repository metadata exists
- Defines page-local Projects listing repository badge row spacing and mobile stacking styles

### `tags.html`

- Groups both blog posts and `_data/projects.yml` project cards by tag
- Defines page-local tag heading and post-list offsets
- Removes the tag index
- Removes tag counts from tag headings

### `_layouts/page.html`

- Adds the shared `github-repo-badges.html` include to pages with `gh-repo` front matter, positioned and aligned by the `badge-position` and `badge-alignment` parameters (defaulting to `top` and `center`)
- Adds previous and next pagination for project pages with `project-id` front matter, following `_data/projects.yml` order
- Extends that pagination to sibling and nested project pages that share a project's `gh-repo` but lack their own `project-id`, always linking to the neighboring project's top-level page rather than a sibling or nested page within the current project
- Removes the inactive upstream comments include

### `_layouts/post.html`

- Adds the shared `github-repo-badges.html` include to posts, positioned and aligned by the `badge-position` and `badge-alignment` parameters (defaulting to `top` and `left`)
- Defines separate desktop and mobile pagination labels
- Labels pagination links with `page.type`
- Restricts previous/next pagination to posts with the same `type` as the current post
- Removes the inactive upstream comments include

### `beautiful-jekyll-theme.gemspec`

- Stops packaging the removed Staticman configuration
- Adds `bigdecimal` as an explicit runtime dependency for future Ruby compatibility

### Removed Inactive Upstream Integration Files

- Deletes unused comment, math, read-time, and search includes:
  - `_includes/commentbox.html`
  - `_includes/comments.html`
  - `_includes/disqus.html`
  - `_includes/fb-comment.html`
  - `_includes/giscus-comment.html`
  - `_includes/mathjax.html`
  - `_includes/matomo.html`
  - `_includes/readtime.html`
  - `_includes/search.html`
  - `_includes/staticman-comment.html`
  - `_includes/staticman-comments.html`
  - `_includes/utterances-comment.html`
- Deletes unused Staticman and search assets:
  - `assets/css/staticman.css`
  - `assets/data/searchcorpus.json`
  - `assets/js/staticman.js`
  - `staticman.yml`

### Removed Legacy Project Post Files

- Deletes `_includes/project_button.html` because Projects page cards now link directly through `_data/projects.yml`
- Deletes the old project-only posts from `_posts/` because `_data/projects.yml` now controls project ordering, card metadata, and project destinations

### Removed Inactive Upstream Minimal Layout Files

Deletes these inactive upstream files:

- `_includes/footer-minimal.html`
- `_layouts/minimal.html`
- `assets/css/beautifuljekyll-minimal.css`

### `.gitignore`

`.gitignore` ignores generated GitHub repository metadata and generated S3 asset version data.

### `.github/workflows/pages.yml`

`.github/workflows/pages.yml` generates GitHub repository metadata and S3 asset version data before the Jekyll build, then deploys `master` builds to GitHub Pages with GitHub Actions.

## GitHub Actions Workflows

Local wrappers that delegate to `cyaris/shared-automation` link to the
[shared-automation workflow reference](https://github.com/cyaris/shared-automation#workflows) for reusable workflow
behavior, inputs, and secrets.

### `.github/workflows/pages.yml`

The `Pages` workflow runs on:

- pushes to `dev` and `master`
- manual dispatch
- a daily 13:23 UTC schedule, 30 minutes after the `Upstream Watch` runs in `mastermind`, `profile_photo`,
  `us_gun_violence_forecasting`, and `the_networks_of_war`

The workflow then:

- installs Ruby dependencies with Bundler and Appraisal
- configures the GitHub Pages base path
- generates `_data/github_repos.yml` from repository front matter
- generates `_data/generated_s3_assets.yml` from current S3 object metadata or deterministic `dev` fallback data
- builds the site with `JEKYLL_ENV=production`
- uploads the Pages artifact
- deploys that artifact from `master` through `actions/deploy-pages`

Scheduled and `master` builds require one of these AWS credential paths so
`scripts/generate-s3-asset-versions.mjs` can call `aws s3api head-object` for every referenced object:

- `AWS_ROLLUP_UPLOAD_ROLE_ARN`
- both `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`

`dev` builds use stable local fallback values, which keeps validation available without AWS credentials.

The `cyaris` actor can dispatch the workflow from the GitHub Actions UI with
**Actions > Pages > Run workflow**. Manual dispatch has no custom inputs. It can also be dispatched from the command line
or GitHub API against `master`:

```sh
gh workflow run .github/workflows/pages.yml --ref master
```

### `.github/workflows/auto-create-dev-pr.yml`

The `Auto-create dev pull request` workflow runs on pushes to `dev` and calls the
[shared auto-create-dev-pr workflow](https://github.com/cyaris/shared-automation#githubworkflowsauto-create-dev-pryml).

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
