import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { render, pages } from '../.ssr/prerender.js';
const origin = process.env.SITE_URL || 'https://wautechltd.com';
if (new URL(origin).protocol !== 'https:')
  throw Error('SITE_URL must use HTTPS');
const approved = process.env.PUBLIC_INDEXING === 'true';
const template = await readFile('dist/index.html', 'utf8');
for (const page of [
  ...pages,
  { path: '/404/', title: 'Page not found', description: 'Return to WAUTECH.' },
]) {
  const noindex =
    !approved ||
    ['/privacy/', '/terms/', '/support/', '/404/'].includes(page.path);
  const meta = `<title>${page.title} | WAUTECH LTD</title><meta name="description" content="${page.description}"><meta name="robots" content="${noindex ? 'noindex, nofollow' : 'index, follow'}"><link rel="canonical" href="${origin}${page.path}"><meta property="og:title" content="${page.title} | WAUTECH LTD"><meta property="og:description" content="${page.description}"><meta property="og:type" content="website"><meta property="og:url" content="${origin}${page.path}"><meta property="og:image" content="${origin}/social.png"><meta name="twitter:card" content="summary_large_image">`;
  const html = template
    .replace('<!--meta-->', meta)
    .replace('<!--app-->', render(page.path));
  const dir = page.path === '/' ? 'dist' : `dist${page.path}`;
  await mkdir(dir, { recursive: true });
  await writeFile(`${dir}/index.html`, html);
  if (page.path === '/404/') await writeFile('dist/404.html', html);
}
await writeFile(
  'dist/robots.txt',
  `User-agent: *\n${approved ? 'Allow: /' : 'Disallow: /'}\nSitemap: ${origin}/sitemap.xml\n`,
);
await writeFile(
  'dist/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages
    .filter((p) => !['/privacy/', '/terms/', '/support/'].includes(p.path))
    .map((p) => `<url><loc>${origin}${p.path}</loc></url>`)
    .join('')}</urlset>`,
);
console.log(
  `Prerendered ${pages.length} pages + 404; indexing ${approved ? 'enabled for approved marketing pages' : 'disabled (preview)'}.`,
);
