# DigitalOcean website publishing preparation

Prepared 16 October 2026. No infrastructure or DNS change is authorized by this document. Domain ownership and existing provider are unverified. Pricing and product facts below were checked against linked provider documentation; recheck at purchase time.

## Discovery

Local discovery found only `C:/Development/wautech-frontend` and `C:/Development/wautech-crm`; neither contains an independent corporate website. GitHub connector listing scoped to WAUTECH-1 returned no repositories, so remote completeness cannot be asserted. Ask the organization administrator to confirm whether an existing corporate repository is outside this connection before creating one. Existing CRM uncommitted work is preserved. This folder is deliberately outside the root npm workspace patterns and has its own package/lock/configuration.

## Exact temporary HTTPS publication procedure (human account action)

1. Review content, source and local production preview. Confirm there is no existing corporate repository to reuse. Authorize creating a dedicated `WAUTECH-1/wautech-website` GitHub repository and pushing this folder; do not push the enclosing CRM repository or its uncommitted changes. The dedicated private repository was created with user authorization on 17 October 2026; use its `main` branch for the initial import.
2. In DigitalOcean, create an App, connect GitHub, and grant the DigitalOcean GitHub app access only to the dedicated repository. Select the approved branch and `/` source directory. Import `.do/app.yaml` after replacing the repository/branch if needed. Disable automatic deployments initially.
3. Confirm the component is **Static Site**, build command `npm ci && npm run build`, output `dist`, index `index.html`, error `404.html`. Use the tested locked dependency installation; select a compatible Node 22/24 build runtime supported by DigitalOcean. Do not provision a database or backend with this website.
4. Keep PUBLIC_INDEXING=false. No domain entry is required for the first preview. Review the cost summary and explicitly authorize creation/deployment.
5. On successful deployment DigitalOcean assigns `https://<assigned-name>.ondigitalocean.app`. Record the actual URL. Update SITE_URL to that exact HTTPS origin and rebuild so preview canonical and sharing URLs match.
6. Check `/`, `/about/`, `/services/`, `/intelligence/`, `/contact/`, `/privacy/`, `/terms/`, `/support/` by direct load and refresh. Verify static directory index resolution on the actual platform. Unknown routes must return the error page with HTTP 404. No SPA catchall is configured because each route has HTML. Check that page assets return 200 and there are no hydration warnings.
7. Inspect mobile menu, keyboard focus, reduced motion, no WebGL, enquiry download and browser console. Confirm HTTPS and preview noindex. This verifies the target platform; local build success alone does not prove deployment behavior.

## Safe custom-domain procedure

1. Verify legal control of `wautechltd.com`, registrar and authoritative DNS provider with the account owner. Inspect current NS, SOA, apex A/AAAA, www CNAME/A/AAAA, MX, TXT, CAA and TTLs read-only. Export the existing zone and document current website targets. Do not assume registration, availability or ownership from this draft.
2. Confirm whether apex or www is canonical; proposed apex is not approved. Approve the production content and effective policies first. Keep all existing email MX, SPF, DKIM and DMARC records and nameservers.
3. Add the apex and www in App Platform Domains, selecting external DNS management. Copy the exact records shown by DigitalOcean. For www use its assigned CNAME target; for the apex use only provider-supported ALIAS/ANAME/CNAME flattening or exact A records prescribed by the current DigitalOcean instructions. Never guess IPs or apply a literal apex CNAME that conflicts with MX/TXT.
4. If restrictive CAA exists, coordinate the certificate issuer requirements from the current platform instructions. Do not delete CAA blindly. Lower only relevant web TTLs in advance where appropriate.
5. With explicit DNS approval, change only the required web records. Retain the DNS provider and email settings. Check propagation from multiple resolvers and verify both hostnames and certificate issuance/automatic HTTPS. Configure and test the secondary hostname's permanent redirect using the platform's currently supported domain redirect setting; merely adding a second domain does not prove redirection.
6. Set SITE_URL to the approved canonical origin, PUBLIC_INDEXING=true after release approval, and rebuild. Verify canonical, sitemap, robots and social links in served HTML. Draft policy pages remain excluded/noindex until approved and intentionally released.
7. Check email send/receive after web changes. Raise TTLs after stability. Keep the old website until acceptance. For DNS rollback restore only previously recorded web records, not the entire zone.

App Platform manages TLS for connected domains; issuance depends on correct DNS and any CAA constraints. Do not claim HTTPS readiness until browser and platform checks pass. Reference: https://docs.digitalocean.com/products/app-platform/how-to/manage-domains/

## Rollback

Record the successful deployment ID and Git SHA before each release. In App Platform Deployments choose the previous successful deployment and its rollback/redeploy action; verify the resulting active deployment and direct routes. Keep auto-deploy disabled while investigating. If the UI cannot roll back, redeploy the approved previous Git SHA through an authorized reviewed branch. Static rollback has no CRM database impact. DNS rollback is separate and subject to TTL propagation. Retain build logs and artifacts.

## Google Search Console

- Verify domain ownership first. Create a Domain property for the confirmed domain.
- Copy Google's exact verification TXT record into the existing DNS provider after approval; do not replace other TXT records.
- Confirm canonical host HTTPS, HTTP/secondary-host redirects, approved legal content, visible HTML and status codes.
- Enable indexing only at launch, check robots and page robots tags, submit `/sitemap.xml` and inspect representative URLs. Request indexing only after noindex is removed on approved pages.
- Inspect coverage and Core Web Vitals after real traffic. No Search Console token is invented or committed.

## Brevo and existing email

The corporate site currently sends no email. The CRM already supports Spring SMTP with environment variables (see CRM-MOBILE.md). Use account-provided SMTP credentials with STARTTLS, a verified sender and actual delivery tests. Brevo API keys/SMTP keys must never enter a frontend bundle.

Add only the Brevo code TXT, account-generated DKIM records and an approved single DMARC policy as shown by the account. Merge with an existing DMARC policy; do not publish competing DMARC records. Standard Brevo authentication does not require changing existing MX or adding a generic SPF include. If a separately configured branded return path or dedicated IP requires SPF, follow its account-specific instructions and merge into the existing single SPF policy within lookup limits. Never replace nameservers or mailbox MX. Validate DKIM and DMARC alignment using delivered message headers. Source: https://help.brevo.com/hc/en-us/articles/12163873383186-Authenticate-your-domain-with-Brevo-Brevo-code-DKIM-DMARC

## Monthly planning estimates (USD, before tax)

| Scope                                        |  Planning amount | Assumptions                                                                                                         |
| -------------------------------------------- | ---------------: | ------------------------------------------------------------------------------------------------------------------- |
| Corporate static site                        | $0 eligible tier | One of up to three static-only apps, within included usage; confirm account eligibility and current transfer limits |
| CRM static frontend                          |             $0–3 | Confirm allowance when combined with paid service                                                                   |
| CRM backend, one 1 GiB instance              |              $12 | Initial sizing only; Java heap/native memory must be load tested; 2 GiB may be needed                               |
| PostgreSQL managed primary                   | $15–30 allowance | Small single-node estimate, actual quote required; no HA assumed                                                    |
| Separate private staging                     | $27–45 allowance | Separate backend and isolated database; do not share production data or credentials                                 |
| Brevo                                        |  $0–25 allowance | Volume, plan and sender needs unconfirmed; obtain actual quote                                                      |
| Monitoring, offsite backups, excess transfer |  $5–25 allowance | Retention and volume dependent                                                                                      |

Website alone can start at $0 if eligible. CRM production planning envelope approximately $32–95/month, plus separate staging $27–45; these are estimates, not a purchased or validated sizing plan. Domain renewal and developer program fees are excluded. Managed database HA materially increases costs. Sources: https://docs.digitalocean.com/products/app-platform/details/pricing/ and https://docs.digitalocean.com/products/databases/postgresql/details/pricing/. Current App Platform documented entry sizes include $5/512 MiB and $12/1 GiB; the smaller tier is not assumed adequate for this Java backend.

Spec schema source: https://docs.digitalocean.com/products/app-platform/reference/app-spec/. The supplied static spec is a preparation template, not provider-validated or deployed.

