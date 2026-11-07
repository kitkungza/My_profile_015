import os
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={'width': 1280, 'height': 800})
    file_url = 'file:///' + os.path.abspath('index.html').replace('\\', '/')
    pg.goto(file_url)
    pg.wait_for_timeout(1000)

    # Scroll to projects
    pg.locator('#projects').scroll_into_view_if_needed()
    pg.wait_for_timeout(1500)

    # Verify link
    links = pg.query_selector_all('.btn-project-visit, .project-live-badge, .project-link-header')
    print('Found IT Academy links count:', len(links))
    assert len(links) >= 1, 'No links found'

    for link in links:
        href = link.get_attribute('href')
        print('Link href:', href)
        assert href == 'https://it-academy-online.vercel.app/', f'Unexpected href: {href}'

    pg.screenshot(path='screenshot_projects_with_link.png')
    b.close()
    print('ALL IT ACADEMY LINK TESTS PASSED!')
