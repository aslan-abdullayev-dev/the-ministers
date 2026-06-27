# The Ministers — Project Context (read this first)

Browser-based geopolitical strategy game. Inspired by territorial.io / openfront.io,
but with deeper diplomacy, espionage, and military layers.

The **long-term** vision is multi-crew: three players share one nation (Diplomat,
War Minister, Recon). **We are NOT building that yet.** For the MVP, **one player
controls one whole nation.** The three roles collapse into systems/tabs that the
single player operates, streamlined so one person is never overwhelmed.

Built by a **solo developer** with a React/Node background, **no prior game-dev or
multiplayer experience.** Optimize every decision for momentum and visible progress
over completeness. The biggest risk to this project is it being abandoned before the
core loop is fun — so the build order exists to fight exactly that.

---

## Golden rules (do not violate without a deliberate decision)

1. **Fun loop before infrastructure.** Single-player vs simple AI first. Multiplayer
   WebSocket sync is Phase 4, not Phase 1. Do not start networking until the local
   game is genuinely fun to click around in.
2. **One system at a time.** Territory + simple army first. Diplomacy and Recon are
   *later layers*, added only after the base loop holds together.
3. **The renderer + province system is a standalone engine module** (`src/engine/`),
   framework-agnostic, free of game-specific rules. The game *and* the future map
   editor both import it. This is the "reusable canvas piece" — treat it as a library.
4. **Server is authoritative** (from Phase 4 on). Clients render what the server
   sends. No client-trusted game state once multiplayer lands.
5. **Every phase ends in something runnable.** If you can't open it in a browser and
   interact with it, the phase isn't done.

---

## Stack

- **Build:** Vite + TypeScript (strict mode on).
- **Rendering:** Canvas 2D for the MVP. Put it behind a small `Renderer` interface so
  a PixiJS/WebGL backend can replace it later when the map grows. Do **not** scatter
  raw `ctx.` calls through game logic.
- **UI panels:** plain HTML/DOM overlaid on the canvas for the MVP. Do **not** mix
  React re-render cycles with the canvas game loop — that's a classic beginner trap.
  React (for panels only) is optional and comes later if ever.
- **Server (Phase 4+):** Node + TypeScript + `ws` (or socket.io if rooms/reconnect
  get painful). One isolated room per match.

---

## Core technical approach: provinces made of pixels

A province is a group of pixels. Two layers back every map:

- **Index map** (offscreen, never shown): every province has a unique ID encoded as a
  unique color. Used for hit-testing ("which province is under the cursor?") and for
  computing adjacency. Reading one pixel gives you the province ID in O(1).
- **Visual map** (what the player sees): provinces filled by current owner color plus
  terrain styling.

Flow: mouse position → read pixel from the index map → province ID → game logic →
update visual map. This is how EU-style and territorial-style games do it. Start with
a small test map (~10–20 provinces) so iteration is fast; scale the map up later.

---

## Proposed repo structure

```
the-ministers/
  index.html
  src/
    engine/            # reusable, framework-agnostic. Game + map editor both use it.
      render/          # Renderer interface + Canvas2D backend (PixiJS later)
      province/        # index-map loading, hit-testing, adjacency
      camera/          # pan + zoom
    game/              # game-specific rules (nations, ticks, combat, economy)
      state/
      systems/         # army, economy, (later: diplomacy, recon, fog)
      ai/
    ui/                # DOM panels overlaid on canvas
    data/
      maps/            # map data files the engine consumes
    main.ts
  server/              # added in Phase 4
```

---

## Current focus

Phase 0 → Phase 1. Follow `BUILD_PLAN.md` and work **one phase at a time**, honoring
each phase's Definition of Done before moving on. Do not skip ahead to the exciting
mechanics — they sit on top of the boring foundation.

## Conventions

- TypeScript strict; no `any` without a comment justifying it.
- Engine code stays pure (no game rules); game code stays out of the engine.
- Small commits, one feature each. Readable over clever.
- When unsure between two designs, build the smaller one and try it.
