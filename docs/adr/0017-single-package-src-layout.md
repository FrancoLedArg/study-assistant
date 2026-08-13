# Single-package harness in `src/`

The **agent harness** is one npm package at the repo root with TypeScript in `src/` (MCP `serveStdio` adapter at the edge over callable handlers). **Course packs** stay at `course-packs/<pack-id>/` (ADR-0004), not inside `src/` and not as a second package. Rejected: a `packages/` monorepo until there is a second buildable artifact (a first-party MCP client is out of slice 1 and would be added then, not now).
