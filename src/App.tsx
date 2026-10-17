import {
  Component,
  lazy,
  Suspense,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { pages, services, pageFor } from './content';
const Scene = lazy(() => import('./Scene'));
class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
function Artwork() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const mobile = matchMedia('(max-width: 760px)');
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    const update = () => {
      let supported = false;
      try {
        const c = document.createElement('canvas');
        supported = !!c.getContext('webgl2');
      } catch {
        /* static illustration remains */
      }
      setEnabled(
        supported &&
          !motion.matches &&
          !mobile.matches &&
          !connection?.saveData &&
          (navigator.hardwareConcurrency || 2) >= 4,
      );
    };
    update();
    motion.addEventListener('change', update);
    mobile.addEventListener('change', update);
    return () => {
      motion.removeEventListener('change', update);
      mobile.removeEventListener('change', update);
    };
  }, []);
  return (
    <div className="artwork" aria-hidden="true">
      <div className="orbital orbital-one" />
      <div className="orbital orbital-two" />
      <div className="orbital orbital-three" />
      <div className="orb-core" />
      {enabled && (
        <SceneBoundary>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </SceneBoundary>
      )}
      <span className="coordinate">CONNECTED BY DESIGN</span>
      <span className="coordinate bottom">WAU / DIGITAL SYSTEMS</span>
    </div>
  );
}
function Arrow() {
  return <span aria-hidden="true">↗</span>;
}
function ServiceList() {
  return (
    <div className="services-list">
      {services.map(([n, name, copy]) => (
        <article key={n}>
          <span className="number">{n}</span>
          <h3>{name}</h3>
          <p>{copy}</p>
          <a
            href="/contact/?intent=consultation"
            aria-label={`Discuss ${name}`}
          >
            <Arrow />
          </a>
        </article>
      ))}
    </div>
  );
}
function Product() {
  return (
    <section className="product-section">
      <div>
        <p className="eyebrow">MEET WAUTECH INTELLIGENCE</p>
        <h2>
          Less scattered.
          <br />
          More connected.
        </h2>
        <p>
          A dedicated CRM bringing organizations, customer relationships and
          everyday work into a shared perspective.
        </p>
        <a className="text-link" href="/intelligence/">
          Explore the platform <Arrow />
        </a>
      </div>
      <div
        className="product-visual"
        aria-label="Conceptual CRM structure, not a live demonstration"
      >
        <div className="concept-label">
          <span className="status-dot" /> PRODUCT ARCHITECTURE / CONCEPT
        </div>
        <div className="concept-center">
          w<span>INTELLIGENCE</span>
        </div>
        <div className="concept-row">
          <span>Relationships</span>
          <span>Organizations</span>
          <span>Workflows</span>
        </div>
        <p>One connected perspective.</p>
      </div>
    </section>
  );
}
function Contact() {
  const [prepared, setPrepared] = useState('');
  return (
    <div className="contact-grid">
      <div>
        <h2>
          A good conversation
          <br />
          is a good beginning.
        </h2>
        <p>
          Tell us what you have in mind. Use this local enquiry builder to
          prepare a brief for the WAUTECH team.
        </p>
        <div className="notice">
          Contact channel awaiting company approval. This form prepares text on
          your device; it does not send or store your enquiry.
        </div>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const d = new FormData(e.currentTarget);
          setPrepared(
            `Enquiry: ${d.get('interest')}\nName: ${d.get('name')}\nEmail: ${d.get('email')}\n\n${d.get('message')}`,
          );
        }}
      >
        <label>
          Your name
          <input name="name" required maxLength={120} autoComplete="name" />
        </label>
        <label>
          Email address
          <input
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
          />
        </label>
        <label>
          I’d like to discuss
          <select
            name="interest"
            defaultValue={
              typeof window !== 'undefined' &&
              new URLSearchParams(window.location.search).get('intent') ===
                'demo'
                ? 'CRM demonstration'
                : 'Consultation'
            }
          >
            <option>Consultation</option>
            <option>CRM demonstration</option>
            <option>Support or account deletion</option>
          </select>
        </label>
        <label>
          A little about your project
          <textarea name="message" rows={4} required maxLength={4000} />
        </label>
        <button className="button primary" type="submit">
          Prepare enquiry <Arrow />
        </button>
        <p className="form-note">
          Please don’t include passwords or sensitive customer information.
        </p>
        {prepared && (
          <div role="status">
            <label>
              Your prepared enquiry
              <textarea readOnly rows={7} value={prepared} />
            </label>
            <button
              className="text-link"
              type="button"
              onClick={() => {
                const url = URL.createObjectURL(
                  new Blob([prepared], { type: 'text/plain' }),
                );
                const a = document.createElement('a');
                a.href = url;
                a.download = 'wautech-enquiry.txt';
                a.click();
                setTimeout(() => URL.revokeObjectURL(url), 1000);
              }}
            >
              Download enquiry ↓
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
function Policy({ kind }: { kind: string }) {
  return (
    <section className="policy">
      <div className="notice">
        DRAFT — COMPANY AND LEGAL APPROVAL REQUIRED. This page is a preparation
        placeholder, not an approved policy.
      </div>
      {kind === 'support' ? (
        <>
          <h2>Support & account deletion</h2>
          <p>
            Approved support address and request channel: [company to provide].
            Do not send identity documents or credentials through this preview.
          </p>
          <h3>Future mobile account deletion</h3>
          <p>
            A verified request process, identity checks, deletion scope,
            retention exceptions and response timeframe must be approved before
            mobile publication. Account deletion is not currently offered
            through this website.
          </p>
          <p>
            Organization records may require separate authority and retention
            review. A future request must explain what is deleted, retained and
            why.
          </p>
        </>
      ) : (
        <>
          <h2>
            {kind === 'privacy' ? 'Privacy Policy' : 'Terms and Conditions'}
          </h2>
          <p>
            Legal entity details, jurisdiction, registered address and effective
            date: [company to approve].
          </p>
          {(kind === 'privacy'
            ? [
                'Data collected and purposes',
                'Lawful basis and retention',
                'Processors and international transfers',
                'Your rights and privacy contact',
                'Cookies and analytics',
              ]
            : [
                'Scope of services and contracting',
                'Intellectual property and permitted use',
                'Fees and service commitments',
                'Liability and dispute resolution',
                'Termination and contact',
              ]
          ).map((title) => (
            <div key={title}>
              <h3>{title}</h3>
              <p>[Approved wording required before publication.]</p>
            </div>
          ))}
          <p>
            This preview includes no analytics, advertising trackers or
            server-side enquiry collection. Hosting providers may process
            request logs; the final policy must reflect the deployed
            environment.
          </p>
        </>
      )}
    </section>
  );
}
export function App({ path = '/' }: { path?: string }) {
  const [menu, setMenu] = useState(false);
  const page = pageFor(path);
  const home = path === '/';
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header className="header">
        <a href="/" className="brand" aria-label="WAUTECH home">
          <img src="/mark.svg" width="35" height="35" alt="" />
          WAUTECH<span className="brand-ltd">LTD</span>
        </a>
        <button
          className="menu-toggle"
          aria-expanded={menu}
          aria-controls="navigation"
          onClick={() => setMenu(!menu)}
        >
          Menu {menu ? '−' : '+'}
        </button>
        <nav
          id="navigation"
          className={menu ? 'open' : ''}
          aria-label="Main navigation"
        >
          {[
            ['/about/', 'About'],
            ['/services/', 'Services'],
            ['/intelligence/', 'Intelligence CRM'],
          ].map(([href, label]) => (
            <a
              href={href}
              key={href}
              aria-current={href === path ? 'page' : undefined}
            >
              {label}
            </a>
          ))}
          <a className="nav-contact" href="/contact/">
            Let’s talk <Arrow />
          </a>
        </nav>
      </header>
      <main id="main">
        {!page ? (
          <section className="page-hero">
            <p className="eyebrow">404 / PAGE NOT FOUND</p>
            <h1>
              A different
              <br />
              direction.
            </h1>
            <a className="button primary" href="/">
              Back to home <Arrow />
            </a>
          </section>
        ) : home ? (
          <>
            <section className="hero">
              <div className="hero-copy">
                <p className="eyebrow">
                  <span className="status-dot" /> ENGINEERING WHAT’S NEXT
                </p>
                <h1>
                  Complex ideas.
                  <br />
                  <span>Intelligent</span>
                  <br />
                  possibilities.
                </h1>
                <p className="lead">
                  Thoughtful software. Connected experiences.
                  <br />
                  Technology built around your ambition.
                </p>
                <div className="actions">
                  <a
                    className="button primary"
                    href="/contact/?intent=consultation"
                  >
                    Start a conversation <Arrow />
                  </a>
                  <a className="button secondary" href="/contact/?intent=demo">
                    Request a CRM demo <Arrow />
                  </a>
                </div>
              </div>
              <Artwork />
              <div className="hero-foot">
                <span>SOFTWARE · CLOUD · MOBILE</span>
                <a href="#expertise">SCROLL TO EXPLORE ↓</a>
              </div>
            </section>
            <section className="intro">
              <p className="eyebrow">IDEAS INTO POSSIBILITY</p>
              <h2>
                Great technology starts
                <br />
                with a better question.
              </h2>
              <p>
                What could your business become with the right digital
                foundation? At WAUTECH, that question shapes how we think about
                software, platforms and connected experiences.
              </p>
              <a className="text-link" href="/about/">
                Our perspective <Arrow />
              </a>
            </section>
            <section id="expertise">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">OUR FOCUS</p>
                  <h2>
                    Built for your
                    <br />
                    next chapter.
                  </h2>
                </div>
                <p>
                  From the systems behind your business
                  <br />
                  to the experiences in your customers’ hands.
                </p>
              </div>
              <ServiceList />
              <p className="approval-note">
                Proposed service portfolio · subject to company approval.
              </p>
            </section>
            <Product />
          </>
        ) : (
          <>
            <section className="page-hero">
              <p className="eyebrow">
                WAUTECH / {path.split('/')[1].toUpperCase()}
              </p>
              <h1>{page.title}</h1>
              <p className="lead">{page.description}</p>
            </section>
            {path === '/about/' ? (
              <section className="about-content">
                <p className="eyebrow">OUR PERSPECTIVE</p>
                <h2>
                  Consider the whole.
                  <br />
                  Care about the details.
                </h2>
                <p>
                  WAUTECH LTD is preparing a connected software offering across
                  web, cloud and native mobile. Our focus is on purposeful
                  experiences and maintainable foundations.
                </p>
                <div className="principles">
                  {[
                    'Understand before building.',
                    'Make complexity feel simple.',
                    'Design for what comes next.',
                  ].map((x, i) => (
                    <article key={x}>
                      <span className="number">0{i + 1}</span>
                      <h3>{x}</h3>
                    </article>
                  ))}
                </div>
                <div className="notice">
                  Company profile, leadership, business registration details and
                  locations are awaiting approved content.
                </div>
              </section>
            ) : path === '/services/' ? (
              <section>
                <ServiceList />
                <div className="notice">
                  These service descriptions are proposed positioning, subject
                  to company approval. Project scope and availability must be
                  agreed directly.
                </div>
              </section>
            ) : path === '/intelligence/' ? (
              <>
                <Product />
                <section className="about-content">
                  <p className="eyebrow">A DEDICATED PRODUCT</p>
                  <h2>Built around organizations.</h2>
                  <p>
                    WAUTECH Intelligence CRM connects organization access,
                    customer records and day-to-day work. The existing platform
                    uses a React frontend, a Java Spring Boot backend and
                    PostgreSQL.
                  </p>
                  <p>
                    Native Android and iOS applications are planned.
                    Availability, pricing and release dates are awaiting company
                    approval.
                  </p>
                  <a className="button primary" href="/contact/?intent=demo">
                    Request a CRM demonstration <Arrow />
                  </a>
                  <p className="form-note">
                    Demonstrations are arranged privately. No live CRM data is
                    shown here.
                  </p>
                </section>
              </>
            ) : path === '/contact/' ? (
              <section>
                <Contact />
              </section>
            ) : (
              <Policy kind={path.split('/')[1]} />
            )}
          </>
        )}
        {page && path !== '/contact/' && (
          <section className="closing">
            <p className="eyebrow">THE NEXT CHAPTER STARTS HERE</p>
            <h2>
              What are you
              <br />
              <span>imagining?</span>
            </h2>
            <a href="/contact/?intent=consultation" className="button primary">
              Let’s explore it <Arrow />
            </a>
          </section>
        )}
      </main>
      <footer>
        <div className="footer-top">
          <a href="/" className="brand">
            WAUTECH<span className="brand-ltd">LTD</span>
          </a>
          <p>
            Thoughtfully engineered.
            <br />
            Built for possibility.
          </p>
          <div>
            {pages
              .filter((p) => p.path !== '/')
              .map((p) => (
                <a href={p.path} key={p.path}>
                  {
                    (
                      {
                        '/about/': 'About',
                        '/services/': 'Services',
                        '/intelligence/': 'Intelligence CRM',
                        '/contact/': 'Contact',
                        '/privacy/': 'Privacy',
                        '/terms/': 'Terms',
                        '/support/': 'Support & account deletion',
                      } as Record<string, string>
                    )[p.path]
                  }
                </a>
              ))}
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getUTCFullYear()} WAUTECH LTD</span>
          <span>COMPANY PREVIEW · CONTENT AWAITING APPROVAL</span>
          <a href="#main">BACK TO TOP ↑</a>
        </div>
      </footer>
    </>
  );
}
