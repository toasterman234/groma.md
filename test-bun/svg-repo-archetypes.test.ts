import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { test } from 'bun:test'

const catalog = JSON.parse(readFileSync(new URL('../assets/isometric/svg-repo/catalog-v0.1.json', import.meta.url), 'utf8')) as {
  schema_version: string
  authority: string
  assets: Array<{
    id: string
    asset_path: string
    source_page_url: string
    license: string
    appearance: string
    curated_sha256: string
    curated_file_bytes: number
    import_status: string
    browser_validation: string
  }>
}

test('SVG Repo asset pilot retains CC0 source provenance and a safe read-only presentation boundary', () => {
  assert.equal(catalog.schema_version, 'svg-repo-archetype-intake-v0.1')
  assert.equal(catalog.authority, 'presentation_only_noncanonical')
  assert.equal(catalog.assets.length, 1)
  const gavel = catalog.assets[0]!
  assert.equal(gavel.id, 'rules-gavel-flat-candidate')
  assert.equal(gavel.source_page_url, 'https://www.svgrepo.com/svg/418522/auction-gavel-judge')
  assert.equal(gavel.license, 'CC0-1.0')
  assert.equal(gavel.appearance, 'flat_emblem_requires_isometric_platform')
  assert.equal(gavel.import_status, 'asset_imported_not_rendered')
  assert.equal(gavel.browser_validation, 'not_performed')
})

test('curated gavel SVG is deterministic, bounded and contains only approved passive SVG primitives', () => {
  const gavel = catalog.assets[0]!
  const svg = readFileSync(new URL('../' + gavel.asset_path, import.meta.url), 'utf8')
  assert.equal(Buffer.byteLength(svg), gavel.curated_file_bytes)
  assert.equal(createHash('sha256').update(svg).digest('hex'), gavel.curated_sha256)
  assert.match(svg, /^<svg\s+viewBox="0 0 64 64"\s+xmlns="http:\/\/www\.w3\.org\/2000\/svg">/)
  assert.match(svg, /<\/svg>\s*$/)
  const tagNames = [...svg.matchAll(/<\/?([A-Za-z][\w.-]*)\b/g)].map(match => match[1])
  assert.ok(tagNames.length >= 2)
  assert.ok(tagNames.every(tag => ['svg', 'path', 'rect', 'polygon'].includes(tag)))
  assert.doesNotMatch(svg, /\b(?:onload|onclick|onerror|href|src|style)\s*=/i)
  assert.doesNotMatch(svg, /<\s*(?:script|foreignObject|image|use|animate|set|iframe)\b/i)
  assert.doesNotMatch(svg, /url\s*\(|javascript\s*:|data\s*:/i)
})
