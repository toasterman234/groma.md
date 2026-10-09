# SVG Repo isometric asset intake — exploratory selection

**Decision (2026-10-09):** SVG Repo is the first asset source for Groma's semantic isometric objects. **Source selection is not asset approval**; no claim is made that all proposed objects already exist as usable isometric SVGs.

This document is the follow-up to [master-repo-0.1 issue #162](https://github.com/toasterman234/master-repo-0.1/issues/162). The Groma class-clusters proof is separate and remains a non-canonical presentation prototype.

## Exact user-selected candidate vocabulary

| Presentation category | Preferred SVG archetypes, in user-listed order |
|---|---|
| Data source | Tower; Cabinet; Repository shelf |
| Dataset | Data cube; Ledger stack |
| Decisions | Stamped card; Forked path marker |
| Artifacts | Document stack; Archive binder |
| Services | Appliance box; Machine module |
| Activity | Moving conveyor segment; Kinetic slab |
| Events | Spark emitter; Timestamp pillar |
| Experiments | Lab flask; Test bench |
| Projects | Program board; Stacked milestone block |
| Rules | Gavel; Rulebook |
| Policies | Policy binder; Governance pillar |
| Playbooks | Open manual; Procedure board |
| Skills | Skill card; Badge |
| Preferences | Personal settings card; Slider board |

**Totals:** 14 categories, 29 possible archetypes. Every entry remains `candidate / not reviewed` unless explicitly marked otherwise in a versioned asset record. Do not silently replace an archetype with a flat generic icon or with an assistant-suggested alternative.

## Verified browse sources and initial candidates

| Target | Source | Page-declared license | Status |
|---|---|---|---|
| Data source / Tower | https://www.svgrepo.com/svg/352957/tower-server | CC0 | License checked; actual geometry/compatibility unreviewed |
| Data source / Tower, Cabinet alternatives | https://www.svgrepo.com/collection/servers-isometric-icons/ | **Not one common license** — inspect each individual icon | Collection verified; individual assets unreviewed |
| Data source / modular rack alternative | https://www.svgrepo.com/svg/474398/1u-server | CC0 (individual SVG page) | From the isometric-server family; SVG bytes and perspective not yet independently inspected |
| Rules / Gavel | https://www.svgrepo.com/svg/418522/auction-gavel-judge | CC0 | License checked; artwork may be flat / visual fit unreviewed |
| Rules / Gavel alternatives | https://www.svgrepo.com/vectors/gavel/ | Per-icon; inspect each | Search landing page only |
| General source | https://www.svgrepo.com/collections/isometric/ | Per-icon; inspect each | Isometric collection directory |

See https://www.svgrepo.com/page/licensing/ for SVG Repo license families. Avoid broad redistribution of SVG Repo's catalogue. Carry source URL, exact license, attribution and any modification terms with each asset. Only import files whose actual license permits the intended usage. **CC0 applies to the two individual candidate pages above, not the whole collection.**

## Asset record contract — proposed

Each selected icon record must have:
- `category`, `archetype` (one of the exact 29 labels), `source_page_url`
- `source_download_url` and `sha256` of the actually obtained SVG; neither may be guessed
- `license`, `attribution` or notice requirements and evidence of license check
- `view_type`: `isometric`, `flat`, or `unverified` after visual inspection
- `import_status`: `candidate`, `reviewed`, `rejected`, `imported`
- `fit`: SVG viewBox, visible silhouette bounds, Groma footprint/hit area and optional cardinal connection anchors
- `mapping`: stable ontology class/subtype/object-override mapping, separate from canonical facts

## Smallest implementation proof

1. Evaluate **Tower** and **Gavel**, one SVG each. Verify actual SVG bytes, individual license, and appearance. A flat gavel can be shown as a fixed-angle emblem on an isometric plinth only if explicitly labeled as a hybrid; never claim it becomes a 3D mesh.
2. Sanitize locally imported SVGs before rendering (reject active content, script, event handlers, foreignObject, external refs, untrusted URL loads). Never live-load third-party SVG into map at runtime.
3. Keep multiple separate data-source and rule object instances even if they share the same illustration; retain distinct IDs, labels, selected/highlighted state, source references and route endpoints.
4. Unit/geometry and real DOM/visual proof must cover zoom, hit selection, edge clipping, native Iso and 2D layout, and accessible labels. Falling back to the existing Groma geometry remains safe.
5. No canonical ontology, LinkML schema, PostgreSQL, runtime, or production merge change without a separately approved integration gate.

**Boundary:** The 29-item intake is an asset-design selection, not 29 licensed/vetted downloads or a fully implemented object library.
