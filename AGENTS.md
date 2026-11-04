# Shortly implementation instructions

The application root is this `Project` directory. Keep all Shortly source, tests, configuration, documentation, and generated application artifacts inside it. Preserve `buildplan.md` as the supplied source plan. The parent directory contains unrelated instructions and prompt-library material.

Read PRD.md, ARCHITECTURE.md, DESIGN_SYSTEM.md, and the relevant docs before changing behavior. Use the selected Node.js/Express/JavaScript/pg, Neon PostgreSQL, React/Vite/TypeScript/Tailwind/Framer Motion stack.

The user authorized continuing all implementation phases on 2026-11-04. Report phase progress and verify dependencies; do not require repeated phase approvals. Production deployment and production resource modification retain a separate approval gate.

- Private management and analytics require verified identity and owner-scoped parameterized SQL. Public short-link redirects remain shareable.
- Never hardcode, log, or commit secrets. VITE variables contain public configuration only.
- Validate external inputs and startup configuration; handle operational errors explicitly and safely.
- Keep frontend and backend independently runnable. Favor focused modules and minimal dependencies.
- Test behavior before declaring it complete. Record actual results and unverified flows in docs/TEST_PLAN.md and docs/TASK_TRACKER.md.
- Use native Windows commands. Parallel agents must own disjoint files; the lead reviews integration.
- Preserve existing work. Document important changes and trade-offs in docs/DECISIONS.md.
