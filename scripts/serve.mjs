import { unwatchFile, watchFile } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { spawn } from "node:child_process"

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const configPath = join(projectRoot, "_config.yml")
const jekyllArguments = ["exec", "jekyll", "serve", "--livereload", ...process.argv.slice(2)]
let jekyllProcess
let restartPending = false
let restartTimeout
let shuttingDown = false

watchFile(configPath, { interval: 300 }, (current, previous) => {
  if (current.mtimeMs === previous.mtimeMs || shuttingDown) return

  clearTimeout(restartTimeout)
  restartTimeout = setTimeout(() => {
    console.log("\n_config.yml changed; restarting Jekyll...")
    restartPending = true
    if (jekyllProcess) jekyllProcess.kill("SIGINT")
    else startJekyll()
  }, 150)
})

function startJekyll() {
  restartPending = false
  jekyllProcess = spawn("bundle", jekyllArguments, {
    cwd: projectRoot,
    shell: process.platform === "win32",
    stdio: "inherit"
  })

  jekyllProcess.on("error", error => {
    unwatchFile(configPath)
    console.error(`Unable to start Jekyll: ${error.message}`)
    process.exitCode = 1
  })

  jekyllProcess.on("exit", (code, signal) => {
    jekyllProcess = undefined

    if (shuttingDown) return
    if (restartPending) {
      startJekyll()
      return
    }

    unwatchFile(configPath)
    if (signal) console.error(`Jekyll stopped after receiving ${signal}.`)
    process.exitCode = code ?? 1
  })
}

function shutDown() {
  if (shuttingDown) return

  shuttingDown = true
  clearTimeout(restartTimeout)
  unwatchFile(configPath)

  if (!jekyllProcess) {
    process.exit(0)
    return
  }

  jekyllProcess.once("exit", () => process.exit(0))
  jekyllProcess.kill("SIGINT")
}

process.on("SIGINT", shutDown)
process.on("SIGTERM", shutDown)

startJekyll()
