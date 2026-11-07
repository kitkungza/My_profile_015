/* ==========================================================================
   PONGSATORN • 3D Cinematic Portfolio Interactive Scripts
   Features:
   - Part 1: Three.js 3D Ambient Particles & Mouse Depth Parallax
   - Part 2: Viral AI Swarm Agents Simulation Engine (TikTok Replication)
   - Part 3: Web Audio Synthesizer, Sparkles, and Greeting Typewriter
   ========================================================================== */

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
let currentLayerCount = 38;
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

  // SVG Pointer with customized theme color
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

function initSwarmSimulation() {
  const container = document.getElementById('swarm-cursor-layer');
  const dock = document.getElementById('swarm-dock');
  const toggleBtn = document.getElementById('swarmToggleBtn');
  const tourBtn = document.getElementById('swarmTourBtn');
  const speedBtn = document.getElementById('swarmSpeedBtn');
  const layerCountEl = document.getElementById('swarm-layer-count');

  if (!container) return;

  // Clear existing
  container.innerHTML = '';
  activeAgentInstances = [];

  // Spawn agent cursors across screen
  agentProfiles.forEach((agent, i) => {
    const el = createAgentCursor(agent, i);
    container.appendChild(el);

    const startX = Math.random() * (window.innerWidth - 100) + 50;
    const startY = Math.random() * (window.innerHeight - 100) + 50;
    el.style.transform = `translate(${startX}px, ${startY}px)`;

    activeAgentInstances.push({
      el: el,
      agent: agent,
      x: startX,
      y: startY,
      targetX: startX,
      targetY: startY,
      speed: (Math.random() * 0.04 + 0.03),
      actionCooldown: Math.floor(Math.random() * 60)
    });
  });

  // Choreography loop
  function stepSwarm() {
    if (!swarmActive) return;

    // Increment layers counter gradually
    if (Math.random() < 0.08 && currentLayerCount < totalLayers) {
      currentLayerCount += Math.floor(Math.random() * 2) + 1;
      if (layerCountEl) {
        layerCountEl.textContent = `${currentLayerCount} / ${totalLayers} layers`;
      }
    }

    const interactiveTargets = document.querySelectorAll(
      '.hero-title, .hero-subtitle, .stat-card, .btn-primary, .skill-category-card, .project-card, .brand-logo, .nav-link'
    );

    activeAgentInstances.forEach((inst) => {
      inst.actionCooldown--;

      if (inst.actionCooldown <= 0) {
        // Pick a new target element or random nearby position
        if (interactiveTargets.length > 0 && Math.random() < 0.65) {
          const target = interactiveTargets[Math.floor(Math.random() * interactiveTargets.length)];
          const rect = target.getBoundingClientRect();
          inst.targetX = rect.left + Math.random() * rect.width;
          inst.targetY = rect.top + Math.random() * rect.height;

          // Occasionally draw a selection box
          if (Math.random() < 0.25) {
            triggerSelectionBox(rect.left, rect.top, rect.width, rect.height);
          }
        } else {
          inst.targetX = Math.random() * (window.innerWidth - 140) + 70;
          inst.targetY = Math.random() * (window.innerHeight - 140) + 70;
        }

        inst.actionCooldown = Math.floor(Math.random() * 80 + 40) / swarmSpeed;
      }

      // Smooth step towards target
      inst.x += (inst.targetX - inst.x) * (inst.speed * swarmSpeed);
      inst.y += (inst.targetY - inst.y) * (inst.speed * swarmSpeed);

      inst.el.style.transform = `translate(${inst.x}px, ${inst.y}px)`;
    });

    requestAnimationFrame(stepSwarm);
  }

  requestAnimationFrame(stepSwarm);

  // Trigger floating dashed selection box
  function triggerSelectionBox(x, y, w, h) {
    if (!swarmActive) return;
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

  // Toggle button listener
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleSwarm);
  }

  // Speed button listener
  if (speedBtn) {
    speedBtn.addEventListener('click', () => {
      if (swarmSpeed === 1) swarmSpeed = 2;
      else if (swarmSpeed === 2) swarmSpeed = 3;
      else swarmSpeed = 1;
      speedBtn.textContent = `${swarmSpeed}x`;
    });
  }

  // Tour mode listener
  if (tourBtn) {
    tourBtn.addEventListener('click', () => {
      isTouring = !isTouring;
      tourBtn.classList.toggle('active', isTouring);
      if (isTouring) startTourScroll();
    });
  }

  // Keyboard shortcut Esc or Alt+Shift+S
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      toggleSwarm();
    } else if (e.altKey && e.shiftKey && (e.key === 'S' || e.key === 's')) {
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

// Initial boot
document.addEventListener('DOMContentLoaded', () => {
  initThreeBackground();
  initParallax();
  initSwarmSimulation();
});
