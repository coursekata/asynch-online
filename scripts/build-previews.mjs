#!/usr/bin/env node
// Renders each session's notebook to a standalone HTML page under
// public/previews/, so instructors can read the whole notebook in the browser
// without downloading it or starting a kernel.
//
// Convention: for content/resources/<slug>.md, the first `files[]` entry whose
// src ends in .ipynb is rendered to public/previews/<slug>.html, and the md
// file's `preview:` field is pointed at it. Idempotent — safe to re-run.
//
// Requires: jupyter nbconvert  (pip install nbconvert)

import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { join, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const resourcesDir = join(root, 'content', 'resources')
const previewsDir = join(root, 'public', 'previews')

mkdirSync(previewsDir, { recursive: true })

let rendered = 0
let skipped = 0

for (const file of readdirSync(resourcesDir).filter((f) => f.endsWith('.md')).sort()) {
  const slug = basename(file, '.md')
  const mdPath = join(resourcesDir, file)
  const md = readFileSync(mdPath, 'utf8')

  const match = md.match(/^\s*-\s*src:\s*(\S*\.ipynb)\s*$/m)
  if (!match) { skipped++; continue }

  // frontmatter srcs are web paths (percent-encoded, rooted at /) that map
  // onto either notebooks/ or public/ depending on the leading segment.
  const webPath = decodeURIComponent(match[1].replace(/^['"]|['"]$/g, ''))
  const nbPath = webPath.startsWith('/notebooks/')
    ? join(root, webPath.slice(1))
    : join(root, 'public', webPath)

  if (!existsSync(nbPath)) {
    console.warn(`  ! ${slug}: notebook not found at ${nbPath}`)
    skipped++
    continue
  }

  execFileSync('jupyter', [
    'nbconvert',
    '--to', 'html',
    '--template', 'lab',
    '--HTMLExporter.theme=light',
    '--output-dir', previewsDir,
    '--output', `${slug}.html`,
    nbPath,
  ], { stdio: ['ignore', 'ignore', 'inherit'] })

  const previewLine = `preview: /previews/${slug}.html`
  const updated = /^preview:.*$/m.test(md)
    ? md.replace(/^preview:.*$/m, previewLine)
    : md.replace(/^---\n/, `---\n${previewLine}\n`)
  if (updated !== md) writeFileSync(mdPath, updated)

  console.log(`  ✓ ${slug}`)
  rendered++
}

console.log(`\nnotebook previews: ${rendered} rendered, ${skipped} skipped`)
