# Verification and delivery record

Date: 16 October 2026 (Asia/Karachi).

## Results actually obtained

- `npm run build`: PASS, including TypeScript noEmit, Vite browser production bundle, server renderer and 8 prerendered routes plus 404 HTML.
- `npm run lint`: PASS, zero warnings.
- `npm test`: PASS, 13 tests, zero failures/skips. Covers prerendered content/navigation/metadata, internal static route links, draft noindex, sitemap and absence of CRM administration links.
- `node scripts/browser-check.mjs`: PASS using installed headless Chrome. All 8 routes checked with axe WCAG 2 A/AA and WCAG 2.1 AA tags; zero automated violations. Desktop and mobile overflow checked. Enquiry preparation, mobile menu navigation, reduced-motion fallback, no-JavaScript content and mobile navigation, and explicit disabled-WebGL fallback passed. No browser page errors recorded. Automated accessibility checks do not replace manual assistive-technology acceptance.
- Screenshots generated and visually inspected: `docs/screenshots/home-desktop.png`, `docs/screenshots/home-mobile.png`. Sharing asset: `public/social.png` copied into dist.
- `docs/browser-results.json` records route results and browser timing/resource diagnostics. Desktop warm local navigation measured LCP 120 ms and CLS 0 in this run. This is loopback lab evidence, not representative internet/mobile performance, a Lighthouse score or field Core Web Vitals. Production CDN/4G/device testing remains a post-deployment check.

## Production asset budgets observed

| Asset | Raw | Gzip |
|---|---:|---:|
| Base application JS | 239.10 kB | 74.98 kB |
| CSS | 10.96 kB | 3.31 kB |
| Lazy desktop 3D JS | 883.58 kB | 238.42 kB |

Three.js is a substantial optional chunk, excluded on narrow/reduced-motion/data-saving/low-concurrency devices and when WebGL2 is unavailable. No external textures, models, fonts or analytics are loaded. Geometry is procedural with modest segment counts. DPR is capped at 1.5 and animation pauses outside the viewport or when the document is hidden. Device concurrency is a heuristic; actual GPU capability varies. Low-end desktop GPU profiling and field performance remain acceptance items.

## Reproduction

From this independent folder: `npm ci`, `npm run lint`, `npm run build`, `npm test`, `npm run preview`; open http://127.0.0.1:5188/. With that preview running, `node scripts/browser-check.mjs` uses installed Chrome and writes screenshots/results. If Chrome is unavailable, configure a supported installed browser or install Playwright browsers in an authorized environment. No browser download is necessary in the tested environment.

The initial sandbox could not resolve npm and blocked Vite realpath access. Dependency download and production build succeeded through authorized elevated execution. No failed attempt is reported as a passing check. Tested host: Node 26.11.1 / npm 11.20.0 on Windows. A DigitalOcean-compatible Node 22/24 runtime must also pass CI before publication; provider build has not been run.

## Launch limits

- No actual DigitalOcean deployment, app-spec provider validation, DNS inspection/change, certificate issuance, Search Console verification or real Brevo inbox test occurred.
- Remote GitHub discovery returned no repositories through the scoped connector; absence of an existing remote website is unconfirmed.
- Domain `wautechltd.com` and canonical host are assumptions, not verified ownership. Indexing is disabled by default.
- Contact enquiry is a local text preparation/download flow. There is no functioning approved company contact destination yet.
- Services, company profile, privacy, terms and support/deletion policies require approval. The support placeholder is not ready for mobile-store submission.
- No CRM tests were rerun or CRM source files changed by this task. Existing release evidence remains historical.
- Static route/status/redirect behavior must be smoke-tested on DigitalOcean; local Vite preview is not proof of CDN routing semantics.

## Git and source status

Source: `C:/Development/wautech-frontend/wautech-website` with separate package-lock.json and configuration, ready to move into its own repository. Current enclosing branch remains `codex/platform-onboarding-recovery` to preserve the existing dirty CRM checkout. On 17 October 2026, the user authorized creating the dedicated private `WAUTECH-1/wautech-website` repository and pushing the website. This folder is now an independent repository on `main`; the enclosing CRM Git repository is not part of that upload. The initial website snapshot is committed for the first push. No PR is necessary for an empty repository initial import; later changes can use feature branches and PRs. Existing CRM changes were already present and were not touched. No Brandista changes, infrastructure provisioning, database changes or secrets were introduced.

## Delivery map

A–D: source, pages/features, preview and production validation are described in README.md and this record. E: `.do/app.yaml`. F–I and K: `docs/DEPLOYMENT.md` covers temporary HTTPS publication, safe DNS, Search Console, Brevo and cost assumptions. J: `docs/CRM-MOBILE.md` covers architecture, blockers, recovery and mobile readiness. L: Git status above.



