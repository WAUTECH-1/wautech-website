# WAUTECH corporate website

Independent React / TypeScript / Vite project. No CRM dependencies, proxy, credentials or application files are used. Dedicated private repository: https://github.com/WAUTECH-1/wautech-website. The local folder is an independent Git repository on `main`, separate from the enclosing CRM checkout.

## Local preview

```powershell
cd C:\Development\wautech-frontend\wautech-website
npm ci
npm run build
npm test
npm run preview
```

Open http://127.0.0.1:5188/. Development: `npm run dev`. Build output: `dist/`. The build renders complete HTML for all eight routes plus a 404; React hydrates the existing HTML. Public text works without JavaScript or WebGL. In development the Vite template has no prerendered root: use production preview for acceptance and SEO checks.

## Implemented

Home, About, Services, Intelligence CRM, Contact, Privacy, Terms, Support/account deletion. CSS orbital illustration is always available. A separately loaded React Three Fiber sculpture adds pointer interaction on desktop, capped DPR, minimal procedural geometry and no texture downloads. Reduced-motion, narrow screens, data saver, low CPU concurrency, WebGL failure and context loss retain the static illustration. CPU count is a conservative capability heuristic, not a GPU benchmark.

The contact form validates locally and downloads an enquiry text file. It sends nothing. Add a verified contact route before public launch. Legal/support pages are explicitly unapproved placeholders; they are not mobile-store compliance deliverables yet. Service positioning requires business approval.

## Release controls

Defaults: `SITE_URL=https://wautechltd.com` (UNVERIFIED domain assumption), `PUBLIC_INDEXING=false`. These are build-time variables read by the prerender script, not frontend secrets. Set SITE_URL to the actual preview HTTPS origin after its first deployment and rebuild. After domain ownership, content and legal approval, use the verified canonical origin and set PUBLIC_INDEXING=true. Draft legal/support pages remain noindex until their release controls are intentionally changed.

Do not put secrets in VITE_* variables. No analytics, external fonts, external assets or enquiry endpoint is configured. Open Graph SVG and a generated 1200×630 PNG sharing image are provided.

See [deployment](docs/DEPLOYMENT.md), [CRM and mobile](docs/CRM-MOBILE.md) and [verification](docs/VERIFICATION.md).


