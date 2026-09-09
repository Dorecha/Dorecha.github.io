# BLOODBOUND

Dark Fantasy Fast-Paced Action Platformer — Phaser 3 vertical slice.

## Workspace

This game is isolated under `bloodbound/` on branch `agent/bloodbound-vertical-slice` so the existing site is untouched.

The GitHub connection available to this workspace does not expose repository-creation permissions, so the isolated branch/folder is the safe deployable workspace I created instead of modifying the existing project root.

## Run

Open `index.html` in a modern browser, or serve the repository with any static HTTP server. The game loads Phaser 3.80.1 from jsDelivr.

Entry point: `bloodbound/index.html`

## Controls

### Desktop
- A/D or Left/Right — move
- W/Up/Space — jump
- J — attack
- K — parry
- L — Blood Dash
- S + J while falling — Gravefall
- ESC — pause
- R — restart after death/victory
- F3 — debug overlay

### Mobile
- Left side — virtual joystick
- Right side — Jump / Attack / Parry / Dash
- Multitouch is supported.

## Systems

Movement, coyote time, jump buffer, wall slide/jump, sword combat, Blood Dash, Momentum Parry, Gravefall, destructible floors, Guard/Archer/Brute enemies, projectiles and reflection, spikes, combo, hitstop, camera shake, particles, afterimages, camera look-ahead, HUD, pause/death/victory flow, procedural sound effects, responsive scaling and touch controls are implemented in the standalone HTML.

## Visual direction

Dark fantasy pixel-art palette based on the supplied knight reference: charcoal stone, muted greens, aged metal and deep crimson accents. Gameplay visuals are generated programmatically, so no external art assets are required.
