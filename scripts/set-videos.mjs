#!/usr/bin/env node
// Writes Vimeo ids into the lecture markdown files' `video:` frontmatter.
//
// Usage:
//   node scripts/set-videos.mjs 1=https://vimeo.com/1211571372 2=1211571373 ...
//   node scripts/set-videos.mjs --file videos.txt
//
// videos.txt is one lecture per line, "<number> <url-or-id>", blank lines and
// # comments ignored:
//   1  https://vimeo.com/1211571372
//   2  https://vimeo.com/1211571373/abc123def     <- unlisted, with hash
//
// Accepts a bare id, a vimeo.com/<id> link, a vimeo.com/<id>/<hash> unlisted
// link, or a player.vimeo.com/video/<id>?h=<hash> embed URL. Idempotent.

import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const resourcesDir = join(root, 'content', 'resources')

function parseRef(raw) {
  const v = raw.trim()
  let m
  if ((m = v.match(/player\.vimeo\.com\/video\/(\d+)(?:\?.*\bh=([A-Za-z0-9]+))?/)))
    return { id: m[1], hash: m[2] }
  if ((m = v.match(/vimeo\.com\/(?:video\/)?(\d+)(?:\/([A-Za-z0-9]+))?/)))
    return { id: m[1], hash: m[2] }
  if ((m = v.match(/^(\d+)$/))) return { id: m[1] }
  throw new Error(`could not parse a Vimeo id out of: ${raw}`)
}

// ── collect assignments ──────────────────────────────────────────────────────
const args = process.argv.slice(2)
const pairs = []
const fileIdx = args.indexOf('--file')
if (fileIdx !== -1) {
  const lines = readFileSync(join(root, args[fileIdx + 1]), 'utf8').split('\n')
  for (const line of lines) {
    const t = line.replace(/#.*$/, '').trim()
    if (!t) continue
    const m = t.match(/^(\d+)[\s=,]+(\S+)/)
    if (!m) throw new Error(`unparsable line: ${line}`)
    pairs.push([Number(m[1]), m[2]])
  }
} else {
  for (const a of args) {
    const m = a.match(/^(\d+)=(.+)$/)
    if (!m) throw new Error(`expected <lecture>=<url>, got: ${a}`)
    pairs.push([Number(m[1]), m[2]])
  }
}
if (!pairs.length) {
  console.error('nothing to do — pass 1=<url> ... or --file videos.txt')
  process.exit(1)
}

// ── index the markdown files by sequence ─────────────────────────────────────
const bySeq = new Map()
for (const f of readdirSync(resourcesDir).filter((f) => f.endsWith('.md'))) {
  const p = join(resourcesDir, f)
  const seq = readFileSync(p, 'utf8').match(/^sequence:\s*(\d+)\s*$/m)
  if (seq) bySeq.set(Number(seq[1]), p)
}

for (const [seq, ref] of pairs) {
  const p = bySeq.get(seq)
  if (!p) { console.warn(`  ! no lecture ${seq}`); continue }

  const { id, hash } = parseRef(ref)
  const block =
    `video:\n  provider: vimeo\n  id: '${id}'` + (hash ? `\n  hash: '${hash}'` : '')

  let md = readFileSync(p, 'utf8')
  if (/^video:\n(?:  .*\n)*/m.test(md)) {
    // replace an existing live block
    md = md.replace(/^video:\n(?:  .*\n)*/m, block + '\n')
  } else {
    // replace the commented-out placeholder, or append before the closing ---
    const placeholder = /^# Paste the Vimeo id[\s\S]*?(?=^\w|^---)/m
    md = placeholder.test(md)
      ? md.replace(placeholder, block + '\n')
      : md.replace(/^(---\n[\s\S]*?)^---$/m, `$1${block}\n---`)
  }
  writeFileSync(p, md)
  console.log(`  ✓ lecture ${seq} → ${id}${hash ? ` (h=${hash})` : ''}`)
}
