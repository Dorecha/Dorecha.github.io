# BLOODBOUND — development roadmap

## Phase 0 — Vertical slice
- [x] Standalone Phaser 3 entry point
- [x] Responsive 1280x720 logical canvas
- [x] Desktop + multitouch controls
- [x] Fast movement, coyote time, jump buffer
- [x] Wall slide / wall jump
- [x] Sword combat and combo
- [x] Blood Dash + dash reset
- [x] Momentum Parry + projectile reflection
- [x] Gravefall + destructible floor
- [x] Guard / Archer / Brute
- [x] Hitstop, shake, particles, afterimages
- [x] Death / restart / victory loop
- [x] HUD + debug mode

## Phase 1 — Production structure
- Split gameplay classes into ES modules.
- Replace generated player/enemy art with the supplied pixel-art direction.
- Move level templates into data-driven room definitions.
- Add pooled particles, damage numbers and afterimages.
- Add deterministic room seeds for reproducible runs.

## Phase 2 — Content
- 6–10 modular rooms per biome.
- More enemy archetypes and elite variants.
- Environmental hazards and moving platforms.
- Boss encounter at the end of the first biome.
- Persistent best time / kills / combo locally.

## Phase 3 — Mobile polish
- Device-safe-area aware controls.
- Haptics where supported.
- Audio mixer and accessibility options.
- Performance presets for lower-end devices.
- Portrait-mode menu / landscape gameplay flow.

## Engineering rule
Gameplay responsiveness has priority over visual complexity. Every new mechanic must have clear input, state, collision, feedback and recovery behavior before adding content around it.
