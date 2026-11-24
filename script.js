/* ==========================================================================
   PONGSATORN • 3D Cinematic Portfolio Interactive Scripts
   Features:
   - Part 1: Three.js 3D Ambient Particles & Mouse Depth Parallax
   - Part 2: Viral AI Swarm Agents Simulation Engine (TikTok Replication)
   - Part 3: Progressive Assembly Choreography (Build-on-Load & Build-on-Scroll)
   - Part 4: Web Audio Synthesizer, Sparkles, and Greeting Typewriter
   ========================================================================== */

// Force page to always start at the very top (Hero Section) on reload/refresh
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// Reset scroll to top instantly
window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

// Clear hash on reload so user starts fresh at the hero section
if (window.location.hash) {
  history.replaceState(null, document.title, window.location.pathname + window.location.search);
}

window.addEventListener('beforeunload', () => {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
});

// Global 3D State
let threeScene, threeCamera, threeRenderer, particleSystem;
let targetMouseX = 0, targetMouseY = 0;
let currentMouseX = 0, currentMouseY = 0;

/* ==========================================================================
   Part 1: Three.js 3D Background Lighting & Particles Constellation
   ========================================================================== */
function initThreeBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas || typeof THREE === 'undefined') {
    console.warn('Three.js or #bg-canvas not available. Falling back gracefully.');
    return;
  }

  // Check WebGL availability
  try {
    threeRenderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
  } catch (e) {
    console.warn('WebGL not supported. Canvas 3D disabled.', e);
    return;
  }

  threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  threeRenderer.setSize(window.innerWidth, window.innerHeight);

  // Scene & Camera
  threeScene = new THREE.Scene();
  threeCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  threeCamera.position.z = 50;

  // Particle System (700 Floating Star-Dust & Crimson Particles)
  const particleCount = 700;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const scales = new Float32Array(particleCount);

  const crimsonColor = new THREE.Color(0xe11d48);
  const brightRedColor = new THREE.Color(0xff4d6d);
  const starWhiteColor = new THREE.Color(0xf8fafc);
  const softBlueColor = new THREE.Color(0x38bdf8);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 120;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 70;

    const roll = Math.random();
    let chosenColor;
    if (roll < 0.45) chosenColor = crimsonColor;
    else if (roll < 0.65) chosenColor = brightRedColor;
    else if (roll < 0.90) chosenColor = starWhiteColor;
    else chosenColor = softBlueColor;

    colors[i * 3] = chosenColor.r;
    colors[i * 3 + 1] = chosenColor.g;
    colors[i * 3 + 2] = chosenColor.b;

    scales[i] = Math.random() * 2.5 + 1;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // Custom Particle Material with smooth circular point texture
  const canvasParticle = document.createElement('canvas');
  canvasParticle.width = 16;
  canvasParticle.height = 16;
  const ctx = canvasParticle.getContext('2d');
  const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.4, 'rgba(255,255,255,0.7)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 16, 16);

  const particleTexture = new THREE.CanvasTexture(canvasParticle);

  const material = new THREE.PointsMaterial({
    size: 2.2,
    map: particleTexture,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  particleSystem = new THREE.Points(geometry, material);
  threeScene.add(particleSystem);

  // Dynamic Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  threeScene.add(ambientLight);

  const pointLightRed = new THREE.PointLight(0xe11d48, 2.5, 90);
  pointLightRed.position.set(0, 0, 20);
  threeScene.add(pointLightRed);

  // Resize handler
  window.addEventListener('resize', onWindowResize, { passive: true });

  // Animation Loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    if (particleSystem) {
      particleSystem.rotation.y = elapsedTime * 0.04;
      particleSystem.rotation.x = Math.sin(elapsedTime * 0.03) * 0.05;
    }

    currentMouseX += (targetMouseX - currentMouseX) * 0.05;
    currentMouseY += (targetMouseY - currentMouseY) * 0.05;

    threeCamera.position.x = currentMouseX * 6;
    threeCamera.position.y = -currentMouseY * 4;
    threeCamera.lookAt(threeScene.position);

    pointLightRed.position.x = currentMouseX * 30;
    pointLightRed.position.y = -currentMouseY * 20;

    threeRenderer.render(threeScene, threeCamera);
  }

  animate();
}

function onWindowResize() {
  if (!threeCamera || !threeRenderer) return;
  threeCamera.aspect = window.innerWidth / window.innerHeight;
  threeCamera.updateProjectionMatrix();
  threeRenderer.setSize(window.innerWidth, window.innerHeight);
}

/* ==========================================================================
   2.5D Depth Parallax Engine (Mouse & Device Orientation)
   ========================================================================== */
function initParallax() {
  const bgText = document.querySelector('.hero-3d-text');
  const portraitWrap = document.querySelector('.hero-portrait-wrap');

  window.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
    targetMouseY = (e.clientY / window.innerHeight) * 2 - 1;

    if (bgText) {
      const moveX = targetMouseX * -22;
      const moveY = targetMouseY * -14;
      const rotY = targetMouseX * -4;
      const rotX = targetMouseY * 4;
      bgText.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px)) rotateY(${rotY}deg) rotateX(${rotX}deg)`;
    }

    if (portraitWrap) {
      const moveX = targetMouseX * 16;
      const moveY = targetMouseY * 10;
      const rotY = targetMouseX * 3;
      portraitWrap.style.transform = `translateX(calc(-50% + ${moveX}px)) translateY(${moveY}px) scale(1.02) rotateY(${rotY}deg)`;
    }
  }, { passive: true });

  if (window.DeviceOrientationEvent && window.innerWidth <= 768) {
    window.addEventListener('deviceorientation', (e) => {
      if (e.gamma !== null && e.beta !== null) {
        targetMouseX = Math.min(Math.max(e.gamma / 30, -1), 1);
        targetMouseY = Math.min(Math.max((e.beta - 45) / 30, -1), 1);

        if (bgText) {
          const moveX = targetMouseX * -12;
          const moveY = targetMouseY * -8;
          bgText.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;
        }

        if (portraitWrap) {
          const moveX = targetMouseX * 10;
          const moveY = targetMouseY * 6;
          portraitWrap.style.transform = `translateX(calc(-50% + ${moveX}px)) translateY(${moveY}px)`;
        }
      }
    }, { passive: true });
  }
}

/* ==========================================================================
   Part 2: Viral AI Swarm Agents Simulation Engine (TikTok Replication)
   ========================================================================== */
let swarmActive = true;
let swarmSpeed = 1; // 1x, 2x, 3x
let isTouring = false;
let currentLayerCount = 0;
const totalLayers = 364;

// 18 Distinct Agent Personas
const agentProfiles = [
  { name: 'Dev-Kitt (Lead)', color: '#e11d48' },
  { name: 'Agent-UI', color: '#38bdf8' },
  { name: 'Agent-VFX', color: '#a855f7' },
  { name: 'System-Bot', color: '#4ade80' },
  { name: 'Agent-Layout', color: '#f59e0b' },
  { name: 'Agent-Motion', color: '#ec4899' },
  { name: 'Agent-3D', color: '#06b6d4' },
  { name: 'Agent-Typography', color: '#8b5cf6' },
  { name: 'Agent-Color', color: '#ef4444' },
  { name: 'Agent-Sensors', color: '#10b981' },
  { name: 'Agent-Firmware', color: '#6366f1' },
  { name: 'Agent-Network', color: '#14b8a6' },
  { name: 'Agent-Database', color: '#eab308' },
  { name: 'Agent-Security', color: '#f97316' },
  { name: 'Agent-Audio', color: '#d946ef' },
  { name: 'Agent-Testing', color: '#84cc16' },
  { name: 'Agent-Optimizer', color: '#0ea5e9' },
  { name: 'Agent-Deploy', color: '#f43f5e' }
];

let activeAgentInstances = [];

function createAgentCursor(agent, index) {
  const cursorWrap = document.createElement('div');
  cursorWrap.className = 'swarm-agent-cursor';
  cursorWrap.id = `agent-cursor-${index}`;

  cursorWrap.innerHTML = `
    <svg class="swarm-cursor-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z" 
            fill="${agent.color}" stroke="#ffffff" stroke-width="1.2"/>
    </svg>
    <div class="swarm-agent-badge" style="background-color: ${agent.color};">
      ${agent.name}
    </div>
  `;

  return cursorWrap;
}

function triggerSelectionBox(x, y, w, h) {
  if (!swarmActive) return;
  const container = document.getElementById('swarm-cursor-layer');
  if (!container) return;

  const box = document.createElement('div');
  box.className = 'swarm-box-indicator';
  box.style.left = `${x}px`;
  box.style.top = `${y}px`;
  box.style.width = `${w}px`;
  box.style.height = `${h}px`;
  container.appendChild(box);

  setTimeout(() => {
    box.remove();
  }, 1400 / swarmSpeed);
}

// Role Actions for Contextual Working Inspection Badges
const agentRoleActions = {
  'Dev-Kitt (Lead)': 'Lead Review',
  'Agent-UI': 'Styling CSS',
  'Agent-VFX': 'Particles FX',
  'System-Bot': 'Syncing State',
  'Agent-Layout': 'Aligning Grid',
  'Agent-Motion': 'Easing Curve',
  'Agent-3D': 'WebGL Shading',
  'Agent-Typography': 'Font Kerning',
  'Agent-Color': 'Palette Glow',
  'Agent-Sensors': 'IoT Telemetry',
  'Agent-Firmware': 'ESP32 Logic',
  'Agent-Network': 'API Latency',
  'Agent-Database': 'Schema Index',
  'Agent-Security': 'Auth Shield',
  'Agent-Audio': 'Chime Synth',
  'Agent-Testing': 'DOM Verified',
  'Agent-Optimizer': '60 FPS Lock',
  'Agent-Deploy': 'Vercel Hook'
};

function assignAgentNextTarget(inst) {
  // Find visible interactive elements
  const allTargets = Array.from(document.querySelectorAll(
    '.hero-title, .hero-subtitle, .stat-card, .btn, .skill-category-card, .project-card, .brand-logo, .nav-link, .profile-details-card, .motto-box, .btn-project-visit, .location-tag'
  )).filter(el => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && r.top < window.innerHeight + 120 && r.bottom > -80;
  });

  // Check occupied targets by other agents to prevent clumping
  const occupied = new Set(activeAgentInstances.map(a => a !== inst && a.targetEl).filter(Boolean));
  const available = allTargets.filter(t => !occupied.has(t));
  const target = available.length > 0
    ? available[Math.floor(Math.random() * available.length)]
    : (allTargets.length > 0 ? allTargets[Math.floor(Math.random() * allTargets.length)] : null);

  if (target) {
    const r = target.getBoundingClientRect();
    inst.targetEl = target;
    // Aim smoothly inside the target's bounding box
    inst.targetX = r.left + Math.random() * (r.width * 0.7) + (r.width * 0.15);
    inst.targetY = r.top + Math.random() * (r.height * 0.5) + (r.height * 0.25);
  } else {
    // If no targets visible, cruise smoothly across viewport
    inst.targetEl = null;
    inst.targetX = Math.random() * (window.innerWidth - 160) + 80;
    inst.targetY = Math.random() * (window.innerHeight - 160) + 80;
  }

  inst.state = 'TRAVELING';
  inst.workTimer = 0;
  inst.workPhase = Math.random() * 10;
}

function initSwarmSimulation() {
  const container = document.getElementById('swarm-cursor-layer');
  const agentCountEl = document.querySelector('.dock-agent-count');

  if (!container) return;

  container.innerHTML = '';
  activeAgentInstances = [];

  // Responsive agent count: keep screen uncluttered and organized
  let maxAgents = 18;
  if (window.innerWidth < 480) {
    maxAgents = 6;
  } else if (window.innerWidth <= 1024) {
    maxAgents = 10;
  }

  const profilesToUse = agentProfiles.slice(0, maxAgents);
  if (agentCountEl && !document.querySelector('.dock-status-dot.completed')) {
    agentCountEl.textContent = `${profilesToUse.length} agents active`;
  }

  profilesToUse.forEach((agent, i) => {
    const el = createAgentCursor(agent, i);
    container.appendChild(el);

    const startX = Math.random() * (window.innerWidth - 120) + 60;
    const startY = Math.random() * (window.innerHeight - 120) + 60;
    el.style.transform = `translate(${startX.toFixed(1)}px, ${startY.toFixed(1)}px)`;

    const inst = {
      el: el,
      agent: agent,
      x: startX,
      y: startY,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      targetX: startX,
      targetY: startY,
      targetEl: null,
      state: 'TRAVELING',
      workTimer: 0,
      workPhase: Math.random() * 10,
      speedMultiplier: 0.9 + Math.random() * 0.25,
      roleAction: agentRoleActions[agent.name] || 'Active'
    };

    assignAgentNextTarget(inst);
    activeAgentInstances.push(inst);
  });

  function stepSwarm() {
    if (!swarmActive) return;

    activeAgentInstances.forEach((inst) => {
      // 1. STATE MACHINE: TRAVELING vs WORKING
      if (inst.state === 'TRAVELING') {
        const dx = inst.targetX - inst.x;
        const dy = inst.targetY - inst.y;
        const dist = Math.hypot(dx, dy);

        // Smooth cruise speed with graceful deceleration on arrival
        const cruiseSpeed = 4.2 * inst.speedMultiplier * swarmSpeed;
        const desiredSpeed = dist < 75 ? (dist / 75) * cruiseSpeed : cruiseSpeed;

        const desiredVx = (dx / (dist || 1)) * desiredSpeed;
        const desiredVy = (dy / (dist || 1)) * desiredSpeed;

        // Smooth steering interpolation (buttery inertia curve)
        inst.vx += (desiredVx - inst.vx) * 0.085;
        inst.vy += (desiredVy - inst.vy) * 0.085;

        // Check if arrived at target element
        if (dist < 18) {
          inst.state = 'WORKING';
          inst.workTimer = Math.floor(Math.random() * 80 + 90) / swarmSpeed; // 1.5 - 3s focused work
          inst.workPhase = 0;

          // Update badge to focused work role
          const badge = inst.el.querySelector('.swarm-agent-badge');
          if (badge) {
            badge.textContent = `${inst.agent.name} (${inst.roleAction})`;
          }

          // Subtle selective inspection box (at most 25% chance)
          if (inst.targetEl && Math.random() < 0.25) {
            const r = inst.targetEl.getBoundingClientRect();
            triggerSelectionBox(r.left, r.top, r.width, r.height);
          }
        }
      } else if (inst.state === 'WORKING') {
        // Organic micro-motion while inspecting element
        inst.workPhase += 0.04;
        const microX = inst.targetX + Math.sin(inst.workPhase) * 8;
        const microY = inst.targetY + Math.cos(inst.workPhase * 0.75) * 5;

        inst.vx += (microX - inst.x) * 0.06;
        inst.vy += (microY - inst.y) * 0.06;
        inst.vx *= 0.82;
        inst.vy *= 0.82;

        inst.workTimer--;
        if (inst.workTimer <= 0) {
          // Restore clean original badge
          const badge = inst.el.querySelector('.swarm-agent-badge');
          if (badge) {
            badge.textContent = inst.agent.name;
          }
          assignAgentNextTarget(inst);
        }
      }

      // 2. FLOCKING SEPARATION (Anti-Clumping / Anti-Collision)
      activeAgentInstances.forEach((other) => {
        if (other === inst) return;
        const sepDx = inst.x - other.x;
        const sepDy = inst.y - other.y;
        const sepDist = Math.hypot(sepDx, sepDy);
        const minSpace = 68; // Space to keep badges readable
        if (sepDist > 0 && sepDist < minSpace) {
          const repel = ((minSpace - sepDist) / minSpace) * 0.32;
          inst.vx += (sepDx / sepDist) * repel;
          inst.vy += (sepDy / sepDist) * repel;
        }
      });

      // 3. APPLY POSITION & NATURAL TILT ANGLE
      inst.x += inst.vx;
      inst.y += inst.vy;

      // Banking angle: tilt gently into the direction of flight (-10deg to +10deg)
      const tilt = Math.max(-10, Math.min(10, inst.vx * 1.6));
      inst.el.style.transform = `translate(${inst.x.toFixed(1)}px, ${inst.y.toFixed(1)}px) rotate(${tilt.toFixed(1)}deg)`;
    });

    requestAnimationFrame(stepSwarm);
  }

  requestAnimationFrame(stepSwarm);
  initSwarmControls();
}

let swarmControlsInitialized = false;

function initSwarmControls() {
  if (swarmControlsInitialized) return;
  swarmControlsInitialized = true;

  const toggleBtn = document.getElementById('swarmToggleBtn');
  const tourBtn = document.getElementById('swarmTourBtn');
  const speedBtn = document.getElementById('swarmSpeedBtn');
  const replayBtn = document.getElementById('swarmReplayBtn');

  if (toggleBtn) toggleBtn.addEventListener('click', toggleSwarm);

  if (speedBtn) {
    speedBtn.addEventListener('click', () => {
      if (swarmSpeed === 1) swarmSpeed = 2;
      else if (swarmSpeed === 2) swarmSpeed = 3;
      else swarmSpeed = 1;
      speedBtn.textContent = `${swarmSpeed}x`;
    });
  }

  if (tourBtn) {
    tourBtn.addEventListener('click', () => {
      isTouring = !isTouring;
      tourBtn.classList.toggle('active', isTouring);
      if (isTouring) startTourScroll();
    });
  }

  if (replayBtn) {
    replayBtn.addEventListener('click', replayAssembly);
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || (e.altKey && e.shiftKey && (e.key === 'S' || e.key === 's'))) {
      toggleSwarm();
    }
  });
}

function toggleSwarm() {
  swarmActive = !swarmActive;
  const toggleBtn = document.getElementById('swarmToggleBtn');
  const cursorLayer = document.getElementById('swarm-cursor-layer');

  if (toggleBtn) {
    toggleBtn.textContent = swarmActive ? 'Esc to Pause' : 'Play Agents ▶';
    toggleBtn.classList.toggle('btn-pause', swarmActive);
  }

  if (cursorLayer) {
    cursorLayer.style.display = swarmActive ? 'block' : 'none';
  }

  if (swarmActive) {
    initSwarmSimulation();
  }
}

function startTourScroll() {
  if (!isTouring) return;
  const sections = ['#hero', '#about', '#skills', '#projects', '#hero'];
  let currentIdx = 0;

  const tourInterval = setInterval(() => {
    if (!isTouring) {
      clearInterval(tourInterval);
      return;
    }
    currentIdx = (currentIdx + 1) % sections.length;
    const target = document.querySelector(sections[currentIdx]);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }, 4500);
}

/* ==========================================================================
   Part 3: Progressive Assembly Choreography (Realistic Drag & Drop Builder)
   ========================================================================== */
let warpOutTimer = null;

function triggerSnapEffect(x, y, w, h) {
  const container = document.getElementById('swarm-cursor-layer');
  if (!container) return;

  const ripple = document.createElement('div');
  ripple.className = 'swarm-snap-ripple';
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  ripple.style.width = `${w}px`;
  ripple.style.height = `${h}px`;
  container.appendChild(ripple);

  if (typeof createSparkleBurst === 'function') {
    createSparkleBurst(x + w / 2, y + h / 2, 8);
  }

  setTimeout(() => ripple.remove(), 550);
}

function checkBuildCompletion() {
  const pending = document.querySelectorAll('.swarm-pending-build');
  const building = document.querySelectorAll('.swarm-building');
  const layerCountEl = document.getElementById('swarm-layer-count');
  const statusDot = document.querySelector('.dock-status-dot');
  const replayBtn = document.getElementById('swarmReplayBtn');
  const toggleBtn = document.getElementById('swarmToggleBtn');
  const agentCountEl = document.querySelector('.dock-agent-count');

  if (pending.length === 0 && building.length === 0) {
    if (layerCountEl) {
      layerCountEl.textContent = `${totalLayers} / ${totalLayers} layers`;
    }
    if (statusDot) {
      statusDot.classList.add('completed');
    }
    if (agentCountEl) {
      agentCountEl.textContent = 'All layers compiled ✨';
    }
    if (replayBtn) {
      replayBtn.style.display = 'inline-flex';
    }
    if (toggleBtn) {
      toggleBtn.style.display = 'none';
    }

    // Agents gracefully disappear after finishing building the website
    clearTimeout(warpOutTimer);
    warpOutTimer = setTimeout(() => {
      disperseSwarmAgents();
    }, 1200);
  }
}

function disperseSwarmAgents() {
  if (activeAgentInstances.length === 0) return;

  activeAgentInstances.forEach((inst, idx) => {
    setTimeout(() => {
      if (inst.el) {
        inst.el.classList.add('agent-warp-out');
      }
    }, idx * 25);
  });

  setTimeout(() => {
    const container = document.getElementById('swarm-cursor-layer');
    if (container) container.innerHTML = '';
    activeAgentInstances = [];
    swarmActive = false;
  }, 900);
}

function ensureAgentsActive() {
  if (!swarmActive || activeAgentInstances.length === 0) {
    swarmActive = true;
    const statusDot = document.querySelector('.dock-status-dot');
    if (statusDot) statusDot.classList.remove('completed');
    const agentCountEl = document.querySelector('.dock-agent-count');
    if (agentCountEl) agentCountEl.textContent = '18 agents active';
    initSwarmSimulation();
  }
}

function assembleElement(el) {
  if (!el || el.classList.contains('swarm-built')) return;

  ensureAgentsActive();

  el.classList.remove('swarm-pending-build');
  el.classList.add('swarm-building');

  const rect = el.getBoundingClientRect();
  const componentName = el.dataset.buildName || 'Component';
  const layerContainer = document.getElementById('swarm-cursor-layer');
  const layerCountEl = document.getElementById('swarm-layer-count');

  if (rect.width <= 0 || rect.height <= 0) {
    el.classList.remove('swarm-building');
    el.classList.add('swarm-built');
    checkBuildCompletion();
    return;
  }

  // 1. Pick a primary builder agent
  let builder = null;
  if (activeAgentInstances.length > 0) {
    builder = activeAgentInstances[Math.floor(Math.random() * activeAgentInstances.length)];
  }

  const startX = builder ? builder.x : (rect.left + (Math.random() > 0.5 ? 120 : -120));
  const startY = builder ? builder.y : (rect.top - 60);

  // 2. Blueprint Ghost
  const ghost = document.createElement('div');
  ghost.className = 'swarm-drag-ghost';
  ghost.style.left = `${startX}px`;
  ghost.style.top = `${startY}px`;
  ghost.style.width = `${rect.width}px`;
  ghost.style.height = `${rect.height}px`;
  ghost.innerHTML = `<div class="swarm-ghost-pill">◫ &lt;${componentName}&gt; ${Math.round(rect.width)}×${Math.round(rect.height)}</div>`;

  // 3. Smart crosshair alignment guides
  const guideX = document.createElement('div');
  guideX.className = 'swarm-smart-guide-x';
  guideX.style.top = `${rect.top + rect.height / 2}px`;

  const guideY = document.createElement('div');
  guideY.className = 'swarm-smart-guide-y';
  guideY.style.left = `${rect.left + rect.width / 2}px`;

  if (layerContainer) {
    layerContainer.appendChild(ghost);
    layerContainer.appendChild(guideX);
    layerContainer.appendChild(guideY);
  }

  // Direct builder agent
  if (builder) {
    builder.targetX = rect.left + rect.width * 0.25;
    builder.targetY = rect.top + 12;
    builder.actionCooldown = 80;
    const badge = builder.el.querySelector('.swarm-agent-badge');
    if (badge) badge.textContent = `${builder.agent.name} (Dragging ⤓)`;
  }

  // Helper agent for smart alignment
  if (activeAgentInstances.length > 1) {
    const helper = activeAgentInstances.find(a => a !== builder);
    if (helper) {
      helper.targetX = rect.right - 20;
      helper.targetY = rect.bottom - 10;
      helper.actionCooldown = 60;
      const hBadge = helper.el.querySelector('.swarm-agent-badge');
      if (hBadge) hBadge.textContent = `${helper.agent.name} (Aligning)`;
    }
  }

  // Animate ghost to target position
  requestAnimationFrame(() => {
    ghost.style.transform = `translate(${rect.left - startX}px, ${rect.top - startY}px)`;
  });

  const dragDuration = 280 / swarmSpeed;
  setTimeout(() => {
    triggerSnapEffect(rect.left, rect.top, rect.width, rect.height);
    playChimeSound(600 + Math.random() * 220, 0.16);

    ghost.remove();
    guideX.remove();
    guideY.remove();

    el.classList.remove('swarm-building');
    el.classList.add('swarm-built');

    if (builder) {
      const badge = builder.el.querySelector('.swarm-agent-badge');
      if (badge) {
        badge.textContent = `${builder.agent.name} (✓ Placed)`;
        setTimeout(() => {
          if (badge) badge.textContent = builder.agent.name;
        }, 400);
      }
    }

    currentLayerCount = Math.min(totalLayers, currentLayerCount + 33);
    if (layerCountEl) {
      layerCountEl.textContent = `${currentLayerCount} / ${totalLayers} layers`;
    }

    checkBuildCompletion();
  }, dragDuration);
}

function replayAssembly() {
  clearTimeout(warpOutTimer);
  const elements = document.querySelectorAll('[data-build-group]');
  elements.forEach(el => {
    el.classList.remove('swarm-built', 'swarm-building');
    el.classList.add('swarm-pending-build');
  });

  const replayBtn = document.getElementById('swarmReplayBtn');
  const toggleBtn = document.getElementById('swarmToggleBtn');
  const statusDot = document.querySelector('.dock-status-dot');
  if (replayBtn) replayBtn.style.display = 'none';
  if (toggleBtn) toggleBtn.style.display = 'inline-block';
  if (statusDot) statusDot.classList.remove('completed');

  ensureAgentsActive();
  setupProgressiveBuild();
}

function setupProgressiveBuild() {
  const elementsToBuild = [
    // 1. Hero group (Assembles on initial load sequentially)
    { sel: '.hero-3d-text', group: 'hero', name: 'Typography: 3D PORTFOLIO', delay: 120 },
    { sel: '.hero-portrait-wrap', group: 'hero', name: 'Avatar: 2.5D Studio Halo', delay: 420 },
    { sel: '.hero-intro-text', group: 'hero', name: 'Bio: Developer Intro', delay: 780 },
    { sel: '.hero-cta-group', group: 'hero', name: 'Actions: CTA & Location', delay: 1100 },
    { sel: '.stats-grid', group: 'hero', name: 'Stats: Metrics Grid', delay: 1400 },
    { sel: '.hero-downloads', group: 'hero', name: 'Download: CV Resume', delay: 1650 },
    // 2. About section group (Assembles on scroll)
    { sel: '.profile-details-card', group: 'about', name: 'Card: Profile Info', delay: 80 },
    { sel: '.motto-greeting-card', group: 'about', name: 'Card: Motto & Greeting', delay: 280 },
    // 3. Skills section group (Assembles on scroll)
    { sel: '.skill-category-card:nth-child(1)', group: 'skills', name: 'Skills: IoT & Hardware', delay: 80 },
    { sel: '.skill-category-card:nth-child(2)', group: 'skills', name: 'Skills: Frontend Web', delay: 260 },
    { sel: '.skill-category-card:nth-child(3)', group: 'skills', name: 'Skills: Tools & Database', delay: 440 },
    // 4. Projects section group (Assembles on scroll)
    { sel: '.project-card:nth-child(1)', group: 'projects', name: 'Project: Smart Farm ESP32', delay: 80 },
    { sel: '.project-card:nth-child(2)', group: 'projects', name: 'Project: IT Academy Hub', delay: 300 }
  ];

  const layerCountEl = document.getElementById('swarm-layer-count');

  // Mark all elements as built initially to guarantee 100% instant visibility
  elementsToBuild.forEach(item => {
    const el = document.querySelector(item.sel);
    if (el) {
      el.classList.add('swarm-built');
      el.dataset.buildGroup = item.group;
      el.dataset.buildName = item.name;
      el.dataset.buildDelay = item.delay;
    }
  });

  currentLayerCount = 0;
  if (layerCountEl) {
    layerCountEl.textContent = `0 / ${totalLayers} layers`;
  }

  // 1. Assemble Hero section elements on load
  const heroElements = document.querySelectorAll('[data-build-group="hero"]');
  heroElements.forEach(el => {
    const delay = parseInt(el.dataset.buildDelay || '0', 10);
    setTimeout(() => {
      assembleElement(el);
    }, delay);
  });

  // 2. Build-on-Scroll via IntersectionObserver (Enhanced for zero-empty scroll)
  const pendingScrollElements = document.querySelectorAll('.swarm-pending-build:not([data-build-group="hero"])');
  pendingScrollElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 250) {
      assembleElement(el);
    }
  });

  if ('IntersectionObserver' in window) {
    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          if (!el.classList.contains('swarm-built')) {
            assembleElement(el);
            scrollObserver.unobserve(el);
          }
        }
      });
    }, {
      rootMargin: '0px 0px 250px 0px',
      threshold: 0.01
    });

    const scrollElements = document.querySelectorAll('.swarm-pending-build:not([data-build-group="hero"])');
    scrollElements.forEach(el => scrollObserver.observe(el));
  }

  // 3. Active Mouse Scroll Wheel & Touch Scroll Listener
  window.addEventListener('scroll', () => {
    const pending = document.querySelectorAll('.swarm-pending-build');
    pending.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 250) {
        assembleElement(el);
      }
    });
  }, { passive: true });

  // Safety net: ensure all elements are visible after 8 seconds
  setTimeout(() => {
    document.querySelectorAll('.swarm-pending-build').forEach(el => {
      el.classList.remove('swarm-pending-build');
      el.classList.add('swarm-built');
    });
    checkBuildCompletion();
  }, 8000);
}

/* ==========================================================================
   Part 4: Interactions, Web Audio Chime, Sparkles & Greeting Typewriter
   ========================================================================== */
let audioMuted = false;
let audioCtx = null;
let greetingIndex = 0;
let typingTimer = null;

const devGreetings = [
  'สวัสดีครับ! ยินดีที่ได้รู้จักครับ ✨💻',
  'ขอบคุณที่แวะมาชมพอร์ตโฟลิโอของผมนะครับ 🚀🔥',
  'กำลังมองหานักพัฒนาเว็บและระบบ IoT อยู่ใช่ไหมครับ? ⚡🌟',
  'อยากเก่ง ก็ต้องลงมือทำ! มาสร้างโปรเจกต์เจ๋งๆ กันครับ 💖✨',
  'ระบบ Smart Farm ESP32 และ IT Academy พร้อมต่อยอดครับ 🌿🤖'
];

function playChimeSound(freq = 587.33, duration = 0.28) {
  if (audioMuted) return;

  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, audioCtx.currentTime + duration);

    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (err) {
    // Ignore autoplay restriction warnings
  }
}

function createSparkles(x, y) {
  const count = 24;
  const symbols = ['✨', '💻', '🚀', '⚡', '🌟', '🔥', '💫'];
  const colors = ['#e11d48', '#38bdf8', '#c084fc', '#fef08a', '#ffffff', '#4ade80'];

  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    p.className = 'sparkle-particle';

    if (Math.random() > 0.4) {
      p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      p.style.fontSize = `${Math.random() * 12 + 14}px`;
    } else {
      const size = Math.random() * 8 + 4;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.borderRadius = '50%';
      const color = colors[Math.floor(Math.random() * colors.length)];
      p.style.background = color;
      p.style.boxShadow = `0 0 10px ${color}`;
    }

    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * 130 + 30;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;

    p.style.left = `${x}px`;
    p.style.top = `${y}px`;
    p.style.setProperty('--dx', `${dx}px`);
    p.style.setProperty('--dy', `${dy}px`);

    document.body.appendChild(p);

    p.addEventListener('animationend', () => p.remove());
  }
}

function typeWriter(text, element, speed = 25) {
  if (typingTimer) clearInterval(typingTimer);
  element.textContent = '';
  let i = 0;

  typingTimer = setInterval(() => {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(typingTimer);
    }
  }, speed);
}

function handleGreetingAction(event) {
  const msgEl = document.getElementById('greetingmassege');
  const greeting = devGreetings[greetingIndex];
  greetingIndex = (greetingIndex + 1) % devGreetings.length;

  if (msgEl) {
    typeWriter(greeting, msgEl);
  }

  const rect = event.target.getBoundingClientRect();
  createSparkles(rect.left + rect.width / 2, rect.top + rect.height / 2);
  playChimeSound(659.25, 0.35); // E5 note chime
}

function initInteractions() {
  const greetingBtn = document.getElementById('greetingBtn');
  const heroGreeting = document.getElementById('heroGreetingTrigger');
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  const swarmSoundBtn = document.getElementById('swarmSoundBtn');

  if (greetingBtn) greetingBtn.addEventListener('click', handleGreetingAction);
  if (heroGreeting) heroGreeting.addEventListener('click', (e) => {
    handleGreetingAction(e);
    const aboutSection = document.getElementById('about');
    if (aboutSection) aboutSection.scrollIntoView({ behavior: 'smooth' });
  });

  const toggleAudio = () => {
    audioMuted = !audioMuted;
    const icon = audioMuted ? '🔇' : '🔊';
    if (audioToggleBtn) audioToggleBtn.textContent = icon;
    if (swarmSoundBtn) swarmSoundBtn.textContent = icon;
  };

  if (audioToggleBtn) audioToggleBtn.addEventListener('click', toggleAudio);
  if (swarmSoundBtn) swarmSoundBtn.addEventListener('click', toggleAudio);
}

// Global visitor state
let visitorName = '';

// Initial boot
function bootApplication() {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  initThreeBackground();
  initParallax();
  initSwarmSimulation();
  setupProgressiveBuild();
  initInteractions();
  initPersonalizedWelcome();
  initCostEstimator();
  // Vibe Coding 2.0 Features
  initThemeToggle();
  initProjectFilter();
  initProjectModal();
  initContactForm();
  // Editorial Renovation Engine (Aperture Row, Embers & Lithos)
  initSmoothScrollReveals();
  initHeaderScrollEffect();
  initSpotlightGlow();
  initCursorPill();
  initCountUpStats();
  initTurntableTilt();
  // Grand Dynamic Renovation: Audio, X-Ray, Turntable & Bench
  initTactileAudio();
  initXRaySpotlight();
  initTurntablePinouts();
  initTelemetryBench();
  // Epic Hologram & Spark Physics
  initCardHologramPhysics();
  initSparkBurstEngine();
  // Aperture Row Rotating Dials & 9-Blade Iris Calibration
  initAboutApertureIris();
  initApertureDials();
}

window.addEventListener('load', () => {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
});

/* ==========================================================================
   Part 5: Course Assignments (ระบบต้อนรับ และระบบคำนวณค่าบริการพัฒนาเว็บไซต์)
   ========================================================================== */

/**
 * ส่วนที่ 1: ระบบข้อความต้อนรับผู้เข้าชม (Personalized Welcome)
 * - ใช้ prompt() เพื่อรับชื่อผู้เข้าชมเว็บไซต์
 * - ใช้ตัวแปร visitorName จัดเก็บชื่อผู้เข้าชม
 * - แสดงข้อความต้อนรับบนหน้าเว็บไซต์ เช่น "ยินดีต้อนรับคุณ [ชื่อ] เข้าสู่เว็บไซต์ Portfolio ของฉัน"
 */
// visitorName is declared in global state above

function promptVisitorName() {
  let inputName = null;
  if (typeof prompt === 'function') {
    inputName = prompt('ยินดีต้อนรับสู่ Portfolio! กรุณากรอกชื่อของคุณ:');
  }

  // ใช้ตัวแปรจัดเก็บชื่อผู้เข้าชม พร้อมกำหนดค่าเริ่มต้นกรณีไม่ได้กรอก
  if (inputName && inputName.trim() !== '') {
    visitorName = inputName.trim();
  } else {
    visitorName = 'ผู้เข้าชม';
  }

  // แสดงข้อความต้อนรับบนหน้าเว็บไซต์
  const welcomeMsgEl = document.getElementById('welcomeMessage');
  if (welcomeMsgEl) {
    welcomeMsgEl.innerHTML = `ยินดีต้อนรับคุณ <strong>${visitorName}</strong> เข้าสู่เว็บไซต์ Portfolio ของฉัน`;
  }
}

function initPersonalizedWelcome() {
  // กำหนดข้อความต้อนรับเริ่มต้นทันที เพื่อไม่ให้หน้าเว็บค้างหรือว่างเปล่า
  const welcomeMessageEl = document.getElementById('welcomeMessage');
  if (welcomeMessageEl) {
    welcomeMessageEl.innerHTML = `ยินดีต้อนรับคุณ <strong>${visitorName || 'ผู้เข้าชม'}</strong> เข้าสู่เว็บไซต์ Portfolio ของฉัน`;
  }

  // ปุ่มสำหรับคลิกเพื่อเปลี่ยนชื่อผู้เข้าชมได้ตลอดเวลา
  const changeNameBtn = document.getElementById('changeNameBtn');
  if (changeNameBtn) {
    changeNameBtn.addEventListener('click', () => {
      promptVisitorName();
      if (typeof playChimeSound === 'function') {
        playChimeSound(587.33, 0.2);
      }
    });
  }
}

/**
 * ส่วนที่ 2: ระบบประมาณการค่าบริการพัฒนาเว็บไซต์ (Website Cost Estimator)
 * - กำหนดราคาค่าพัฒนาเว็บไซต์หน้าละ 500 บาท
 * - ใช้ prompt() รับจำนวนหน้าที่ต้องการ
 * - ใช้ Number() แปลงข้อมูลเป็นตัวเลข
 * - คำนวณค่าบริการทั้งหมด (จำนวนหน้า × 500)
 * - แสดงจำนวนหน้าและค่าบริการรวมบนหน้าเว็บไซต์
 */
function estimateWebsiteCost() {
  // กำหนดราคาค่าพัฒนาเว็บไซต์หน้าละ 500 บาท
  const pricePerPage = 500;

  // ใช้ prompt() รับจำนวนหน้าที่ต้องการ
  let inputPages = null;
  if (typeof prompt === 'function') {
    inputPages = prompt('กรุณาระบุจำนวนหน้าที่ต้องการพัฒนาเว็บไซต์ (ราคาหน้าละ 500 บาท):');
  }

  // กรณีผู้ใช้กด Cancel หรือปิดหน้าต่าง
  if (inputPages === null) {
    return;
  }

  // ใช้ Number() แปลงข้อมูลเป็นตัวเลข
  const pageCount = Number(inputPages);

  const displayPageEl = document.getElementById('estPageCount');
  const displayTotalEl = document.getElementById('estTotalPrice');
  const remarkEl = document.getElementById('estRemark');

  // ตรวจสอบความถูกต้องของข้อมูล (ต้องเป็นตัวเลขที่มากกว่า 0)
  if (isNaN(pageCount) || pageCount <= 0 || !Number.isInteger(pageCount)) {
    if (typeof alert === 'function') {
      alert('กรุณากรอกจำนวนหน้าเป็นตัวเลขจำนวนเต็มบวกที่ถูกต้องครับ (เช่น 1, 2, 5)');
    }
    if (displayPageEl) displayPageEl.textContent = '-';
    if (displayTotalEl) displayTotalEl.textContent = '-';
    if (remarkEl) {
      remarkEl.textContent = '* ข้อมูลไม่ถูกต้อง กรุณากดคำนวณใหม่อีกครั้ง';
      remarkEl.style.color = '#ff4d6d';
    }
    return;
  }

  // คำนวณค่าบริการทั้งหมด (จำนวนหน้า × 500)
  const totalPrice = pageCount * pricePerPage;

  // แสดงจำนวนหน้าและค่าบริการรวมบนหน้าเว็บไซต์
  if (displayPageEl) {
    displayPageEl.textContent = `${pageCount.toLocaleString()} หน้า`;
  }
  if (displayTotalEl) {
    displayTotalEl.textContent = `${totalPrice.toLocaleString()} บาท`;
  }
  if (remarkEl) {
    remarkEl.textContent = `* คำนวณเรียบร้อย: ${pageCount} หน้า × 500 บาท = ${totalPrice.toLocaleString()} บาท`;
    remarkEl.style.color = '#38bdf8';
  }

  // เล่นเสียง Synthesizer ยืนยันการคำนวณ (ถ้ามี)
  if (typeof playChimeSound === 'function') {
    playChimeSound(880, 0.25);
  }
}

function initCostEstimator() {
  const calcBtn = document.getElementById('calcCostBtn');
  if (calcBtn) {
    calcBtn.addEventListener('click', estimateWebsiteCost);
  }
}



/* ==========================================================================
   Part 6: Vibe Coding 2.0 Features
   - 01: Project Filter (ระบบกรองผลงานตามหมวดหมู่)
   - 02: Contact Form with Validation (แบบฟอร์มติดต่อพร้อมตรวจสอบข้อมูล)
   - 03: Dark Mode / Light Mode Switch (ระบบสลับธีมมืดและสว่าง)
   - 04: Project Details Modal Popup (หน้าต่างแสดงรายละเอียดผลงานเพิ่มเติม)
   ========================================================================== */

/**
 * 03. Dark / Light Mode Switcher
 * - จัดการสลับธีมระหว่าง Dark Mode (ค่าเริ่มต้น) และ Light Mode
 * - จดจำค่าที่ผู้ใช้เลือกลงใน localStorage
 * - อัปเดตไอคอนปุ่ม (🌙 <-> ☀️) และปรับแต่งบรรยากาศสีสัน
 */
function initThemeToggle() {
  const themeBtn = document.getElementById('themeToggleBtn');
  if (!themeBtn) return;

  // ตรวจสอบค่าธีมที่บันทึกไว้ใน localStorage
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    themeBtn.textContent = '☀️';
  } else {
    document.body.classList.remove('light-mode');
    themeBtn.textContent = '🌙';
  }

  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    themeBtn.textContent = isLight ? '☀️' : '🌙';
    localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');

    // เล่นเสียง Effect ตอบสนองการกดปุ่ม
    if (typeof playChimeSound === 'function') {
      playChimeSound(784, 0.2); // G5 chime note
    }
  });
}

/**
 * 01. Project Filter System
 * - กรองผลงานตามหมวดหมู่: ทั้งหมด (all), IoT & Hardware (iot), Web Application (web)
 * - สลับสถานะ active ของปุ่มตัวกรอง
 * - ซ่อน/แสดงการ์ดผลงานอย่างลื่นไหล
 */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // อัปเดตสถานะปุ่มที่ถูกเลือก
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterVal = btn.getAttribute('data-filter');

      // ซ่อนหรือแสดงผลงานตามหมวดหมู่
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterVal === 'all' || category === filterVal) {
          card.classList.remove('is-hidden');
        } else {
          card.classList.add('is-hidden');
        }
      });

      if (window.__projectsDial && typeof window.__projectsDial.setFilter === 'function') {
        window.__projectsDial.setFilter(filterVal);
      }

      if (typeof playChimeSound === 'function') {
        playChimeSound(659.25, 0.15); // E5 chime
      }
    });
  });
}

/**
 * 04. Project Details Modal Popup
 * - จัดเก็บข้อมูลรายละเอียดเชิงลึกของแต่ละผลงาน
 * - เปิดหน้าต่างป๊อปอัปแสดงชื่อผลงาน หมวดหมู่ คำอธิบาย จุดเด่น และเทคโนโลยี
 * - รองรับการปิดหน้าต่างด้วยปุ่มกากบาท ปุ่มปิด คลิกพื้นหลัง หรือกดปุ่ม Escape
 */
const projectDetailsData = {
  smartfarm: {
    title: '1. ระบบ Smart Farm ด้วย ESP32',
    tag: 'HARDWARE & IOT',
    desc: 'ระบบฟาร์มอัจฉริยะที่ใช้ ESP32 ในการควบคุมเซนเซอร์วัดความชื้นในดิน อุณหภูมิ และความเข้มแสง พร้อมหน้าเว็บ Dashboard ควบคุมแบบเรียลไทม์ผ่าน WiFi จัดการสั่งรดน้ำอัตโนมัติ',
    highlights: [
      'เชื่อมต่อเซนเซอร์ตรวจวัดสภาพแวดล้อม (DHT22, Soil Moisture Sensor, LDR)',
      'หน้าเว็บ Web Dashboard สำหรับมอนิเตอร์และสั่งเปิด/ปิดวาล์วน้ำได้ทุกที่ผ่านอินเทอร์เน็ต',
      'ระบบทำงานอัตโนมัติทันทีเมื่อค่าความชื้นในดินต่ำกว่าเกณฑ์ที่กำหนด',
      'แปลงข้อมูลสถิติสภาพแวดล้อมย้อนหลังแสดงผลเป็นกราฟแนวโน้มแบบเรียลไทม์'
    ],
    tech: ['ESP32', 'C++', 'Web Dashboard', 'Automation', 'Sensors'],
    link: null
  },
  itacademy: {
    title: '2. เว็บไซต์เรียนรู้ IT Academy',
    tag: 'WEB PLATFORM',
    desc: 'แพลตฟอร์มการเรียนรู้ออนไลน์สำหรับผู้สนใจด้านเทคโนโลยีสารสนเทศ รวบรวมหลักสูตร สื่อการสอน และแบบทดสอบเกี่ยวกับ IoT, Network, และ Web Application',
    highlights: [
      'ระบบแสดงหลักสูตรและเนื้อหาบทเรียนเป็นหมวดหมู่อย่างเป็นระเบียบ',
      'ออกแบบ UI ทันสมัย รองรับทั้งคอมพิวเตอร์และโทรศัพท์มือถือ (Responsive Web)',
      'มีแบบทดสอบและลิงก์แหล่งเรียนรู้เพิ่มเติมในสายงานเทคโนโลยี',
      'เชื่อมต่อกับ Vercel สำหรับการ Deploy และเปิดใช้งานจริงบนออนไลน์'
    ],
    tech: ['Web Application', 'HTML5/CSS3', 'JavaScript', 'PHP', 'Education'],
    link: 'https://it-academy-online.vercel.app/'
  },
  smartdetect: {
    title: '3. ระบบตรวจจับวัตถุอัจฉริยะ (Smart Detection)',
    tag: 'HARDWARE & IOT',
    desc: 'ระบบเฝ้าระวังและตรวจจับความเคลื่อนไหวผ่านเซนเซอร์และ ESP32 ส่งสัญญาณแจ้งเตือนอัตโนมัติแบบเรียลไทม์ เพิ่มความปลอดภัยให้สถานที่',
    highlights: [
      'ตรวจจับความเคลื่อนไหวด้วยเซนเซอร์อินฟราเรด (PIR Sensor) แบบแม่นยำ',
      'แจ้งเตือนสถานะทันทีเมื่อพบความเคลื่อนไหวผิดปกติ',
      'รองรับการส่งข้อมูลผ่านโพรโทคอล MQTT สำหรับระบบ Smart Security',
      'ประหยัดพลังงานด้วยระบบ Standby อัจฉริยะ'
    ],
    tech: ['ESP32', 'PIR Sensor', 'MQTT Protocol', 'IoT Security'],
    link: null
  },
  bloompetal: {
    title: '4. Bloom & Petal ร้านดอกไม้ออนไลน์',
    tag: 'WEB PLATFORM',
    desc: 'เว็บแอปพลิเคชันระบบสั่งซื้อสินค้าออนไลน์สำหรับร้านดอกไม้ รองรับระบบตะกร้าสินค้า (Cart), ค้นหาสินค้า และออกแบบหน้าเว็บแบบ Responsive',
    highlights: [
      'ระบบแคตตาล็อกสินค้าพร้อมตัวกรองประเภทช่อดอกไม้และของขวัญ',
      'ระบบตะกร้าสินค้าแบบเรียลไทม์ (Cart Management) คำนวณยอดเงินอัตโนมัติ',
      'หน้าเว็บรองรับ Mobile-First Design แสดงผลสวยงามบนสมาร์ตโฟน',
      'โครงสร้างโค้ด HTML5 / CSS3 / Vanilla JS ประสิทธิภาพสูง'
    ],
    tech: ['HTML5 / CSS3', 'JavaScript', 'Firebase Hosting', 'E-Commerce UI'],
    link: null
  }
};

function initProjectModal() {
  const modal = document.getElementById('projectModal');
  if (!modal) return;

  const backdrop = document.getElementById('modalBackdrop');
  const closeBtn = document.getElementById('modalCloseBtn');
  const cancelBtn = document.getElementById('modalCancelBtn');
  const titleEl = document.getElementById('modalTitle');
  const tagEl = document.getElementById('modalTag');
  const descEl = document.getElementById('modalDesc');
  const highlightsEl = document.getElementById('modalHighlights');
  const techTagsEl = document.getElementById('modalTechTags');
  const liveLinkEl = document.getElementById('modalLiveLink');

  const openModal = (key) => {
    const data = projectDetailsData[key];
    if (!data) return;

    if (titleEl) titleEl.textContent = data.title;
    if (tagEl) tagEl.textContent = data.tag;
    if (descEl) descEl.textContent = data.desc;

    if (highlightsEl) {
      highlightsEl.innerHTML = '';
      data.highlights.forEach(h => {
        const li = document.createElement('li');
        li.textContent = h;
        highlightsEl.appendChild(li);
      });
    }

    if (techTagsEl) {
      techTagsEl.innerHTML = '';
      data.tech.forEach(t => {
        const span = document.createElement('span');
        span.textContent = t;
        techTagsEl.appendChild(span);
      });
    }

    if (liveLinkEl) {
      if (data.link) {
        liveLinkEl.href = data.link;
        liveLinkEl.style.display = 'inline-flex';
      } else {
        liveLinkEl.style.display = 'none';
      }
    }

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (typeof playChimeSound === 'function') {
      playChimeSound(700, 0.2);
    }
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.btn-project-detail').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const key = btn.getAttribute('data-project');
      openModal(key);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
}

/**
 * 02. Contact Form with Input Validation
 * - ตรวจสอบความถูกต้องของข้อมูล (Validation):
 *   1) ชื่อ: ต้องไม่ว่าง และมีความยาวอย่างน้อย 2 ตัวอักษร
 *   2) อีเมล: ต้องไม่ว่าง และเป็นรูปแบบอีเมลที่ถูกต้อง (name@example.com)
 *   3) ข้อความ: ต้องไม่ว่าง และมีความยาวอย่างน้อย 5 ตัวอักษร
 * - แสดงข้อความแจ้งเตือนข้อผิดพลาดใต้ช่องกรอกแบบเรียลไทม์
 * - แสดงกล่องข้อความแจ้งเตือนความสำเร็จ (Success Banner) พร้อมจำลองการทำงานโดยไม่ต้องส่งอีเมลจริง
 */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const messageInput = document.getElementById('contactMessage');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');
  const statusBox = document.getElementById('contactStatus');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Real-time clear error upon input
  if (nameInput) {
    nameInput.addEventListener('input', () => {
      nameInput.classList.remove('is-invalid');
      if (nameError) nameError.textContent = '';
    });
  }
  if (emailInput) {
    emailInput.addEventListener('input', () => {
      emailInput.classList.remove('is-invalid');
      if (emailError) emailError.textContent = '';
    });
  }
  if (messageInput) {
    messageInput.addEventListener('input', () => {
      messageInput.classList.remove('is-invalid');
      if (messageError) messageError.textContent = '';
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Reset error messages and status
    if (nameError) nameError.textContent = '';
    if (emailError) emailError.textContent = '';
    if (messageError) messageError.textContent = '';
    if (statusBox) {
      statusBox.style.display = 'none';
      statusBox.className = 'contact-status-box';
    }

    // 1. ตรวจสอบชื่อ
    const nameVal = nameInput ? nameInput.value.trim() : '';
    if (!nameVal) {
      if (nameError) nameError.textContent = 'กรุณากรอกชื่อของคุณ';
      if (nameInput) nameInput.classList.add('is-invalid');
      isValid = false;
    } else if (nameVal.length < 2) {
      if (nameError) nameError.textContent = 'ชื่อต้องมีความยาวอย่างน้อย 2 ตัวอักษร';
      if (nameInput) nameInput.classList.add('is-invalid');
      isValid = false;
    }

    // 2. ตรวจสอบอีเมล
    const emailVal = emailInput ? emailInput.value.trim() : '';
    if (!emailVal) {
      if (emailError) emailError.textContent = 'กรุณากรอกอีเมลของคุณ';
      if (emailInput) emailInput.classList.add('is-invalid');
      isValid = false;
    } else if (!emailRegex.test(emailVal)) {
      if (emailError) emailError.textContent = 'รูปแบบอีเมลไม่ถูกต้อง (เช่น example@mail.com)';
      if (emailInput) emailInput.classList.add('is-invalid');
      isValid = false;
    }

    // 3. ตรวจสอบข้อความ
    const msgVal = messageInput ? messageInput.value.trim() : '';
    if (!msgVal) {
      if (messageError) messageError.textContent = 'กรุณากรอกข้อความที่คุณต้องการติดต่อ';
      if (messageInput) messageInput.classList.add('is-invalid');
      isValid = false;
    } else if (msgVal.length < 5) {
      if (messageError) messageError.textContent = 'ข้อความต้องมีความยาวอย่างน้อย 5 ตัวอักษร';
      if (messageInput) messageInput.classList.add('is-invalid');
      isValid = false;
    }

    // หากข้อมูลไม่ถูกต้อง หยุดการทำงานและส่งเสียงเตือน
    if (!isValid) {
      if (typeof playChimeSound === 'function') {
        playChimeSound(330, 0.2); // Low frequency alert chime
      }
      return;
    }

    // จำลองการส่งข้อมูลสำเร็จ และแสดงข้อความแจ้งเตือน
    if (statusBox) {
      statusBox.className = 'contact-status-box success';
      statusBox.innerHTML = `<strong>✅ ส่งข้อความสำเร็จ!</strong> ขอบคุณคุณ <strong>${nameVal}</strong> ทางเราได้รับข้อความของคุณเรียบร้อยแล้ว และจะติดต่อกลับไปยัง <em>${emailVal}</em> โดยเร็ว (จำลองการทำงานโดยไม่จำเป็นต้องส่งอีเมลจริง)`;
      statusBox.style.display = 'block';
    }

    // ล้างข้อมูลในฟอร์มหลังส่งสำเร็จ
    form.reset();

    // เล่นเสียงยืนยันความสำเร็จ
    if (typeof playChimeSound === 'function') {
      playChimeSound(880, 0.3); // High frequency success chime
    }
  });
}


/* ==========================================================================
   Part 7: Editorial Renovation Engine (Aperture Row, Embers Foundry & Lithos)
   - Smooth Scroll Reveals with cubic ease-out
   - Sticky Header Dynamic Compression
   - Interactive Mouse Spotlight Glow (0.1 lerp smoothing)
   - Floating Cursor Pill Indicator
   - Animated Count-Up Numbers
   - 3D Turntable Plate Tilt Physics
   ========================================================================== */

/**
 * 1. Smooth Scroll Reveals with IntersectionObserver
 * - Adds .in class to .reveal elements as they enter the screen
 */
function initSmoothScrollReveals() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const revealEl = (el) => {
    if (!el.classList.contains('in')) {
      el.classList.add('in');
    }
  };

  // 1. Immediately reveal elements that are already within or near viewport
  reveals.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 250) {
      revealEl(el);
    }
  });

  // 2. High-performance IntersectionObserver with generous 250px rootMargin
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          revealEl(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.01,
      rootMargin: '0px 0px 250px 0px'
    });

    reveals.forEach(el => {
      if (!el.classList.contains('in')) {
        observer.observe(el);
      }
    });
  } else {
    reveals.forEach(revealEl);
  }

  // 3. Fallback active scroll listener so fast scroll actions reveal instantly without empty gaps
  window.addEventListener('scroll', () => {
    reveals.forEach(el => {
      if (!el.classList.contains('in')) {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight + 250) {
          revealEl(el);
        }
      }
    });
  }, { passive: true });
}

/**
 * 2. Sticky Header Dynamic Compression on Scroll
 * - Compresses header height from 84px to 68px when scrolling past 36px
 */
function initHeaderScrollEffect() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const onScroll = () => {
    const y = window.scrollY || window.pageYOffset;
    if (y > 36) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/**
 * 3. Interactive Mouse Spotlight Glow (Lithos Inspired Smooth Lerp)
 * - Glides a soft radial lighting layer across the background
 */
function initSpotlightGlow() {
  const spotlight = document.getElementById('spotlightGlow');
  if (!spotlight) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let smoothX = mouseX;
  let smoothY = mouseY;
  let hasMoved = false;

  window.addEventListener('pointermove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!hasMoved) {
      hasMoved = true;
      smoothX = mouseX;
      smoothY = mouseY;
      spotlight.style.opacity = '1';
    }
  }, { passive: true });

  function render() {
    if (hasMoved) {
      smoothX += (mouseX - smoothX) * 0.1;
      smoothY += (mouseY - smoothY) * 0.1;
      spotlight.style.transform = `translate3d(${smoothX.toFixed(1)}px, ${smoothY.toFixed(1)}px, 0)`;
    }
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

/**
 * 4. Floating Cursor Pill Indicator (Aperture Row Inspired)
 * - Follows cursor and activates when hovering interactive cards
 */
function initCursorPill() {
  const pill = document.getElementById('cursorPill');
  const pillText = document.getElementById('cursorPillText');
  if (!pill) return;

  let mouseX = -100;
  let mouseY = -100;
  let pillX = -100;
  let pillY = -100;

  window.addEventListener('pointermove', (e) => {
    mouseX = e.clientX + 16;
    mouseY = e.clientY + 16;
  }, { passive: true });

  function update() {
    pillX += (mouseX - pillX) * 0.18;
    pillY += (mouseY - pillY) * 0.18;
    pill.style.transform = `translate3d(${pillX.toFixed(1)}px, ${pillY.toFixed(1)}px, 0)`;
    requestAnimationFrame(update);
  }
  requestAnimationFrame(update);

  const interactiveTargets = document.querySelectorAll(
    '.project-card, .btn-project-detail, .btn-project-visit, .stat-card, .btn-calc, .skill-category-card'
  );
  interactiveTargets.forEach(target => {
    target.addEventListener('pointerenter', () => {
      if (window.innerWidth >= 860) {
        if (target.classList.contains('project-card')) {
          if (pillText) pillText.textContent = 'EXPLORE PROJECT';
        } else if (target.classList.contains('btn-calc')) {
          if (pillText) pillText.textContent = 'CALCULATE';
        } else if (target.classList.contains('skill-category-card')) {
          if (pillText) pillText.textContent = 'VIEW STACK';
        } else {
          if (pillText) pillText.textContent = 'INTERACT';
        }
        pill.classList.add('visible');
      }
    });
    target.addEventListener('pointerleave', () => {
      pill.classList.remove('visible');
    });
  });
}

/**
 * 5. Animated Count-Up Numbers (Aperture Row "The Bench" Inspired)
 * - Smoothly ticks numbers upward when scrolled into view
 */
function initCountUpStats() {
  const stats = document.querySelectorAll('.stat-num[data-target]');
  if (!stats.length) return;

  let started = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        stats.forEach(el => {
          const target = parseFloat(el.getAttribute('data-target')) || 0;
          const suffix = el.getAttribute('data-suffix') || '';
          const prefix = el.getAttribute('data-prefix') || '';
          const isInt = Number.isInteger(target);
          const startTime = performance.now();
          const duration = 1400;

          function frame(now) {
            const p = Math.min((now - startTime) / duration, 1);
            // Cubic ease out
            const eased = 1 - Math.pow(1 - p, 3);
            const current = target * eased;
            el.textContent = prefix + (isInt ? Math.round(current) : current.toFixed(1)) + suffix;
            if (p < 1) {
              requestAnimationFrame(frame);
            } else {
              el.textContent = prefix + target + suffix;
            }
          }
          requestAnimationFrame(frame);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.25 });

  const grid = document.querySelector('.stats-grid');
  if (grid) observer.observe(grid);
}

/**
 * 6. 3D Turntable Plate Tilt Physics in Project Details Drawer
 * - Smooth cursor-driven perspective rotation (Aperture Row Inspired)
 */
function initTurntableTilt() {
  const turntable = document.querySelector('.modal-turntable');
  const visual = document.querySelector('.modal-turntable-visual');
  if (!turntable || !visual) return;

  turntable.addEventListener('pointermove', (e) => {
    const rect = turntable.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    const ry = Math.max(-14, Math.min(14, nx * 14));
    const rx = Math.max(-10, Math.min(10, -ny * 10));
    visual.style.transform = `rotateY(${ry.toFixed(2)}deg) rotateX(${rx.toFixed(2)}deg) scale(1.06)`;
  });

  turntable.addEventListener('pointerleave', () => {
    visual.style.transform = 'rotateY(0deg) rotateX(0deg) scale(1)';
  });
}

/* ==========================================================================
   Part 8: Advanced Interactive Engineering (Lithos & Aperture Row Inspired)
   ========================================================================== */

/**
 * 1. Tactile Web Audio Feedback Engine
 * - Synthesizes crisp mechanical microswitch clicks and telemetry pings
 */
let audioEnabled = true;

function getAudioContext() {
  if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function playMechanicalRelaySound(tone = 'snap') {
  if (!audioEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Stage 1: Filtered noise snap (Microswitch contact strike)
    const bufferSize = Math.floor(ctx.sampleRate * 0.035);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(tone === 'heavy' ? 1400 : 2400, now);
    filter.Q.setValueAtTime(3.5, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.25, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);

    // Stage 2: Low-frequency metallic body thud
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(tone === 'heavy' ? 110 : 160, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.05);

    oscGain.gain.setValueAtTime(0.2, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.055);
  } catch (err) {
    // Audio context may be restricted by autoplay policy
  }
}

function playTelemetryPingSound() {
  if (!audioEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(1046.5, now); // C6
    osc1.frequency.exponentialRampToValueAtTime(2093, now + 0.12); // C7

    oscGain.gain.setValueAtTime(0.18, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc1.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.23);
  } catch (err) {}
}

function initTactileAudio() {
  const audioBtn = document.getElementById('audioToggleBtn');
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      audioEnabled = !audioEnabled;
      audioBtn.textContent = audioEnabled ? '🔊' : '🔇';
      audioBtn.title = audioEnabled ? 'Mute Audio' : 'Unmute Audio';
      if (audioEnabled) {
        getAudioContext();
        playMechanicalRelaySound('snap');
      }
    });
  }

  // Bind clicks across interactive elements
  const interactiveButtons = document.querySelectorAll(
    '.filter-btn, .theme-toggle-btn, .btn-calc, .btn-primary, .btn-secondary, .btn-project-detail, .modal-close-btn'
  );
  interactiveButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      playMechanicalRelaySound('snap');
    });
  });
}

/**
 * 2. Hardware-to-Code X-Ray Spotlight (Lithos Inspired)
 * - Tracks pointer over the Smart Farm preview card with lerp and dynamic radial masking
 */
function initXRaySpotlight() {
  const xray = document.getElementById('smartfarmXrayPreview');
  if (!xray) return;

  let mouseX = 50;
  let mouseY = 50;
  let currentX = 50;
  let currentY = 50;
  let isHovered = false;
  let animId = null;

  function update() {
    if (isHovered) {
      currentX += (mouseX - currentX) * 0.18;
      currentY += (mouseY - currentY) * 0.18;
    } else {
      currentX += (50 - currentX) * 0.08;
      currentY += (50 - currentY) * 0.08;
    }

    xray.style.setProperty('--xray-x', `${currentX.toFixed(2)}%`);
    xray.style.setProperty('--xray-y', `${currentY.toFixed(2)}%`);
    xray.style.setProperty('--lens-opacity', isHovered ? '1' : '0.45');

    animId = requestAnimationFrame(update);
  }

  xray.addEventListener('pointerenter', () => {
    isHovered = true;
    playMechanicalRelaySound('heavy');
    if (!animId) animId = requestAnimationFrame(update);
  });

  xray.addEventListener('pointermove', (e) => {
    const rect = xray.getBoundingClientRect();
    mouseX = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    mouseY = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
  });

  xray.addEventListener('pointerleave', () => {
    isHovered = false;
    mouseX = 50;
    mouseY = 50;
  });

  animId = requestAnimationFrame(update);
}

/**
 * 3. Hardware Pinout Turntable & Hotspots (Aperture Row Inspired)
 * - Interactive 3D perspective board with clickable GPIO pins and technical callout specs
 */
function initTurntablePinouts() {
  const stage = document.getElementById('turntableStage3D');
  const hotspots = document.querySelectorAll('.pinout-hotspot');
  const calloutTag = document.getElementById('pinoutCalloutTag');
  const calloutDesc = document.getElementById('pinoutCalloutDesc');
  const calloutHud = document.getElementById('pinoutCalloutHud');

  if (!stage) return;

  // 3D tilt tracking
  const container = document.getElementById('modalTurntable');
  if (container) {
    container.addEventListener('pointermove', (e) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      const rx = (-ny * 18).toFixed(2);
      const ry = (nx * 22).toFixed(2);
      stage.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(10px)`;
    });

    container.addEventListener('pointerleave', () => {
      stage.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0px)';
    });
  }

  // Hotspot hover & click interaction
  let resetTimer = null;
  hotspots.forEach(pin => {
    function activatePin() {
      clearTimeout(resetTimer);
      const pinName = pin.getAttribute('data-pin') || '';
      const pinLabel = pin.getAttribute('data-label') || '';
      const pinDesc = pin.getAttribute('data-desc') || '';

      if (calloutTag) calloutTag.textContent = `${pinName} · ${pinLabel}`;
      if (calloutDesc) calloutDesc.textContent = pinDesc;
      if (calloutHud) calloutHud.classList.add('highlighted');

      playMechanicalRelaySound('heavy');
    }

    pin.addEventListener('pointerenter', activatePin);
    pin.addEventListener('click', activatePin);

    pin.addEventListener('pointerleave', () => {
      resetTimer = setTimeout(() => {
        if (calloutTag) calloutTag.textContent = 'PINOUT INSPECTOR';
        if (calloutDesc) calloutDesc.textContent = 'Hover หรือคลิกหมุด GPIO ด้านบนเพื่อดูวงจร';
        if (calloutHud) calloutHud.classList.remove('highlighted');
      }, 2000);
    });
  });
}

/**
 * 4. Live IoT Telemetry & Calibration Bench (Aperture Row "The Bench" Inspired)
 * - Oscilloscope waveform simulation, real-time live metrics jitter, and interactive ping test
 */
function initTelemetryBench() {
  const bench = document.getElementById('telemetry-bench');
  if (!bench) return;

  const scopeWavePath = document.getElementById('scopeWavePath');
  const scopeWaveGlow = document.getElementById('scopeWaveGlow');
  const latencyEl = document.getElementById('telemetryLatency');
  const packetsEl = document.getElementById('telemetryPackets');
  const freqEl = document.getElementById('scopeFreqVal');
  const jitterEl = document.getElementById('scopeJitterVal');
  const moistValEl = document.getElementById('gaugeMoistVal');
  const moistBarEl = document.getElementById('gaugeMoistBar');
  const btnPing = document.getElementById('btnSensorPing');
  const ackBadge = document.getElementById('telemetryAckBadge');

  let packetCount = 14820;
  let wavePhase = 0;
  let waveAmplitude = 36;
  let surgeFactor = 1;

  // Oscilloscope Continuous Waveform Animation
  function renderWave() {
    wavePhase += 0.08;
    const points = [];
    const width = 600;
    const height = 180;
    const midY = height / 2;
    const step = 15;

    for (let x = 0; x <= width; x += step) {
      const freq = 0.024;
      const y = midY + Math.sin(x * freq + wavePhase) * (waveAmplitude * surgeFactor)
                     + Math.cos(x * 0.05 + wavePhase * 1.5) * (8 * surgeFactor)
                     + (Math.random() - 0.5) * 2;
      points.push(`${x},${y.toFixed(1)}`);
    }

    const d = 'M' + points.join(' L');
    if (scopeWavePath) scopeWavePath.setAttribute('d', d);
    if (scopeWaveGlow) scopeWaveGlow.setAttribute('d', d);

    if (surgeFactor > 1) {
      surgeFactor -= 0.03;
      if (surgeFactor < 1) surgeFactor = 1;
    }

    requestAnimationFrame(renderWave);
  }
  renderWave();

  // Periodic Telemetry Jitter Stream
  setInterval(() => {
    packetCount += Math.floor(Math.random() * 3) + 1;
    if (packetsEl) packetsEl.textContent = packetCount.toLocaleString();

    if (latencyEl && (!btnPing || !btnPing.disabled)) {
      const lat = Math.floor(Math.random() * 5) + 12; // 12-16ms
      latencyEl.textContent = lat;
    }

    if (freqEl) {
      const freq = (100.0 + (Math.random() * 0.8 - 0.4)).toFixed(1);
      freqEl.textContent = `${freq} Hz`;
    }

    if (jitterEl) {
      const jit = (0.3 + Math.random() * 0.3).toFixed(1);
      jitterEl.textContent = `±${jit} ms`;
    }

    if (moistValEl && moistBarEl) {
      const moist = (68.2 + Math.random() * 0.6).toFixed(1);
      moistValEl.textContent = moist;
      moistBarEl.style.width = `${moist}%`;
    }
  }, 1600);

  // Sensor Ping Trigger Interaction
  if (btnPing) {
    btnPing.addEventListener('click', () => {
      playTelemetryPingSound();
      playMechanicalRelaySound('heavy');

      // Surge waveform
      surgeFactor = 2.4;

      // Drop ping latency and bump packets
      packetCount += 1;
      if (packetsEl) packetsEl.textContent = packetCount.toLocaleString();
      if (latencyEl) latencyEl.textContent = '9';

      btnPing.disabled = true;
      btnPing.style.opacity = '0.7';

      if (ackBadge) {
        ackBadge.textContent = '✓ ACK 200 OK (9ms) · SYNCHRONIZED';
        ackBadge.classList.add('acknowledged');
      }

      setTimeout(() => {
        btnPing.disabled = false;
        btnPing.style.opacity = '1';
        if (ackBadge) {
          ackBadge.textContent = 'STREAMING NORMAL';
          ackBadge.classList.remove('acknowledged');
        }
      }, 2400);
    });
  }
}

/**
 * 5. Holographic 3D Card Tilt & Specular Shine Physics
 * - Gives all cards dynamic specular glare and 3D gyro perspective
 */
function initCardHologramPhysics() {
  const cards = document.querySelectorAll('[data-card-hover]');
  cards.forEach(card => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--card-x', `${x}px`);
      card.style.setProperty('--card-y', `${y}px`);

      // Gentle 3D gyro tilt
      const nx = (x / rect.width) * 2 - 1;
      const ny = (y / rect.height) * 2 - 1;
      const rx = (-ny * 7).toFixed(2);
      const ry = (nx * 7).toFixed(2);
      card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-5px) scale(1.015)`;
    });

    card.addEventListener('pointerleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)';
    });
  });
}

/**
 * 6. Particle Spark Burst Engine (Micro-Fireworks)
 * - Shoots crisp electric spark dots on user click for an ultra-tactile cyber feel
 */
function initSparkBurstEngine() {
  window.addEventListener('click', (e) => {
    // Only spawn if click wasn't on interactive inputs
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    for (let i = 0; i < 8; i++) {
      const spark = document.createElement('div');
      spark.className = 'cyber-spark';
      const angle = (i / 8) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const dist = Math.random() * 50 + 20;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;
      spark.style.setProperty('--dx', `${dx.toFixed(1)}px`);
      spark.style.setProperty('--dy', `${dy.toFixed(1)}px`);
      spark.style.left = `${e.clientX}px`;
      spark.style.top = `${e.clientY}px`;
      document.body.appendChild(spark);
      setTimeout(() => spark.remove(), 600);
    }
  });
}

/* ==========================================================================
   Part 9: Aperture Row Rotating Lens Ring Stages & 9-Blade Iris Engine
   ========================================================================== */

/**
 * Shared math helpers for Aperture Row kinematics
 */
function dialClamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

/**
 * 1. Interactive 9-Blade Mechanical Aperture Iris in #about
 * - Smoothly opens/closes on scroll position and expands wide-open on hover
 */
function initAboutApertureIris() {
  const aboutEl = document.getElementById('about');
  const wrap = document.getElementById('aboutIrisWrap');
  const glow = document.getElementById('aboutIrisGlow');
  const bezelMarks = document.getElementById('aboutIrisBezelMarks');
  const bladesGroup = document.getElementById('aboutIrisBlades');
  const readoutEl = document.getElementById('aboutIrisReadout');
  if (!aboutEl || !wrap || !bezelMarks || !bladesGroup) return;

  const NS = 'http://www.w3.org/2000/svg';
  const IRIS_IR = 148;
  const bladeEls = [];
  const fStops = ['1.4', '2', '2.8', '4', '5.6', '8', '11', '16'];
  const stopLabels = ['16', '11', '8', '5.6', '4', '2.8', '2', '1.4'];

  // Build 48 CNC bezel ticks
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * Math.PI * 2;
    const major = i % 6 === 0;
    const r1 = 216;
    const r2 = major ? 202 : 208;
    const line = document.createElementNS(NS, 'line');
    line.setAttribute('x1', (230 + Math.cos(a) * r1).toFixed(2));
    line.setAttribute('y1', (230 + Math.sin(a) * r1).toFixed(2));
    line.setAttribute('x2', (230 + Math.cos(a) * r2).toFixed(2));
    line.setAttribute('y2', (230 + Math.sin(a) * r2).toFixed(2));
    line.setAttribute('stroke', major ? 'rgba(255,255,255,0.36)' : 'rgba(255,255,255,0.14)');
    line.setAttribute('stroke-width', major ? '1.5' : '1');
    bezelMarks.appendChild(line);
  }

  // Engraved f-stop numbers around bezel
  fStops.forEach((lbl, i) => {
    const deg = -140 + i * 24;
    const rad = (deg * Math.PI) / 180;
    const r = 172;
    const x = 230 + Math.cos(rad) * r;
    const y = 230 + Math.sin(rad) * r;
    const txt = document.createElementNS(NS, 'text');
    txt.setAttribute('x', x.toFixed(1));
    txt.setAttribute('y', y.toFixed(1));
    txt.setAttribute('fill', i === 0 ? '#ff4d6d' : 'rgba(238,240,243,0.58)');
    txt.setAttribute('font-family', 'Space Grotesk, Barlow Semi Condensed, sans-serif');
    txt.setAttribute('font-size', '12.5');
    txt.setAttribute('font-weight', '600');
    txt.setAttribute('text-anchor', 'middle');
    txt.setAttribute('dominant-baseline', 'central');
    txt.setAttribute('transform', `rotate(${deg + 90} ${x.toFixed(1)} ${y.toFixed(1)})`);
    txt.textContent = lbl;
    bezelMarks.appendChild(txt);
  });

  // 9 metallic chamfered aperture blades
  for (let k = 0; k < 9; k++) {
    const g = document.createElementNS(NS, 'g');
    const path = document.createElementNS(NS, 'path');
    path.setAttribute('d', 'M -240 0 L 240 0 L 240 240 L -240 240 Z');
    path.setAttribute('fill', k % 2 === 0 ? 'url(#aboutBladeGradA)' : 'url(#aboutBladeGradB)');

    const edge = document.createElementNS(NS, 'line');
    edge.setAttribute('x1', '-240');
    edge.setAttribute('y1', '0.6');
    edge.setAttribute('x2', '240');
    edge.setAttribute('y2', '0.6');
    edge.setAttribute('stroke', 'rgba(255,255,255,0.28)');
    edge.setAttribute('stroke-width', '1.2');

    g.appendChild(path);
    g.appendChild(edge);
    bladesGroup.appendChild(g);
    bladeEls.push(g);
  }

  let isVisible = false;
  let isHover = false;
  let irisOpen = 0.36;
  let lastReadout = '';
  let lastTime = performance.now();

  function applyTransform(openVal) {
    const ro = 14 + openVal * (IRIS_IR - 30);
    const twist = (1 - openVal) * 34;
    const counter = -twist * 1.6;

    for (let k = 0; k < 9; k++) {
      const angle = (k / 9) * 360 + twist;
      bladeEls[k].setAttribute(
        'transform',
        `rotate(${angle.toFixed(2)}) translate(0 ${ro.toFixed(2)}) rotate(${counter.toFixed(2)})`
      );
    }

    if (glow) {
      glow.style.transform = `scale(${(0.64 + openVal * 0.56).toFixed(3)})`;
      glow.style.opacity = (0.3 + openVal * 0.62).toFixed(3);
    }

    const idx = dialClamp(Math.round(openVal * (stopLabels.length - 1)), 0, stopLabels.length - 1);
    const nextTxt = isHover ? 'f/1.4 · WIDE OPEN · ID 68219010015' : `f/${stopLabels[idx]} · HOVER TO CALIBRATE`;
    if (readoutEl && nextTxt !== lastReadout) {
      lastReadout = nextTxt;
      readoutEl.textContent = nextTxt;
    }
  }

  wrap.addEventListener('pointerenter', () => {
    isHover = true;
    playMechanicalRelaySound('snap');
  });
  wrap.addEventListener('pointerleave', () => {
    isHover = false;
  });
  wrap.addEventListener('click', () => {
    isHover = !isHover;
    playMechanicalRelaySound('heavy');
  });

  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
    }, { threshold: 0.05 });
    obs.observe(aboutEl);
  } else {
    isVisible = true;
  }

  applyTransform(irisOpen);

  function frame(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    if (isVisible) {
      const rect = aboutEl.getBoundingClientRect();
      const prog = dialClamp((window.innerHeight * 0.75 - rect.top) / (rect.height + window.innerHeight * 0.3), 0, 1);
      const target = isHover ? 1 : 0.14 + prog * 0.72;
      if (Math.abs(target - irisOpen) > 0.0008) {
        irisOpen += (target - irisOpen) * (1 - Math.exp(-dt * 9));
        applyTransform(irisOpen);
      }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/**
 * 2. Top-Down 3D Machined Studio Hardware SVG Models (Camera-Styled Aesthetic)
 */
function buildStudioModelSvg(modelId, uid) {
  const metalId = `m_${uid}`;
  const bezelId = `b_${uid}`;
  const lensId = `l_${uid}`;

  const sharedDefs = `
    <defs>
      <linearGradient id="${metalId}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#d4d8e0"/>
        <stop offset="28%" stop-color="#8b929e"/>
        <stop offset="55%" stop-color="#e8ecf2"/>
        <stop offset="82%" stop-color="#5a606b"/>
        <stop offset="100%" stop-color="#9ca3af"/>
      </linearGradient>
      <radialGradient id="${bezelId}" cx="38%" cy="32%" r="72%">
        <stop offset="0%" stop-color="#2c303a"/>
        <stop offset="65%" stop-color="#13151b"/>
        <stop offset="100%" stop-color="#090a0d"/>
      </radialGradient>
      <radialGradient id="${lensId}" cx="36%" cy="34%" r="68%">
        <stop offset="0%" stop-color="#ff6b8b"/>
        <stop offset="35%" stop-color="#e11d48"/>
        <stop offset="72%" stop-color="#4c0519"/>
        <stop offset="100%" stop-color="#0d0407"/>
      </radialGradient>
    </defs>`;

  const opticalCore = (cx, cy, rOuter, label) => `
    <circle cx="${cx}" cy="${cy}" r="${rOuter}" fill="url(#${metalId})" stroke="#090a0d" stroke-width="2"/>
    <circle cx="${cx}" cy="${cy}" r="${rOuter - 8}" fill="#12141a" stroke="rgba(255,255,255,0.22)" stroke-width="1"/>
    <circle cx="${cx}" cy="${cy}" r="${rOuter - 16}" fill="none" stroke="rgba(225,29,72,0.55)" stroke-width="1.4" stroke-dasharray="3 3"/>
    <circle cx="${cx}" cy="${cy}" r="${rOuter - 24}" fill="url(#${lensId})" stroke="#1f232c" stroke-width="3"/>
    <ellipse cx="${cx - rOuter * 0.22}" cy="${cy - rOuter * 0.22}" rx="${rOuter * 0.2}" ry="${rOuter * 0.12}" transform="rotate(-32 ${cx} ${cy})" fill="rgba(255,255,255,0.42)"/>
    ${label ? `<text x="${cx}" y="${cy + rOuter - 2}" fill="#e2e8f0" font-family="Space Grotesk, monospace" font-size="8.5" font-weight="700" text-anchor="middle" letter-spacing="1.2">${label}</text>` : ''}
  `;

  switch (modelId) {
    case 'iot':
      return `<svg viewBox="0 0 360 242" aria-hidden="true">${sharedDefs}
        <!-- Tactical ESP32 Rangefinder Hardware Chassis -->
        <rect x="44" y="40" width="272" height="162" rx="18" fill="url(#${metalId})" stroke="#0a0b0e" stroke-width="2"/>
        <rect x="48" y="66" width="264" height="130" rx="12" fill="url(#${bezelId})"/>
        <!-- Top Knurled Knobs & WiFi Ceramic Block -->
        <rect x="70" y="28" width="44" height="16" rx="4" fill="#1b1d24" stroke="#9ca3af" stroke-width="1.2"/>
        <rect x="242" y="28" width="48" height="16" rx="4" fill="#1b1d24" stroke="#9ca3af" stroke-width="1.2"/>
        <rect x="132" y="45" width="96" height="16" rx="3" fill="#0d0e12" stroke="rgba(255,255,255,0.18)"/>
        <text x="180" y="56" fill="#ff4d6d" font-family="Space Grotesk, monospace" font-size="9" font-weight="700" text-anchor="middle" letter-spacing="2">ESP32 · IOT-32</text>
        <!-- Brass GPIO Header Rails -->
        <g fill="#f59e0b" opacity="0.9">
          <rect x="58" y="82" width="12" height="6" rx="1"/><rect x="58" y="94" width="12" height="6" rx="1"/>
          <rect x="58" y="106" width="12" height="6" rx="1"/><rect x="58" y="118" width="12" height="6" rx="1"/>
          <rect x="290" y="82" width="12" height="6" rx="1"/><rect x="290" y="94" width="12" height="6" rx="1"/>
          <rect x="290" y="106" width="12" height="6" rx="1"/><rect x="290" y="118" width="12" height="6" rx="1"/>
        </g>
        <!-- Telemetry LED & Rangefinder Window -->
        <rect x="78" y="46" width="32" height="14" rx="2" fill="#041c15" stroke="#10b981" stroke-width="1"/>
        <circle cx="290" cy="53" r="4" fill="#ff2d55"/>
        <!-- Center Precision Optical Sensor Aperture Lens -->
        ${opticalCore(180, 134, 62, '240MHz · ADC')}
      </svg>`;

    case 'web':
      return `<svg viewBox="0 0 360 242" aria-hidden="true">${sharedDefs}
        <!-- Fullstack Dark-Glass Console Unit -->
        <rect x="34" y="34" width="292" height="174" rx="16" fill="url(#${metalId})"/>
        <rect x="42" y="44" width="276" height="154" rx="10" fill="url(#${bezelId})"/>
        <!-- Glowing Viewport Screen -->
        <rect x="56" y="56" width="174" height="106" rx="8" fill="#050811" stroke="rgba(56,189,248,0.4)" stroke-width="1.4"/>
        <text x="143" y="94" fill="#38bdf8" font-family="Space Grotesk, monospace" font-size="18" font-weight="700" text-anchor="middle">&lt;APP /&gt;</text>
        <text x="143" y="115" fill="#94a3b8" font-family="Space Grotesk, monospace" font-size="9" text-anchor="middle" letter-spacing="1.8">HTML5 · CSS3 · ES6+</text>
        <rect x="72" y="132" width="142" height="6" rx="3" fill="rgba(225,29,72,0.28)"/>
        <rect x="72" y="132" width="96" height="6" rx="3" fill="#ff2d55"/>
        <!-- Machined Optical Rotary Jog Dial on Right -->
        ${opticalCore(272, 118, 44, '')}
        <!-- Bottom Mechanical Tactile Keycaps -->
        <g>
          <rect x="58" y="172" width="38" height="16" rx="4" fill="#1e2029" stroke="rgba(255,255,255,0.18)"/>
          <rect x="104" y="172" width="38" height="16" rx="4" fill="#1e2029" stroke="rgba(255,255,255,0.18)"/>
          <rect x="150" y="172" width="38" height="16" rx="4" fill="#e11d48"/>
          <rect x="196" y="172" width="38" height="16" rx="4" fill="#1e2029" stroke="rgba(255,255,255,0.18)"/>
        </g>
      </svg>`;

    case 'sys':
      return `<svg viewBox="0 0 360 242" aria-hidden="true">${sharedDefs}
        <!-- Twin-Lens Reflex Inspired Vertical Server & Linux Chassis -->
        <rect x="104" y="16" width="152" height="210" rx="16" fill="url(#${metalId})"/>
        <rect x="112" y="24" width="136" height="194" rx="12" fill="url(#${bezelId})"/>
        <!-- Top Ground-Glass Terminal Screen Hood -->
        <rect x="128" y="34" width="104" height="36" rx="4" fill="#07110d" stroke="rgba(16,185,129,0.5)" stroke-width="1.4"/>
        <text x="180" y="56" fill="#34d399" font-family="Space Grotesk, monospace" font-size="11" font-weight="700" text-anchor="middle">&gt;_ LINUX · GIT</text>
        <!-- Twin Vertically Stacked Optical/Platter Lenses -->
        ${opticalCore(180, 112, 34, '')}
        ${opticalCore(180, 174, 38, 'SSH · TLS')}
        <!-- Side CNC Crank -->
        <rect x="256" y="102" width="16" height="44" rx="5" fill="url(#${metalId})"/>
        <circle cx="264" cy="124" r="10" fill="#181a22" stroke="#cbd5e1" stroke-width="1.5"/>
      </svg>`;

    case 'telemetry':
      return `<svg viewBox="0 0 360 242" aria-hidden="true">${sharedDefs}
        <!-- Oscilloscope & Radar Calibration Instrument Rig -->
        <rect x="50" y="42" width="260" height="158" rx="20" fill="url(#${metalId})"/>
        <rect x="58" y="50" width="244" height="142" rx="14" fill="url(#${bezelId})"/>
        <!-- Side Rangefinder Gauges -->
        <rect x="70" y="64" width="66" height="114" rx="8" fill="#050b0a" stroke="rgba(255,255,255,0.12)"/>
        <path d="M 76 120 Q 90 88 103 120 T 130 120" fill="none" stroke="#ff2d55" stroke-width="2.4"/>
        <text x="103" y="158" fill="#38bdf8" font-family="Space Grotesk, monospace" font-size="9" font-weight="700" text-anchor="middle">100.4Hz</text>
        <!-- Large Protruding Optical Telemetry Barrel -->
        ${opticalCore(214, 121, 64, 'MQTT v5')}
      </svg>`;

    case 'smartfarm':
      return `<svg viewBox="0 0 360 242" aria-hidden="true">${sharedDefs}
        <!-- Smart Farm ESP32 Weatherproof Studio Rig -->
        <rect x="42" y="34" width="276" height="174" rx="20" fill="url(#${metalId})"/>
        <rect x="50" y="42" width="260" height="158" rx="14" fill="url(#${bezelId})"/>
        <!-- Top Status Badge -->
        <rect x="70" y="54" width="120" height="18" rx="4" fill="#041912" stroke="rgba(16,185,129,0.5)"/>
        <circle cx="82" cy="63" r="3.5" fill="#10b981"/>
        <text x="136" y="66" fill="#6ee7b7" font-family="Space Grotesk, monospace" font-size="8.5" font-weight="700" text-anchor="middle">SOIL: 68.5% · PUMP AUTO</text>
        <!-- Main Environmental Optical Sensor Barrel -->
        ${opticalCore(130, 134, 52, 'DHT22 · ADC')}
        <!-- Solid State Pump Relay & ESP32 Core Module on Right -->
        <rect x="206" y="60" width="88" height="122" rx="8" fill="#14161e" stroke="rgba(225,29,72,0.4)"/>
        <rect x="218" y="72" width="64" height="44" rx="4" fill="#0b0c10" stroke="#9ca3af" stroke-width="1"/>
        <text x="250" y="98" fill="#f8fafc" font-family="Space Grotesk, monospace" font-size="9" font-weight="700" text-anchor="middle">ESP32</text>
        <circle cx="232" cy="148" r="12" fill="#d97706" stroke="#fde68a" stroke-width="1.5"/>
        <circle cx="268" cy="148" r="12" fill="#e11d48" stroke="#fda4af" stroke-width="1.5"/>
      </svg>`;

    case 'itacademy':
      return `<svg viewBox="0 0 360 242" aria-hidden="true">${sharedDefs}
        <!-- IT Academy Web Workstation Rig -->
        <rect x="38" y="30" width="284" height="182" rx="16" fill="url(#${metalId})"/>
        <rect x="46" y="38" width="268" height="166" rx="11" fill="url(#${bezelId})"/>
        <rect x="60" y="52" width="240" height="124" rx="8" fill="#070a13" stroke="rgba(255,45,85,0.4)" stroke-width="1.4"/>
        <!-- Mini Educational Dashboard UI inside Hardware Frame -->
        <rect x="74" y="64" width="212" height="18" rx="4" fill="rgba(225,29,72,0.18)"/>
        <circle cx="86" cy="73" r="3.5" fill="#10b981"/>
        <text x="148" y="76" fill="#ffffff" font-family="Space Grotesk, monospace" font-size="8.5" font-weight="700" text-anchor="middle">IT ACADEMY · VERCEL LIVE</text>
        <rect x="74" y="92" width="64" height="70" rx="5" fill="#111625" stroke="rgba(56,189,248,0.35)"/>
        <rect x="148" y="92" width="64" height="70" rx="5" fill="#111625" stroke="rgba(255,45,85,0.35)"/>
        <rect x="222" y="92" width="64" height="70" rx="5" fill="#111625" stroke="rgba(16,185,129,0.35)"/>
        <circle cx="180" cy="188" r="7" fill="url(#${metalId})"/>
      </svg>`;

    case 'smartdetect':
      return `<svg viewBox="0 0 360 242" aria-hidden="true">${sharedDefs}
        <!-- PIR Optical Motion Radar Camera Rig -->
        <rect x="52" y="40" width="256" height="162" rx="22" fill="url(#${metalId})"/>
        <rect x="60" y="48" width="240" height="146" rx="16" fill="url(#${bezelId})"/>
        <!-- Center PIR Fresnel Dome + Radar Pulse Rings -->
        <circle cx="180" cy="121" r="64" fill="#1a1c24" stroke="rgba(255,255,255,0.22)" stroke-width="1.5"/>
        <circle cx="180" cy="121" r="52" fill="url(#${lensId})"/>
        <polygon points="180,74 222,121 180,168 138,121" fill="none" stroke="rgba(255,255,255,0.32)" stroke-width="1.2"/>
        <circle cx="180" cy="121" r="24" fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="1"/>
        <circle cx="90" cy="74" r="6" fill="#ff2d55"/>
        <text x="268" y="78" fill="#cbd5e1" font-family="Space Grotesk, monospace" font-size="8.5" font-weight="700" text-anchor="end">PIR-IR</text>
      </svg>`;

    case 'bloompetal':
    default:
      return `<svg viewBox="0 0 360 242" aria-hidden="true">${sharedDefs}
        <!-- Bloom & Petal Studio Display & Color Puck -->
        <rect x="40" y="34" width="280" height="174" rx="18" fill="url(#${metalId})"/>
        <rect x="48" y="42" width="264" height="158" rx="12" fill="url(#${bezelId})"/>
        <rect x="62" y="56" width="166" height="130" rx="8" fill="#180a10" stroke="rgba(255,77,109,0.45)"/>
        <text x="145" y="114" fill="#fda4af" font-family="Barlow Condensed, sans-serif" font-size="22" font-weight="700" text-anchor="middle" letter-spacing="1.5">BLOOM &amp; PETAL</text>
        <text x="145" y="134" fill="#94a3b8" font-family="Space Grotesk, monospace" font-size="8" text-anchor="middle">E-COMMERCE · RESPONSIVE UI</text>
        ${opticalCore(268, 121, 42, 'CART UI')}
      </svg>`;
  }
}

/**
 * 3. Orbiting Floating Mini Hardware Props (Spring Physics)
 */
function buildPropAccessorySvg(propType) {
  const styles = {
    chip: `<svg viewBox="0 0 64 64"><rect x="14" y="14" width="36" height="36" rx="6" fill="#181a22" stroke="#f59e0b" stroke-width="2.2"/><rect x="22" y="22" width="20" height="20" rx="2" fill="#e11d48"/><path d="M20 8v6M32 8v6M44 8v6M20 50v6M32 50v6M44 50v6M8 20h6M8 32h6M8 44h6M50 20h6M50 32h6M50 44h6" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round"/></svg>`,
    probe: `<svg viewBox="0 0 64 64"><rect x="20" y="10" width="24" height="16" rx="4" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/><path d="M25 26v28M39 26v28" stroke="#f59e0b" stroke-width="4" stroke-linecap="round"/><circle cx="32" cy="18" r="3" fill="#10b981"/></svg>`,
    relay: `<svg viewBox="0 0 64 64"><rect x="12" y="14" width="40" height="36" rx="5" fill="#0284c7" stroke="#bae6fd" stroke-width="2"/><rect x="18" y="22" width="28" height="18" rx="2" fill="#0f172a"/><circle cx="24" cy="31" r="3" fill="#ff2d55"/><circle cx="40" cy="31" r="3" fill="#10b981"/></svg>`,
    oled: `<svg viewBox="0 0 64 64"><rect x="10" y="14" width="44" height="36" rx="4" fill="#111827" stroke="#9ca3af" stroke-width="2"/><rect x="14" y="20" width="36" height="24" rx="2" fill="#020617" stroke="#38bdf8" stroke-width="1.2"/><text x="32" y="35" fill="#38bdf8" font-size="9" font-family="monospace" text-anchor="middle">68.5%</text></svg>`,
    html: `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="24" fill="#161822" stroke="#ff4d6d" stroke-width="2.2"/><text x="32" y="37" fill="#ffffff" font-size="18" font-weight="bold" font-family="monospace" text-anchor="middle">&lt;/&gt;</text></svg>`,
    js: `<svg viewBox="0 0 64 64"><rect x="12" y="12" width="40" height="40" rx="8" fill="#f59e0b"/><text x="38" y="44" fill="#090a0f" font-size="20" font-weight="900" font-family="sans-serif" text-anchor="middle">JS</text></svg>`,
    php: `<svg viewBox="0 0 64 64"><ellipse cx="32" cy="32" rx="26" ry="18" fill="#312e81" stroke="#a5b4fc" stroke-width="2"/><text x="32" y="37" fill="#ffffff" font-size="14" font-weight="bold" font-family="monospace" text-anchor="middle">API</text></svg>`,
    ui: `<svg viewBox="0 0 64 64"><rect x="10" y="14" width="44" height="36" rx="6" fill="#1e1b2e" stroke="#e11d48" stroke-width="2"/><rect x="16" y="20" width="14" height="24" rx="2" fill="#ff2d55" opacity="0.8"/><rect x="34" y="20" width="14" height="10" rx="2" fill="#38bdf8"/><rect x="34" y="34" width="14" height="10" rx="2" fill="#cbd5e1"/></svg>`,
    term: `<svg viewBox="0 0 64 64"><rect x="10" y="14" width="44" height="36" rx="6" fill="#090d16" stroke="#10b981" stroke-width="2"/><text x="32" y="37" fill="#34d399" font-size="16" font-weight="bold" font-family="monospace" text-anchor="middle">&gt;_</text></svg>`,
    git: `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="24" fill="#181920" stroke="#e11d48" stroke-width="2"/><circle cx="24" cy="22" r="4" fill="#ff4d6d"/><circle cx="24" cy="42" r="4" fill="#38bdf8"/><circle cx="40" cy="32" r="4" fill="#10b981"/><path d="M24 26v12M24 26c6 0 12 2 12 6" stroke="#e2e8f0" stroke-width="2" fill="none"/></svg>`,
    usb: `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="22" fill="#1c1f26" stroke="#cbd5e1" stroke-width="2.2"/><circle cx="32" cy="32" r="10" fill="#e11d48"/></svg>`,
    cloud: `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="24" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/><text x="32" y="36" fill="#38bdf8" font-size="11" font-weight="bold" font-family="monospace" text-anchor="middle">TLS</text></svg>`,
    wave: `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="24" fill="#071310" stroke="#10b981" stroke-width="2"/><path d="M14 32 Q23 16 32 32 T50 32" stroke="#ff2d55" stroke-width="3" fill="none"/></svg>`,
    pir: `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="22" fill="#e2e8f0" stroke="#475569" stroke-width="2.5"/><polygon points="32,14 48,32 32,50 16,32" fill="none" stroke="#64748b" stroke-width="1.5"/><circle cx="32" cy="32" r="6" fill="#e11d48"/></svg>`,
    cart: `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="24" fill="#2b0813" stroke="#ff4d6d" stroke-width="2"/><path d="M20 22h4l3 16h14l3-12H26" stroke="#ffffff" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>`
  };
  return styles[propType] || styles.chip;
}

/**
 * 4. Reusable ApertureDialStage (Rotating Machined Lens Ring Carousel Engine)
 */
class ApertureDialStage {
  constructor(config) {
    this.stage = document.getElementById(config.stageId);
    if (!this.stage) return;

    this.items = config.items || [];
    this.allItems = this.items.slice();
    this.band1Text = config.band1Text || 'PONGSAKORN · DEVELOPER SHOWCASE · ';
    this.band2Text = config.band2Text || '∞ · 1.4 · 2 · 2.8 · 4 · 5.6 · 8 · 11 · ';
    this.pillLabel = config.pillLabel || 'VIEW DETAILS';
    this.onActiveChange = config.onActiveChange || null;
    this.onActiveItemClick = config.onActiveItemClick || null;
    this.quickTabsSelector = config.quickTabsSelector || null;

    this.discCanvas = this.stage.querySelector('.dial-disc-canvas');
    this.ringCanvas = this.stage.querySelector('.dial-ring-canvas');
    this.discCtx = this.discCanvas.getContext('2d');
    this.ringCtx = this.ringCanvas.getContext('2d');
    this.itemsWrap = this.stage.querySelector('.dial-ring-items');
    this.indexMark = this.stage.querySelector('.dial-index-mark');
    this.indexReadout = this.stage.querySelector('.dial-index-readout');
    this.copyIdxCur = this.stage.querySelector('.dial-idx-cur');
    this.copyIdxTotal = this.stage.querySelector('.dial-idx-total');
    this.barFill = this.stage.querySelector('.dial-bar-fill');
    this.copyTitle = this.stage.querySelector('.dial-copy-title');
    this.copySub = this.stage.querySelector('.dial-copy-sub');
    this.copyDesc = this.stage.querySelector('.dial-copy-desc');
    this.copyChips = this.stage.querySelector('.dial-copy-chips');
    this.copyControls = this.stage.querySelector('.dial-copy-controls');
    this.pagerEl = this.stage.querySelector('.dial-pager');
    this.prevBtn = this.stage.querySelector('.dial-prev-btn');
    this.nextBtn = this.stage.querySelector('.dial-next-btn');

    this.G = { W: 900, H: 580, DPR: 1, R: 1200, CX: 550, CY: 1350, RI: 1020, IW: 310, IH: 208, DELTA: 0.44, visHalfSpan: 0.55 };
    this.targetPos = 0;
    this.posS = -0.75; // Initial calibration spin-in when revealed
    this.prevPosS = -0.75;
    this.velS = 0;
    this.activeIdx = 0;
    this.lastDrawnRot = NaN;
    this.isVisible = true;
    this.isDragging = false;
    this.dragMoved = false;
    this.dragMovedRecently = false;
    this.swapTimer = null;
    this.scrambleRaf = null;

    this.buildDomNodes();
    this.bindEvents();
    this.recalcLayout();
    this.populateCopyInstant(0);
    this.startLoop();
  }

  buildDomNodes() {
    this.itemsWrap.innerHTML = '';
    this.pagerEl.innerHTML = '';
    this.nodes = [];
    this.pagerDots = [];

    this.allItems.forEach((itemData, idx) => {
      const itemEl = document.createElement('div');
      itemEl.className = 'cam-item' + (idx === 0 ? ' is-active' : '');
      itemEl.dataset.itemIdx = String(idx);

      const accStates = (itemData.props || []).map(([propType, x, y, rotDeg, size], j) => {
        const wrap = document.createElement('div');
        wrap.className = 'cam-acc';
        wrap.innerHTML = buildPropAccessorySvg(propType);
        itemEl.appendChild(wrap);
        const sign = ((idx + j) % 2 === 0 ? 1 : -1) * (0.65 + ((idx * 5 + j * 11) % 9) * 0.05);
        return {
          el: wrap, x, y, rot: rotDeg, size,
          stiff: 92 - 12 * j, damp: 13,
          s: idx === 0 ? 1 : 0, sv: 0,
          rnd: sign, phase: idx * 1.6 + j * 2.1
        };
      });

      const body = document.createElement('div');
      body.className = 'cam-body';

      const visual = document.createElement('div');
      visual.className = 'studio-model-visual';
      visual.innerHTML = buildStudioModelSvg(itemData.modelId, `${this.stage.id}_${itemData.id}`);

      const reticle = document.createElement('div');
      reticle.className = 'reticle';
      reticle.innerHTML =
        '<span class="ret-corner tl"></span><span class="ret-corner tr"></span>' +
        '<span class="ret-corner bl"></span><span class="ret-corner br"></span>' +
        '<span class="ret-center"></span>';

      body.appendChild(visual);
      body.appendChild(reticle);
      itemEl.appendChild(body);
      this.itemsWrap.appendChild(itemEl);

      body.addEventListener('click', (e) => {
        if (this.dragMovedRecently) return;
        e.stopPropagation();
        const visibleIdx = this.items.indexOf(itemData);
        if (visibleIdx === -1) return;
        if (visibleIdx === this.activeIdx) {
          if (this.onActiveItemClick) {
            this.onActiveItemClick(itemData);
          } else {
            this.goTo((visibleIdx + 1) % this.items.length);
          }
        } else {
          this.goTo(visibleIdx);
        }
      });

      const pill = document.getElementById('cursorPill');
      const pillText = document.getElementById('cursorPillText');
      body.addEventListener('pointerenter', () => {
        const visibleIdx = this.items.indexOf(itemData);
        if (visibleIdx === this.activeIdx && !this.isDragging && window.innerWidth >= 860 && pill) {
          if (pillText) pillText.textContent = this.pillLabel;
          pill.classList.add('visible');
        }
      });
      body.addEventListener('pointerleave', () => {
        if (pill) pill.classList.remove('visible');
      });

      this.nodes.push({ data: itemData, el: itemEl, body, visual, acc: accStates, lastBlur: 0, visible: true });

      const dot = document.createElement('button');
      dot.className = 'pager-dot' + (idx === 0 ? ' active' : '');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Select ${itemData.title}`);
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        const visibleIdx = this.items.indexOf(itemData);
        if (visibleIdx !== -1) this.goTo(visibleIdx);
      });
      this.pagerEl.appendChild(dot);
      this.pagerDots.push(dot);
    });
  }

  bindEvents() {
    let startX = 0;
    let startPos = 0;
    let samples = [];

    this.stage.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      if (e.target.closest('.dial-copy, .dial-pager, button, a')) return;
      this.isDragging = true;
      this.dragMoved = false;
      startX = e.clientX;
      startPos = this.posS;
      samples = [{ x: e.clientX, t: performance.now() }];
      this.stage.classList.add('dragging');
      const pill = document.getElementById('cursorPill');
      if (pill) pill.classList.remove('visible');
    });

    window.addEventListener('pointermove', (e) => {
      if (!this.isDragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 5) this.dragMoved = true;
      if (!this.dragMoved) return;
      const now = performance.now();
      samples.push({ x: e.clientX, t: now });
      while (samples.length > 5 && now - samples[0].t > 120) samples.shift();
      this.targetPos = dialClamp(startPos - dx / (this.G.RI * this.G.DELTA), 0, Math.max(0, this.items.length - 1));
    }, { passive: true });

    const finishDrag = () => {
      if (!this.isDragging) return;
      this.isDragging = false;
      this.stage.classList.remove('dragging');
      if (this.dragMoved) {
        this.dragMovedRecently = true;
        setTimeout(() => { this.dragMovedRecently = false; }, 120);
        let velPx = 0;
        if (samples.length >= 2) {
          const dt = (samples[samples.length - 1].t - samples[0].t) / 1000;
          if (dt > 0.005) velPx = (samples[samples.length - 1].x - samples[0].x) / dt;
        }
        const fling = dialClamp((-velPx / (this.G.RI * this.G.DELTA)) * 0.22, -1.2, 1.2);
        const snapIdx = dialClamp(Math.round(this.targetPos + fling), 0, Math.max(0, this.items.length - 1));
        this.goTo(snapIdx);
      }
    };

    window.addEventListener('pointerup', finishDrag);
    window.addEventListener('pointercancel', finishDrag);

    // Horizontal trackpad swipe or Shift+Wheel spins dial without trapping vertical page scroll
    let wheelLock = 0;
    this.stage.addEventListener('wheel', (e) => {
      const horiz = Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey;
      if (!horiz) return;
      e.preventDefault();
      const now = performance.now();
      if (now < wheelLock) return;
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(d) > 14) {
        wheelLock = now + 420;
        const dir = d > 0 ? 1 : -1;
        this.goTo(dialClamp(this.activeIdx + dir, 0, this.items.length - 1));
      }
    }, { passive: false });

    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.goTo((this.activeIdx - 1 + this.items.length) % this.items.length);
      });
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.goTo((this.activeIdx + 1) % this.items.length);
      });
    }

    if (this.quickTabsSelector) {
      const tabs = document.querySelectorAll(this.quickTabsSelector);
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const idx = parseInt(tab.getAttribute('data-dial-target') || '0', 10);
          this.goTo(idx);
        });
      });
    }

    if ('IntersectionObserver' in window) {
      let spunIn = false;
      const obs = new IntersectionObserver((entries) => {
        this.isVisible = entries[0].isIntersecting;
        if (this.isVisible && !spunIn) {
          spunIn = true;
          this.posS = -0.85;
        }
      }, { threshold: 0.05 });
      obs.observe(this.stage);
    }

    window.addEventListener('resize', () => this.recalcLayout(), { passive: true });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        this.rebuildTextCaches();
        this.lastDrawnRot = NaN;
      });
    }
  }

  measureArcText(text, radius, font, letterSpacingPx) {
    this.ringCtx.font = font;
    const glyphs = [];
    let accAngle = 0;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      const w = this.ringCtx.measureText(ch).width;
      glyphs.push({ ch, angle: accAngle + (w * 0.5) / radius });
      accAngle += (w + letterSpacingPx) / radius;
    }
    return { font, glyphs, totalAngle: Math.max(accAngle, 0.01) };
  }

  rebuildTextCaches() {
    const fs1 = Math.max(11.5, this.G.W * 0.0112);
    this.textCache1 = this.measureArcText(this.band1Text, this.G.R - 52, `600 ${fs1.toFixed(1)}px "Barlow Condensed", sans-serif`, fs1 * 0.42);
    const fs2 = Math.max(10, this.G.W * 0.0095);
    this.textCache2 = this.measureArcText(this.band2Text, this.G.R - 86, `600 ${fs2.toFixed(1)}px "Space Grotesk", monospace`, fs2 * 0.24);
  }

  recalcLayout() {
    const W = this.stage.clientWidth || window.innerWidth;
    const H = this.stage.clientHeight || 580;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    this.G.W = W;
    this.G.H = H;
    this.G.DPR = DPR;

    if (W >= 860) {
      this.G.R = 1.24 * W;
      this.G.CX = 0.65 * W;
      this.G.CY = 0.28 * H + this.G.R;
      this.G.RI = this.G.R - 0.30 * H;
      this.G.IW = Math.min(340, 0.28 * W);
      this.G.IH = this.G.IW * 0.672;
      this.G.DELTA = (0.40 * W) / this.G.RI;
    } else {
      this.G.R = 1.48 * W;
      this.G.CX = 0.5 * W;
      this.G.CY = 0.52 * H + this.G.R;
      this.G.RI = this.G.R - 0.19 * H;
      this.G.IW = Math.min(280, 0.64 * W);
      this.G.IH = this.G.IW * 0.672;
      this.G.DELTA = (0.85 * W) / this.G.RI;
    }

    const maxSide = Math.max(this.G.CX, W - this.G.CX) + 120;
    this.G.visHalfSpan = Math.asin(Math.min(0.98, maxSide / this.G.R)) + 0.08;

    if (this.indexMark) {
      const topRimY = this.G.CY - this.G.R;
      this.indexMark.style.left = `${this.G.CX.toFixed(1)}px`;
      this.indexMark.style.top = `${Math.max(16, topRimY - 26).toFixed(1)}px`;
    }

    this.nodes.forEach((node) => {
      node.el.style.width = `${this.G.IW.toFixed(1)}px`;
      node.el.style.height = `${this.G.IH.toFixed(1)}px`;
      node.el.style.marginLeft = `${(-this.G.IW / 2).toFixed(1)}px`;
      node.el.style.marginTop = `${(-this.G.IH / 2).toFixed(1)}px`;

      node.acc.forEach((a) => {
        const sz = a.size * this.G.IW;
        a.el.style.width = `${sz.toFixed(1)}px`;
        a.el.style.height = `${sz.toFixed(1)}px`;
        a.el.style.marginLeft = `${(-sz / 2).toFixed(1)}px`;
        a.el.style.marginTop = `${(-sz / 2).toFixed(1)}px`;
      });
    });

    this.rebuildTextCaches();
    this.drawDiscCanvas();
    this.lastDrawnRot = NaN;
  }

  drawDiscCanvas() {
    const { W, H, DPR, R, CX, CY, visHalfSpan } = this.G;
    this.discCanvas.width = Math.round(W * DPR);
    this.discCanvas.height = Math.round(H * DPR);
    const ctx = this.discCtx;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const discGrad = ctx.createRadialGradient(CX, CY - R * 0.4, R * 0.05, CX, CY, R);
    discGrad.addColorStop(0, '#0f0e13');
    discGrad.addColorStop(0.75, '#131218');
    discGrad.addColorStop(1, '#18141c');

    ctx.save();
    ctx.shadowColor = 'rgba(225, 29, 72, 0.36)';
    ctx.shadowBlur = 110;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = -28;
    ctx.fillStyle = discGrad;
    ctx.beginPath();
    ctx.arc(CX, CY, R, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(CX, CY, R, 0, Math.PI * 2);
    ctx.clip();

    const a0 = -Math.PI / 2 - visHalfSpan;
    const a1 = -Math.PI / 2 + visHalfSpan;
    const minVisR = Math.max(40, CY - H - 80);

    ctx.lineWidth = 1;
    let idx = 0;
    for (let r = R - 16; r >= minVisR; r -= 4.5) {
      const alpha = idx % 3 === 0 ? 0.032 : 0.018;
      ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
      ctx.beginPath();
      ctx.arc(CX, CY, r, a0, a1);
      ctx.stroke();
      idx++;
    }

    const sweep = ctx.createRadialGradient(CX, CY - R + 16, 10, CX, CY - R + 20, Math.min(W * 0.45, 500));
    sweep.addColorStop(0, 'rgba(255, 255, 255, 0.095)');
    sweep.addColorStop(0.45, 'rgba(225, 29, 72, 0.045)');
    sweep.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = sweep;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(CX, CY, R - 0.75, a0, a1);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(225, 29, 72, 0.22)';
    ctx.beginPath();
    ctx.arc(CX, CY, R - 16, a0, a1);
    ctx.stroke();
    ctx.restore();
  }

  drawCurvedBand(cache, radius, minTheta, maxTheta, color, rot) {
    if (!cache || !cache.glyphs.length) return;
    const ctx = this.ringCtx;
    ctx.font = cache.font;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const startC = Math.floor(minTheta / cache.totalAngle);
    const endC = Math.ceil(maxTheta / cache.totalAngle);
    for (let c = startC; c <= endC; c++) {
      const base = c * cache.totalAngle;
      for (let i = 0; i < cache.glyphs.length; i++) {
        const g = cache.glyphs[i];
        const theta = base + g.angle;
        if (theta < minTheta || theta > maxTheta || g.ch === ' ') continue;
        const sa = theta + rot;
        ctx.save();
        ctx.translate(this.G.CX + Math.cos(sa) * radius, this.G.CY + Math.sin(sa) * radius);
        ctx.rotate(sa + Math.PI / 2);
        ctx.fillText(g.ch, 0, 0);
        ctx.restore();
      }
    }
  }

  drawRingCanvas(rot) {
    const { W, H, DPR, R, CX, CY, visHalfSpan } = this.G;
    if (this.ringCanvas.width !== Math.round(W * DPR) || this.ringCanvas.height !== Math.round(H * DPR)) {
      this.ringCanvas.width = Math.round(W * DPR);
      this.ringCanvas.height = Math.round(H * DPR);
    }
    const ctx = this.ringCtx;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const minTheta = (-Math.PI / 2 - visHalfSpan) - rot;
    const maxTheta = (-Math.PI / 2 + visHalfSpan) - rot;

    // 1. Knurled Edge
    const knurlStep = 4.8 / R;
    const kStart = Math.floor(minTheta / knurlStep);
    const kEnd = Math.ceil(maxTheta / knurlStep);
    ctx.beginPath();
    ctx.strokeStyle = '#2c2934';
    ctx.lineWidth = 1.6;
    for (let k = kStart; k <= kEnd; k++) {
      const a = k * knurlStep + rot;
      ctx.moveTo(CX + Math.cos(a) * (R - 1), CY + Math.sin(a) * (R - 1));
      ctx.lineTo(CX + Math.cos(a) * (R - 14), CY + Math.sin(a) * (R - 14));
    }
    ctx.stroke();

    // 2. Degree Ticks (1° and 5°)
    const degRad = Math.PI / 180;
    const dStart = Math.floor(minTheta / degRad);
    const dEnd = Math.ceil(maxTheta / degRad);
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255,255,255,0.16)';
    ctx.lineWidth = 1;
    for (let d = dStart; d <= dEnd; d++) {
      if (d % 5 === 0) continue;
      const a = d * degRad + rot;
      ctx.moveTo(CX + Math.cos(a) * (R - 19), CY + Math.sin(a) * (R - 19));
      ctx.lineTo(CX + Math.cos(a) * (R - 26), CY + Math.sin(a) * (R - 26));
    }
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255,255,255,0.34)';
    ctx.lineWidth = 1.3;
    for (let d = dStart; d <= dEnd; d++) {
      if (d % 5 !== 0) continue;
      const a = d * degRad + rot;
      ctx.moveTo(CX + Math.cos(a) * (R - 19), CY + Math.sin(a) * (R - 19));
      ctx.lineTo(CX + Math.cos(a) * (R - 33), CY + Math.sin(a) * (R - 33));
    }
    ctx.stroke();

    // 3. Curved Band Typography
    this.drawCurvedBand(this.textCache1, R - 52, minTheta, maxTheta, 'rgba(255,255,255,0.26)', rot);
    this.drawCurvedBand(this.textCache2, R - 86, minTheta, maxTheta, 'rgba(255,77,109,0.52)', rot);
  }

  scrambleReadout(targetText) {
    if (!this.indexReadout) return;
    if (this.scrambleRaf) cancelAnimationFrame(this.scrambleRaf);
    const chars = '0123456789ABCDEF/+-';
    const t0 = performance.now();
    const dur = 300;
    const step = (now) => {
      const p = dialClamp((now - t0) / dur, 0, 1);
      if (p >= 1) {
        this.indexReadout.textContent = targetText;
        this.scrambleRaf = null;
        return;
      }
      const locked = Math.floor(p * targetText.length);
      let out = '';
      for (let i = 0; i < targetText.length; i++) {
        out += i < locked ? targetText[i] : chars[Math.floor(Math.random() * chars.length)];
      }
      this.indexReadout.textContent = out;
      this.scrambleRaf = requestAnimationFrame(step);
    };
    this.scrambleRaf = requestAnimationFrame(step);
  }

  populateCopyInstant(idx) {
    const item = this.items[idx];
    if (!item) return;
    this.copyIdxCur.textContent = String(idx + 1).padStart(2, '0');
    if (this.copyIdxTotal) this.copyIdxTotal.textContent = String(this.items.length).padStart(2, '0');
    this.barFill.style.width = `${((idx + 1) / this.items.length) * 100}%`;
    this.copyTitle.textContent = item.title;
    this.copySub.textContent = item.sub;
    this.copyDesc.textContent = item.desc;
    this.copyChips.innerHTML = (item.chips || []).map(c => `<span class="chip">${c}</span>`).join('');
    if (this.indexReadout) this.indexReadout.textContent = item.readout;
    if (this.onActiveChange) this.onActiveChange(item, idx);
  }

  syncExternalUI(idx) {
    const activeItem = this.items[idx];
    this.nodes.forEach((n) => {
      n.el.classList.toggle('is-active', n.data === activeItem);
    });
    this.pagerDots.forEach((dot, rawIdx) => {
      dot.classList.toggle('active', this.allItems[rawIdx] === activeItem);
    });
    if (this.quickTabsSelector) {
      document.querySelectorAll(this.quickTabsSelector).forEach(tab => {
        const tIdx = parseInt(tab.getAttribute('data-dial-target') || '-1', 10);
        tab.classList.toggle('active', tIdx === idx);
      });
    }
  }

  goTo(idx) {
    if (!this.items.length) return;
    const nextIdx = dialClamp(idx, 0, this.items.length - 1);
    this.targetPos = nextIdx;
    if (nextIdx === this.activeIdx) return;

    this.activeIdx = nextIdx;
    this.syncExternalUI(nextIdx);
    playMechanicalRelaySound('snap');

    const item = this.items[nextIdx];
    this.copyIdxCur.textContent = String(nextIdx + 1).padStart(2, '0');
    if (this.copyIdxTotal) this.copyIdxTotal.textContent = String(this.items.length).padStart(2, '0');
    this.barFill.style.width = `${((nextIdx + 1) / this.items.length) * 100}%`;
    this.scrambleReadout(item.readout);

    clearTimeout(this.swapTimer);
    const blocks = [this.copySub, this.copyDesc, this.copyChips, this.copyControls].filter(Boolean);
    this.copyTitle.style.transition = 'transform 0.55s cubic-bezier(0.77, 0, 0.18, 1)';
    this.copyTitle.classList.add('out');
    blocks.forEach(el => {
      el.style.transitionDelay = '0ms';
      el.classList.add('out');
    });

    this.swapTimer = setTimeout(() => {
      this.copyTitle.textContent = item.title;
      this.copySub.textContent = item.sub;
      this.copyDesc.textContent = item.desc;
      this.copyChips.innerHTML = (item.chips || []).map(c => `<span class="chip">${c}</span>`).join('');

      this.copyTitle.style.transition = 'none';
      this.copyTitle.classList.remove('out');
      this.copyTitle.style.transform = 'translateY(108%)';
      void this.copyTitle.offsetHeight;
      this.copyTitle.style.transition = 'transform 0.55s cubic-bezier(0.77, 0, 0.18, 1)';
      this.copyTitle.style.transform = 'translateY(0)';

      blocks.forEach((el, k) => {
        el.style.transitionDelay = `${k * 65}ms`;
        el.classList.remove('out');
      });

      if (this.onActiveChange) this.onActiveChange(item, nextIdx);
    }, 260);
  }

  setFilter(category) {
    this.items = category === 'all'
      ? this.allItems.slice()
      : this.allItems.filter(item => item.category === category);

    this.nodes.forEach((n, rawIdx) => {
      const included = this.items.includes(n.data);
      n.el.classList.toggle('is-filtered-out', !included);
      if (this.pagerDots[rawIdx]) {
        this.pagerDots[rawIdx].classList.toggle('is-filtered-out', !included);
      }
    });

    this.activeIdx = 0;
    this.targetPos = 0;
    this.posS = -0.5;
    this.lastDrawnRot = NaN;
    this.syncExternalUI(0);
    this.populateCopyInstant(0);
  }

  startLoop() {
    let lastTime = performance.now();
    const tick = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      if (this.isVisible) {
        this.posS += (this.targetPos - this.posS) * (1 - Math.exp(-dt * 10));
        if (Math.abs(this.targetPos - this.posS) < 0.0002) this.posS = this.targetPos;

        const instVel = dt > 0 ? (this.posS - this.prevPosS) / dt : 0;
        this.velS += (instVel - this.velS) * (1 - Math.exp(-dt * 16));
        this.prevPosS = this.posS;

        const rot = -this.posS * this.G.DELTA;
        if (Number.isNaN(this.lastDrawnRot) || Math.abs(rot - this.lastDrawnRot) > 0.00004) {
          this.drawRingCanvas(rot);
          this.lastDrawnRot = rot;
        }

        const moving = Math.abs(this.velS) > 0.05;
        const blurPx = moving ? Math.round(Math.min(6, Math.abs(this.velS) * 2.2) * 2) / 2 : 0;

        for (let rawIdx = 0; rawIdx < this.nodes.length; rawIdx++) {
          const node = this.nodes[rawIdx];
          const i = this.items.indexOf(node.data);
          if (i === -1) continue;

          const d = i - this.posS;
          const absD = Math.abs(d);

          if (absD > 1.85) {
            if (node.visible) {
              node.el.style.visibility = 'hidden';
              node.visible = false;
            }
            continue;
          }
          if (!node.visible) {
            node.el.style.visibility = 'visible';
            node.visible = true;
          }

          const ang = -Math.PI / 2 + d * this.G.DELTA;
          const ix = this.G.CX + Math.cos(ang) * this.G.RI;
          const iy = this.G.CY + Math.sin(ang) * this.G.RI;
          const rotDeg = (d * this.G.DELTA) * (180 / Math.PI);
          const op = 1 - Math.min(0.62, absD * 0.5);

          node.el.style.transform = `translate3d(${ix.toFixed(2)}px, ${iy.toFixed(2)}px, 0) rotate(${rotDeg.toFixed(3)}deg)`;
          node.el.style.opacity = op.toFixed(3);

          if (blurPx !== node.lastBlur) {
            node.lastBlur = blurPx;
            node.visual.style.filter = blurPx > 0
              ? `blur(${blurPx}px) drop-shadow(0 24px 26px rgba(0,0,0,0.85))`
              : 'drop-shadow(0 24px 26px rgba(0,0,0,0.85))';
          }

          const target = Math.max(0, 1 - absD * 1.15);
          for (let j = 0; j < node.acc.length; j++) {
            const a = node.acc[j];
            const force = (target - a.s) * a.stiff - a.sv * a.damp;
            a.sv += force * dt;
            a.s += a.sv * dt;

            const spread = 1 + (1 - a.s) * 0.9;
            const ax = a.x * this.G.IW * spread;
            const ay = a.y * this.G.IW * spread;
            const idle = Math.sin(now * 0.0014 + a.phase) * 2.2 * dialClamp(a.s, 0, 1);
            const arot = a.rot + (1 - a.s) * 80 * a.rnd + idle;
            const aop = dialClamp(a.s * 1.4, 0, 1);

            a.el.style.transform = `translate3d(${ax.toFixed(1)}px, ${ay.toFixed(1)}px, 0) rotate(${arot.toFixed(2)}deg)`;
            a.el.style.opacity = aop.toFixed(3);
          }
        }
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
}

/**
 * 5. Initialize Skills & Projects Rotating Lens Dial Stages
 */
function initApertureDials() {
  const skillsData = [
    {
      id: 'iot',
      modelId: 'iot',
      title: 'IoT & Embedded Systems',
      sub: 'HARDWARE & CLOUD · 240MHz',
      readout: 'ESP32',
      desc: 'การพัฒนาฮาร์ดแวร์อัจฉริยะ เซนเซอร์ตรวจวัด และเชื่อมต่อระบบคลาวด์แบบเรียลไทม์ด้วย Arduino & C++',
      chips: ['ESP32 Microcontroller', 'Smart Home System', 'Sensor Interfacing', 'Arduino & C++'],
      props: [
        ['chip', -0.64, -0.14, -20, 0.2],
        ['oled', 0.66, 0.16, 12, 0.22],
        ['probe', -0.5, 0.46, 22, 0.22],
        ['relay', 0.58, -0.4, -10, 0.22]
      ]
    },
    {
      id: 'web',
      modelId: 'web',
      title: 'Web Development',
      sub: 'FULLSTACK & API · MODERN UI',
      readout: 'ES6+',
      desc: 'สร้างเว็บแอปพลิเคชันแบบอินเทอร์แอกทีฟ ออกแบบ 2.5D UI ที่รองรับทุกขนาดหน้าจอและเชื่อมต่อระบบหลังบ้าน API',
      chips: ['HTML5 & Modern CSS3', 'JavaScript (ES6+)', 'PHP Backend', 'Responsive 2.5D UI'],
      props: [
        ['html', -0.62, -0.18, -14, 0.2],
        ['js', 0.64, 0.12, 16, 0.2],
        ['php', -0.48, 0.46, 0, 0.22],
        ['ui', 0.56, -0.42, -18, 0.22]
      ]
    },
    {
      id: 'sys',
      modelId: 'sys',
      title: 'Systems & Platforms',
      sub: 'OS & WORKFLOW · DEVOPS',
      readout: 'LINUX',
      desc: 'การจัดการระบบปฏิบัติการ Linux และ Windows เครื่องมือควบคุมเวอร์ชัน Git/GitHub และสภาพแวดล้อมพัฒนา',
      chips: ['Linux Environment', 'Windows Workstation', 'Git & GitHub', 'VS Code Live Server'],
      props: [
        ['term', -0.64, -0.2, 14, 0.2],
        ['git', 0.62, 0.24, 0, 0.2],
        ['usb', 0.52, -0.44, -25, 0.2],
        ['cloud', -0.52, 0.42, 18, 0.2]
      ]
    },
    {
      id: 'telemetry',
      modelId: 'telemetry',
      title: 'Telemetry & 2.5D Motion',
      sub: 'MQTT TLS · WEBGL & AUDIO',
      readout: 'MQTT5',
      desc: 'การสตรีมข้อมูล IoT ผ่าน MQTT TLS 1.3 พร้อมหน้าปัด Oscilloscope สดและการสังเคราะห์เสียง Web Audio DSP',
      chips: ['MQTT QoS 1 TLS', 'Three.js WebGL', 'Web Audio DSP', 'Oscilloscope HUD'],
      props: [
        ['wave', -0.64, -0.16, -12, 0.22],
        ['cloud', 0.64, 0.2, 10, 0.2],
        ['chip', 0.54, -0.42, 24, 0.2],
        ['ui', -0.48, 0.46, -16, 0.2]
      ]
    }
  ];

  new ApertureDialStage({
    stageId: 'skillsDialStage',
    band1Text: 'PONGSAKORN · CORE CAPABILITIES · IOT & EMBEDDED · FULLSTACK WEB · SYSTEMS · ',
    band2Text: 'ESP32 240MHz · ES6+ · PHP 8 · LINUX · GIT · MQTT 5.0 · I2C 400kHz · ',
    pillLabel: 'VIEW STACK',
    quickTabsSelector: '#skillsQuickTabs .dial-tab-btn',
    items: skillsData
  });

  const projectsData = [
    {
      id: 'smartfarm',
      modelId: 'smartfarm',
      category: 'iot',
      title: '1. SMART FARM ESP32',
      sub: 'HARDWARE & IOT · COMPLETED',
      readout: 'ESP32',
      desc: 'พัฒนาโดยมีหน้าเว็บควบคุมและสามารถอ่านค่าเซนเซอร์บนหน้าเว็บที่ไหนก็ได้ พร้อมระบบควบคุมมอเตอร์รดน้ำอัตโนมัติ ติดตามสภาพแวดล้อมเป็นกราฟเรียลไทม์',
      chips: ['ESP32', 'C++', 'Web Dashboard', 'Automation'],
      link: null,
      props: [
        ['probe', -0.64, -0.14, -18, 0.22],
        ['oled', 0.66, 0.16, 12, 0.22],
        ['relay', -0.5, 0.44, 14, 0.22],
        ['chip', 0.58, -0.4, -22, 0.2]
      ]
    },
    {
      id: 'itacademy',
      modelId: 'itacademy',
      category: 'web',
      title: '2. IT ACADEMY HUB',
      sub: 'WEB PLATFORM · LIVE ON VERCEL',
      readout: 'LIVE',
      desc: 'เว็บไซต์สำหรับเรียนรู้สายงาน IT ทั้ง IoT, Network, Web App และภาษาโปรแกรมมิ่ง รวมคู่มือ แหล่งเรียนรู้ และแนวทางสู่สายอาชีพเทคโนโลยี',
      chips: ['Web Application', 'HTML/CSS/JS', 'PHP', 'Education'],
      link: 'https://it-academy-online.vercel.app/',
      props: [
        ['html', -0.62, -0.2, -16, 0.2],
        ['php', 0.64, 0.14, 14, 0.22],
        ['js', -0.52, 0.44, 20, 0.2],
        ['cloud', 0.56, -0.42, -12, 0.2]
      ]
    },
    {
      id: 'smartdetect',
      modelId: 'smartdetect',
      category: 'iot',
      title: '3. SMART DETECTION',
      sub: 'HARDWARE & IOT SECURITY · COMPLETED',
      readout: 'PIR-IR',
      desc: 'ระบบเซนเซอร์ตรวจจับความเคลื่อนไหวอัจฉริยะ เชื่อมต่อไมโครคอนโทรลเลอร์ส่งข้อมูลผ่านโพรโทคอล MQTT แจ้งเตือนความปลอดภัยแบบเรียลไทม์',
      chips: ['ESP32', 'PIR Sensor', 'MQTT', 'IoT Security'],
      link: null,
      props: [
        ['pir', -0.64, -0.16, -15, 0.22],
        ['wave', 0.64, 0.2, 10, 0.22],
        ['chip', 0.54, -0.44, 24, 0.2],
        ['cloud', -0.5, 0.44, -20, 0.2]
      ]
    },
    {
      id: 'bloompetal',
      modelId: 'bloompetal',
      category: 'web',
      title: '4. BLOOM & PETAL',
      sub: 'E-COMMERCE PLATFORM · FEATURED',
      readout: 'STORE',
      desc: 'เว็บแอปพลิเคชันระบบสั่งซื้อสินค้าออนไลน์สำหรับร้านดอกไม้ รองรับระบบตะกร้าสินค้า (Cart) ค้นหา และออกแบบหน้าเว็บแบบ Responsive ทุกอุปกรณ์',
      chips: ['HTML5 / CSS3', 'JavaScript', 'Firebase Hosting', 'E-Commerce UI'],
      link: null,
      props: [
        ['cart', -0.62, -0.16, -14, 0.22],
        ['ui', 0.64, 0.18, 16, 0.22],
        ['js', -0.5, 0.46, 18, 0.2],
        ['html', 0.56, -0.42, -20, 0.2]
      ]
    }
  ];

  const inspectBtn = document.getElementById('projectsDialInspectBtn');
  const visitLink = document.getElementById('projectsDialVisitLink');
  const catalogCards = document.querySelectorAll('.catalog-row-card');

  window.__projectsDial = new ApertureDialStage({
    stageId: 'projectsDialStage',
    band1Text: 'PORTFOLIO ARCHIVE · SMART FARM ESP32 · IT ACADEMY · SMART DETECTION · BLOOM & PETAL · ',
    band2Text: 'GPIO 21 · 400kHz · SSL TLS · PWM · 12-BIT ADC · OLED · VERCEL · ',
    pillLabel: 'VIEW PROJECT',
    items: projectsData,
    onActiveChange: (item) => {
      if (inspectBtn) inspectBtn.setAttribute('data-project', item.id);
      if (visitLink) {
        if (item.link) {
          visitLink.href = item.link;
          visitLink.style.display = 'inline-flex';
        } else {
          visitLink.style.display = 'none';
        }
      }
      catalogCards.forEach(card => {
        card.classList.toggle('dial-selected', card.getAttribute('data-project-id') === item.id);
      });
    },
    onActiveItemClick: (item) => {
      if (inspectBtn) {
        inspectBtn.setAttribute('data-project', item.id);
        inspectBtn.click();
      }
    }
  });

  // Wire catalog card clicks to smoothly turn the rotating project dial
  catalogCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('button, a, .xray-card-preview')) return;
      const projId = card.getAttribute('data-project-id');
      if (!window.__projectsDial) return;
      const matchIdx = window.__projectsDial.items.findIndex(it => it.id === projId);
      if (matchIdx !== -1) {
        window.__projectsDial.goTo(matchIdx);
      }
    });
  });
}

/* ==========================================================================
   Application Bootstrap (After all classes and registries are declared)
   ========================================================================== */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootApplication);
} else {
  bootApplication();
}




