# Animated Thumbnail Generation

This document records the current reproducibility contract for the site's generated APNG thumbnails. Install one-off
Node dependencies under a task-specific directory made with `mktemp -d` (or under `${TMPDIR:-/tmp}`) so generation
does not change site dependencies. Encode every APNG with an `acTL` play count of `0` so it loops infinitely; when
changing the play count directly, recalculate the chunk CRC.

## Preserved GIF Animations

`assets/img/kidpix_dynamite_eraser.png` and `assets/img/nostradamus.png` are lossless APNG conversions of the former
GIF assets. Decode the source GIF with `gifuct-js`, composite each frame into a full RGBA canvas according to its
transparency and disposal metadata, and encode the canvases with `upng-js`. Keep the decoded frame content and timing,
but encode infinite playback even when the source animation has a finite play count.

The Kid Pix source is
[`img/cursor-tnt-anim.gif`](https://github.com/vikrum/kidpix/blob/4268b12a055503882b9e3b6382b110e39f1b1e12/img/cursor-tnt-anim.gif)
from the GPL-3.0 [`vikrum/kidpix`](https://github.com/vikrum/kidpix) repository, pinned to commit
`4268b12a055503882b9e3b6382b110e39f1b1e12` (the only commit to touch that path). The file at that commit has SHA-256
`883997e6706b447b650f812e3bea2df4b48f5d34446971f853e19856b36e506f`, matching the source hash in the table below. The
Nostradamus GIF came from this site's own version history and no earlier external provenance was recorded; its source
hash in the table below is the reproducibility anchor for that input.

The conversion used one-off `gifuct-js`, `pngjs`, and `upng-js` dependencies outside the repository. The preserved
animation contracts are:

| Asset | Dimensions | Frames | Frame timing | Plays | Source SHA-256 | APNG SHA-256 |
| --- | ---: | ---: | ---: | ---: | --- | --- |
| Kid Pix dynamite eraser | 9x16 | 2 | 130 ms | Infinite | `883997e6706b447b650f812e3bea2df4b48f5d34446971f853e19856b36e506f` | `e5ec6eb073ba803b843f724076d75f8c5302cce141ade0183c5849de5415c795` |
| Nostradamus | 400x400 | 61 | 100 ms | Infinite | `517bdd635691de7156c99f4797bd8d1d2ffed99ef666a8423d2d4a8e9aa9a8d0` | `ba679c980c4359bdd96585a07e5cac929e76f22e7337f835bec62830b55dd963` |

After conversion, decode every APNG frame and compare its RGBA hash with the corresponding composited GIF frame. Also
verify the PNG signature, `acTL` frame and play counts, `fcTL` delays, dimensions, and MIME type.

The Kid Pix custom cursor intentionally retains the existing CSS animation that alternates
`kidpix_dynamite_eraser_large_1.png` and `kidpix_dynamite_eraser_large_2.png` every 125 ms in a 250 ms infinite loop.
Those 10x18 files are now real static PNGs rather than GIF-encoded files with `.png` extensions. The redundant 9x16
non-cursor frame copies were removed. The CSS declares no explicit hotspot, so the browser keeps the existing top-left
hotspot and `auto` fallback. This frame-swap implementation preserves cursor animation in browsers that render APNG
`<img>` animations but display an APNG custom cursor as a static image.

## Firework Launcher

`assets/img/firework-launcher.png` contains transparent, full-frame APNG replacement frames encoded from `360x360`
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

`assets/img/firework-launcher-archived.png` is an unused historical comparison copy. The rendered site references only
`assets/img/firework-launcher.png`.

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
