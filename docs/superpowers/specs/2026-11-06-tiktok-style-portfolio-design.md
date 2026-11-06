# Design Specification: TikTok-Style 3D Portfolio Web (Based on My_profile_015)

## 1. Intent & The Why
- **Intent**: Transform the user's existing portfolio (`My_profile_015`) into a high-impact, cinematic 3D portfolio website that mirrors the viral TikTok video by `@renandooke`.
- **Target Persona**: พงศกร เมืองประเทศ (กิต), IT 1 student, IoT & Web Developer (Student ID: 68219010015).
- **Core Value Proposition**: Showcase Kitt's skills (IoT, ESP32, Web Dev, Programming) using the exact dark & crimson aesthetic, 2.5D depth layering (subject overlapping massive 3D text), interactive 3D elements, and the viral "AI Swarm Agents" simulation effect from the TikTok clip.

---

## 2. Goals, Non-Goals, and Anti-Goals

### Goals
1. **Visual Fidelity to TikTok Clip**:
   - Deep cinematic dark theme (`#08080a` - `#0f0f13`) with crimson red accents (`#e11d48` / `#dc2626`).
   - Massive 3D typography (**"PORTFOLIO"** / **"DEVELOPER"**) placed on the background layer.
   - Foreground transparent cutout portrait of Kitt centered in the hero section, overlapping the background 3D text (2.5D depth effect).
   - Dynamic 3D lighting, ambient glow, and interactive particle field using WebGL / Three.js that responds to mouse / device orientation.
2. **The Viral "AI Swarm Agents" Simulation**:
   - Replicate the visual experience seen in the TikTok clip (the bottom bar indicating `18 agents | 38 / 364 layers`, touring controls, and multiple colorful multiplayer cursors animating, typing, and "building" the elements).
   - Configurable / toggleable so it can run as an interactive demo or showcase, while leaving the site 100% usable as a real portfolio.
3. **Preserve & Upgrade Core Profile Content from `My_profile_015`**:
   - Name: นายพงศกร เมืองประเทศ (กิต) · 68219010015 · เทคโนโลยีสารสนเทศ IT 1.
   - Motto: "อยากเก่ง ก็ลงมือทำ" (with interactive greeting / dev messages).
   - Skills: IoT, Smart Home, Web Application, HTML, CSS, JavaScript, C++, PHP, Linux.
   - Projects: Smart Farm with ESP32, IT Academy web platform.
4. **Standalone & Zero Build Friction**:
   - Maintain vanilla web standard (HTML5, CSS3, ES6 JavaScript) with Three.js loaded via CDN or lightweight standalone bundle so the user can open `index.html` via VS Code Live Server immediately without npm build steps.

### Non-Goals
- Building an actual distributed multiplayer backend or heavy server architecture (the agent swarm is a high-fidelity frontend choreography/simulation, matching what was shown on screen).
- Changing the user's personal identity or school info.

### Anti-Goals
- Sluggish performance or lagging on mobile devices (must fall back gracefully if WebGL is disabled or on low-power devices).
- Overcomplicating the folder structure beyond the user's familiar `index.html`, `style.css`, `script.js`, `image/`.

---

## 3. Constraints
- **Platform**: Runs locally in browser (e.g. `localhost:5500` / Live Server) and can be hosted statically (GitHub Pages, Netlify, Vercel).
- **Assets**: Source image `image/IMG_20260430_114834_830.jpg` needs background removal to become a transparent PNG cutout (`image/profile_cutout.png`).
- **Typography**: Google Fonts Prompt & Bebas Neue / Montserrat / Space Grotesk for the bold condensed 3D title.

---

## 4. Approaches Considered & Trade-offs

### Approach 1: Pure CSS 2.5D Parallax
- *Pros*: Extremely lightweight, no external 3D libraries.
- *Cons*: Limited 3D lighting, no dynamic depth particles, lacks the cinematic feel of WebGL.

### Approach 2: Three.js / WebGL 3D Interactive (Selected by User)
- *Pros*: Provides exact cinematic lighting, 3D spatial typography, interactive particles, and depth tilt matching the TikTok studio aesthetic.
- *Cons*: Slightly larger initial script download (Three.js CDN ~140KB min+gzip), which is easily handled by modern browsers and cached.
- *Decision*: User explicitly chose Approach 2 to match the TikTok video as closely as possible.

---

## 5. Architectural & Detailed Design

### 5.1 Hero Section (The TikTok Anchor)
- **Top Navigation Bar**:
  - Left: `PONGSATORN •` with badge `IT & IOT DEVELOPER`
  - Center: Nav anchors (`#about`, `#skills`, `#projects`, `#contact`)
  - Right: Action button `Let's Talk ↗` or `ทักทาย ✨`
- **Centerpiece (Three.js Canvas + DOM Overlay)**:
  - Three.js WebGL canvas background rendering floating ambient particles, subtle geometric grid, and reactive light glow following cursor movement.
  - Large condensed 3D typography `PORTFOLIO` in deep crimson red (`#8b111b` to `#e11d48` gradient with subtle glow), positioned on the Z-layer behind the cutout.
  - Transparent cutout of Kitt standing centered in front of the typography.
  - Parallax effect: Moving mouse tilts the portrait and background text in opposite depths (3D stereoscopic feel).
- **Left Column**:
  - Hand-drawn or script accent: *"Hello, I'm"*
  - Bold name: **PONGSATORN**
  - Subtitle: `WEB & IOT DEVELOPER`
  - Bio / Motto: *"อยากเก่ง ก็ลงมือทำ — พัฒนาระบบ IoT และเว็บแอปพลิเคชัน จากวงจรฮาร์ดแวร์สู่แดชบอร์ดออนไลน์"*
  - CTA Button: `ดูผลงานของผม ↓` (Crimson red pill button with subtle pulse).
  - Location / Department tag: `BANGKOK / SAMUT PRAKAN · IT 1`
- **Right Column**:
  - Quote: *"Every code, a new solution"*
  - Key Metric Stat Counters:
    - `3+` ภาษาและเทคโนโลยีหลัก
    - `2+` โปรเจกต์ฮาร์ดแวร์ & ซอฟต์แวร์
    - `6821...` รหัสนักศึกษา IT 1
  - Secondary Action: `DOWNLOAD CV ⤓` or `ดูโค้ดบน GitHub ↗`

### 5.2 Viral Feature: "AI Swarm Agents" Mode
- An interactive bottom floating widget:
  - Badge: `● 18 agents active` | `38 / 364 layers` | `[Touring] [1x] [🔊]`
  - Button to toggle / play / stop the Swarm simulation.
- Simulation behavior:
  - 10-18 stylized multiplayer cursors (with user avatar colors and labels like `Agent-UI`, `Agent-VFX`, `Agent-Code`, `Dev-Agent`) fly across the screen.
  - Cursors click, highlight sections, and show typing animations / selection boxes around elements, precisely replicating the viral TikTok recording.
  - Non-intrusive: easily paused, closed, or exited via `Esc` or toggle button.

### 5.3 Upgraded Profile Sections
1. **About Me & Interactive Greeting**:
   - Retains the greeting button (`#greetingBtn`) with enhanced dev greeting messages, sparkle particle burst, sound toggle (optional subtle click/pop), and student credential card (`68219010015`).
2. **Skills Matrix**:
   - Grouped into:
     - Embedded / IoT: ESP32, Smart Home, Arduino/C++
     - Web Development: HTML5, CSS3, Modern JavaScript, PHP
     - Systems & Tools: Linux, Windows, VS Code, Git
   - Interactive 3D tilt cards with glowing borders on hover.
3. **Projects Showcase**:
   - Card 1: **Smart Farm with ESP32** (Live telemetry dashboard concept, sensor gauges, automated irrigation control).
   - Card 2: **IT Academy Platform** (Interactive learning portal for IoT, Networking & Web development).
   - Each project card includes tags, live demo / details modal, and github link.
4. **Footer**:
   - Modern dark studio footer with copyright, department credit, and social / contact links.

---

## 6. What's Left to the Builder
- Precise Three.js scene tuning (camera FOV, particle counts, lighting intensity).
- Python selfie segmentation script to extract clean cutout PNG from `IMG_20260430_114834_830.jpg`.
- Polishing responsive layout down to mobile screens (stacking hero text, adjusting 3D text scaling).
- Fine-tuning the cursor paths and speed in the Swarm Rebuild simulation.
