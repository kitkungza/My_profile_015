const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('style.css', 'utf8');
const js = fs.readFileSync('script.js', 'utf8');

// Verify CSS has build-on-scroll classes
const requiredCss = [
  '.swarm-pending-build',
  '.swarm-built',
  'element-assembled'
];

for (const c of requiredCss) {
  if (!css.includes(c)) {
    console.error(`Missing CSS rule: ${c}`);
    process.exit(1);
  }
}

// Verify JS has scroll build and progressive assembly logic
const requiredJs = [
  'setupProgressiveBuild',
  'assembleElement',
  'IntersectionObserver',
  'swarm-pending-build',
  'swarm-built'
];

for (const j of requiredJs) {
  if (!js.includes(j)) {
    console.error(`Missing JS function or logic: ${j}`);
    process.exit(1);
  }
}

console.log('Scroll build test PASSED');
