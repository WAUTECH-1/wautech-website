# CRM and future mobile hosting specification — NOT FOR DEPLOYMENT

## Evidence inspected

- `C:/Development/wautech-frontend/docs/ONBOARDING-LOCAL-HANDOFF.md`: existing blockers, account flows, SMTP configuration and local-only verification.
- `C:/Development/wautech-crm/docs/security/authentication.md` and ADR-002: process-local servlet sessions, CSRF, no cross-origin credentialed CORS, 30-minute idle expiry.
- Backend `application.yml`: actual environment variable names, secure cookie toggle, readiness and protected metrics configuration.
- ADR-003 and authorization.md: server-validated organization membership plus organization-scoped repositories.
- No dedicated cloud deployment runbook or Dockerfile was found in the local backend file inventory. The README is historical and understates implemented features; the newer onboarding handoff is the operational reference. Historical reported test counts are not new release evidence.

## Proposed topology

Corporate public site is a separate App Platform static-only application. CRM uses another App Platform app: React static component at `/` and Java 25 Spring Boot Docker service under `/api`, PostgreSQL 17 managed Standard Edition in a compatible region. Version 17 is currently supported for new clusters: https://docs.digitalocean.com/products/databases/postgresql/details/limits/.

Use ingress path preservation: `/api` must reach the backend as `/api`, not `/`. Review `preserve_path_prefix` in the current ingress spec, then verify login and CSRF on staging. Put `/api` before the frontend catchall. CRM routes need a static SPA fallback; the corporate site's prerender rules are independent. Do not expose the backend component on a separate direct public origin. Deny unrelated routes, setup and actuator paths at ingress except reviewed minimal health probes. Readiness uses the existing `/api/health/readiness` path after checking the current controllers. Route monitoring only over reviewed authenticated access; do not publish metrics anonymously.

Build a dedicated Java 25 multi-stage Dockerfile only after selecting approved builder/runtime image tags and immutable digests. Run Maven Wrapper verification in CI, copy only the reviewed executable JAR to a non-root runtime, configure SERVER_PORT=8080, cap heap to leave native memory, and scan OS/JVM dependencies. No Dockerfile was injected into the existing backend. Java 25 availability, patch support, image provenance and App Platform container behavior require validation before release.

Use one backend instance only. Local sessions are lost on restart/redeployment; document reauthentication and validate rolling deployment behavior, which can temporarily overlap instances. Before horizontal scaling, choose Spring Session with a shared durable store or an independently reviewed authentication design and test CSRF, logout, credential-version revocation and expiry across nodes. Sticky routing alone does not solve revocation or failover.

## Environment and secrets

Set via DigitalOcean secret fields, never Git, website config or VITE_*:

- DB_URL: provider JDBC URL with TLS and CA verification (`sslmode=verify-full` and appropriate trust configuration), DB_USERNAME, DB_PASSWORD. Use a restricted application role, not database owner. Separate controlled migration credentials if supported by the existing deployment process.
- SESSION_COOKIE_SECURE=true, FRONTEND_URL=the exact CRM HTTPS origin, SERVER_PORT=8080. Verify forwarded-proxy/header trust and that generated links use HTTPS.
- BOOTSTRAP_ENABLED=false normally. First owner setup requires a separate restricted operator window and secret; close immediately afterward. Do not publicly expose administration/bootstrap as part of marketing publishing.
- RECOVERY_HMAC_KEY: independent stable high-entropy secret; controlled rotation invalidates pending grants/invitations. Do not rotate blindly.
- SMTP_HOST, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD, SMTP_AUTH=true, SMTP_STARTTLS=true, SMTP_SSL=false, SMTP_FROM, SMTP_FROM_NAME. Use exact Brevo account values and authorized sender. For implicit TLS choose the appropriate alternate combination, not both.
- MONITORING_AUTH_ENABLED=true only with correct MONITORING_ISSUER_URI, MONITORING_JWK_SET_URI and MONITORING_AUDIENCE; machine credentials must have metrics.read. Existing security keeps metrics denied if incomplete.

Browser authentication stays same-origin cookie plus CSRF. Keep HttpOnly/Secure/SameSite and existing authorization checks. Organization IDs from headers are requests for context, never proof of membership. Validate every resource access and background job by organization. Do not expose database ports publicly; restrict trusted sources to the intended app, use TLS and keep staging isolated.

## Private staging

Separate app, database, secrets, sender configuration and hostname. Place an enforced authenticated access gateway or allowlist in front of **all** staging routes, including static assets and the default ondigitalocean.app hostname; verify no bypass via component or alternate hostname. If App Platform cannot provide the required access restriction, do not publish staging until an approved gateway topology is tested. noindex is supplementary, not access control. Use synthetic test fixtures only. No production database cloning without a reviewed sanitization process.

## Backups, restore and operations

Enable the managed provider's supported automated backups/PITR; confirm exact retention and recovery bounds for the purchased plan. Define business-approved RPO/RTO before purchase. Add encrypted logical backups into a separately controlled object store if needed, with least-privilege access, retention, lifecycle and restore audit. Never put backup credentials in the app repository. Quarterly (and before migration changes), restore into an isolated PostgreSQL 17 target, validate Flyway history, row counts, tenant integrity and authentication, record elapsed restore time, then approve recovery readiness. Do not restore over production during rehearsal.

Alert on deployment failures, readiness failures, error rate, latency, saturation, database connections/storage, SMTP failures and authentication anomalies. Redact cookies, tokens, passwords, recovery codes, customer PII and raw messages from logs. Use existing correlation IDs for tracing. Agree retention/access and incident ownership. Migrations are additive and tested against a restored copy before release; application rollback does not roll back schema automatically.

## Release gates and blockers

1. Existing handoff: actual provider inbox delivery is unverified; credentials and end-to-end deliverability tests are required.
2. Existing handoff: personal owner/company/admin acceptance journey remains outstanding; backend review before cloud deployment is still recommended.
3. Existing handoff: tasks/activities expose existing lists only; multiple memberships currently select the first organization by name. Approve product limitations or resolve separately before release.
4. Cloud gates: independent current CI evidence, dependency/security review, Java 25 Docker build and image scan, same-origin ingress/cookie/CSRF tests, secure proxy handling and session behavior during rolling replacement.
5. Isolation gates: cross-tenant authorization regression, role transitions, disabled accounts, recovery and invitation replay/expiry/rate limits; no marketing links to administration.
6. Data gates: staging privacy, schema migration rehearsal, tested backup restoration and accepted RPO/RTO.
7. Operations gates: verified SMTP, monitoring authentication, alert delivery and rollback rehearsal.
8. Business gates: domain control, approved privacy/terms/support/deletion policy and authorized infrastructure budget.

No CRM deployment is permitted until these gates are evidenced and accepted. This task changes no CRM source, migrations or deployment behavior.

## Native Android / iOS readiness (design work only)

Retain current browser sessions. Native apps need a separate reviewed contract; no native token endpoint is assumed to exist. Prefer standards-based OAuth/OIDC authorization code + PKCE using the system browser, no embedded client secret, short-lived access tokens, rotating refresh tokens and replay detection. Choose an identity provider/authorization server before implementation. Bind tokens to intended issuer/audience and backend authorization; logout/recovery/credential changes must revoke the appropriate grants and devices. Biometrics unlock local credentials but are not server authentication.

Store refresh credentials in Android Keystore-backed secure storage and iOS Keychain; keep access tokens in memory where possible. Never persist credentials in logs, plaintext preferences or URLs. Require TLS, validate certificates, avoid brittle pinning unless rotation is designed, throttle login/recovery and provide device revocation. Keep organization checks server-side for every API request; a native client must not trust a local role or organization selector.

Design `/api/v1` compatibility and deprecation policy without renaming existing browser endpoints. Document OpenAPI, pagination, typed errors, correlation IDs and versioned mobile release testing. Reuse reviewed recovery concepts with one-time, expiring grants; avoid long-lived authorization in deep-link query parameters. Verify app-switch and interrupted-flow behavior.

Publish Android `/.well-known/assetlinks.json` only after package names and release signing certificate fingerprints are approved. Publish Apple `/.well-known/apple-app-site-association` only after team ID, bundle ID and paths are confirmed. Restrict association paths and validate content types, HTTPS and absence of redirect chains. No fabricated identifiers or association files are included.

Before store submission, inventory app and SDK data collection, complete Google Play Data Safety and Apple App Privacy disclosures, provide approved public privacy/support URLs and actual retention/deletion behavior. Google account-creation apps generally need an in-app deletion path and a functional external web request pathway; Apple requires in-app initiation for apps supporting account creation. This placeholder support page does not satisfy those requirements. Clarify account versus organization deletion, legal retention, timing, identity verification, backups and user confirmation; test the actual workflow before publication. Do not interfere with ongoing mobile code.

Sources checked 16 October 2026:

- https://developer.apple.com/support/offering-account-deletion-in-your-app/
- https://support.google.com/googleplay/android-developer/answer/13327111
- https://docs.digitalocean.com/products/app-platform/reference/app-spec/
