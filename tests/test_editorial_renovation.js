const fs = require('fs');
const assert = require('assert');

console.log('Testing Editorial Renovation (Aperture Row, Embers & Lithos)...');

const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('style.css', 'utf8');
const js = fs.readFileSync('script.js', 'utf8');

// 1. Check Grain Texture Overlay
console.log('Testing 1: Grain Texture Overlay...');
assert(html.includes('class="grain"'), 'HTML must have grain overlay');
assert(css.includes('.grain'), 'CSS must style .grain');
console.log('✔ Grain overlay verified!');

// 2. Check Interactive Spotlight Glow Layer
console.log('Testing 2: Interactive Spotlight Glow...');
assert(html.includes('id="spotlightGlow"'), 'HTML must have #spotlightGlow');
assert(css.includes('.spotlight-glow'), 'CSS must style .spotlight-glow');
assert(js.includes('function initSpotlightGlow'), 'JS must define initSpotlightGlow');
console.log('✔ Interactive spotlight glow verified!');

// 3. Check Floating Cursor Pill
console.log('Testing 3: Floating Cursor Pill...');
assert(html.includes('id="cursorPill"'), 'HTML must have #cursorPill');
assert(css.includes('.cursor-pill'), 'CSS must style .cursor-pill');
assert(css.includes('.cursor-dot'), 'CSS must style .cursor-dot');
assert(js.includes('function initCursorPill'), 'JS must define initCursorPill');
console.log('✔ Floating cursor pill verified!');

// 4. Check Technical Glyphs Column
console.log('Testing 4: Technical Glyphs Column...');
assert(html.includes('class="glyphs-column"'), 'HTML must have .glyphs-column');
assert(css.includes('.glyphs-column'), 'CSS must style .glyphs-column');
console.log('✔ Technical glyphs column verified!');

// 5. Check Viewfinder Reticle Corners
console.log('Testing 5: Reticle Viewfinder Corners...');
assert(html.includes('class="ret-corner tl"'), 'HTML must have top-left reticle corner');
assert(html.includes('class="ret-corner br"'), 'HTML must have bottom-right reticle corner');
assert(css.includes('.reticle'), 'CSS must style .reticle');
assert(css.includes('.ret-corner'), 'CSS must style .ret-corner');
console.log('✔ Reticle viewfinder corners verified!');

// 6. Check Smooth Scroll Reveal System
console.log('Testing 6: Smooth Scroll Reveal System...');
assert(html.includes('class="section-card reveal"'), 'HTML sections must have .reveal');
assert(css.includes('.reveal.in'), 'CSS must define .reveal.in');
assert(js.includes('function initSmoothScrollReveals'), 'JS must define initSmoothScrollReveals');
console.log('✔ Smooth scroll reveal system verified!');

// 7. Check Sticky Header Dynamic Compression
console.log('Testing 7: Sticky Header Compression...');
assert(css.includes('.site-header.scrolled'), 'CSS must style .site-header.scrolled');
assert(js.includes('function initHeaderScrollEffect'), 'JS must define initHeaderScrollEffect');
console.log('✔ Sticky header dynamic compression verified!');

// 8. Check Slide-Over Detail Drawer & 3D Turntable
console.log('Testing 8: Detail Drawer & 3D Turntable...');
assert(html.includes('id="modalTurntable"'), 'HTML must have modal turntable');
assert(html.includes('id="modalSpecsGrid"'), 'HTML must have modal specs grid');
assert(css.includes('.modal-turntable'), 'CSS must style .modal-turntable');
assert(css.includes('.specs-grid'), 'CSS must style .specs-grid');
assert(js.includes('function initTurntableTilt'), 'JS must define initTurntableTilt');
console.log('✔ Detail drawer & 3D turntable verified!');

// 9. Check Giant Metallic Wordmark Footer
console.log('Testing 9: Giant Metallic Wordmark Footer...');
assert(html.includes('class="ftr-wordmark"'), 'HTML must have .ftr-wordmark');
assert(css.includes('.ftr-wordmark'), 'CSS must style .ftr-wordmark');
console.log('✔ Giant metallic wordmark footer verified!');

// 10. Check Animated Count-Up Numbers
console.log('Testing 10: Animated Count-Up Numbers...');
assert(html.includes('data-target="5"'), 'HTML must have data-target on stats');
assert(js.includes('function initCountUpStats'), 'JS must define initCountUpStats');
console.log('✔ Animated count-up numbers verified!');

console.log('\n=============================================================');
console.log('🎉 ALL EDITORIAL RENOVATION TESTS PASSED WITH 100% SUCCESS! 🎉');
console.log('=============================================================');
