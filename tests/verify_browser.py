import asyncio
from playwright.async_api import async_playwright

async def verify_scroll_build():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={"width": 1440, "height": 900})
        page = await context.new_page()

        console_errors = []
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)

        url = "file:///C:/Users/asus/Downloads/My_profile_015/index.html"
        await page.goto(url, wait_until="networkidle")

        # 1. Check initial load (Hero assembly underway)
        await page.wait_for_timeout(600)
        hero_built = await page.evaluate("document.querySelector('.hero-3d-text').classList.contains('swarm-built')")
        print(f"Hero 3D text built at 600ms: {hero_built}")

        # Wait for full Hero assembly
        await page.wait_for_timeout(1000)
        await page.screenshot(path="C:/Users/asus/Downloads/My_profile_015/screenshot_assembled_hero.png")

        # 2. Scroll down into About & Skills
        await page.evaluate("window.scrollTo({ top: 800, behavior: 'smooth' })")
        await page.wait_for_timeout(800)
        about_built = await page.evaluate("document.querySelector('.profile-details-card').classList.contains('swarm-built')")
        print(f"About card assembled on scroll: {about_built}")

        # 3. Scroll down into Projects
        await page.evaluate("window.scrollTo({ top: 1600, behavior: 'smooth' })")
        await page.wait_for_timeout(800)
        projects_built = await page.evaluate("document.querySelector('.project-card').classList.contains('swarm-built')")
        print(f"Project card assembled on scroll: {projects_built}")

        # Layer counter at end
        layer_text = await page.text_content("#swarm-layer-count")
        print(f"Final layer counter: {layer_text}")

        await page.screenshot(path="C:/Users/asus/Downloads/My_profile_015/screenshot_scroll_build.png")

        print(f"Console errors: {len(console_errors)}")
        for err in console_errors:
            print("ERROR:", err)

        await browser.close()

if __name__ == "__main__":
    asyncio.run(verify_scroll_build())
