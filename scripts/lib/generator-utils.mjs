import fs from "node:fs"
import path from "node:path"

export function collectContentFiles(dir, { extensions, ignoredDirs = new Set(), ignoredFiles = new Set() }) {
  const files = []

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!ignoredDirs.has(entry.name)) {
        files.push(...collectContentFiles(path.join(dir, entry.name), { extensions, ignoredDirs, ignoredFiles }))
      }
      continue
    }

    if (entry.isFile() && extensions.has(path.extname(entry.name)) && !ignoredFiles.has(entry.name)) {
      files.push(path.join(dir, entry.name))
    }
  }

  return files
}

export function yamlQuote(value) {
  return `"${String(value).replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"`
}
