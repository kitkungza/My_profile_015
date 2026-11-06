# TikTok-Style 3D Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform `My_profile_015` into a high-impact, cinematic 3D portfolio website for Kitt (Pongsatorn) replicating the exact viral TikTok aesthetic by `@renandooke` (dark & crimson theme, 2.5D depth layering with cutout photo, Three.js particles/lighting, and interactive AI Swarm cursors simulation).

**Architecture:** A Three.js WebGL canvas provides reactive 3D ambient lighting and floating depth particles behind a 2.5D CSS layered hero section (giant 3D "PORTFOLIO" typography positioned behind a transparent cutout portrait of Kitt). On top, a standalone JS choreography engine simulates the viral multiplayer "AI Swarm Agents" building the page, while retaining all core profile content, skills, projects, and greeting interactions in pure vanilla web standards.

**Tech Stack:** HTML5, CSS3, ES6 JavaScript, Three.js (r128 CDN), Google Fonts (Prompt, Bebas Neue, Space Grotesk), MediaPipe/Python (one-time portrait cutout generation).

**Spec:** `docs/superpowers/specs/2026-11-06-tiktok-style-portfolio-design.md`

## Global Constraints

- Must run directly via VS Code Live Server or static file opening without build tools or npm dependencies.
- Retain all personal details: พงศกร เมืองประเทศ (กิต), ID: 68219010015, IT 1, motto "อยากเก่ง ก็ลงมือทำ".
- Color palette: Deep Studio Black (`#08080a`), Card Surface (`rgba(18, 18, 24, 0.7)`), Crimson Red (`#e11d48` / `#dc2626`), Crimson Deep (`#881337`).
- Zero console errors; graceful fallback if WebGL is unavailable.
- Responsive across mobile (<768px), tablet (768-1024px), and desktop (>1024px).

## Review Focus

1. **Missing WebGL support or hardware acceleration disabled**: fallback to CSS gradient background without breaking layout or scripts.
2. **Cutout image loading failure**: fallback portrait styling so hero section remains visually intact if image path fails.
3. **AI Swarm simulation performance on mobile**: automatically disable or reduce agent count on low-powered mobile devices to prevent frame drops.
4. **Z-index collision between 3D text, cutout, and interactive buttons**: ensure all CTA buttons, nav links, and interactive elements remain clickable with `pointer-events: auto`.
5. **Reduced motion accessibility (`prefers-reduced-motion: reduce`)**: disable particle movement and cursor swarm if user prefers reduced motion.

---

### Task 1: Generate Transparent Cutout Portrait Asset

**Files:**
- Create: `scripts/extract_cutout.py`
- Create: `image/profile_cutout.png`
- Input: `image/IMG_20260430_114834_830.jpg`

**Interfaces:**
- Consumes: `image/IMG_20260430_114834_830.jpg`
- Produces: `image/profile_cutout.png` (transparent PNG, antialiased edges, minimum 600x600 resolution)

- [ ] **Step 1: Write test script to verify cutout requirements**

Create `tests/test_cutout.py` checking that `image/profile_cutout.png` exists, has 4 channels (RGBA), and contains transparent pixels (alpha < 255):
```python
import os
from PIL import Image

def test_cutout():
    path = "image/profile_cutout.png"
    assert os.path.exists(path), "Cutout image does not exist"
    img = Image.open(path)
    assert img.mode == "RGBA", f"Expected RGBA, got {img.mode}"
    alpha = img.split()[-1]
    has_transparent = any(p < 10 for p in alpha.getdata())
    assert has_transparent, "Image has no transparent background"
    print("Cutout test PASSED")

if __name__ == "__main__":
    test_cutout()
```

- [ ] **Step 2: Run test to verify it fails**

Run: `& "C:\Users\asus\AppData\Local\Python\bin\python.exe" tests/test_cutout.py`
Expected: FAIL with "Cutout image does not exist"

- [ ] **Step 3: Implement cutout extraction script with MediaPipe / OpenCV**

Write `scripts/extract_cutout.py` using MediaPipe Selfie Segmentation or OpenCV grabcut to segment Kitt's portrait from `image/IMG_20260430_114834_830.jpg` and save as `image/profile_cutout.png` with smooth feathered alpha masking.

- [ ] **Step 4: Run extraction script and verify test passes**

Run extraction: `& "C:\Users\asus\AppData\Local\Python\bin\python.exe" scripts/extract_cutout.py`
Run test: `& "C:\Users\asus\AppData\Local\Python\bin\python.exe" tests/test_cutout.py`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add image/profile_cutout.png scripts/extract_cutout.py tests/test_cutout.py
git commit -m "feat(assets): extract transparent portrait cutout for 2.5D hero"
```

---

### Task 2: Structural Markup & TikTok Layout (`index.html`)

**Files:**
- Modify: `index.html`
- Create: `tests/test_dom.js`

**Interfaces:**
- Consumes: `image/profile_cutout.png`
- Produces: HTML structure containing `#bg-canvas`, `.hero-3d-text`, `.hero-portrait`, `.swarm-dock`, `#about`, `#skills`, `#projects`, `.site-footer`

- [ ] **Step 1: Write test to verify DOM structure**

Create `tests/test_dom.js` checking that `index.html` includes all required semantic sections and attributes:
```javascript
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const requiredElements = [
  'id="bg-canvas"',
  'class="hero-3d-text"',
  'src="image/profile_cutout.png"',
  'id="swarm-dock"',
  'id="about"',
  'id="skills"',
  'id="projects"',
  '68219010015',
  'อยากเก่ง ก็ลงมือทำ',
  'Smart Farm ด้วย ESP32',
  'three.min.js'
];

for (const el of requiredElements) {
  if (!html.includes(el)) {
    console.error(`Missing element or copy: ${el}`);
    process.exit(1);
  }
}
console.log('DOM structure test PASSED');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test_dom.js`
Expected: FAIL with missing elements (`id="bg-canvas"` or `hero-3d-text`)

- [ ] **Step 3: Update `index.html` with complete TikTok-style layout**

Implement in `index.html`:
1. Google Fonts imports: `Prompt`, `Bebas Neue`, `Space Grotesk`.
2. Three.js CDN script (`https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js`).
3. Navbar: `PONGSATORN •`, `IT & IOT DEVELOPER`, nav links (`#about`, `#skills`, `#projects`), and CTA `Let's Talk ↗`.
4. Hero Section:
   - `<canvas id="bg-canvas"></canvas>`
   - `<div class="hero-3d-text">PORTFOLIO</div>`
   - `<div class="hero-portrait-wrap"><img src="image/profile_cutout.png" alt="Pongsatorn"></div>`
   - Left column: `Hello, I'm`, `PONGSATORN`, `WEB & IOT DEVELOPER`, motto, `ดูผลงานของผม ↓`, location tag.
   - Right column: Quote `Every code, a new solution`, Stat cards (`3+` Tech Languages, `2+` Hardware/Web Projects, Student ID), `DOWNLOAD CV ⤓`.
5. Floating Swarm dock widget:
   - `<div id="swarm-dock">...</div>` with `18 agents active`, `38 / 364 layers`, and toggle buttons.
6. Preserved & enhanced sections:
   - `#about` with student ID `68219010015`, motto, `#greetingBtn`, and greeting message.
   - `#skills` with categorized cards (IoT/ESP32, Web Dev, OS/Systems).
   - `#projects` with Smart Farm ESP32 & IT Academy showcase.
   - Footer.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test_dom.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add index.html tests/test_dom.js
git commit -m "feat(html): overhaul markup for TikTok 2.5D hero and sections"
```

---

### Task 3: Cinematic Styling, 2.5D Stacking & Glassmorphism (`style.css`)

**Files:**
- Modify: `style.css`
- Create: `tests/test_css.js`

**Interfaces:**
- Consumes: Classes defined in `index.html`
- Produces: CSS variables, 2.5D layering rules (`z-index` hierarchy), crimson glow effects, responsive media queries

- [ ] **Step 1: Write test verifying CSS layer rules and variables**

Create `tests/test_css.js`:
```javascript
const fs = require('fs');
const css = fs.readFileSync('style.css', 'utf8');

const requiredTokens = [
  '--bg-dark: #08080a',
  '--accent-crimson:',
  '.hero-3d-text',
  '.hero-portrait-wrap',
  'z-index: 1',
  'z-index: 2',
  'z-index: 3',
  '@media (max-width: 768px)'
];

for (const token of requiredTokens) {
  if (!css.includes(token)) {
    console.error(`Missing CSS token: ${token}`);
    process.exit(1);
  }
}
console.log('CSS rules test PASSED');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test_css.js`
Expected: FAIL with missing tokens

- [ ] **Step 3: Implement comprehensive dark cinematic styles in `style.css`**

Implement:
1. CSS custom properties for palette (`--bg-dark: #08080a`, `--accent-crimson: #e11d48`, `--accent-deep: #881337`, `--text-main: #f8fafc`, `--card-bg: rgba(18, 18, 24, 0.7)`).
2. Canvas absolute full-viewport positioning (`z-index: 1`).
3. Giant 3D "PORTFOLIO" typography (`font-family: 'Bebas Neue'`, crimson gradient, subtle perspective extrusion, `z-index: 2`).
4. Centered cutout portrait (`z-index: 3`, drop-shadow glow, smooth transform transition for mouse parallax).
5. Foreground UI overlay (`z-index: 4`) with pointer-events configured so buttons remain interactive.
6. Glassmorphism cards for stats, skills, and projects with crimson hover borders.
7. Floating Swarm dock styles at bottom center.
8. Responsive breakpoints:
   - On screens < 768px, scale down "PORTFOLIO" font, stack hero columns vertically, and preserve readable layout.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test_css.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add style.css tests/test_css.js
git commit -m "feat(css): apply dark crimson studio styling and 2.5D depth layering"
```

---

### Task 4: Three.js 3D Background & Interactive Mouse Parallax (`script.js` - Part 1)

**Files:**
- Modify: `script.js`
- Create: `tests/test_three_init.js`

**Interfaces:**
- Consumes: `<canvas id="bg-canvas">`, `.hero-3d-text`, `.hero-portrait-wrap`
- Produces: Three.js scene, ambient crimson lighting, floating depth particle system, dynamic mouse tilt parallax

- [ ] **Step 1: Write test for Three.js module structure and parallax listener**

Create `tests/test_three_init.js`:
```javascript
const fs = require('fs');
const js = fs.readFileSync('script.js', 'utf8');

const requiredMethods = [
  'initThreeBackground',
  'THREE.PerspectiveCamera',
  'THREE.BufferGeometry',
  'THREE.Points',
  'initParallax',
  'requestAnimationFrame'
];

for (const m of requiredMethods) {
  if (!js.includes(m)) {
    console.error(`Missing method or symbol: ${m}`);
    process.exit(1);
  }
}
console.log('Three.js integration test PASSED');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test_three_init.js`
Expected: FAIL with missing methods

- [ ] **Step 3: Implement Three.js background and mouse parallax in `script.js`**

Implement:
1. `initThreeBackground()`:
   - Check WebGL availability. If not available, gracefully exit.
   - Setup `THREE.Scene`, `THREE.PerspectiveCamera`, `THREE.WebGLRenderer({ canvas, alpha: true })`.
   - Create 3D particle constellation (600+ crimson and star-white particles scattered in depth).
   - Point lights: one red light (`#dc2626`) following mouse coordinate, one soft blue fill light.
   - Render loop with gentle continuous particle drift.
   - Resize handler maintaining aspect ratio.
2. `initParallax()`:
   - Listen to `mousemove` on window.
   - Calculate normalized coordinates `(mouseX - 0.5) * 2`.
   - Smoothly interpolate camera position in Three.js.
   - Apply subtle opposite 3D translation to `.hero-3d-text` (`translate3d(x * -15px, y * -15px, 0)`) and `.hero-portrait-wrap` (`translate3d(x * 12px, y * 8px, 0) scale(1.02)`).

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test_three_init.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add script.js tests/test_three_init.js
git commit -m "feat(3d): implement Three.js ambient particles and mouse depth parallax"
```

---

### Task 5: Viral "AI Swarm Agents" Simulation Engine (`script.js` - Part 2)

**Files:**
- Modify: `script.js`
- Create: `tests/test_swarm.js`

**Interfaces:**
- Consumes: `#swarm-dock`, elements across the page (`.hero-title`, `.project-card`, `.nav-link`)
- Produces: Simulated multiplayer cursor DOM elements, waypoint paths, typing/bounding box animations, play/pause state toggle

- [ ] **Step 1: Write test for Swarm simulation API**

Create `tests/test_swarm.js`:
```javascript
const fs = require('fs');
const js = fs.readFileSync('script.js', 'utf8');

const requiredSwarmSymbols = [
  'initSwarmSimulation',
  'agentProfiles',
  'createAgentCursor',
  'toggleSwarm',
  'swarmActive'
];

for (const s of requiredSwarmSymbols) {
  if (!js.includes(s)) {
    console.error(`Missing Swarm symbol: ${s}`);
    process.exit(1);
  }
}
console.log('Swarm simulation test PASSED');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test_swarm.js`
Expected: FAIL with missing Swarm symbols

- [ ] **Step 3: Implement Swarm Rebuild simulation in `script.js`**

Implement:
1. Agent profiles list (18 agents with custom colors, e.g. `Dev-Kitt` [#e11d48], `UI-Agent` [#38bdf8], `VFX-Agent` [#a855f7], `System-Bot` [#4ade80], etc.).
2. SVG cursor generator creating realistic OS/Figma-style pointers with name badges.
3. Waypoint choreography:
   - Agents move smoothly between key UI anchors.
   - Display animated dashed bounding boxes (`w: 260px, h: 42px`) around elements they "inspect".
   - Typewriter simulation on tagline/headings.
4. Bottom dock widget integration:
   - Dynamic counter updating `X / 364 layers`.
   - Speed toggle (1x / 2x / 3x).
   - Play/Pause toggle and `Esc` key shortcut to stop.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test_swarm.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add script.js tests/test_swarm.js
git commit -m "feat(swarm): add interactive AI Swarm Agents multiplayer simulation"
```

---

### Task 6: Interaction Polish & Profile Logic Integration (`script.js` - Part 3)

**Files:**
- Modify: `script.js`
- Create: `tests/test_interactions.js`

**Interfaces:**
- Consumes: `#greetingBtn`, `#greetingmassege`, `#about`, `#skills`, `#projects`
- Produces: Greeting interaction with developer messages, sound chime (via Web Audio API, no external MP3 needed), sparkle burst, and smooth nav scrolling

- [ ] **Step 1: Write test verifying interactive functions**

Create `tests/test_interactions.js`:
```javascript
const fs = require('fs');
const js = fs.readFileSync('script.js', 'utf8');

const requiredInteractions = [
  'devGreetings',
  'playChimeSound',
  'createSparkles',
  'typeWriter'
];

for (const fn of requiredInteractions) {
  if (!js.includes(fn)) {
    console.error(`Missing interaction symbol: ${fn}`);
    process.exit(1);
  }
}
console.log('Interactions test PASSED');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test_interactions.js`
Expected: FAIL with missing symbols

- [ ] **Step 3: Implement polished interactions and Web Audio chime**

Implement:
1. Retain and enhance `devGreetings` array and typewriter message switcher for `#greetingBtn`.
2. Synthesize a clean modern audio chime via browser `AudioContext` (short sine/triangle pitch blend, gentle gain fade) when the user clicks greeting or CTA, with a mute toggle.
3. Enhanced sparkle burst on greeting button click.
4. Smooth scroll navigation for all anchor links.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test_interactions.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add script.js tests/test_interactions.js
git commit -m "feat(interactions): integrate greeting synthesizer, dev messages and sparkles"
```

---

### Task 7: End-to-End Verification & Live Server Validation

**Files:**
- Run all test scripts in `tests/`
- Start local preview server and capture browser screenshot using Playwright or headless Chrome.

- [ ] **Step 1: Run complete test suite**

```bash
& "C:\Users\asus\AppData\Local\Python\bin\python.exe" tests/test_cutout.py
node tests/test_dom.js
node tests/test_css.js
node tests/test_three_init.js
node tests/test_swarm.js
node tests/test_interactions.js
```
Expected: All tests return PASS.

- [ ] **Step 2: Launch local test server and take screenshot for visual comparison**

Run a local server, navigate using Playwright / browser tools, take full-page screenshot and verify:
- Crimson & dark cinematic lighting matches the TikTok clip.
- "PORTFOLIO" 3D text sits squarely behind Kitt's cutout.
- Swarm dock and cursors animate cleanly.
- No layout overflow or clipping errors.

- [ ] **Step 3: Final clean commit**

```bash
git add .
git commit -m "feat: complete TikTok-style 3D portfolio overhaul with AI Swarm simulation"
```
