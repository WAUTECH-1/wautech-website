import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { writeFile, mkdir } from 'node:fs/promises';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = [];
await mkdir('docs/screenshots', { recursive: true });
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  await context.addInitScript(() => {
    window.__metrics = { lcp: 0, cls: 0 };
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) window.__metrics.lcp = e.startTime;
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((list) => {
      for (const e of list.getEntries())
        if (!e.hadRecentInput) window.__metrics.cls += e.value;
    }).observe({ type: 'layout-shift', buffered: true });
  });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  for (const route of [
    '/',
    '/about/',
    '/services/',
    '/intelligence/',
    '/contact/',
    '/privacy/',
    '/terms/',
    '/support/',
  ]) {
    await page.goto(`http://127.0.0.1:5188${route}`, {
      waitUntil: 'networkidle',
    });
    const axe = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    );
    results.push({
      route,
      violations: axe.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.map((n) => n.target),
      })),
      overflow,
    });
    if (route === '/')
      await page.screenshot({
        path: 'docs/screenshots/home-desktop.png',
        fullPage: true,
      });
  }
  await page.goto('http://127.0.0.1:5188/contact/?intent=demo');
  await page.getByLabel('Your name', { exact: true }).fill('Review User');
  await page
    .getByLabel('Email address', { exact: true })
    .fill('review@example.com');
  await page
    .getByLabel('A little about your project')
    .fill('Please arrange a private CRM demonstration.');
  await page.getByRole('button', { name: 'Prepare enquiry' }).click();
  if (
    !(await page
      .getByLabel('Your prepared enquiry')
      .inputValue()
      .then((x) => x.includes('CRM demonstration')))
  )
    throw Error('Enquiry builder failed');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://127.0.0.1:5188/', { waitUntil: 'networkidle' });
  await page.screenshot({
    path: 'docs/screenshots/home-mobile.png',
    fullPage: true,
  });
  await page.getByRole('button', { name: 'Menu' }).click();
  await page
    .getByRole('navigation')
    .getByRole('link', { name: 'Services', exact: true })
    .click();
  if (!page.url().includes('/services/'))
    throw Error('Mobile navigation failed');
  for (const route of [
    '/',
    '/about/',
    '/services/',
    '/intelligence/',
    '/contact/',
    '/privacy/',
    '/terms/',
    '/support/',
  ]) {
    await page.goto(`http://127.0.0.1:5188${route}`, {
      waitUntil: 'networkidle',
    });
    if (
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      )
    )
      throw Error(`Mobile overflow ${route}`);
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('http://127.0.0.1:5188/');
  if (await page.locator('canvas').count())
    throw Error('Reduced motion loaded canvas');
  const nojs = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await nojs.newPage();
  await staticPage.goto('http://127.0.0.1:5188/');
  if (!(await staticPage.getByRole('heading', { level: 1 }).isVisible()))
    throw Error('No-JS content missing');
  await staticPage.setViewportSize({ width: 390, height: 844 });
  if (!(await staticPage.getByRole('navigation').isVisible()))
    throw Error('No-JS mobile navigation hidden');
  await nojs.close();
  const noGL = await browser.newContext();
  await noGL.addInitScript(() => {
    HTMLCanvasElement.prototype.getContext = () => null;
  });
  const fallback = await noGL.newPage();
  await fallback.goto('http://127.0.0.1:5188/', { waitUntil: 'networkidle' });
  if (await fallback.locator('canvas').count())
    throw Error('WebGL-disabled fallback failed');
  await noGL.close();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('http://127.0.0.1:5188/', { waitUntil: 'networkidle' });
  const performance = await page.evaluate(() => ({
    vitals: window.__metrics,
    navigation: performance
      .getEntriesByType('navigation')
      .map((e) => e.toJSON()),
    resources: performance
      .getEntriesByType('resource')
      .map((e) => ({ name: e.name, ...e.toJSON() })),
  }));
  await page.goto('http://127.0.0.1:5188/social.svg');
  await page.setViewportSize({ width: 1200, height: 630 });
  await page.screenshot({ path: 'public/social.png' });
  await writeFile(
    'docs/browser-results.json',
    JSON.stringify(
      {
        results,
        errors,
        interactions: [
          'enquiry preparation',
          'mobile navigation',
          'all mobile routes without overflow',
          'reduced motion',
          'no-JS HTML and mobile navigation',
          'WebGL disabled fallback',
        ],
        performance,
      },
      null,
      2,
    ),
  );
  if (errors.length || results.some((r) => r.violations.length || r.overflow))
    throw Error('Browser verification failed; see docs/browser-results.json');
  console.log(
    '8 routes: zero axe WCAG A/AA violations; desktop/mobile overflow checks, enquiry, navigation, reduced motion and no-JS passed.',
  );
} finally {
  await browser.close();
}
