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

  // Mark all elements as pending build initially
  elementsToBuild.forEach(item => {
    const el = document.querySelector(item.sel);
    if (el) {
      el.classList.add('swarm-pending-build');
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

  // 2. Build-on-Scroll via IntersectionObserver
  if ('IntersectionObserver' in window) {
    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          if (!el.classList.contains('swarm-built')) {
            const delay = parseInt(el.dataset.buildDelay || '0', 10);
            setTimeout(() => {
              assembleElement(el);
            }, delay);
            scrollObserver.unobserve(el);
          }
        }
      });
    }, {
      rootMargin: '0px 0px 100px 0px',
      threshold: 0.05
    });

    const scrollElements = document.querySelectorAll('.swarm-pending-build:not([data-build-group="hero"])');
    scrollElements.forEach(el => scrollObserver.observe(el));
  }

  // 3. Active Mouse Scroll Wheel & Touch Scroll Listener
  window.addEventListener('scroll', () => {
    const pending = document.querySelectorAll('.swarm-pending-build');
    pending.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 80) {
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

// Initial boot
document.addEventListener('DOMContentLoaded', () => {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  initThreeBackground();
  initParallax();
  initSwarmSimulation();
  setupProgressiveBuild();
  initInteractions();
});

window.addEventListener('load', () => {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
});
