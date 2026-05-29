#!/usr/bin/env node
/**
 * IndexNow protocol submitter — notifies Bing/Yandex/Seznam of fresh URLs.
 *
 * Usage:
 *   node scripts/submit-indexnow.mjs
 */

const HOST = 'kalamakitroubas.gr';
const KEY = '3d9a60c1c513043e7918985f073bb476';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP_URL = `https://${HOST}/sitemap.xml`;
const SITEMAP_INDEX = `https://${HOST}/sitemap-index.xml`;

async function fetchText(url) {
  const r = await fetch(url, { headers: { 'User-Agent': 'UltrasIndexNow/1.0' }, redirect: 'follow' });
  if (!r.ok) throw new Error(`GET ${url} -> ${r.status}`);
  return r.text();
}

function extractLocs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim());
}

async function collectUrls() {
  // Prefer the plain sitemap; some hosts serve a 200 HTML 404 for missing files.
  let xml;
  try {
    xml = await fetchText(SITEMAP_URL);
    if (!xml.trimStart().startsWith('<?xml') && !xml.trimStart().startsWith('<urlset') && !xml.trimStart().startsWith('<sitemapindex')) {
      throw new Error('not XML');
    }
  } catch {
    xml = await fetchText(SITEMAP_INDEX);
  }
  const locs = extractLocs(xml);
  if (xml.includes('<sitemapindex')) {
    const all = new Set();
    for (const sm of locs) {
      try {
        const sub = await fetchText(sm);
        for (const loc of extractLocs(sub)) all.add(loc);
      } catch (e) {
        console.warn(`! Skipped ${sm}: ${e.message}`);
      }
    }
    return [...all].filter(u => u.startsWith(`https://${HOST}/`));
  }
  return locs.filter(u => u.startsWith(`https://${HOST}/`));
}

async function submitChunk(urlList) {
  const r = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList,
    }),
  });
  const text = await r.text().catch(() => '');
  return { status: r.status, body: text };
}

(async () => {
  console.log(`[IndexNow] ${HOST}`);
  const urls = await collectUrls();
  console.log(`[IndexNow] collected ${urls.length} URLs from sitemap`);
  if (!urls.length) { console.error('No URLs, abort.'); process.exit(1); }
  const CHUNK = 500;
  let ok = 0, ko = 0;
  for (let i = 0; i < urls.length; i += CHUNK) {
    const chunk = urls.slice(i, i + CHUNK);
    const { status, body } = await submitChunk(chunk);
    console.log(`[IndexNow] chunk ${i / CHUNK + 1}: HTTP ${status} ${body.slice(0, 200)}`);
    if (status >= 200 && status < 300) ok += chunk.length; else ko += chunk.length;
  }
  console.log(`[IndexNow] done. submitted=${ok} failed=${ko}`);
  if (ko) process.exit(2);
})();
