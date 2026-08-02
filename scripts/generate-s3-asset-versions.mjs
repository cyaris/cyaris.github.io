import path from "node:path"

import { buildS3AssetEntries, headS3Object, readSiteS3Config, writeS3AssetData } from "./lib/s3-assets.mjs"

const root = process.cwd()
const config = readSiteS3Config(root)
const mode = process.env.S3_ASSET_VERSION_MODE || "fallback"

if (!["aws", "fallback"].includes(mode)) {
  throw new Error(`S3_ASSET_VERSION_MODE must be "aws" or "fallback", got "${mode}"`)
}

if (mode === "aws" && !config.bucket) {
  throw new Error("Cannot derive an S3 bucket name from s3_bucket in _config.yml")
}

const entries = await buildS3AssetEntries({
  bundlePrefix: process.env.S3_BUNDLE_PREFIX ?? config.bundlePrefix,
  headObject: key =>
    headS3Object({
      bucket: process.env.S3_BUCKET || config.bucket,
      key,
      profile: process.env.AWS_PROFILE,
      region: process.env.AWS_REGION || config.region
    }),
  mode,
  root
})

writeS3AssetData(path.resolve(process.env.S3_ASSET_DATA_FILE || "_data/generated_s3_assets.yml"), entries)
console.log(
  `Wrote ${entries.length.toLocaleString()} S3 asset versions to ${process.env.S3_ASSET_DATA_FILE || "_data/generated_s3_assets.yml"} using ${mode} mode`
)
