import assert from "node:assert/strict"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"

import {
  buildS3AssetEntries,
  bundlePrefixForEnvironment,
  fallbackVersion,
  objectKeyFromS3Path,
  parseS3AssetIncludes,
  resolveS3Path,
  versionFromMetadata,
  writeS3AssetData
} from "./lib/s3-assets.mjs"

const root = fs.mkdtempSync(path.join(os.tmpdir(), "cyaris-s3-assets-"))

fs.mkdirSync(path.join(root, "_includes"))
fs.mkdirSync(path.join(root, "mastermind", "play"), { recursive: true })
fs.mkdirSync(path.join(root, "resume"))
fs.writeFileSync(
  path.join(root, "_includes", "head.html"),
  "{% include s3_asset.html path='mastermind/bundle.css' type='style' bundle=true %}\n"
)
fs.writeFileSync(
  path.join(root, "mastermind", "play", "index.html"),
  "{% include s3_asset.html path='mastermind/bundle.js' type='script' bundle=true %}\n"
)
fs.writeFileSync(
  path.join(root, "resume", "index.html"),
  "{% include s3_asset.html path='pdf/resume/Charlie_Yaris_Resume.pdf' %}\n"
)
fs.writeFileSync(path.join(root, "query.html"), "{% include s3_asset.html path='images/photo.png?size=large' %}\n")

const productionVersions = new Map([
  ["images/photo.png", { ETag: '"photo-etag"' }],
  ["mastermind/bundle.css", { ETag: '"css-etag"' }],
  ["mastermind/bundle.js", { VersionId: "prod-version+1" }],
  ["pdf/resume/Charlie_Yaris_Resume.pdf", { LastModified: "2026-08-01T12:00:00.000Z", ContentLength: 12345 }]
])
const nextVersions = new Map([...productionVersions, ["mastermind/bundle.js", { VersionId: "prod-version+2" }]])

const first = await buildS3AssetEntries({ headObject: key => lookup(productionVersions, key), mode: "aws", root })
const second = await buildS3AssetEntries({ headObject: key => lookup(productionVersions, key), mode: "aws", root })
const changed = await buildS3AssetEntries({ headObject: key => lookup(nextVersions, key), mode: "aws", root })

assert.deepEqual(versionsByKey(first), versionsByKey(second))
assert.equal(versionFor(changed, "mastermind/bundle.js"), "prod-version%2B2")
assert.equal(versionFor(changed, "mastermind/bundle.css"), versionFor(first, "mastermind/bundle.css"))
assert.equal(
  versionFor(changed, "pdf/resume/Charlie_Yaris_Resume.pdf"),
  versionFor(first, "pdf/resume/Charlie_Yaris_Resume.pdf")
)
assert.equal(versionFor(first, "mastermind/bundle.js"), "prod-version%2B1")
assert.equal(versionFor(first, "mastermind/bundle.css"), "css-etag")
assert.equal(versionFor(first, "pdf/resume/Charlie_Yaris_Resume.pdf"), "2026-08-01T12%3A00%3A00.000Z-12345")
assert.equal(versionFor(first, "images/photo.png"), "photo-etag")

const development = await buildS3AssetEntries({
  bundlePrefix: "dev_",
  headObject: key =>
    lookup(
      new Map([
        ["images/photo.png", { ETag: '"photo-etag"' }],
        ["mastermind/dev_bundle.css", { ETag: '"dev-css-etag"' }],
        ["mastermind/dev_bundle.js", { ETag: '"dev-js-etag"' }],
        ["pdf/resume/Charlie_Yaris_Resume.pdf", { ETag: '"resume-etag"' }]
      ]),
      key
    ),
  mode: "aws",
  root
})

assert.equal(versionFor(development, "mastermind/dev_bundle.js"), "dev-js-etag")
assert.equal(versionFor(development, "mastermind/dev_bundle.css"), "dev-css-etag")
assert.equal(
  development.some(entry => entry.key === "mastermind/bundle.js"),
  false
)
assert.equal(objectKeyFromS3Path("images/photo.png?size=large"), "images/photo.png")
assert.equal(resolveS3Path("fireworks/bundle2.js", true, "dev_"), "fireworks/dev_bundle2.js")
assert.equal(bundlePrefixForEnvironment("dev_", "development"), "dev_")
assert.equal(bundlePrefixForEnvironment("dev_", "production"), "")
assert.equal(fallbackVersion("mastermind/bundle.js"), fallbackVersion("mastermind/bundle.js"))
assert.notEqual(fallbackVersion("mastermind/bundle.js"), fallbackVersion("mastermind/bundle.css"))
assert.equal(versionFromMetadata({ VersionId: "null", ETag: '"etag"' }).version, "etag")

await assert.rejects(
  () => buildS3AssetEntries({ headObject: key => lookup(new Map(), key), mode: "aws", root }),
  /Missing mock metadata for images\/photo\.png/
)

assert.throws(
  () => parseS3AssetIncludes("dynamic.html", "{% include s3_asset.html path=page.asset_path %}"),
  /Cannot statically resolve s3_asset path/
)

const outFile = path.join(root, "_data", "generated_s3_assets.yml")
writeS3AssetData(outFile, first)
assert.match(fs.readFileSync(outFile, "utf8"), /- logical_id: "mastermind_bundle"\n  key: "mastermind\/bundle\.js"\n/)

console.log("S3 asset version tests passed")

function lookup(metadataByKey, key) {
  if (!metadataByKey.has(key)) {
    throw new Error(`Missing mock metadata for ${key}`)
  }

  return metadataByKey.get(key)
}

function versionFor(entries, key) {
  return entries.find(entry => entry.key === key)?.version
}

function versionsByKey(entries) {
  return Object.fromEntries(entries.map(entry => [entry.key, entry.version]))
}
