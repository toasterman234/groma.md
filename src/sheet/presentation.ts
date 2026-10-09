import type { AnnotatedElement } from '../types.ts'
import { GAP, ISLAND_GAP } from './forces.ts'
import type { SemanticObjectClass, Shape } from './types.ts'

export const SEMANTIC_OBJECT_CLASSES = [
  'Dataset', 'Service', 'Decision', 'Artifact', 'Event', 'Project', 'Rule', 'Preference',
] as const satisfies readonly SemanticObjectClass[]

export type LayoutPreset = 'default' | 'class-clusters'

export interface LayoutSpacing {
  /** Minimum air between sibling envelopes, in sheet cells. */
  siblingGap: number
  /** Minimum air used when packing members inside a semantic class zone, in sheet cells. */
  groupGap: number
  /** Minimum air between top-level islands, in sheet cells. */
  islandGap: number
}

export interface PresentationProfile {
  /** Explicit demo projection; architecture elements remain unchanged. */
  classByElementId: ReadonlyMap<string, SemanticObjectClass> | Readonly<Record<string, SemanticObjectClass>>
  shapeByClass: Readonly<Record<SemanticObjectClass, Shape>>
  visualGroupByClass: Readonly<Record<SemanticObjectClass, string>>
}

export interface SheetLayoutOptions {
  layout?: LayoutPreset
  presentation?: PresentationProfile
  spacing?: Partial<LayoutSpacing>
}

export interface ResolvedSheetLayoutOptions {
  layout: LayoutPreset
  presentation?: PresentationProfile
  spacing: LayoutSpacing
}

const CLASS_SHAPES: Record<SemanticObjectClass, Shape> = {
  Dataset: { kind: 'cylinder' },
  Service: { kind: 'hex-prism' },
  Decision: { kind: 'stacked-slab' },
  Artifact: { kind: 'block' },
  Event: { kind: 'pill' },
  Project: { kind: 'block' },
  Rule: { kind: 'hex-prism' },
  Preference: { kind: 'cylinder' },
}

const CLASS_GROUPS: Record<SemanticObjectClass, string> = {
  Dataset: 'Data',
  Service: 'Runtime',
  Decision: 'Governance',
  Artifact: 'Delivery',
  Event: 'Interaction',
  Project: 'Delivery',
  Rule: 'Governance',
  Preference: 'Governance',
}

/** The eight-class visual vocabulary used by the isolated prototype fixture. */
export const EXPLORATORY_PRESENTATION_PROFILE: PresentationProfile = {
  classByElementId: {
    'observed:dataset': 'Dataset',
    'observed:service': 'Service',
    'observed:decision': 'Decision',
    'observed:artifact': 'Artifact',
    'observed:event': 'Event',
    'observed:project': 'Project',
    'observed:rule': 'Rule',
    'observed:preference': 'Preference',
  },
  shapeByClass: CLASS_SHAPES,
  visualGroupByClass: CLASS_GROUPS,
}

export function createPresentationProfile(
  classByElementId: PresentationProfile['classByElementId'],
): PresentationProfile {
  return { classByElementId, shapeByClass: CLASS_SHAPES, visualGroupByClass: CLASS_GROUPS }
}

export function resolveSheetLayoutOptions(options: SheetLayoutOptions = {}): ResolvedSheetLayoutOptions {
  return {
    layout: options.layout ?? 'default',
    presentation: options.presentation,
    spacing: {
      siblingGap: Math.max(GAP, Math.floor(options.spacing?.siblingGap ?? GAP)),
      groupGap: Math.max(GAP, Math.floor(options.spacing?.groupGap ?? GAP)),
      islandGap: Math.max(ISLAND_GAP, Math.floor(options.spacing?.islandGap ?? ISLAND_GAP)),
    },
  }
}

function classValue(profile: PresentationProfile | undefined, element: AnnotatedElement): SemanticObjectClass | undefined {
  const source = profile?.classByElementId
  if (source === undefined) return undefined
  return source instanceof Map
    ? source.get(element.representationId)
    : (source as Readonly<Record<string, SemanticObjectClass>>)[element.representationId]
}

export function objectClassOf(profile: PresentationProfile | undefined, element: AnnotatedElement): SemanticObjectClass | undefined {
  return classValue(profile, element)
}

export function shapeFor(
  profile: PresentationProfile | undefined,
  element: AnnotatedElement,
  fallback: Shape,
): Shape {
  const objectClass = classValue(profile, element)
  return objectClass === undefined ? fallback : profile!.shapeByClass[objectClass] ?? fallback
}

export function visualGroupFor(
  profile: PresentationProfile | undefined,
  element: AnnotatedElement,
): string | undefined {
  const objectClass = classValue(profile, element)
  return objectClass === undefined ? undefined : profile!.visualGroupByClass[objectClass] ?? objectClass
}
