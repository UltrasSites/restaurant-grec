// Screenshot Playwright du /cashd SPA Messenger refonte
// Mock les endpoints API pour pouvoir afficher le dashboard sans backend live
import { chromium, devices } from 'file:///C:/Users/User/Desktop/Ultras-Brain/node_modules/playwright/index.mjs';
import path from 'node:path';

const OUT = process.env.OUT || 'C:/Users/User/Desktop/Ultras-Brain/00-inbox';
const URL = 'http://localhost:4321/cashd';

function mockOrders(n = 3) {
  const now = Date.now();
  const items1 = [
    { id: 'p1', name: 'Kalamaki Pork x2', price: 4.5, qty: 2 },
    { id: 'p2', name: 'Pita Souvlaki', price: 5.5, qty: 1 },
    { id: 'p3', name: 'Tzatziki', price: 2.5, qty: 1 },
  ];
  const items2 = [
    { id: 'p4', name: 'Gyros Plate', price: 12.9, qty: 1 },
    { id: 'p5', name: 'Greek Salad', price: 8.5, qty: 1 },
    { id: 'p6', name: 'Mythos Beer', price: 4.0, qty: 2 },
  ];
  const items3 = [
    { id: 'p7', name: 'Souvlaki Chicken', price: 4.5, qty: 3 },
    { id: 'p8', name: 'Patates fritas', price: 3.5, qty: 2 },
  ];
  return [
    {
      id: 'K001', name: 'Maria Papadopoulou', phone: '+306971234567',
      items: items1, total: 17.0, pickup_time: '20', lang: 'el', mode: 'takeaway', payment: 'cash',
      status: 'new', created_at: now - 120000, prep_minutes: null, delivery_minutes: null,
      accepted_at: null, eta_changed_at: null, delivery_zone: null, unread_client_messages: 0,
      notes: '', notes_translated: '', country: 'GR',
    },
    {
      id: 'K002', name: 'Nikos Stamatis', phone: '+306987654321',
      items: items2, total: 33.8, pickup_time: '30', lang: 'el', mode: 'delivery', payment: 'card',
      status: 'seen', created_at: now - 600000, prep_minutes: 25, delivery_minutes: 15,
      accepted_at: now - 300000, eta_changed_at: now - 300000, delivery_zone: null,
      address: 'Akti Themistokleous 42, Pireas', floor: '3', bell: 'Stamatis',
      notes: 'Sans oignon svp', notes_translated: 'Χωρίς κρεμμύδι παρακαλώ', country: 'GR',
      unread_client_messages: 2,
    },
    {
      id: 'K003', name: 'Eleni Vassiliou', phone: '+306944112233',
      items: items3, total: 20.5, pickup_time: '15', lang: 'el', mode: 'takeaway', payment: 'card',
      status: 'new', created_at: now - 30000, prep_minutes: null, delivery_minutes: null,
      accepted_at: null, eta_changed_at: null, delivery_zone: null, unread_client_messages: 0,
      notes: '', notes_translated: '', country: 'GR',
    },
  ];
}

function mockMessages() {
  const now = Date.now();
  return [
    { id: 1, sender: 'system', text: 'accepted:25:15', created_at: now - 300000 },
    { id: 2, sender: 'client', text: 'Καλησπερα! Ποτε φτανει η παραγγελια;', created_at: now - 200000 },
    { id: 3, sender: 'patron', text: 'Σε 20 λεπτα παρακαλω!', created_at: now - 180000 },
    { id: 4, sender: 'client', text: 'Τελεια ευχαριστω!', created_at: now - 50000 },
  ];
}

async function setup(page, viewport) {
  // Route les endpoints API
  await page.route('**/api/orders/poll**', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json',
      body: JSON.stringify({ ok: true, orders: mockOrders(), now: Date.now() }) });
  });
  await page.route('**/api/orders/history', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json',
      body: JSON.stringify({ ok: true, rows: [
        { id: 'K999', name: 'Test Closed', total: 15.5, status: 'paid', mode: 'takeaway', items_count: 2, created_at: Date.now() - 7200000 },
      ] }) });
  });
  await page.route('**/api/orders/messages-summary**', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json',
      body: JSON.stringify({ ok: true, conversations: [
        { id: 'K002', name: 'Nikos Stamatis', last_at: Date.now() - 50000, last_sender: 'client', last_message: 'Τελεια ευχαριστω!', unread_client: 1, status: 'seen', mode: 'delivery', total: 33.8 },
      ] }) });
  });
  await page.route('**/api/orders/*/messages', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json',
      body: JSON.stringify({ ok: true, messages: mockMessages(), unread_client: 1, total_client: 2, total_patron: 1, now: Date.now() }) });
  });
  await page.route('**/api/orders/*/public**', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json',
      body: JSON.stringify({ ok: true, messages: mockMessages() }) });
  });
}

(async () => {
  const browser = await chromium.launch();

  // === DESKTOP 1440x900 ===
  let ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  let page = await ctx.newPage();
  await setup(page);
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 20000 });
  // Bypass login : on attend que JS load, puis on simule directement le show du dashboard
  await page.evaluate(() => {
    const login = document.getElementById('login-screen');
    const dash = document.getElementById('dashboard');
    if (login) login.style.display = 'none';
    if (dash) dash.classList.add('show');
  });
  // Wait pour le polling
  await page.waitForTimeout(2500);
  // Ouvrir un onglet chat flottant (K002)
  await page.evaluate(() => {
    if (window.openFloatingChat) window.openFloatingChat('K002');
  }).catch(() => {});
  // L'API openFloatingChat est dans une IIFE, accédons-y via click bouton
  // Plus simple : simuler click sur le bouton message-chat de K002
  await page.evaluate(() => {
    const btn = document.querySelector('button[data-action="toggle-chat"][data-id="K002"]');
    if (btn) btn.click();
  });
  await page.waitForTimeout(1800);
  await page.screenshot({ path: path.join(OUT, 'cashd-spa-desktop.png'), fullPage: false });
  console.log('Desktop screenshot saved');
  await ctx.close();

  // === MOBILE 375x812 (iPhone X-like) ===
  ctx = await browser.newContext({ ...devices['iPhone X'] });
  page = await ctx.newPage();
  await setup(page);
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.evaluate(() => {
    const login = document.getElementById('login-screen');
    const dash = document.getElementById('dashboard');
    if (login) login.style.display = 'none';
    if (dash) dash.classList.add('show');
  });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: path.join(OUT, 'cashd-spa-mobile.png'), fullPage: false });
  console.log('Mobile screenshot saved');
  await ctx.close();

  await browser.close();
  console.log('Done.');
})().catch((e) => { console.error(e); process.exit(1); });
