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
