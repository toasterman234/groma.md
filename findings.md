# Findings

- Checkout: `/Users/bencharney/groma-iso-prototype-20261009`, clean `main` at `7b9f3c09`, except pre-existing untracked `.pi/`.
- Requested branch `explore/ontology-isometric-layout-v0.1` does not exist locally or in listed remotes.
- Required commands are currently unavailable on PATH: `backlog`, `groma`.
- Required preflight currently fails because the Redis container is not running.
- Required pinned-layout references are `backlog/docs/doc-1 - Semantic-city-layout-evaluation.md` and `backlog/docs/doc-2 - OpenClaw-upper-band-semantic-layout.md`; they must be read before layout changes.
- Relevant prior work appears in completed/archive tasks around isometric SVG shapes, spacing, routes, and layout; overlap search narrowed to open tasks and found only unrelated TASK-565/TASK-563/TASK-562, while the requested class/shape cluster search returned no open match.
- Pinned-layout guidance says growth can overlap nearby siblings when a compact semantic item expands; the prototype must reserve explicit group/island spacing and test collisions/routes rather than assume pinning is safe.
- Backlog task created as TASK-576, status In Progress, on branch `explore/ontology-isometric-layout-v0.1`; references include the exact current owners and both pinned-layout documents.
- `bun install --frozen-lockfile` restored 131 locked workspace packages. `bun src/cli.ts agent-instructions` now works; `bun x backlog.md` is the available Backlog CLI invocation because `backlog`/`bunx` are not on PATH.
- Groma source trace: `src/sheet/place.ts` selects current shapes from C4 kind; `src/sheet/types.ts` owns `Shape` and `Placement`; `src/sheet/measure.ts` owns shape measurement; `src/viewers/web/iso/projection/project.ts` owns projected faces/ports; `src/viewers/web/iso/painting/buildings.ts` paints floors/labels. Existing focused tests are in `test-bun/sheet-scene.test.ts`, `test-bun/projection.test.ts`, and `test-bun/iso-map.test.ts`.
