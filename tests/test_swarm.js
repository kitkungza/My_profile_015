const fs = require('fs');
const js = fs.readFileSync('script.js', 'utf8');

const requiredSwarmSymbols = [
  'initSwarmSimulation',
  'agentProfiles',
  'createAgentCursor',
  'toggleSwarm',
  'swarmActive'
];

for (const s of requiredSwarmSymbols) {
  if (!js.includes(s)) {
    console.error(`Missing Swarm symbol: ${s}`);
    process.exit(1);
  }
}
console.log('Swarm simulation test PASSED');
