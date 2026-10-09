# Semantic class-cluster prototype

This is an exploratory Groma presentation slice, not a replacement architecture model.

## Meaning boundary

The architecture remains the same OKF/C4 world: elements keep their existing `kind`, parent, relationship, and `technology` values. A presentation profile is supporting Groma-specific knowledge supplied at render time. An ordinary Markdown reader therefore sees no new ontology field; Groma interprets the profile only when composing the sheet.

The profile's `classByElementId` map is an explicit demo projection. `Dataset`, `Service`, `Decision`, `Artifact`, `Event`, `Project`, `Rule`, and `Preference` are presentation classes, not C4 abstractions. Their `shapeByClass` and `visualGroupByClass` entries own only visual encoding and zone labels.

## In-memory usage

```ts
import { sheetScene } from '../../../src/sheet/scene.ts'
import { createPresentationProfile } from '../../../src/sheet/presentation.ts'

const presentation = createPresentationProfile({
  'observed:orders': 'Dataset',
  'observed:api': 'Service',
})

const scene = sheetScene(world, {
  layout: 'class-clusters',
  presentation,
  spacing: { siblingGap: 4, groupGap: 5, islandGap: 6 },
})
```

`sheetScene(world)` remains the default layout and default C4-kind shape behavior. Unknown or unmapped classes use the existing fallback: actors are round, external systems are pills, and other elements are blocks. The class-cluster preset groups mapped siblings into visible family zones and routes the resulting scene through the existing route solver.

The exploratory shape vocabulary is:

- `Dataset` and `Preference`: cylinder
- `Service` and `Rule`: hexagonal prism
- `Decision`: stacked slab
- `Artifact` and `Project`: block
- `Event`: pill

The projected geometry is shared by labels, selection groups, and relationship endpoint clipping. The typed spacing object keeps sibling, class-zone, and top-level island gaps explicit.

## Web proof

Open the Groma web map and use **Layout** beside the Iso/2D/Layers control. **Original** keeps the normal map. **Class clusters** enables the exploratory profile; sibling, group, and island spacing retarget the existing map animation immediately. Choose a component in the Layout **Component** selector (or click it on the map), choose one of the eight classes, and select **Assign class**. The panel shows **Current: Dataset · session only** (for example), annotates assigned components in the selector, and announces **Assigned [component] → [class] · session only** after applying. It also focuses/highlights the chosen component through normal map selection; the existing map animator transitions its geometry where applicable. In **Original** mode the assignment is retained but does not change the visible shape until **Class clusters** is selected. Assigning a class again uses **Update class**, while **Unassigned** clears its presentation class. The assignment is keyed by the component representation id, changes only the in-memory presentation profile, and does not infer from C4 `kind` or `technology`.

Live world updates keep assignments whose component ids still exist and drop assignments for disappeared components. Returning to **Original** uses the server's normal sheet, so the default map and relationships remain unchanged.

This prototype does not add a backend, Postgres integration, or persisted object classes. The control is included in the browser bundle; browser/DOM inspection remains separate evidence and is not implied by the unit tests.

Focused evidence:

```sh
bun test --timeout 20000 test-bun/semantic-class-clusters.test.ts
bun run typecheck
```
