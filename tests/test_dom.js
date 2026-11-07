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
