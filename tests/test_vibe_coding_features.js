const fs = require('fs');
const assert = require('assert');

console.log('Testing งานที่ 9: Vibe Coding พัฒนา Portfolio ด้วย AI...');

const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('style.css', 'utf8');
const js = fs.readFileSync('script.js', 'utf8');

// -------------------------------------------------------------
// 1. Check Feature 01: Project Filter
// -------------------------------------------------------------
console.log('Testing Feature 01: Project Filter...');
assert(html.includes('class="project-filter-bar"'), 'HTML must have project-filter-bar');
assert(html.includes('data-filter="all"'), 'Filter bar must have "all" button');
assert(html.includes('data-filter="iot"'), 'Filter bar must have "iot" button');
assert(html.includes('data-filter="web"'), 'Filter bar must have "web" button');
assert(html.includes('data-category="iot"'), 'Project cards must have data-category="iot"');
assert(html.includes('data-category="web"'), 'Project cards must have data-category="web"');

assert(css.includes('.project-filter-bar'), 'CSS must define .project-filter-bar');
assert(css.includes('.filter-btn'), 'CSS must define .filter-btn');
assert(css.includes('.project-card.is-hidden'), 'CSS must define .project-card.is-hidden');

assert(js.includes('function initProjectFilter'), 'JS must define initProjectFilter');
assert(js.includes("btn.getAttribute('data-filter')"), 'JS must read data-filter');
console.log('✔ Feature 01: Project Filter passed!');

// -------------------------------------------------------------
// 2. Check Feature 02: Contact Form
// -------------------------------------------------------------
console.log('Testing Feature 02: Contact Form...');
assert(html.includes('id="contact"'), 'HTML must have #contact section');
assert(html.includes('id="contactForm"'), 'HTML must have #contactForm');
assert(html.includes('id="contactName"'), 'HTML must have contactName input');
assert(html.includes('id="contactEmail"'), 'HTML must have contactEmail input');
assert(html.includes('id="contactMessage"'), 'HTML must have contactMessage textarea');
assert(html.includes('id="contactStatus"'), 'HTML must have contactStatus alert box');

assert(css.includes('.contact-section'), 'CSS must define .contact-section');
assert(css.includes('.contact-form'), 'CSS must define .contact-form');
assert(css.includes('.contact-status-box.success'), 'CSS must define success status box');

assert(js.includes('function initContactForm'), 'JS must define initContactForm');
assert(js.includes('emailRegex'), 'JS must validate email format');
assert(js.includes('contact-status-box success'), 'JS must show success status');
console.log('✔ Feature 02: Contact Form passed!');

// -------------------------------------------------------------
// 3. Check Feature 03: Dark Mode / Light Mode Switch
// -------------------------------------------------------------
console.log('Testing Feature 03: Dark Mode / Light Mode...');
assert(html.includes('id="themeToggleBtn"'), 'HTML must have #themeToggleBtn');
assert(css.includes('body.light-mode'), 'CSS must define body.light-mode overrides');
assert(js.includes('function initThemeToggle'), 'JS must define initThemeToggle');
assert(js.includes("localStorage.getItem('portfolio-theme')"), 'JS must check saved theme in localStorage');
assert(js.includes("localStorage.setItem('portfolio-theme'"), 'JS must save theme to localStorage');
console.log('✔ Feature 03: Dark Mode passed!');

// -------------------------------------------------------------
// 4. Check Feature 04: Project Details Modal Popup
// -------------------------------------------------------------
console.log('Testing Feature 04: Project Details...');
assert(html.includes('id="projectModal"'), 'HTML must have #projectModal');
assert(html.includes('id="modalCloseBtn"'), 'HTML must have #modalCloseBtn');
assert(html.includes('class="btn-project-detail"'), 'HTML must have .btn-project-detail buttons');

assert(css.includes('.project-modal'), 'CSS must define .project-modal');
assert(css.includes('.modal-card'), 'CSS must define .modal-card');

assert(js.includes('function initProjectModal'), 'JS must define initProjectModal');
assert(js.includes('projectDetailsData'), 'JS must have projectDetailsData dictionary');
assert(js.includes('modal.classList.add(\'is-open\')'), 'JS must handle opening modal');
console.log('✔ Feature 04: Project Details passed!');

// -------------------------------------------------------------
// 5. Check Integrity of Existing Requirements
// -------------------------------------------------------------
console.log('Checking that existing sections and personal data are intact...');
assert(html.includes('PONGSAKORN'), 'Brand logo must be intact');
assert(html.includes('68219010015'), 'Student ID must be intact');
assert(html.includes('id="about"'), 'About section must be intact');
assert(html.includes('id="skills"'), 'Skills section must be intact');
assert(html.includes('id="projects"'), 'Projects section must be intact');
assert(html.includes('id="cost-estimator"'), 'Cost estimator section must be intact');
assert(html.includes('Smart Farm ด้วย ESP32'), 'Smart Farm project must be intact');
assert(html.includes('IT Academy'), 'IT Academy project must be intact');
console.log('✔ All existing requirements are 100% intact!');

console.log('\n======================================================');
console.log('🎉 ALL VIBE CODING TESTS PASSED SUCCESSFULLY! 🎉');
console.log('======================================================');
