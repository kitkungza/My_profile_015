/**
 * Test Suite: Aperture Row Rotating Lens Dial Stages & 9-Blade Mechanical Iris
 */
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const projectRoot = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(projectRoot, 'style.css'), 'utf8');
const js = fs.readFileSync(path.join(projectRoot, 'script.js'), 'utf8');

console.log('Testing Aperture Row Rotating Dial Stages & 9-Blade Iris...');

// 1. About Section 9-Blade Aperture Iris
assert(html.includes('id="aboutIrisWrap"'), 'HTML must have #aboutIrisWrap');
assert(html.includes('id="aboutIrisBlades"'), 'HTML must have #aboutIrisBlades');
assert(css.includes('.iris-wrap'), 'CSS must define .iris-wrap');
assert(js.includes('function initAboutApertureIris('), 'JS must define initAboutApertureIris');
console.log('✔ About 9-Blade Aperture Iris verified!');

// 2. Skills Rotating Lens Ring Stage
assert(html.includes('id="skillsDialStage"'), 'HTML must have #skillsDialStage');
assert(html.includes('id="skillsQuickTabs"'), 'HTML must have #skillsQuickTabs');
assert(html.includes('id="skillsRingItems"'), 'HTML must have #skillsRingItems');
console.log('✔ Skills Rotating Dial Stage verified!');

// 3. Projects Rotating Lens Ring Stage + Catalog Shelf Sync
assert(html.includes('id="projectsDialStage"'), 'HTML must have #projectsDialStage');
assert(html.includes('id="projectsRingItems"'), 'HTML must have #projectsRingItems');
assert(html.includes('id="projectsDialInspectBtn"'), 'HTML must have #projectsDialInspectBtn');
assert(html.includes('catalog-row-card'), 'HTML must have .catalog-row-card catalog shelf');
console.log('✔ Projects Rotating Dial Stage & Shelf verified!');

// 4. Shared ApertureDialStage CSS & JS Engine
assert(css.includes('.aperture-dial-stage'), 'CSS must define .aperture-dial-stage');
assert(css.includes('.dial-disc-canvas'), 'CSS must define .dial-disc-canvas');
assert(css.includes('.dial-ring-canvas'), 'CSS must define .dial-ring-canvas');
assert(js.includes('class ApertureDialStage'), 'JS must define class ApertureDialStage');
assert(js.includes('function buildStudioModelSvg('), 'JS must define buildStudioModelSvg');
assert(js.includes('function buildPropAccessorySvg('), 'JS must define buildPropAccessorySvg');
assert(js.includes('function initApertureDials('), 'JS must define initApertureDials');
assert(js.includes('window.__projectsDial'), 'JS must sync filter with window.__projectsDial');
console.log('✔ Shared ApertureDialStage Engine verified!');

console.log('\n🎉 ALL APERTURE ROW ROTATING DIAL TESTS PASSED 100%! 🎉');
