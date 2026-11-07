const fs = require('fs');
const js = fs.readFileSync('script.js', 'utf8');

const requiredInteractions = [
  'devGreetings',
  'playChimeSound',
  'createSparkles',
  'typeWriter'
];

for (const fn of requiredInteractions) {
  if (!js.includes(fn)) {
    console.error(`Missing interaction symbol: ${fn}`);
    process.exit(1);
  }
}
console.log('Interactions test PASSED');
