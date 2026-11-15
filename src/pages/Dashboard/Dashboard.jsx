import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardHeader from './DashboardHeader';
import BackgroundMesh from '../../components/BackgroundMesh';
import AboutModal from '../../components/AboutModal';
import { APP_SECTIONS } from './appsData';
import './dashboard.css';

export default function Dashboard() {
  const [aboutOpen, setAboutOpen] = useState(false);

  useEffect(() => {
    if (aboutOpen) {
      document.body.classList.add('modal-open');
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') setAboutOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.classList.remove('modal-open');
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [aboutOpen]);

  return (
    <div className="dashboard-page">
      <BackgroundMesh />

      <DashboardHeader onOpenAbout={() => setAboutOpen(true)} />

      <main className="main-content">
        {/* Hero Section */}
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-eyebrow">Personal Workspace</div>
          <h1 className="hero-title" id="hero-title">
            My Apps &amp;<br />
            <span className="gradient-word">Projects</span>
          </h1>
          <p className="hero-sub">
            A curated collection of personal tools, calculators, and creative showcases.
          </p>
        </section>

        {/* App Sections */}
        {APP_SECTIONS.map((section) => (
          <section key={section.id} className="app-section" aria-labelledby={`${section.id}-label`}>
            <div className="section-header">
              <span className="section-label" id={`${section.id}-label`}>
                {section.label}
              </span>
              <div className="section-line" />
              <span className="section-count">{section.items.length}</span>
            </div>

            <div className="app-list">
              {section.items.map((app) => {
                const itemContent = (
                  <>
                    <div className="app-item-icon">
                      {app.icon}
                    </div>
                    <div className="app-item-info">
                      <div className="app-item-name">{app.name}</div>
                      <div className="app-item-desc">{app.desc}</div>
                    </div>
                    <span className="app-item-tag">{app.tag}</span>
                    <div className="app-item-arrow">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  </>
                );

                return app.isInternalRoute ? (
                  <Link
                    key={app.id}
                    to={app.href}
                    className="app-item"
                    style={{ '--item-accent': app.accent }}
                    aria-label={`${app.name} — ${app.tag}`}
                  >
                    {itemContent}
                  </Link>
                ) : (
                  <a
                    key={app.id}
                    href={app.href}
                    className="app-item"
                    style={{ '--item-accent': app.accent }}
                    aria-label={`${app.name} — ${app.tag}`}
                  >
                    {itemContent}
                  </a>
                );
              })}
            </div>
          </section>
        ))}
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <p>&copy; 2026 Azizi Yahya &nbsp;&middot;&nbsp; v2.5</p>
      </footer>

      {/* About Modal */}
      <AboutModal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />
    </div>
  );
}
