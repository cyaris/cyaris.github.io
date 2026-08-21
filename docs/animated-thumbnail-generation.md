# Animated Thumbnail Generation

This document records the current reproducibility contract for the site's generated APNG thumbnails. Install one-off
Node dependencies under a task-specific directory made with `mktemp -d` (or under `${TMPDIR:-/tmp}`) so generation
does not change site dependencies.

## Firework Launcher

`assets/img/firework-launcher-demo.png` contains transparent, full-frame APNG replacement frames encoded from `360x360`
RGBA buffers with `upng-js`; `pngjs` may generate preview PNGs. Full-frame replacement preserves alpha fades without
depending on version-specific encoder internals.

Current render contract:

- 20 synthetic fireworks over 355 frames
- 50 ms per frame and 1.25x slow-motion timing
- `mulberry32` particle seeds of `9001 + index * 101`
- launch-schedule seed `44021`
- 65 px horizontal no-launch margins and a 20 px center buffer
- centered first and last launches at x=180
- intermediate left launches from x=65 through x=160 and right launches from x=200 through x=295

Calculate `frameCount` as `Math.round(284 * 1.25)`. Scale these timing ranges by 1.25 rather than reducing frame rate or
resolution:

- catch-up
- drop
- explosion
- fade
- launch
- particle tail delay

Launch the first firework at frame 0. Place the final launch at
`frameCount - 1 - fireworkDuration(lastFirework)` and distribute intermediate launches with seeded gap weights from
0.15 through 2.25, normalized across available frames with a five-frame minimum gap.

After launch and drop, hold a short tail catch-up phase, use circle-in-out easing for burst and fade movement, spread
tail delays across all particles, keep phase alpha values below full opacity, and switch colors during stationary
catch-up. Show only the launcher effect.

After regeneration, decode the APNG and confirm:

- 360x360 dimensions
- 355 full-frame frames
- uniform 50 ms delays
- RGBA alpha preservation
- no delta-frame blend artifacts

`assets/img/firework-launcher-demo-new.png` is an unused comparison copy. Do not regenerate or synchronize it unless a
specific comparison task still needs it; remove it once no external review depends on the historical filename.

## Networks Of War

`assets/img/networks-war-demo.png` mirrors the sibling Networks of War graph using the `Invasion of Afghanistan` record
from `the_networks_of_war/frontend/src/lib/static/graphData.json` (sibling repository `cyaris/the_networks_of_war`,
checked out alongside this repository).

Side assignments:

- Side 1:
  - Australia
  - Canada
  - France
  - the United Kingdom
  - the United States of America
- Side 2: Afghanistan

Display `United States of America` as `United States` before calculating label positions.

Generate with:

- `pngjs`
- The sibling frontend's dependencies:
  - `d3-force`
  - `d3-scale`
- `upng-js`

Preserve `assets/img/networks-war-globe-thumbnail.png` as the legacy static thumbnail.

Current render contract:

- 360x360 transparent RGBA frames
- 382 frames at 50 ms per frame
- the component's side colors and force-layout constants
- no node-size descriptor
- a 192-frame, 540-degree clockwise drag of `United States` around fixed-center `Afghanistan`
- immediate reverse playback by appending the forward frames in reverse order, excluding the first and last frames
  (already shown as the loop's endpoints), for 190 reverse frames and 382 total

Before capture, pin `United States` at 3 o'clock and settle the other participants until alpha and velocity meet the
chosen thresholds. During drag, move only the United States fixed coordinates, advance the simulation one tick per
frame, and use linear orbit progress. Keep Canada, the United Kingdom, France, and Australia unpinned.

Use `graphLayout.marginSize = 0`, but retain these component calculations:

- `externalLabelX`
- `getNodeMargins`
- `getXAdjusted`
- `getYAdjusted`

Preserve the component's label rules for:

- external labels
- horizontal shifts
- inside/outside placement
- quadrants
- text width
- vertical shifts

Add component-computed label offsets to the transformed node anchor without multiplying them by final render scale. Do
not feed the final bounds fit back into label placement.

After regeneration, decode the APNG and confirm:

- 360x360 dimensions
- 382 full-frame frames
- uniform 50 ms delays (20 fps)
- all nontransparent pixels remain inside the image bounds
- `bundle exec jekyll build` still renders the project page
