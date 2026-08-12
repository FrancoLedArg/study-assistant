# MVP plan (post shape lock)

Ordered build path after [Lock Study OS product shape](https://github.com/FrancoLedArg/study-assistant/issues/1). This is enough plan for the shape-lock destination — not a full schedule and not shipped software.

## First slice — done when

One complete **tutor loop** for the operator on the **Databases** **course pack**:

load context → teach from **cátedra sources** → optional **workspace artifacts** → **validated proposal** + **evidence brief** through the validator → **session summary**

…against a real local **student-model store**. No web UI. MCP peers are optional after this slice works for the operator.

## Build order (slice 1)

1. MCP **agent harness** scaffold + store config defaults (`student_model_store` / `~/.study-os/…`).
2. Minimal **Databases** **course pack** on disk (`pack.yaml` + enough `sources/` to teach).
3. SQLite **student-model store** schema (teaching profile, mastery overlay, active pack, session summaries, proposals/briefs, runtime-registration slots).
4. Tools for that loop (no external web, no live runtime yet): load context, list/set **active course pack**, search/read cátedra, write artifacts, submit proposal+brief, write session summary.
5. Three skills — tutor-loop, course-faithful, proposal hygiene — enough prose to run.
6. Operator dogfood: one real study session.

## Deferred past slice 1

Shape-locked, but not required for first-slice done-when:

- Allowlisted **web search** / **external sources**
- **Subject runtime** probe/run (artifacts-only practice is enough)
- Rich Databases knowledge-component catalog authorship
- Peer install docs / packaging polish

Still out of scope for the product shape (see map): multi-repo platform, knowledge-graph-first modeling, non-MCP classmate clients, per-student fine-tunes, operator-hosted multi-tenant student DB, open tool matrix, Fetch-URL in v1.

## Later slices (sketch only)

Not scheduled here — revisit after slice 1 dogfood:

- Wire allowlisted web search + attribution
- Runtime registration UI/tools + probe/run for SQL
- Expand course-pack content and mastery.yaml
- Peer onboarding (point harness at their own store file)
