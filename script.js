/* ==========================================================================
   PONGSATORN • 3D Cinematic Portfolio Interactive Scripts
   Features:
   - Part 1: Three.js 3D Ambient Particles & Mouse Depth Parallax
   - Part 2: Viral AI Swarm Agents Simulation Engine
   - Part 3: Web Audio Synthesizer, Sparkles, and Greeting Typewriter
   ========================================================================== */

// Global State
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

  // Particle System (650+ Floating Star-Dust & Crimson Particles)
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
    // Spatial positioning in a cylindrical depth volume
    positions[i * 3] = (Math.random() - 0.5) * 120;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 70;

    // Color gradient distribution: 60% crimson/reds, 30% white, 10% soft blue
    const roll = Math.random();
    let chosenColor;
    if (roll < 0.45) {
      chosenColor = crimsonColor;
    } else if (roll < 0.65) {
      chosenColor = brightRedColor;
    } else if (roll < 0.90) {
      chosenColor = starWhiteColor;
    } else {
      chosenColor = softBlueColor;
    }

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

    // Subtle drift rotation
    if (particleSystem) {
      particleSystem.rotation.y = elapsedTime * 0.04;
      particleSystem.rotation.x = Math.sin(elapsedTime * 0.03) * 0.05;
    }

    // Smooth Mouse Interpolation (Lerp)
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
    // Normalize coordinates (-1 to 1)
    targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
    targetMouseY = (e.clientY / window.innerHeight) * 2 - 1;

    // Apply 2.5D Depth shift to DOM elements
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

  // Optional Gyroscope Parallax for Mobile
  if (window.DeviceOrientationEvent && window.innerWidth <= 768) {
    window.addEventListener('deviceorientation', (e) => {
      if (e.gamma !== null && e.beta !== null) {
        targetMouseX = Math.min(Math.max(e.gamma / 30, -1), 1);
        targetMouseY = Math.min(Math.max((e.beta - 45) / 30, -1), 1);
      }
    }, { passive: true });
  }
}

// Initial boot
document.addEventListener('DOMContentLoaded', () => {
  initThreeBackground();
  initParallax();
});
