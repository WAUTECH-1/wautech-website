import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
const routes = [
  '',
  'about',
  'services',
  'intelligence',
  'contact',
  'privacy',
  'terms',
  'support',
];
for (const route of routes)
  test(`prerendered ${route || 'home'} is meaningful without JS`, async () => {
    const html = await readFile(
      `dist/${route ? route + '/' : ''}index.html`,
      'utf8',
    );
    assert.match(html, /<h1>/);
    assert.match(html, /<nav/);
    assert.match(html, /Skip to content/);
    assert.match(html, /<link rel="canonical"/);
    assert.match(html, /<meta property="og:title"/);
    assert.doesNotMatch(html, /<!--app-->/);
    assert.equal((html.match(/<h1>/g) || []).length, 1);
  });
test('preview indexing is disabled', async () => {
  if (process.env.PUBLIC_INDEXING === 'true') return;
  assert.match(await readFile('dist/robots.txt', 'utf8'), /Disallow: \//);
});
test('legal placeholders are explicitly marked and noindexed', async () => {
  for (const route of ['privacy', 'terms', 'support']) {
    const html = await readFile(`dist/${route}/index.html`, 'utf8');
    assert.match(html, /APPROVAL REQUIRED/);
    assert.match(html, /noindex, nofollow/);
  }
});
test('CRM showcase never links to private administration', async () => {
  const html = await readFile('dist/intelligence/index.html', 'utf8');
  assert.doesNotMatch(
    html,
    /href="[^"]*(localhost|127\.0\.0\.1|\/platform|\/login)/,
  );
  assert.match(html, /No live CRM data/);
});
test('all internal page links have static targets', async () => {
  for (const route of routes) {
    const html = await readFile(
      `dist/${route ? route + '/' : ''}index.html`,
      'utf8',
    );
    for (const match of html.matchAll(/href="(\/[^"?#]*)(?:[?#][^"]*)?"/g)) {
      const path = match[1];
      if (path.includes('.')) continue;
      await stat(`dist${path}index.html`);
    }
  }
});
test('sitemap is well formed and contains marketing routes only', async () => {
  const xml = await readFile('dist/sitemap.xml', 'utf8');
  assert.match(xml, /<urlset/);
  assert.equal((xml.match(/<loc>/g) || []).length, 5);
  assert.doesNotMatch(xml, /\/privacy\//);
});
