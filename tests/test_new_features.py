import os
import time
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()

    # 1. Desktop Test: 1440x900
    page = browser.new_page(viewport={'width': 1440, 'height': 900})
    file_url = 'file:///' + os.path.abspath('index.html').replace('\\', '/')
    page.goto(file_url)

    # Capture initial drag & drop building in progress
    page.wait_for_timeout(800)
    page.screenshot(path='screenshot_desktop_building.png')

    # Wait for hero to finish building and agents to complete
    page.wait_for_timeout(3500)
    page.screenshot(path='screenshot_desktop_halo_built.png')

    # Check halo frame exists and is rendered
    halo = page.query_selector('.portrait-halo-frame')
    assert halo is not None, "Halo frame not found"
    halo_box = halo.bounding_box()
    print("Halo Box:", halo_box)

    # 2. Scroll down to trigger About / Skills / Projects assembly
    page.mouse.wheel(0, 800)
    page.wait_for_timeout(1000)
    page.screenshot(path='screenshot_desktop_scroll_drag.png')

    page.mouse.wheel(0, 1200)
    page.wait_for_timeout(3500)
    page.screenshot(path='screenshot_desktop_all_complete.png')

    # 3. Mobile Test: Samsung Galaxy A55 (360x800)
    page_m = browser.new_page(viewport={'width': 360, 'height': 800})
    page_m.goto(file_url)
    page_m.wait_for_timeout(900)
    page_m.screenshot(path='screenshot_a55_building.png')

    page_m.wait_for_timeout(3000)
    page_m.screenshot(path='screenshot_a55_halo_built.png')

    halo_m = page_m.query_selector('.portrait-halo-frame')
    assert halo_m is not None, "Mobile halo frame not found"
    halo_m_box = halo_m.bounding_box()
    print("Mobile Halo Box:", halo_m_box)

    browser.close()
    print("ALL BROWSER TESTS PASSED SUCCESSFULLY!")
