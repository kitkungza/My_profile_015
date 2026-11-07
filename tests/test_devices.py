import asyncio
from playwright.async_api import async_playwright

async def test_devices():
    devices = [
        {"name": "samsung_a55", "width": 360, "height": 800},
        {"name": "iphone_16", "width": 393, "height": 852},
        {"name": "ipad_mini", "width": 768, "height": 1024},
        {"name": "ipad_pro", "width": 1024, "height": 1366}
    ]

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)

        for dev in devices:
            context = await browser.new_context(viewport={"width": dev["width"], "height": dev["height"]})
            page = await context.new_page()

            url = "file:///C:/Users/asus/Downloads/My_profile_015/index.html"
            await page.goto(url, wait_until="networkidle")
            await page.wait_for_timeout(1000)

            # Capture hero viewport
            await page.screenshot(path=f"C:/Users/asus/Downloads/My_profile_015/screenshot_{dev['name']}_hero.png")

            # Scroll and capture full page
            await page.screenshot(path=f"C:/Users/asus/Downloads/My_profile_015/screenshot_{dev['name']}_full.png", full_page=True)
            print(f"Captured {dev['name']}")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(test_devices())
