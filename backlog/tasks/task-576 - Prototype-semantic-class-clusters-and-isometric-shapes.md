---
id: TASK-576
title: Prototype semantic class clusters and isometric shapes
status: In Progress
assignee: []
created_date: '2026-10-09 06:55'
updated_date: '2026-10-09 07:36'
labels: []
dependencies: []
references:
  - 'https://github.com/toasterman234/master-repo-0.1/issues/162'
  - backlog/docs/doc-1 - Semantic-city-layout-evaluation.md
  - backlog/docs/doc-2 - OpenClaw-upper-band-semantic-layout.md
  - src/sheet/place.ts
  - src/sheet/types.ts
  - src/sheet/measure.ts
  - src/viewers/web/iso/projection/project.ts
  - src/viewers/web/iso/painting/buildings.ts
  - src/sheet/forces.ts
modified_files:
  - src/sheet/presentation.ts
  - src/sheet/types.ts
  - src/sheet/measure.ts
  - src/sheet/pack.ts
  - src/sheet/pack-paths.ts
  - src/sheet/pack-forces.ts
  - src/sheet/place.ts
  - src/sheet/scene.ts
  - src/viewers/web/iso/projection/project.ts
  - src/viewers/web/iso/painting/buildings.ts
  - test-bun/semantic-class-clusters.test.ts
  - docs/viewers/web/class-clusters.md
  - docs/viewers/web/index.md
  - task_plan.md
  - findings.md
  - progress.md
  - src/viewers/web/chrome/class-layout.ts
  - src/viewers/web/page.ts
  - src/viewers/web/render.ts
  - test-bun/web-class-layout.test.ts
  - groma/systems/groma-md/components/class-layout.md
  - groma/systems/groma-md/containers/export/components/class-layout.md
  - groma/systems/groma-md/containers/export/components/render.md
  - groma/systems/groma-md/components/sheet-presentation.md
  - groma/systems/groma-md/containers/cli/components/sheet-presentation.md
  - groma/systems/groma-md/containers/cli/components/scene.md
priority: medium
type: feature
ordinal: 653000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
This explicitly approved exploratory prototype tests a separate presentation profile for semantic object classes and an opt-in class-cluster map in the isolated clone. It must demonstrate the requested visual vocabulary without changing canonical C4/ontology meaning, default layout behavior, or production systems. The supported result is a small real demo with deterministic geometry/layout evidence and a clear boundary around anything not implemented.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 A project-local presentation profile or demo projection maps Dataset, Service, Decision, Artifact, Event, Project, Rule, and Preference to explicit visual groups/shapes without changing canonical architecture or ontology semantics.
- [x] #2 The selectable class-clusters layout groups sample objects into visible class or major-family zones, exposes typed sibling/group/island spacing, preserves route clearance and hierarchy validity, and leaves the existing layout unchanged by default.
- [x] #3 Projected SVG geometry includes tested cylinder, hexagonal prism, and stacked slab footprints used by packing, labels, selection, and relationship endpoints; unknown classes retain the existing Groma default shape.
- [x] #4 Focused regression tests prove deterministic placement, spacing, valid hierarchy/routes, class-to-shape mapping, projection geometry, and default behavior preservation.
- [x] #5 Usage and test evidence document this as an exploratory in-memory prototype with no backend or Postgres integration; any feasible UI limitation is explicit.
- [x] #6 bun run check completes with its exit status recorded, and browser/DOM inspection is either performed and recorded or explicitly marked UNVERIFIED.
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [x] #1 Acceptance criteria have objective verification evidence.
- [x] #2 Relevant checks pass and changes remain task-scoped.
- [x] #3 Public contracts or documentation are updated when behavior changes.
- [x] #4 Implementation Plan reflects the final approach; correction history and verification are recorded in Implementation Notes.
<!-- DOD:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Trace current placement, measurement, projection, paint, UI view-mode, route, and test ownership; keep class meaning in a separate presentation profile/demo projection. 2. Add typed class shape/visual-group mapping and the three projected footprints while preserving unknown/default behavior. 3. Add opt-in class-clusters placement with typed sibling/group/island spacing and route-safe geometry, then expose only a bounded reusable demo/config surface if the existing UI can absorb it safely. 4. Add focused deterministic tests and usage documentation, run the repository check, inspect browser/DOM if available, review the diff, and leave the exploratory branch unmerged.

3. Add a small in-memory web control beside Map view: Original/Class clusters toggle, sibling/group/island spacing inputs, and explicit class assignment for the selected existing element; retarget the existing map animator and preserve live payload resets.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Governance and overlap review completed before implementation. Durable Explore record: https://github.com/toasterman234/master-repo-0.1/issues/162. The project backlog CLI was unavailable on PATH, so all required commands are being run through the locked Backlog.md package via bun x backlog.md; no task Markdown is edited directly.

Implemented the typed exploratory presentation profile, class-clusters preset, sibling/group/island spacing options, cylinder/hex-prism/stacked-slab projected geometry, SVG metadata, focused regression tests, and usage docs. Focused evidence: 5/5 new tests, 39/39 existing sheet/route/projection tests, and bun run typecheck pass. Browser/DOM inspection remains unverified; no web settings controls were added because the supported surface is the typed in-memory API.

Verification: focused affected suite passes 58/58 and bun run typecheck passes. Required bun run check exits 1 with 775 pass, 51 skip, 6 fail; every failure is a Swift worker build missing SwiftParser in the local CommandLineTools environment.

Reconciled prior task-scoped root planning files after verifying their contents and ownership; Backlog TASK-576 is now the plan and evidence record.

2026-10-09 follow-up: fixed the web renderer to retain serverSheet, refresh it from every live payload, and use it for Original; class-clusters still computes a separate sheet. Added resolveClassLayoutSheet and a regression covering toggle back to the exact initial sheet identity/geometry plus the latest live payload sheet. Verified bun run typecheck, focused class-layout/class-cluster tests (9/9), and git diff --check pass. Browser/DOM inspection remains UNVERIFIED; full bun run check is still pending.

2026-10-09 final verification: full bun run check ran to completion and exited 1: 779 pass, 51 skip, 6 fail across 836 tests. All six failures are Swift worker tests blocked by the local environment's missing SwiftParser/Apple SDK modules; no task-owned class-layout test failed. The focused class-layout/class-cluster suite is 9/9 and typecheck passes. Browser proof was attempted by launching the local web map, but the available macOS window helper failed because its native helper binary is missing; browser/DOM proof remains UNVERIFIED. Groma scan outputs were folded into the existing render and scene owners; no stand-alone task-owned Groma components remain. Task remains In Progress.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Implemented the isolated exploratory semantic class-cluster presentation slice: explicit Dataset/Service/Decision/Artifact/Event/Project/Rule/Preference mapping, opt-in typed class-cluster spacing, cylinder/hex-prism/stacked-slab projection geometry, in-memory Layout controls, SVG metadata, focused regressions, and usage docs. The renderer now preserves the latest server-delivered sheet for Original across toggles and live payloads. Verified typecheck, focused tests (9/9), and diff hygiene. Required bun run check exits 1 with 779 pass, 51 skip, and 6 SwiftParser/Apple SDK-blocked failures. Browser/DOM inspection is UNVERIFIED because the local macOS helper binary is unavailable. No merge, deploy, backend, Postgres integration, or production adoption was performed.
<!-- SECTION:FINAL_SUMMARY:END -->
