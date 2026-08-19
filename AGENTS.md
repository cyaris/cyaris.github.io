# Repository Guidance

## Embedded App Hosting

- Treat embedded Svelte app pages as hosts for compiled bundles. Change app behavior, routes, and app-scoped styles in the source repo, rebuild/upload compiled bundle artifacts, and keep Jekyll pages as lightweight shell pages plus host-page CSS; do not patch generated bundle behavior or duplicate route content directly in Jekyll.

## Host Page Styling

- `full-width: true` uses the site's full-width Jekyll/Bootstrap layout. Keep embedded tools full-width, and scope page-local alignment overrides to surrounding page furniture rather than the chart unless requested.
- Embedded frontend Tailwind bundles are scoped under each app's wrapper class, so Tailwind utility classes on Jekyll wrapper elements outside that app scope will not apply. Use page CSS, inline CSS, or global site CSS for Jekyll wrapper elements.

## Documentation

- Use `../shared-automation/AGENTS.md` as the source of truth for README and Markdown documentation-style conventions.
- After changing any Beautiful Jekyll-derived file or adding any site styling or functionality that deviates from
  upstream Beautiful Jekyll, inspect the affected file's subsection in the README's `Deviations From Beautiful Jekyll`
  section and update it in the same change. An existing subsection is not sufficient unless it already describes the
  changed behavior; apply this check even to one-line fixes.
- Before finishing changes that add or touch files in `_includes`, compare the include paths against upstream Beautiful Jekyll. Any current or future `_includes` file that is not present upstream must automatically be documented in the README's `Additional Features` section in the same change.
- Keep the README's `Additional Features` section focused on site-local features and `_includes` files not found upstream. Keep the `Deviations From Beautiful Jekyll` section focused on changed upstream files, removed upstream files, and behavioral differences from upstream.
- Keep `_includes` limited to files actually used by the site, based on features currently enabled in `_config.yml` plus integrations activated by visiting pages. The only include files that may remain present while unused by the active site are `_includes/social-networks-links.html`, `_includes/cloudflare_analytics.html`, `_includes/google_analytics.html`, `_includes/gtm_head.html`, and `_includes/gtm_body.html`. Delete any other unused include file together with its corresponding imports or integrations, and document each removal in the README's `Deviations From Beautiful Jekyll` section.

## Content

- Keep all tags alphabetized.
- Keep all tags lowercase.

## JavaScript And HTML

- Follow the JavaScript- and HTML-relevant guidance from `../svelte-lib/AGENTS.md` for site JavaScript, `.mjs` Node scripts, JavaScript embedded within HTML files, and HTML/Liquid templates in this repository, including import placement, formatting, dependency ownership, lightweight embedded-app shells, and small-variable cleanup preferences. Repo-local JavaScript and HTML rules in this file override sibling `svelte-lib` guidance when they conflict. Treat Svelte-component, embedded-app, package-export, and library-release rules from that file as applicable only when this repository is editing comparable Svelte or shared-library code.

## Animated Thumbnail Assets

- Prefer focused, subject-only animations for thumbnails. Avoid recording the whole website, navbar, browser chrome, or long setup motion unless the user explicitly asks for that context.
- Use temporary tooling outside the repo, for example `npm install --prefix /private/tmp/<task-name> pngjs omggif upng-js`, to avoid changing site dependencies when generating one-off animation assets.
- Prefer APNG or WebP when smooth alpha fades over transparent backgrounds are important. GIF transparency is binary, so fading particles can become spotty even with more frames.
- For synthetic GIF animations, generate indexed frames directly with `omggif`; reserve palette index `0` for transparent black, pass `transparent: 0`, and use `disposal: 2` for each frame. Use `pngjs` for optional preview PNGs.
- Keep animated thumbnails small and reusable: square dimensions, short loops, deterministic seeds where randomness is involved, and output under `assets/img/` with a descriptive filename.
- When adapting an interactive effect into a thumbnail, capture or synthesize only the meaningful part of the effect, and make the loop long enough for the final event to finish before it resets.
- For every future APNG thumbnail, document recreation details in this section in the same manner as the existing fireworks and Networks of War entries. Include the output path, source data or source effect, temporary tooling and dependencies, canvas size, frame count, frame delay/fps, deterministic seeds or deterministic layout rules, important animation phases, encoding requirements, preserved legacy assets, verification checks, and any intentional deviations from the source app.
- `assets/img/firework-launcher-demo.png` is generated as a transparent APNG rather than a GIF so the firework particles can fade smoothly with real alpha transparency.
- Create `assets/img/firework-launcher-demo.png` with temporary Node tooling outside the repo using `pngjs` for preview PNGs and `upng-js` for APNG encoding.
- Generate the fireworks APNG from full `360x360` RGBA frame buffers, then encode with `upng-js` through its documented public API using full-frame APNG replacement frames; this preserves alpha fades and avoids delta-frame blend artifacts without relying on version-specific internal helper signatures.
- Write the same generated APNG bytes to both `assets/img/firework-launcher-demo.png` and `assets/img/firework-launcher-demo-new.png` so the legacy and comparison filenames remain in sync.
- Current `assets/img/firework-launcher-demo.png` animation settings: `360x360`, 20 synthetic fireworks, deterministic particle seeds, `355` frames, `50ms` per frame, `1.25x` slow-motion timing, and a seeded random-gap launch schedule.
- For slow-motion `assets/img/firework-launcher-demo.png` renders, keep image quality unchanged by preserving the `360x360` canvas, full RGBA frame buffers, and `50ms` frame delay; make the animation slower by increasing frame count and scaling launch, drop, catch-up, explosion, fade, and tail-delay frame ranges by the slow-motion factor.
- For the current slow-motion render, calculate `frameCount` as `Math.round(284 * 1.25)`, keep `frameDelayMs = 50`, and scale `launchFrames`, `dropFrames`, `catchupFrames`, `explosionFrames`, `fadeFrames`, and per-particle `tailDelay` by the same `1.25` factor rather than lowering frame rate or canvas quality.
- Use full-frame APNG replacement frames for `assets/img/firework-launcher-demo.png` while showing only the launcher effect, not the website, navbar, or browser chrome.
- Use a deterministic `mulberry32` PRNG. Seed each firework with `9001 + index * 101`, and seed launch scheduling with `44021`.
- For `assets/img/firework-launcher-demo.png`, treat margin as the horizontal no-launch zone only: explosions may enter the side regions, but intermediate firework launch centers must not. Use a `65px` no-launch margin on both sides of the `360px` canvas and a `20px` center buffer. Launch the first and last fireworks from horizontal center x=`180`, and alternate every intermediate firework between seeded left-side x positions from x=`65` through x=`160` and seeded right-side x positions from x=`200` through x=`295` so both sides stay covered throughout the animation.
- For `assets/img/firework-launcher-demo.png`, fire the first firework at frame `0`, calculate the last firework's launch frame as `frameCount - 1 - fireworkDuration(lastFirework)` so the final centered firework completes at the end of the loop, and place intermediate launches from seeded random gap weights from `0.15` through `2.25` normalized across the available frames with a `5`-frame minimum gap.
- For `assets/img/firework-launcher-demo.png`, emulate the slower explosion feel from the `origin/master` APNG: after launch/drop, hold a short tail catch-up phase before bursting, ease burst and fade movement with circle-in-out easing, and keep explosion/fade frame ranges long enough that particles expand gradually rather than snapping outward.
- For `assets/img/firework-launcher-demo.png`, keep alpha fades visible by spreading launch tail delays across all particles, using sub-opaque launch/drop/burst/fade alpha values, and switching particle colors during the stationary catch-up phase rather than during the moving fade-out phase.
- Before finishing a regenerated `assets/img/firework-launcher-demo.png`, decode both APNG filenames and verify they are byte-identical, `360x360`, full-frame replacement encoded, RGBA/alpha-preserving, and use the expected frame count and `50ms` frame delay.
- `assets/img/networks-war-demo.png` is generated as a transparent APNG for the Networks of War project thumbnail. It mirrors the `the_networks_of_war` frontend graph code and static data, using the `Invasion of Afghanistan` war record from `frontend/src/lib/static/graphData.json` (`United States of America`, `Canada`, `United Kingdom`, `France`, and `Australia` on side 1; `Afghanistan` on side 2). For thumbnail readability, render `United States of America` as `United States`; apply that display-name replacement before calculating label margins and positions so the same component label rules operate on the rendered name.
- Keep `assets/img/networks-war-globe-thumbnail.png` in the repository as the preserved legacy thumbnail even while `assets/img/networks-war-demo.png` is used by the project page.
- Create `assets/img/networks-war-demo.png` with temporary Node tooling outside the repo using `pngjs` for preview PNGs, `upng-js` for APNG encoding, and the Networks of War frontend dependencies (`d3-force` and `d3-scale`) from the sibling `the_networks_of_war/frontend` workspace so the site dependencies stay unchanged.
- Current `assets/img/networks-war-demo.png` animation settings: `360x360`, square `360x360` graph layout, transparent RGBA frames, `382` frames, `50ms` per frame, full-frame APNG replacement frames, the same side colors and force-layout constants as `TheNetworksOfWar.svelte`, no node-size descriptor selected, and a half-speed forward `192`-frame `540`-degree clockwise drag path for the `United States` node around the fixed primary `Afghanistan` node. Before capturing the first frame, pin `United States` at angle `0`/3 o'clock and let the D3 force simulation settle the other participants around that start position until alpha and node velocity stay below the chosen thresholds; the APNG begins only after that unrecorded pre-settle is complete. After the forward path reaches its `540`-degree endpoint and the dragged `United States` node/title is at its source-rule endpoint, reverse immediately by appending the completed forward frames in reverse order; do not wait for every non-dragged participant to settle.
- For the `assets/img/networks-war-demo.png` drag phase, capture the first frame after the 3 o'clock start layout has fully settled. Keep `Afghanistan` fixed at the graph center and move only the `United States` fixed drag coordinates around the circular path, but do not pin `Canada`, `United Kingdom`, `France`, or `Australia`; advance the D3 force simulation by `1` tick per captured drag frame so those participants can respond naturally. Use linear orbit progress so the visible animation begins with the drag itself, not with a slow ease-in while the surrounding graph wakes up.
- For `assets/img/networks-war-demo.png`, run the D3 force simulation to settle the graph before capturing frames. Use `graphLayout.marginSize = 0` so the thumbnail does not reserve the app's visible-chart border padding, but keep the component's `getNodeMargins`, `getXAdjusted`, `getYAdjusted`, and `externalLabelX` behavior with that zero margin. Do not replace those adjustment functions with raw coordinates; otherwise `externalLabelX` can clamp a label while its node is outside the chart, making labels drift far from nodes during drag.
- Match the component's label-placement rules relative to each node, including `textWidth`, `nameFitsInNode`, inside-label placement, outside-label quadrant selection, `vertical_name_shift`, `horizontal_name_shift`, and `externalLabelX` with the zero-margin graph layout. The final bounds fit must not feed back into `labelPosition`, `externalLabelX`, or any other label-placement calculation. When rasterizing labels directly into fixed-size PNG frames, do not multiply `label.x` or `label.y` by the final render scale; add those component-computed offsets to the transformed node anchor so text spacing stays visually consistent with the Networks of War SVG tool. The current physics-settle trial intentionally uses the source-rule label positions directly, with no dragged-label crossfade and no forced copy of the first `United States` label position onto the final forward frame.
- Verify `assets/img/networks-war-demo.png` after regeneration by decoding the APNG and confirming it is `360x360`, has `382` frames, uses a uniform `50ms` delay (`20fps`, matching `assets/img/firework-launcher-demo.png`), keeps decoded nontransparent pixels inside the image bounds, and still renders the project page through `bundle exec jekyll build`.

## Site Styling

- For site-local Jekyll links and asset paths, use the `relative_url` filter instead of concatenating `site.url`. Reserve `absolute_url` for metadata, feeds, canonical URLs, or other places that require a fully qualified URL.
- Prefer relative paths and `relative_url` for site-local links/assets over `site.*` values unless the output explicitly needs site configuration or a fully qualified URL.
- Keep CSS that is only relevant to one page in that page file. If that styling becomes relevant to more than one file, move it back to `assets/css/custom.css` with the other shared site styles.
- Keep mobile blog tag links hidden unless the user approves showing them. When they remain hidden, preserve compact
  mobile sizing and wrapping rules in `assets/css/custom.css` so removing the mobile `display: none` rule later produces
  usable tag-pill formatting.
- Keep color variables used in `assets/css/custom.css` aligned with the color variables defined in `_config.yml`. Prefer adding or updating the corresponding CSS custom property in `assets/css/beautifuljekyll.css` and referencing it with `var(...)` from `custom.css`, so `custom.css` remains valid plain CSS for editor tooling and Prettier.

## GitHub Actions

- Use `../shared-automation/AGENTS.md` as the source of truth for shared GitHub Actions, reusable workflow wrapper,
  release-policy, dispatch, and automation documentation conventions.
- Before merging any pull request, explicitly inspect CodeRabbit comments and reviews and assess every still-applicable
  finding; do not merge solely because checks are green.
- Workflows must fail clearly when a requested feature requires credentials, secrets, repository variables, external
  permissions, or paid services that are not configured. Apply this to dry-run modes too unless the feature is
  explicitly documented as credential-optional.
- Keep the root `Pages` workflow local to this repository unless another Jekyll site starts sharing the
  same build workflow.
- Site release naming and milestone overrides belong in `.github/release-policy.yml`.

## Release Management

- While working in this repository, evaluate whether the accumulated changes represent a meaningful release milestone.
- A release may be appropriate when the work includes a substantial user-facing feature, a major redesign or workflow change, a meaningful new integration, an important architecture change, a backward-incompatible change, a stable initial public version, a significant performance, reliability, security, accessibility, or compatibility improvement, or a coherent group of changes that materially changes how the project is used.
- Do not recommend a release for routine maintenance, formatting, minor refactoring, isolated dependency updates, or small bug fixes unless their combined impact is significant.
- Write clear, specific commit subjects that describe the actual change. Prefer plain language over release-tool syntax,
  and do not exaggerate routine maintenance as user-facing work.
- Treat upstream automation, shared workflow reference, dependency-pin, Renovate, release-policy, and local dependency ref
  maintenance as non-release work unless it changes user-facing behavior, runtime behavior, or a published API.
- When the current work appears to justify a release, state that a release may be warranted, explain the milestone in plain language, suggest a release title, suggest a tag consistent with this repository's existing convention, summarize release-note content, identify breaking changes or migration concerns, and recommend full release, prerelease, or draft status.
- For future website releases, prefer `vX.Y.Z` tags with release titles in the form `vX.Y.Z - Plain-English Milestone`, while leaving historical tags intact unless the user explicitly approves a tag migration.
- Do not create, rename, move, or delete tags or publish a GitHub release unless the user explicitly requests it.
