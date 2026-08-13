# Node type-stripping, pnpm, Vitest

The **agent harness** is run as `node src/server.ts` (Node type stripping, no `tsx`, no `dist/` emit for the MCP command). Typecheck is `tsc --noEmit`; `tsconfig` sets `erasableSyntaxOnly` so we never use `enum`/decorators Node cannot strip. `engines.node` is ≥ 24. Package manager is pnpm; tests are Vitest at the callable-handler seam (temp store + temp pack). Rejected: `tsx`/ts-node, a compile-to-`dist` MCP entry, Jest, and npm as the locked client (npm still works; pnpm is what we commit).
