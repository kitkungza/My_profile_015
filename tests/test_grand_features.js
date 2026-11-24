/**
 * Test Suite: Grand Features Renovation
 * Combining Aperture Row, Embers Foundry & Lithos into Pongsakorn's Portfolio
 */
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const projectRoot = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(projectRoot, 'style.css'), 'utf8');
const js = fs.readFileSync(path.join(projectRoot, 'script.js'), 'utf8');

console.log('Testing Grand Features Integration (5 Key Pillars)...');

// Pillar 1: Hardware-to-Code X-Ray Spotlight (Lithos Inspired)
console.log('Testing Pillar 1: Hardware-to-Code X-Ray Spotlight...');
assert(html.includes('id="smartfarmXrayPreview"'), 'Missing #smartfarmXrayPreview in HTML');
assert(html.includes('class="xray-layer xray-base"'), 'Missing xray base layer');
assert(html.includes('class="xray-layer xray-reveal"'), 'Missing xray reveal layer');
assert(html.includes('class="xray-lens"'), 'Missing xray lens in HTML');
assert(css.includes('.xray-card-preview'), 'Missing .xray-card-preview in CSS');
assert(css.includes('mask-image: radial-gradient('), 'Missing radial mask-image in CSS');
assert(js.includes('function initXRaySpotlight('), 'Missing initXRaySpotlight in JS');
console.log('✔ Pillar 1: X-Ray Spotlight verified!');

// Pillar 2: Hardware Pinout Turntable with Interactive Hotspots (Aperture Row Inspired)
console.log('Testing Pillar 2: Hardware Pinout Turntable...');
assert(html.includes('id="turntableStage3D"'), 'Missing #turntableStage3D in HTML');
assert(html.includes('class="pinout-hotspot"'), 'Missing pinout-hotspot buttons in HTML');
assert(html.includes('id="pinoutCalloutHud"'), 'Missing #pinoutCalloutHud in HTML');
assert(css.includes('.pinout-hotspot'), 'Missing .pinout-hotspot in CSS');
assert(css.includes('.pin-pulse-ring'), 'Missing .pin-pulse-ring in CSS');
assert(js.includes('function initTurntablePinouts('), 'Missing initTurntablePinouts in JS');
console.log('✔ Pillar 2: Hardware Pinout Turntable verified!');

// Pillar 3: Live IoT Telemetry & Calibration Bench (Aperture Row The Bench Inspired)
console.log('Testing Pillar 3: Live IoT Telemetry & Calibration Bench...');
assert(html.includes('id="telemetry-bench"'), 'Missing #telemetry-bench in HTML');
assert(html.includes('id="scopeWavePath"'), 'Missing #scopeWavePath in HTML');
assert(html.includes('id="btnSensorPing"'), 'Missing #btnSensorPing in HTML');
assert(html.includes('id="telemetryLatency"'), 'Missing #telemetryLatency in HTML');
assert(html.includes('id="telemetryPackets"'), 'Missing #telemetryPackets in HTML');
assert(css.includes('.telemetry-bench-section'), 'Missing .telemetry-bench-section in CSS');
assert(css.includes('.scope-display'), 'Missing .scope-display in CSS');
assert(js.includes('function initTelemetryBench('), 'Missing initTelemetryBench in JS');
console.log('✔ Pillar 3: Telemetry Bench verified!');

// Pillar 4: Depth Kinetic Typography & Industrial Layering (Embers Foundry Inspired)
console.log('Testing Pillar 4: Kinetic Layering & Depth Typography...');
assert(html.includes('class="hero-3d-text"'), 'Missing hero 3d text');
assert(html.includes('class="hero-portrait-wrap"'), 'Missing hero portrait wrap');
assert(css.includes('--font-display'), 'Missing display font token');
assert(css.includes('preserve-3d'), 'Missing preserve-3d transform style');
console.log('✔ Pillar 4: Kinetic Layering verified!');

// Pillar 5: Tactile Haptic Audio Feedback Engine
console.log('Testing Pillar 5: Tactile Web Audio Feedback...');
assert(html.includes('id="audioToggleBtn"'), 'Missing #audioToggleBtn in HTML');
assert(js.includes('function playMechanicalRelaySound('), 'Missing playMechanicalRelaySound in JS');
assert(js.includes('function playTelemetryPingSound('), 'Missing playTelemetryPingSound in JS');
assert(js.includes('function initTactileAudio('), 'Missing initTactileAudio in JS');
console.log('✔ Pillar 5: Tactile Web Audio Engine verified!');

console.log('\n=============================================================');
console.log('🎉 ALL 5 GRAND PILLARS VERIFIED WITH 100% SUCCESS! 🎉');
console.log('=============================================================\n');
