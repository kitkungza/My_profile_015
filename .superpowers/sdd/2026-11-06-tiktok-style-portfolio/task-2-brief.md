# Task 2: Structural Markup & TikTok Layout (`index.html`)

**Files:**
- Modify: `index.html`
- Create: `tests/test_dom.js`

**Interfaces:**
- Consumes: `image/profile_cutout.png`
- Produces: HTML structure containing `#bg-canvas`, `.hero-3d-text`, `.hero-portrait-wrap`, `#swarm-dock`, `#about`, `#skills`, `#projects`, `.site-footer`

## Global Constraints Verbatim
- Repository root: `C:\Users\asus\Downloads\My_profile_015`
- Must run directly via VS Code Live Server or static file opening without build tools or npm dependencies.
- Retain all personal details: พงศกร เมืองประเทศ (กิต), ID: 68219010015, IT 1, motto "อยากเก่ง ก็ลงมือทำ".
- Google Fonts: `Prompt`, `Bebas Neue`, `Space Grotesk`.
- Three.js via CDN: `https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js`.

## Steps
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
   - `#about` with student ID `68219010015`, motto, `#greetingBtn`, and greeting message (`#greetingmassege`).
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
