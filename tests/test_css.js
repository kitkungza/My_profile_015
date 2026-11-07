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
