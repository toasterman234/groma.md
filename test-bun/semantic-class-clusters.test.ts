import assert from 'node:assert/strict'
import { test } from 'bun:test'

import { createPresentationProfile, EXPLORATORY_PRESENTATION_PROFILE } from '../src/sheet/presentation.ts'
import { sheetScene } from '../src/sheet/scene.ts'
import { cylinderOutline, hexPrismOutline, polygonPrismFaces, projectScene, stackedSlabFaces } from '../src/viewers/web/iso/projection/project.ts'
import { buildingsSvg } from '../src/viewers/web/iso/painting/buildings.ts'
import { markup } from '../src/viewers/web/iso/painting/svg.ts'
import { box, uses, worldOf } from './helpers.ts'

const unit = { x: 0, y: 0, width: 1, height: 1 }

function classWorld() {
  return worldOf([
    box('shop', 'system', unit),
    box('api', 'container', unit, { parent: 'observed:shop' }),
    ...[
      ['dataset', 'Dataset'],
      ['service', 'Service'],
      ['decision', 'Decision'],
      ['artifact', 'Artifact'],
      ['event', 'Event'],
      ['project', 'Project'],
      ['rule', 'Rule'],
      ['preference', 'Preference'],
    ].map(([id]) => box(id, 'component', unit, { parent: 'observed:api' })),
    box('vendor', 'system', unit, { external: true }),
    box('mystery', 'component', unit, { parent: 'observed:api' }),
  ], [
    uses('dataset-uses-service', 'dataset', 'service'),
  ])
}

const profile = createPresentationProfile({
  'observed:dataset': 'Dataset',
  'observed:service': 'Service',
  'observed:decision': 'Decision',
  'observed:artifact': 'Artifact',
  'observed:event': 'Event',
  'observed:project': 'Project',
  'observed:rule': 'Rule',
  'observed:preference': 'Preference',
})

function gapBetween(left: { gx: number; gy: number; w: number; d: number }, right: { gx: number; gy: number; w: number; d: number }): number {
  const x = Math.max(left.gx - (right.gx + right.w), right.gx - (left.gx + left.w))
  const y = Math.max(left.gy - (right.gy + right.d), right.gy - (left.gy + left.d))
  return Math.max(x, y)
}

test.concurrent('the exploratory profile maps all eight classes and leaves unknown classes for default fallback', () => {
  assert.deepEqual(Object.keys(EXPLORATORY_PRESENTATION_PROFILE.shapeByClass).sort(), [
    'Artifact', 'Dataset', 'Decision', 'Event', 'Preference', 'Project', 'Rule', 'Service',
  ])
  const scene = sheetScene(classWorld(), { layout: 'class-clusters', presentation: profile })
  const buildings = new Map(scene.buildings.map(building => [building.id, building]))
  assert.equal(buildings.get('dataset')?.shape.kind, 'cylinder')
  assert.equal(buildings.get('service')?.shape.kind, 'hex-prism')
  assert.equal(buildings.get('decision')?.shape.kind, 'stacked-slab')
  assert.equal(buildings.get('artifact')?.shape.kind, 'block')
  assert.equal(buildings.get('event')?.shape.kind, 'pill')
  assert.equal(buildings.get('project')?.shape.kind, 'block')
  assert.equal(buildings.get('rule')?.shape.kind, 'hex-prism')
  assert.equal(buildings.get('preference')?.shape.kind, 'cylinder')
  assert.equal(buildings.get('mystery')?.shape.kind, 'block')
  assert.equal(buildings.get('mystery')?.objectClass, undefined)
  assert.equal(scene.routes.length, 1)
})

test.concurrent('class-clusters is deterministic, creates visible family zones, and respects configured gaps', () => {
  const options = { layout: 'class-clusters' as const, presentation: profile, spacing: { siblingGap: 5, groupGap: 6, islandGap: 7 } }
  const first = sheetScene(classWorld(), options)
  const second = sheetScene(classWorld(), options)
  assert.deepEqual(second, first)
  assert.deepEqual(first.zones.map(zone => zone.name).sort(), ['Data', 'Delivery', 'Governance', 'Interaction', 'Runtime'])
  const delivery = first.zones.find(zone => zone.name === 'Delivery')!
  const members = first.buildings.filter(building => delivery.members.includes(building.representationId))
  assert.equal(members.length, 2)
  assert.ok(gapBetween(members[0]!.rect, members[1]!.rect) >= 6)
  for (const zone of first.zones) {
    for (const member of first.buildings.filter(building => zone.members.includes(building.representationId))) {
      assert.ok(member.rect.gx >= zone.rect.gx && member.rect.gy >= zone.rect.gy)
      assert.ok(member.rect.gx + member.rect.w <= zone.rect.gx + zone.rect.w)
      assert.ok(member.rect.gy + member.rect.d <= zone.rect.gy + zone.rect.d)
    }
  }
  assert.equal(first.routes.length, 1)
  assert.ok(first.routes.every(route => route.points.every(point => Number.isFinite(point.gx) && Number.isFinite(point.gy))))
})

test.concurrent('default layout and default shapes remain unchanged without the opt-in profile', () => {
  const world = classWorld()
  assert.deepEqual(sheetScene(world), sheetScene(world, { layout: 'default' }))
  assert.ok(sheetScene(world).buildings.every(building => building.shape.kind === 'block' || building.kind === 'actor' || building.external))
})

test.concurrent('projected shape geometry supplies cylinder, hexagonal prism, and stacked slab faces to SVG paint', () => {
  const rect = { gx: 2, gy: 3, w: 4, d: 4 }
  assert.equal(cylinderOutline(rect).length, 32)
  assert.equal(hexPrismOutline(rect).length, 6)
  const hexFaces = polygonPrismFaces(hexPrismOutline(rect), 0, 1)
  assert.equal(hexFaces.at(-1)?.side, 'top')
  assert.equal(hexFaces.at(-1)?.points.length, 6)
  assert.equal(stackedSlabFaces(rect, 0, 1).length, 3)
  const scene = sheetScene(classWorld(), { layout: 'class-clusters', presentation: profile })
  const svg = markup(buildingsSvg(projectScene(scene)))
  assert.match(svg, /shape-cylinder/)
  assert.match(svg, /shape-hex-prism/)
  assert.match(svg, /shape-stacked-slab/)
  assert.match(svg, /data-object-class="Dataset"/)
  assert.match(svg, /data-visual-group="Runtime"/)
})

test.concurrent('larger class-cluster spacing expands the demo without changing route ownership', () => {
  const world = classWorld()
  const compact = sheetScene(world, { layout: 'class-clusters', presentation: profile, spacing: { siblingGap: 2, groupGap: 2, islandGap: 3 } })
  const spacious = sheetScene(world, { layout: 'class-clusters', presentation: profile, spacing: { siblingGap: 5, groupGap: 5, islandGap: 8 } })
  assert.ok(spacious.sheet.w >= compact.sheet.w)
  assert.ok(spacious.sheet.d >= compact.sheet.d)
  assert.deepEqual(spacious.routes.map(route => [route.source, route.target]), compact.routes.map(route => [route.source, route.target]))
})
