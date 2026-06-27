# The Ministers — Design Summary & Build Plan

This is the source of truth for *what* we're building and *in what order*. Read
`CLAUDE.md` first for project context and conventions.

---

## 1. Vision (long term — for context only, NOT the MVP)

A multiplayer geopolitical strategy game where a nation is run by three players with
asymmetric roles — **Diplomat** (strategy, treaties, war/peace, casus belli),
**War Minister** (recruiting, positioning, combat), and **Recon** (espionage,
fog of war, intercepting enemy plans). Matchmaking is Dota-style: you queue for a
role and get dropped into a nation with strangers. No direct chat — coordination
happens through map pings and a request system. Free-to-play, monetized later via
cosmetics, a battle pass, and a premium tier (replays, full-map spectating). Browser
first; a Steam client is a multi-year-later goal.

All of the above is the destination. **We do not build it directly.**

---

## 2. The simplification (what we are actually building)

**One player controls one whole nation.** The three roles become **systems** the
single player operates through the UI — streamlined so a solo player isn't drowning.
Anything micromanagement-heavy from the original design is **auto-resolved or cut**
for now:

- Emissaries **auto-travel** (no manual steering).
- Supply lines are **automatic/emergent** (no placing depots or roads).
- Army units are **one icon per unit** (no formations of soldier-boxes).
- Spy micro, prisoner/pillage/bridge mechanics, intel-clarity tiers, battle pass,
  cosmetics, spectating — **all deferred** (see §6).

This keeps the project buildable by one person and gets a playable game on screen
fast. The multi-crew split can be reintroduced much later as a networking layer on
top of working single-player systems.

---

## 3. Core loop (MVP)

> Own provinces → expand into / attack adjacent provinces → a simple economy grows
> with territory and funds your actions → win by holding X% of the map.

Get **that** fun first. Diplomacy and Recon are added on top only once the
territory-and-army loop is enjoyable on its own.

---

## 4. Map architecture (summary — full detail in `CLAUDE.md`)

- Provinces are groups of pixels, backed by an **index map** (province ID per pixel,
  for hit-testing + adjacency) and a **visual map** (owner color + terrain).
- The eventual target is a large map (bigger than territorial's ~500k-pixel maps),
  but the MVP starts with a **small hand-made test map (~10–20 provinces)** so you can
  iterate in seconds, not minutes.
- The renderer sits behind an interface so Canvas 2D can be swapped for PixiJS/WebGL
  when province counts and map size demand it.

---

## 5. Phased roadmap

Work top to bottom. Do not start a phase until the previous one meets its Definition
of Done (DoD). Each phase produces something you can open in a browser.

### Phase 0 — Skeleton + canvas + camera
Set up Vite + TS. Render a hardcoded province map. Implement pan and zoom.
**DoD:** the app runs; a map is visible; you can smoothly pan and zoom.

### Phase 1 — Province engine (the reusable core / map-editor seed)
Load provinces from a data file plus an index map. Hover-highlight a province under
the cursor. Click to select. Click to paint ownership color locally. Compute province
adjacency from the index map.
**DoD:** hover highlights the correct province; clicking paints it; adjacency is
queryable. This module lives in `src/engine/` and has zero game rules in it.

### Phase 2 — Single-player game loop ("is it fun?" gate)
Add 2–4 nations (you + simple AI). A tick advances the game. You can claim adjacent
neutral provinces; the AI does too. A win condition fires at X% map control.
**DoD:** you can play a full match against AI to a win/loss, start to finish.
*If this isn't fun, stop and fix the loop before building anything else.*

### Phase 3 — Streamlined nation systems
Per-province army strength: build units, move/attack between adjacent provinces with
deterministic combat math. A simple treasury that grows with territory and pays for
unit builds and actions. Still single-player vs AI.
**DoD:** you can fund an army, attack the AI, take provinces, and lose them — and the
economy meaningfully constrains your choices.

### Phase 4 — Multiplayer backbone (the hard, boring, essential part)
Node + `ws` server. One isolated room per match. Two browser tabs join the same
match. Server holds authoritative state and sends **delta updates**. Reconnect works.
**DoD:** tab A claims a province; tab B sees it within one tick; refreshing a tab
rejoins cleanly without corrupting state.

### Phase 5 — Role layers, one at a time (multiplayer-safe)
- **5a — Fog of war + basic Recon:** provinces are dark until revealed; a recon action
  reveals them. Server filters what each client can see.
- **5b — Diplomacy:** auto-travel emissary carries an offer (alliance / trade / pact /
  transit / call-to-arms); recipient accepts / counters / rejects. No chat.
- **5c — Casus belli + war declaration:** the gate that turns provinces hostile.
**DoD (per sub-phase):** the layer works across two clients without desyncing.

### Phase 6 — Map editor
Reuse the engine to paint provinces, assign terrain / owner / capital, and export the
map data file the game consumes.
**DoD:** a map made in the editor loads and plays in the game unmodified.

---

## 6. Deferred — captured so it isn't lost, but NOT built now

Multi-crew 3-players-per-nation; matchmaking + ranked per role; battle pass; cosmetics;
premium subscription (replays, full-map spectating); tournaments; Steam client;
procedural and community map sharing; intel-clarity tiers; prisoner / pillage /
destroy-bridge / scorched-earth mechanics; minister betrayal/defection; global event
feed + casus-belli forge; large 1.5–2M-pixel maps; PixiJS/WebGL renderer.

These re-enter the plan only after Phases 0–4 are solid.

---

## 7. Open questions (decide when the relevant phase arrives)

- Real-time (smooth RTS) vs discrete tick on the backend — start with a simple tick.
- Real-world geography vs fantasy / procedural maps.
- Exact win condition and match length target.
- AI difficulty model (threat-ratio heuristic vs something richer).
- If/when React is introduced for UI panels.

---

## 8. First session for Claude Code

1. Scaffold the Vite + TypeScript project per the repo structure in `CLAUDE.md`.
2. Get a blank canvas filling the window with a working pan/zoom camera.
3. Hardcode 3–4 rectangular "provinces" and render them in different colors.
4. Stop. Run it. Confirm Phase 0 DoD before touching Phase 1.
