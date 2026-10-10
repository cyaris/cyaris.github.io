import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"

// Checks a built site's search metadata: every canonical, sitemap, and robots.txt URL is absolute on the configured
// origin, `noindex` pages stay out of the sitemap, and every indexable page has a description.
const projectRoot = path.dirname(path.dirname(new URL(import.meta.url).pathname))
const siteDirectory = path.resolve(process.argv[2] ?? path.join(projectRoot, "_site"))
const origin = fs.readFileSync(path.join(projectRoot, "_config.yml"), "utf8").match(/^url: (\S+)$/m)?.[1]

assert.ok(origin?.startsWith("https://"), "_config.yml must set an https `url` for absolute search metadata")

function htmlFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    let entryPath = path.join(directory, entry.name)
    if (entry.isDirectory()) return htmlFiles(entryPath)
    return entry.name.endsWith(".html") ? [entryPath] : []
  })
}

function attribute(html, pattern) {
  return html.match(pattern)?.[1]
}

assert.match(
  fs.readFileSync(path.join(siteDirectory, "robots.txt"), "utf8"),
  new RegExp(`^Sitemap: ${origin}/sitemap\\.xml$`, "m")
)

let sitemapUrls = new Set(
  [...fs.readFileSync(path.join(siteDirectory, "sitemap.xml"), "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    match => match[1]
  )
)

assert.ok(sitemapUrls.size > 0, "sitemap.xml lists no URLs")
for (let url of sitemapUrls) assert.ok(url.startsWith(`${origin}/`), `sitemap URL ${url} is not on ${origin}`)

let pageCount = 0
for (let file of htmlFiles(siteDirectory)) {
  let html = fs.readFileSync(file, "utf8")
  // Redirect stubs and embedded fragments carry no page head.
  if (!html.includes('<meta name="robots"')) continue

  let relativePath = path.relative(siteDirectory, file)
  let canonical = attribute(html, /<link rel="canonical" href="([^"]*)"/)
  let robots = attribute(html, /<meta name="robots" content="([^"]*)"/)

  pageCount++
  assert.ok(canonical?.startsWith(`${origin}/`), `${relativePath} canonical ${canonical} is not on ${origin}`)
  assert.equal(attribute(html, /<meta property="og:url" content="([^"]*)"/), canonical, `${relativePath} og:url`)

  if (robots.startsWith("noindex")) {
    assert.ok(!sitemapUrls.has(canonical), `${relativePath} is noindex but listed in sitemap.xml`)
  } else {
    assert.ok(
      attribute(html, /<meta name="description" content="([^"]*)"/)?.trim(),
      `${relativePath} has no description`
    )
  }

  for (let [, json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    assert.doesNotThrow(() => JSON.parse(json), `${relativePath} has invalid structured data`)
  }
}

assert.ok(pageCount > 0, `No built pages found in ${siteDirectory}`)
console.log(`Search metadata checks passed for ${pageCount} pages and ${sitemapUrls.size} sitemap URLs.`)
