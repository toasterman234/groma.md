import assert from 'node:assert/strict'
import { test } from 'bun:test'

import {
  classLayoutControl,
  classLayoutCss,
  classLayoutOptions,
  createClassLayoutState,
  resolveClassLayoutSheet,
  retainClassAssignments,
  resolveClassComponentChoice,
} from '../src/viewers/web/chrome/class-layout.ts'
import { box, worldOf } from './helpers.ts'

const unit = { x: 0, y: 0, width: 1, height: 1 }

test.concurrent('class layout state is original by default and opts into explicit class-cluster options', () => {
  const state = createClassLayoutState()
  assert.equal(state.preset, 'default')
  assert.deepEqual(classLayoutOptions(state), { layout: 'default' })

  state.preset = 'class-clusters'
  state.spacing = { siblingGap: 4, groupGap: 5, islandGap: 6 }
  state.classByElementId.set('observed:api', 'Service')
  const options = classLayoutOptions(state)
  assert.equal(options.layout, 'class-clusters')
  assert.deepEqual(options.spacing, state.spacing)
  const presentation = options.presentation!
  assert.equal(presentation.classByElementId instanceof Map, true)
  assert.equal((presentation.classByElementId as Map<string, string>).get('observed:api'), 'Service')
})

test.concurrent('Original restores the delivered sheet identity through toggle and live payload refresh', () => {
  const world = worldOf([
    box('system', 'system', unit),
    box('component', 'component', unit, { parent: 'observed:system' }),
  ])
  const initialServerSheet = world.sheet
  const state = createClassLayoutState()

  assert.equal(resolveClassLayoutSheet(initialServerSheet, world, state), initialServerSheet)
  state.preset = 'class-clusters'
  assert.notEqual(resolveClassLayoutSheet(initialServerSheet, world, state), initialServerSheet)
  state.preset = 'default'
  const restored = resolveClassLayoutSheet(initialServerSheet, world, state)
  assert.equal(restored, initialServerSheet)
  assert.deepEqual(restored, initialServerSheet)

  const liveWorld = worldOf([
    box('system', 'system', { x: 1, y: 2, width: 2, height: 2 }),
    box('component', 'component', { x: 1, y: 2, width: 2, height: 2 }, { parent: 'observed:system' }),
  ])
  const liveServerSheet = liveWorld.sheet
  assert.equal(resolveClassLayoutSheet(liveServerSheet, liveWorld, state), liveServerSheet)
  assert.deepEqual(resolveClassLayoutSheet(liveServerSheet, liveWorld, state), liveServerSheet)
})

test.concurrent('class assignments only retain existing components across a live world update', () => {
  const state = createClassLayoutState()
  state.classByElementId.set('observed:live', 'Dataset')
  state.classByElementId.set('observed:gone', 'Artifact')
  retainClassAssignments(state, worldOf([box('live', 'component', unit)]))
  assert.deepEqual([...state.classByElementId], [['observed:live', 'Dataset']])
})

test.concurrent('the map control exposes both layout modes, typed spacing, and all explicit classes', () => {
  const markup = classLayoutControl()
  for (const id of ['class-layout-mode', 'class-layout-sibling', 'class-layout-group', 'class-layout-island', 'class-layout-component', 'class-layout-class', 'class-layout-assign']) {
    assert.equal(markup.includes(`id="${id}"`), true)
  }
  for (const objectClass of ['Dataset', 'Service', 'Decision', 'Artifact', 'Event', 'Project', 'Rule', 'Preference']) {
    assert.equal(markup.includes(`value="${objectClass}"`), true)
  }
  assert.match(markup, /Original/)
  assert.match(markup, /Class clusters/)
})

test.concurrent('the Layout control clears the normal native details inspector', () => {
  assert.match(classLayoutCss, /right: calc\(var\(--details-inset\) \+ 24px\)/)
  assert.match(classLayoutCss, /top: 74px; right: calc\(var\(--details-inset\) \+ 24px\); z-index: 7/)
})

test.concurrent('direct component choice works without map selection and tracks new map picks', () => {
  const world = worldOf([
    box('system', 'system', unit),
    box('first', 'component', unit, { parent: 'observed:system' }),
    box('second', 'component', unit, { parent: 'observed:system' }),
  ])
  const first = world.elements.find(item => item.representationId === 'observed:first')!
  const second = world.elements.find(item => item.representationId === 'observed:second')!
  const system = world.elements.find(item => item.kind === 'system')!
  const components = world.elements.filter(item => item.kind === 'component')
  assert.equal(resolveClassComponentChoice(components, system, undefined, first.representationId), first.representationId)
  assert.equal(resolveClassComponentChoice(components, undefined, undefined, second.representationId), second.representationId)
  assert.equal(resolveClassComponentChoice(components, first, undefined, second.representationId), first.representationId)
  assert.equal(resolveClassComponentChoice(components, first, first.representationId, second.representationId), second.representationId)
  assert.equal(resolveClassComponentChoice(components, system, undefined, 'observed:gone'), undefined)
})
