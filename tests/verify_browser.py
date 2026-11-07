import asyncio
from playwright.async_api import async_playwright

async def capture():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={"width": 1440, "height": 900})
        page = await context.new_page()

        console_errors = []
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)

        url = "file:///C:/Users/asus/Downloads/My_profile_015/index.html"
        await page.goto(url, wait_until="networkidle")
        await page.wait_for_timeout(2000)

        # Take full page screenshot and viewport screenshot
        await page.screenshot(path="C:/Users/asus/Downloads/My_profile_015/screenshot_hero.png")
        await page.screenshot(path="C:/Users/asus/Downloads/My_profile_015/screenshot_full.png", full_page=True)

        print(f"Console errors: {len(console_errors)}")
        for err in console_errors:
            print("ERROR:", err)

        # Check element visibility
        bg_text = await page.is_visible(".hero-3d-text")
        portrait = await page.is_visible(".hero-portrait")
        swarm_dock = await page.is_visible("#swarm-dock")
        agents = await page.locator(".swarm-agent-cursor").count()

        print(f"Hero 3D Text visible: {bg_text}")
        print(f"Hero Portrait visible: {portrait}")
        print(f"Swarm Dock visible: {swarm_dock}")
        print(f"Active Swarm Agents count: {agents}")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(capture())
