import type { AnnotatedElement, ArchitectureGraph } from '../../../types.ts'
import { sheetScene } from '../../../sheet/scene.ts'
import type { SheetScene } from '../../../sheet/types.ts'
import {
  createPresentationProfile,
  resolveSheetLayoutOptions,
  SEMANTIC_OBJECT_CLASSES,
  type LayoutPreset,
  type LayoutSpacing,
  type SheetLayoutOptions,
} from '../../../sheet/presentation.ts'
import type { SemanticObjectClass } from '../../../sheet/types.ts'

export interface ClassLayoutState {
  preset: LayoutPreset
  spacing: LayoutSpacing
  classByElementId: Map<string, SemanticObjectClass>
}

export interface ClassLayoutControlOptions {
  state: ClassLayoutState
  selected: () => AnnotatedElement | undefined
  apply: () => void
}

export interface ClassLayoutControlBinding {
  refresh(): void
}

export function createClassLayoutState(): ClassLayoutState {
  return {
    preset: 'default',
    spacing: { ...resolveSheetLayoutOptions().spacing },
    classByElementId: new Map(),
  }
}

export function classLayoutOptions(state: ClassLayoutState): SheetLayoutOptions {
  if (state.preset === 'default') return { layout: 'default' }
  return {
    layout: 'class-clusters',
    presentation: createPresentationProfile(state.classByElementId),
    spacing: { ...state.spacing },
  }
}

export function resolveClassLayoutSheet(serverSheet: SheetScene, world: ArchitectureGraph, state: ClassLayoutState): SheetScene {
  return state.preset === 'default' ? serverSheet : sheetScene(world, classLayoutOptions(state))
}

/** Keeps the presentation profile in memory while dropping assignments for disappeared components. */
export function retainClassAssignments(state: ClassLayoutState, world: ArchitectureGraph): void {
  const components = new Set(world.elements.filter(element => element.kind === 'component').map(element => element.representationId))
  for (const id of state.classByElementId.keys()) {
    if (!components.has(id)) state.classByElementId.delete(id)
  }
}

export function classLayoutControl(): string {
  const classes = SEMANTIC_OBJECT_CLASSES.map(objectClass => `<option value="${objectClass}">${objectClass}</option>`).join('')
  return `<details id="class-layout" class="floating-map-bar"><summary aria-label="Presentation layout" title="Presentation layout"><span>Layout</span><span class="class-layout-chevron"></span></summary><div class="class-layout-popover" role="group" aria-label="Presentation layout controls"><label>Mode<select id="class-layout-mode"><option value="default">Original</option><option value="class-clusters">Class clusters</option></select></label><label>Sibling spacing<span class="class-layout-range"><input id="class-layout-sibling" type="range" min="2" max="12" step="1"><output for="class-layout-sibling"></output></span></label><label>Group spacing<span class="class-layout-range"><input id="class-layout-group" type="range" min="2" max="12" step="1"><output for="class-layout-group"></output></span></label><label>Island spacing<span class="class-layout-range"><input id="class-layout-island" type="range" min="3" max="16" step="1"><output for="class-layout-island"></output></span></label><fieldset><legend>Selected component</legend><output id="class-layout-selection" aria-live="polite"></output><label>Class<select id="class-layout-class"><option value="">Unassigned</option>${classes}</select></label><button id="class-layout-assign" type="button">Assign class</button></fieldset></div></details>`
}

export function bindClassLayoutControl(host: HTMLElement, options: ClassLayoutControlOptions): ClassLayoutControlBinding {
  const mode = host.querySelector<HTMLSelectElement>('#class-layout-mode')!
  const sibling = host.querySelector<HTMLInputElement>('#class-layout-sibling')!
  const group = host.querySelector<HTMLInputElement>('#class-layout-group')!
  const island = host.querySelector<HTMLInputElement>('#class-layout-island')!
  const ranges = [[sibling, 'siblingGap'], [group, 'groupGap'], [island, 'islandGap']] as const
  const classSelect = host.querySelector<HTMLSelectElement>('#class-layout-class')!
  const assign = host.querySelector<HTMLButtonElement>('#class-layout-assign')!
  const selection = host.querySelector<HTMLOutputElement>('#class-layout-selection')!
  const updateSpacing = (): void => {
    for (const [input, key] of ranges) options.state.spacing[key] = Number(input.value)
    options.apply()
  }
  mode.addEventListener('change', () => {
    options.state.preset = mode.value as LayoutPreset
    options.apply()
  })
  for (const [input] of ranges) input.addEventListener('input', updateSpacing)
  assign.addEventListener('click', () => {
    const selected = options.selected()
    if (selected?.kind !== 'component') return
    if (classSelect.value === '') options.state.classByElementId.delete(selected.representationId)
    else options.state.classByElementId.set(selected.representationId, classSelect.value as SemanticObjectClass)
    options.apply()
  })
  const refresh = (): void => {
    mode.value = options.state.preset
    for (const [input, key] of ranges) {
      input.value = String(options.state.spacing[key])
      input.nextElementSibling!.textContent = input.value
    }
    const selected = options.selected()
    const component = selected?.kind === 'component' ? selected : undefined
    selection.textContent = component?.title ?? 'Select a component on the map'
    classSelect.value = component === undefined ? '' : options.state.classByElementId.get(component.representationId) ?? ''
    classSelect.disabled = component === undefined
    assign.disabled = component === undefined
  }
  refresh()
  return { refresh }
}

export const classLayoutCss = `
  #class-layout {
    position: absolute; top: 74px; right: 24px; z-index: 7; display: block;
  }
  #class-layout > summary { display: flex; align-items: center; gap: 8px; height: 34px; padding: 0 12px; cursor: pointer; list-style: none; }
  #class-layout > summary::-webkit-details-marker { display: none; }
  #class-layout[open] > summary { color: var(--ink); }
  .class-layout-chevron { width: 6px; height: 6px; border-right: 1px solid currentColor; border-bottom: 1px solid currentColor; transform: rotate(45deg) translateY(-2px); }
  #class-layout[open] .class-layout-chevron { transform: rotate(225deg) translate(-1px, -1px); }
  .class-layout-popover { position: absolute; top: calc(100% + 8px); right: 0; width: 230px; display: grid; gap: 10px; padding: 14px; border: 1px solid var(--hairline); border-radius: 10px; background: var(--paper); box-shadow: 0 8px 24px #0002; }
  .class-layout-popover label, .class-layout-popover fieldset { display: grid; gap: 5px; }
  .class-layout-popover label, .class-layout-popover legend { color: var(--muted); font-size: 11px; }
  .class-layout-popover select, .class-layout-popover button { min-height: 30px; border: 1px solid var(--hairline); border-radius: var(--control-radius); background: var(--paper); padding: 5px 8px; }
  .class-layout-popover select { color: var(--ink); }
  .class-layout-popover fieldset { min-width: 0; margin: 2px 0 0; border: 0; border-top: 1px solid var(--hairline); padding: 10px 0 0; }
  .class-layout-popover legend { padding: 0; }
  .class-layout-popover output { min-height: 18px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--ink); }
  .class-layout-range { display: grid; grid-template-columns: 1fr 26px; align-items: center; gap: 8px; }
  .class-layout-range output { text-align: right; }
  .class-layout-popover input[type="range"] { width: 100%; accent-color: var(--ink); }
  .class-layout-popover button { cursor: pointer; color: var(--ink); }
  .class-layout-popover button:hover:not(:disabled) { background: var(--hover); }
  .class-layout-popover button:disabled, .class-layout-popover select:disabled { cursor: not-allowed; opacity: .5; }
  body.hud-hidden #class-layout { display: none; }
  @media (prefers-reduced-motion: reduce) { #class-layout .class-layout-chevron { transition: none; } }
`
