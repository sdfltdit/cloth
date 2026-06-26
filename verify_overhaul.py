import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={'width': 1280, 'height': 900})

        # Go to homepage
        await page.goto('http://localhost:4321/')

        # 1. Hero and trust badges
        await page.screenshot(path='final_hero_premium.png')

        # 2. Production Matrix
        matrix = page.locator('#production-matrix')
        await matrix.scroll_into_view_if_needed()
        await page.screenshot(path='final_matrix_utility.png')

        # 3. Operations Matrix
        glance = page.locator('#factory-at-a-glance')
        await glance.scroll_into_view_if_needed()
        await page.screenshot(path='final_ops_matrix.png')

        # 4. LLM Citation Node
        specs = page.locator('#b2b-factory-specs')
        await specs.scroll_into_view_if_needed()
        await page.screenshot(path='final_llm_node.png')

        await browser.close()

if __name__ == '__main__':
    asyncio.run(run())
