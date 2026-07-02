import { useEffect, useState } from 'react';

/**
 * PowerShell Agent Landing Page
 * Design: Organic Intelligence - Biomimetic Modernism
 * 
 * Key Design Elements:
 * - Curved SVG dividers for organic flow
 * - Warm gold + slate blue color palette
 * - Layered depth with shadows and gradients
 * - Smooth animations on scroll
 * - Asymmetric layout with staggered content
 */

import '../styles/wacore.css';

export default function WACoreLanding() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="wa-core-theme min-h-screen">
      {/* ========== HEADER ========== */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="container-custom">
          <div className="flex items-center justify-between py-4">
            <div className="text-2xl font-bold text-accent-primary">
              WA-Core
            </div>
            <nav className="hidden md:flex gap-8">
              <a href="#pillars" className="text-sm font-medium hover:text-accent-primary transition">
                Features
              </a>
              <a href="#benefits" className="text-sm font-medium hover:text-accent-primary transition">
                Benefits
              </a>
              <a href="#contact" className="text-sm font-medium hover:text-accent-primary transition">
                Contact
              </a>
            </nav>
            <a href="/downloads/wa-core-bootstrap-installer.ps1" download="wa-core-bootstrap-installer.ps1" className="btn btn-primary text-sm flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Ladda ner Agent (.ps1)
            </a>
          </div>
        </div>
      </header>

      {/* ========== HERO SECTION ========== */}
      <section className="hero pt-24">
        <div className="hero-content">
          <h1 className="fade-in-up">
            The Ultimate <span className="gradient-text">PowerShell Agent</span>
          </h1>
          <p className="subtitle fade-in-up">
            Your local nerve center. Autonomous. Intelligent. Always working.
          </p>
          <p className="text-lg text-muted fade-in-up max-w-2xl mx-auto">
            WA-Core is not just a CLI tool—it's an autonomous, event-driven background process that orchestrates your code, infrastructure, communication, and business logic in real-time.
          </p>
          <div className="hero-cta">
            <a href="/downloads/wa-core-bootstrap-installer.ps1" download="wa-core-bootstrap-installer.ps1" className="btn btn-primary flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Ladda ner WA-Core Installer
            </a>
            <a href="#pillars" className="btn btn-outline">
              View Documentation
            </a>
          </div>
        </div>
      </section>

      {/* ========== SVG DIVIDER 1 ========== */}
      <svg className="divider" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M0,50 Q300,0 600,50 T1200,50 L1200,120 L0,120 Z" fill="#F8F7F4" />
      </svg>

      {/* ========== PILLARS SECTION ========== */}
      <section id="pillars" className="pillar-section section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="fade-in-up">Three Dimensions of Autonomy</h2>
            <p className="text-lg text-muted max-w-2xl mx-auto fade-in-up">
              WA-Core operates on three integrated levels to transform your Windows environment into a self-healing, intelligent execution engine.
            </p>
          </div>

          {/* ========== PILLAR 1: CODE & INFRASTRUCTURE ORCHESTRATION ========== */}
          <div className="pillar-content mb-24">
            <div className="pillar-text slide-in-left">
              <h3 className="text-accent-primary">
                <span className="accent-underline">Code & Infrastructure Orchestration</span>
              </h3>
              <p>
                WA-Core monitors your local development environment in real-time, acting as the missing link between your code and your ecosystem of agents.
              </p>
              <ul className="pillar-features">
                <li>
                  <strong>Dynamic Graph Syncing:</strong> Automatically parse dependencies and update your Neo4j database when you write new code or update components.
                </li>
                <li>
                  <strong>Self-Healing Environments:</strong> When containers crash, WA-Core reads error logs, infers root causes, adjusts configuration, and restarts services automatically.
                </li>
                <li>
                  <strong>Refactoring on the Fly:</strong> Write pseudocode comments with goals—WA-Core executes the logic and builds out actual code according to your design patterns.
                </li>
                <li>
                  <strong>Real-Time Documentation:</strong> System documentation and agent context update automatically as your infrastructure evolves.
                </li>
              </ul>
            </div>
            <div className="pillar-image slide-in-right">
              <div className="text-center">
                <div className="text-5xl mb-4">⚙️</div>
                <p>Code & Infrastructure Flow</p>
              </div>
            </div>
          </div>

          {/* ========== PILLAR 2: COMMUNICATION & DATA-AS-A-SHIELD ========== */}
          <div className="pillar-content reversed mb-24">
            <div className="pillar-text slide-in-right">
              <h3 className="text-accent-primary">
                <span className="accent-underline">Communication & Data-as-a-Shield</span>
              </h3>
              <p>
                Instead of context-switching to your inbox, WA-Core integrates external communication directly into your terminal flow, protected by rigorous privacy filters.
              </p>
              <ul className="pillar-features">
                <li>
                  <strong>Asynchronous Triage:</strong> Reads incoming mail and messages, analyzes sender history, and filters out noise before it reaches you.
                </li>
                <li>
                  <strong>Armed Draft Responses:</strong> For critical business emails, WA-Core fetches relevant data and prepares draft responses backed by facts, not guesses.
                </li>
                <li>
                  <strong>Voice-to-CLI:</strong> Transcribe verbal instructions ("Build a new module for material traceability") into executable PowerShell commands.
                </li>
                <li>
                  <strong>Privacy-First Integration:</strong> Exchange Web Services and Graph API integration with strict data filtering and security protocols.
                </li>
              </ul>
            </div>
            <div className="pillar-image slide-in-left">
              <div className="text-center">
                <div className="text-5xl mb-4">💬</div>
                <p>Communication Intelligence</p>
              </div>
            </div>
          </div>

          {/* ========== PILLAR 3: COMMERCIAL ROI FILTERING ========== */}
          <div className="pillar-content">
            <div className="pillar-text slide-in-left">
              <h3 className="text-accent-primary">
                <span className="accent-underline">Commercial ROI Filtering</span>
              </h3>
              <p>
                WA-Core acts as a gatekeeper for new initiatives, dependencies, and scripts—ensuring every addition creates lasting value, not technical debt.
              </p>
              <ul className="pillar-features">
                <li>
                  <strong>ROI-Filtered Code:</strong> Before adopting a new framework or API, WA-Core evaluates it against stability and long-term value principles.
                </li>
                <li>
                  <strong>Automated Compliance:</strong> Continuously scans your output and architecture against current EU directives, flagging code that may require adjustment.
                </li>
                <li>
                  <strong>Sustainable Growth:</strong> Ensures every decision prioritizes scalability, profitability, and legal compliance for long-term success.
                </li>
                <li>
                  <strong>Bloat Prevention:</strong> Identifies and prevents adoption of bloated libraries that create technical debt and reduce system efficiency.
                </li>
              </ul>
            </div>
            <div className="pillar-image slide-in-right">
              <div className="text-center">
                <div className="text-5xl mb-4">📊</div>
                <p>ROI & Compliance Monitoring</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== SVG DIVIDER 2 ========== */}
      <svg className="divider" viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ transform: 'rotate(180deg)' }}>
        <path d="M0,50 Q300,0 600,50 T1200,50 L1200,120 L0,120 Z" fill="#fafaf8" />
      </svg>

      {/* ========== BENEFITS SECTION ========== */}
      <section id="benefits" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="fade-in-up">Why WA-Core?</h2>
            <p className="text-lg text-muted max-w-2xl mx-auto fade-in-up">
              Stop managing your infrastructure manually. Let WA-Core handle the complexity while you focus on strategy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Benefit Card 1 */}
            <div className="feature-card fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="feature-icon">
                <span>⚡</span>
              </div>
              <h3>Instant Automation</h3>
              <p>
                Your infrastructure responds to changes in milliseconds, not hours. Self-healing, self-optimizing, always on.
              </p>
            </div>

            {/* Benefit Card 2 */}
            <div className="feature-card fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="feature-icon">
                <span>🛡️</span>
              </div>
              <h3>Data-Driven Decisions</h3>
              <p>
                Every decision backed by real data. No guesswork. ROI-optimized code and compliance-first architecture.
              </p>
            </div>

            {/* Benefit Card 3 */}
            <div className="feature-card fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="feature-icon">
                <span>🧠</span>
              </div>
              <h3>Intelligent Context</h3>
              <p>
                WA-Core understands your entire system—code, infrastructure, business goals. It acts as your strategic partner.
              </p>
            </div>

            {/* Benefit Card 4 */}
            <div className="feature-card fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="feature-icon">
                <span>🔄</span>
              </div>
              <h3>Continuous Optimization</h3>
              <p>
                Your system learns and improves over time. Technical debt is identified and eliminated automatically.
              </p>
            </div>

            {/* Benefit Card 5 */}
            <div className="feature-card fade-in-up" style={{ animationDelay: '0.5s' }}>
              <div className="feature-icon">
                <span>📈</span>
              </div>
              <h3>Scalable Growth</h3>
              <p>
                As your business grows, WA-Core scales with you. Built for long-term success, not quick fixes.
              </p>
            </div>

            {/* Benefit Card 6 */}
            <div className="feature-card fade-in-up" style={{ animationDelay: '0.6s' }}>
              <div className="feature-icon">
                <span>✅</span>
              </div>
              <h3>Compliance Ready</h3>
              <p>
                Automatically aligned with EU directives and industry standards. Stay compliant without manual effort.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== SVG DIVIDER 3 ========== */}
      <svg className="divider" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M0,50 Q300,0 600,50 T1200,50 L1200,120 L0,120 Z" fill="#F8F7F4" />
      </svg>

      {/* ========== CTA SECTION ========== */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="fade-in-up">Ready to Transform Your Infrastructure?</h2>
            <p className="text-lg text-muted mb-8 fade-in-up">
              WA-Core is your local nerve center. Set the strategic direction, and let the agent build the structure, defend your time, and ensure everything produced is scalable and profitable.
            </p>
            <div className="flex gap-4 justify-center flex-wrap fade-in-up">
              <button className="btn btn-primary btn-lg">
                Start Free Trial
              </button>
              <button className="btn btn-outline btn-lg">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========== ENTERPRISE DOCS ========== */}
      <section id="docs" className="py-24 bg-surface-primary border-y border-white/5">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Enterprise Documentation & Compliance</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Ladda ner den fullständiga arkitekturen för WA-Core, samt våra säkerhetspolicys för Zero-Trust och Data-as-a-Shield.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-6 rounded-2xl bg-surface-secondary border border-white/5 hover:border-accent-primary/30 transition-colors">
              <h3 className="text-xl font-bold mb-2 text-accent-primary">Arkitektur & Whitepaper</h3>
              <p className="text-sm text-gray-400 mb-6">Läs Phase 1-5 designen och vår Enterprise-arkitektur.</p>
              <a href="/downloads/wa-core/Architecture_Whitepaper.md" download className="text-accent-primary hover:text-white font-medium flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Ladda ner .md
              </a>
            </div>
            <div className="p-6 rounded-2xl bg-surface-secondary border border-white/5 hover:border-accent-primary/30 transition-colors">
              <h3 className="text-xl font-bold mb-2 text-accent-primary">Zero-Trust IP Policy</h3>
              <p className="text-sm text-gray-400 mb-6">Hur WA-Core skyddar ditt IP med lokala agenter.</p>
              <a href="/downloads/wa-core/IP_Security_Policy.md" download className="text-accent-primary hover:text-white font-medium flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Ladda ner policy
              </a>
            </div>
            <div className="p-6 rounded-2xl bg-surface-secondary border border-white/5 hover:border-accent-primary/30 transition-colors">
              <h3 className="text-xl font-bold mb-2 text-accent-primary">Enterprise Licens</h3>
              <p className="text-sm text-gray-400 mb-6">Licensavtal för on-prem och autonom drift.</p>
              <a href="/downloads/wa-core/Enterprise_License.md" download className="text-accent-primary hover:text-white font-medium flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Ladda ner licens
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer id="contact">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4>WA-Core</h4>
              <p className="text-sm text-gray-300">
                The ultimate PowerShell agent for autonomous infrastructure orchestration.
              </p>
            </div>
            <div>
              <h4>Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features">Features</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#docs">Documentation</a></li>
                <li><a href="#roadmap">Roadmap</a></li>
              </ul>
            </div>
            <div>
              <h4>Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#about">About</a></li>
                <li><a href="#blog">Blog</a></li>
                <li><a href="#careers">Careers</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4>Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#privacy">Privacy Policy</a></li>
                <li><a href="#terms">Terms of Service</a></li>
                <li><a href="#security">Security</a></li>
                <li><a href="#compliance">Compliance</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-300">
                © 2026 WA-Core. All rights reserved.
              </p>
              <div className="flex gap-6 mt-4 md:mt-0">
                <a href="#twitter" className="text-sm hover:text-white transition">Twitter</a>
                <a href="#github" className="text-sm hover:text-white transition">GitHub</a>
                <a href="#linkedin" className="text-sm hover:text-white transition">LinkedIn</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

