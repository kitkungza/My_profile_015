const fs = require('fs');
const assert = require('assert');

// Read files
const html = fs.readFileSync('index.html', 'utf8');
const js = fs.readFileSync('script.js', 'utf8');
const css = fs.readFileSync('style.css', 'utf8');

console.log('Testing Course Assignment Requirements...');

// 1. Check HTML elements
const requiredHtmlElements = [
  'id="welcome-banner"',
  'id="welcomeMessage"',
  'id="cost-estimator"',
  'id="calcCostBtn"',
  'id="estPageCount"',
  'id="estTotalPrice"'
];

for (const id of requiredHtmlElements) {
  assert(html.includes(id), `Missing required HTML element: ${id}`);
}
console.log('✔ HTML elements exist');

// 2. Check JavaScript Requirements:
// Section 1: Personalized Welcome with prompt()
assert(js.includes('initPersonalizedWelcome'), 'Missing initPersonalizedWelcome function');
assert(/prompt\(/.test(js), 'Must use prompt()');
assert(/ยินดีต้อนรับคุณ/.test(js), 'Must display welcome message with "ยินดีต้อนรับคุณ"');

// Section 2: Website Cost Estimator
// - 500 baht per page
// - prompt() for pages
// - Number() conversion
// - multiplication (pages * 500)
// - display page count and total price
assert(js.includes('initCostEstimator'), 'Missing initCostEstimator function');
assert(/500/.test(js), 'Must specify 500 baht rate');
assert(/Number\(/.test(js), 'Must use Number() to convert input');
assert(/estimateWebsiteCost/.test(js) || /calculateWebsiteCost/.test(js), 'Must have calculation function');

console.log('✔ JavaScript requirements verified');

// 3. Check CSS styling added
assert(css.includes('.welcome-banner') || css.includes('#welcome-banner'), 'Missing welcome banner styling in CSS');
assert(css.includes('.cost-estimator') || css.includes('#cost-estimator'), 'Missing cost estimator styling in CSS');
console.log('✔ CSS styles verified');

console.log('\nAll Course Assignment Tests PASSED!');
