# Exploratory ontology-isometric layout prototype

## Goal
Implement the approved isolated-clone prototype only in this checkout: a project-local semantic presentation profile, selectable class-cluster layout, typed spacing controls, three projected isometric SVG shapes, minimal usable exposure where safe, and focused regression coverage. Canonical architecture/ontology and default layout remain unchanged. This is exploratory and must not be merged or treated as production adoption.

## Current phase
Phase 2 — typed presentation profile, shapes, and class-cluster placement (`in_progress`)

Phase 1 complete: governance, pinned-layout docs, open-task overlap search, branch creation, TASK-576 creation, dependency restoration, and source ownership trace are recorded in findings/progress and TASK-576.

## Phases
- [ ] Phase 1: Governance, Backlog task, branch, overlap review, and source trace
- [ ] Phase 2: Typed presentation profile, shapes, projection, and class-cluster layout vertical slice
- [ ] Phase 3: Minimal UI/demo exposure and focused regression tests
- [ ] Phase 4: Documentation, full checks, review, commit, and optional draft PR

## Acceptance ledger
- [ ] Explicit semantic `objectClass` or demo `classByElementId` maps to shape and visual group without changing C4/ontology semantics.
- [ ] Dataset, Service, Decision, Artifact, Event, Project, Rule, and Preference examples are represented.
- [ ] `class-clusters` is selectable and leaves original layout unchanged by default.
- [ ] Typed sibling/group/island spacing controls are exposed at the smallest sensible boundary.
- [ ] Cylinder, hexagonal prism, and stacked slab projected SVG shapes have geometry used by packing and relationships; labels and selection remain valid.
- [ ] Unknown classes preserve existing Groma default shape behavior.
- [ ] View modes 2D/Iso/Layers and SVG camera paint rules remain intact.
- [ ] Focused tests cover determinism, spacing, hierarchy/routes, mapping, geometry, and default preservation.
- [ ] `bun run check` passes; exact exit status and HEAD recorded.
- [ ] Browser/DOM inspection is run if feasible; otherwise explicitly marked UNVERIFIED.
- [ ] Exploratory branch is committed only with task files; draft PR is opened only if credentials allow; never merge.

## Test additions authority and gap
- Supported rule: user-approved exploratory request above.
- Incorrect result detected: class-aware shape/layout behavior could silently alter default architecture rendering or produce invalid routes/overlaps.
- Coverage gap: existing tests cover current placement/projection but not project-local class mapping, class clusters, or the requested projected footprints; add the smallest focused tests beside the owning modules.

## Decisions made
| Decision | Reason |
|---|---|
| Keep semantic classes in a presentation profile/demo projection, not `technology` or C4 kinds | Preserve canonical architecture and make the exploratory meaning explicit. |
| Keep original layout as default and add `class-clusters` as a separate strategy | Requested opt-in exploration and protects existing map behavior. |
| Prefer typed in-memory config over backend/editor work | Smallest real prototype; no Postgres/backend integration is in scope. |

## Errors and blockers
| Attempt | Error | Resolution |
|---|---|---|
| 1 | `backlog instructions overview` unavailable (`backlog: command not found`) | Blocker to resolve by locating the project CLI/tooling without editing task records manually. |
| 1 | preflight failed because Redis container is not running | Record as environment limitation; do not start unrelated infrastructure without need. |
| 1 | `groma agent-instructions` unavailable (`groma: command not found`) | Locate project-local executable/package before scanner/architecture work. |
| 1 | First discovery shell had unescaped `find` parentheses | Use a changed shell command; no repository impact. |
