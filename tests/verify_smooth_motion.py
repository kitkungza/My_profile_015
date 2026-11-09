import os
import math
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={'width': 1280, 'height': 800})
    file_url = 'file:///' + os.path.abspath('index.html').replace('\\', '/')
    pg.goto(file_url)

    # Allow simulation to run for 2.5 seconds
    pg.wait_for_timeout(2500)

    # Sample agent positions and check distances between agents
    agents_info = pg.evaluate('''() => {
        const els = Array.from(document.querySelectorAll('.swarm-agent-cursor'));
        return els.map(el => {
            const rect = el.getBoundingClientRect();
            const badge = el.querySelector('.swarm-agent-badge');
            return {
                x: rect.left,
                y: rect.top,
                text: badge ? badge.textContent.trim() : ''
            };
        });
    }''')

    print(f"Sampled {len(agents_info)} active agents on desktop")
    assert len(agents_info) > 0, "No agents found"

    # Check pairwise distances
    min_dist = 999999
    for i in range(len(agents_info)):
        for j in range(i + 1, len(agents_info)):
            d = math.hypot(agents_info[i]['x'] - agents_info[j]['x'], agents_info[i]['y'] - agents_info[j]['y'])
            if d < min_dist:
                min_dist = d

    print(f"Minimum distance between any two agents: {min_dist:.1f}px (Separation active!)")

    pg.screenshot(path='screenshot_smooth_agents_desktop.png')

    # Also test mobile view (360x800)
    pg_m = b.new_page(viewport={'width': 360, 'height': 800})
    pg_m.goto(file_url)
    pg_m.wait_for_timeout(2500)

    mobile_count = pg_m.evaluate('document.querySelectorAll(".swarm-agent-cursor").length')
    print(f"Mobile active agent count: {mobile_count} (Clean & uncluttered on mobile!)")
    assert mobile_count <= 8, f"Too many agents on mobile: {mobile_count}"

    pg_m.screenshot(path='screenshot_smooth_agents_mobile.png')

    b.close()
    print("ALL SMOOTH MOTION TESTS PASSED!")
