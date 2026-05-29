// Test scroll-lock du menu mobile drawer
// Usage: node scripts/test-menu-scroll-lock.mjs [url]
// Default url = http://localhost:4321/el/

import { chromium, devices } from 'playwright';
import fs from 'fs';
import path from 'path';

const URL = process.argv[2] || 'http://localhost:4321/el/';
const OUT_DIR = path.resolve('audits/kalamaki-menu-fix-2026-05-26');
fs.mkdirSync(OUT_DIR, { recursive: true });

const results = [];
function log(msg, ok) {
    const prefix = ok === true ? '[PASS]' : ok === false ? '[FAIL]' : '[INFO]';
    const line = `${prefix} ${msg}`;
    console.log(line);
    results.push({ ok, msg });
}

(async () => {
    const browser = await chromium.launch({ headless: true });
    const ctx = await browser.newContext({
        ...devices['iPhone 13'],
        locale: 'el-GR',
    });
    const page = await ctx.newPage();

    log(`Loading ${URL}`);
    await page.goto(URL, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1200);

    // Scroll page down so we have a known scroll position to verify restoration
    await page.evaluate(() => window.scrollTo(0, 600));
    await page.waitForTimeout(300);
    const scrollBefore = await page.evaluate(() => window.scrollY);
    log(`Initial scrollY before open: ${scrollBefore}`, scrollBefore > 0);

    await page.screenshot({ path: path.join(OUT_DIR, '01-page-scrolled-before-open.png'), fullPage: false });

    // Open the drawer
    const openBtn = page.locator('#mobile-open-drawer-btn');
    await openBtn.waitFor({ state: 'visible', timeout: 5000 });
    await openBtn.click();
    await page.waitForTimeout(800);

    const bodyHasLockClass = await page.evaluate(() => document.body.classList.contains('drawer-open'));
    log(`body.classList contains 'drawer-open': ${bodyHasLockClass}`, bodyHasLockClass === true);

    const bodyPosition = await page.evaluate(() => getComputedStyle(document.body).position);
    log(`body computed position after open: ${bodyPosition}`, bodyPosition === 'fixed');

    const bodyTop = await page.evaluate(() => document.body.style.top);
    log(`body inline top: ${bodyTop} (should be -${scrollBefore}px)`, bodyTop === `-${scrollBefore}px`);

    const drawerAriaHidden = await page.evaluate(() => document.getElementById('menu-panel')?.getAttribute('aria-hidden'));
    log(`drawer aria-hidden after open: ${drawerAriaHidden}`, drawerAriaHidden === 'false');

    await page.screenshot({ path: path.join(OUT_DIR, '02-drawer-open.png'), fullPage: false });

    // Attempt to scroll the page (touch swipe simulation via mouse wheel + touch events)
    // Try wheel on backdrop (top-left zone, outside drawer)
    await page.mouse.move(50, 100);
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(400);
    const scrollAfterWheel = await page.evaluate(() => window.scrollY);
    // When body is position:fixed, window.scrollY should remain 0 (because the layout root is offset)
    log(`window.scrollY after wheel attempt on backdrop: ${scrollAfterWheel} (expect ~0 when body fixed)`, scrollAfterWheel === 0);

    // Try touch swipe on backdrop area
    try {
        await page.touchscreen.tap(30, 100);
    } catch (e) {}

    // Simulate swipe-down on drawer (top of drawer area, swipe downward)
    const drawerBox = await page.locator('#menu-panel').boundingBox();
    if (drawerBox) {
        const startX = drawerBox.x + drawerBox.width / 2;
        const startY = drawerBox.y + 30; // near top of drawer (handle area)
        // We can't easily simulate a real touch swipe — but we dispatch touchstart/touchend events
        await page.evaluate(({ x, y, dy }) => {
            const drawer = document.getElementById('menu-panel');
            if (!drawer) return;
            const t1 = new Touch({ identifier: 1, target: drawer, clientX: x, clientY: y, screenX: x, screenY: y });
            const t2 = new Touch({ identifier: 1, target: drawer, clientX: x, clientY: y + dy, screenX: x, screenY: y + dy });
            drawer.dispatchEvent(new TouchEvent('touchstart', { touches: [t1], changedTouches: [t1], bubbles: true, cancelable: true }));
            drawer.dispatchEvent(new TouchEvent('touchend', { touches: [], changedTouches: [t2], bubbles: true, cancelable: true }));
        }, { x: startX, y: startY, dy: 120 });
        await page.waitForTimeout(900);

        const drawerOpenAfterSwipe = await page.evaluate(() => document.getElementById('menu-panel')?.classList.contains('open'));
        log(`drawer.classList.contains('open') after swipe-down: ${drawerOpenAfterSwipe} (expect false — closed by swipe)`, drawerOpenAfterSwipe === false);

        await page.waitForTimeout(300);
        const scrollAfterSwipe = await page.evaluate(() => window.scrollY);
        log(`scrollY after swipe-close: ${scrollAfterSwipe} (expect ${scrollBefore} — restored)`, scrollAfterSwipe === scrollBefore);

        await page.screenshot({ path: path.join(OUT_DIR, '03-after-swipe-close-scroll-restored.png'), fullPage: false });
    }

    // Re-open and test backdrop click close
    await openBtn.click();
    await page.waitForTimeout(700);
    const backdrop = page.locator('#menu-overlay');
    await backdrop.click({ position: { x: 30, y: 80 }, force: true });
    await page.waitForTimeout(700);
    const drawerOpenAfterBackdrop = await page.evaluate(() => document.getElementById('menu-panel')?.classList.contains('open'));
    log(`drawer closed via backdrop click: ${!drawerOpenAfterBackdrop}`, drawerOpenAfterBackdrop === false);
    const scrollAfterBackdrop = await page.evaluate(() => window.scrollY);
    log(`scrollY after backdrop close: ${scrollAfterBackdrop} (expect ${scrollBefore})`, scrollAfterBackdrop === scrollBefore);

    // Re-open and test X button close
    await openBtn.click();
    await page.waitForTimeout(700);
    await page.locator('#drawer-close-btn').click();
    await page.waitForTimeout(700);
    const drawerOpenAfterX = await page.evaluate(() => document.getElementById('menu-panel')?.classList.contains('open'));
    log(`drawer closed via X button: ${!drawerOpenAfterX}`, drawerOpenAfterX === false);
    const scrollAfterX = await page.evaluate(() => window.scrollY);
    log(`scrollY after X close: ${scrollAfterX} (expect ${scrollBefore})`, scrollAfterX === scrollBefore);

    // Re-open and test Escape key close
    await openBtn.click();
    await page.waitForTimeout(700);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(700);
    const drawerOpenAfterEsc = await page.evaluate(() => document.getElementById('menu-panel')?.classList.contains('open'));
    log(`drawer closed via Escape: ${!drawerOpenAfterEsc}`, drawerOpenAfterEsc === false);
    const scrollAfterEsc = await page.evaluate(() => window.scrollY);
    log(`scrollY after Escape close: ${scrollAfterEsc} (expect ${scrollBefore})`, scrollAfterEsc === scrollBefore);

    await page.screenshot({ path: path.join(OUT_DIR, '04-final-state.png'), fullPage: false });

    await browser.close();

    const passed = results.filter(r => r.ok === true).length;
    const failed = results.filter(r => r.ok === false).length;
    console.log(`\nTOTAL: ${passed} PASS / ${failed} FAIL`);
    fs.writeFileSync(path.join(OUT_DIR, 'test-results.json'), JSON.stringify({ url: URL, results, passed, failed }, null, 2));
    process.exit(failed > 0 ? 1 : 0);
})();
