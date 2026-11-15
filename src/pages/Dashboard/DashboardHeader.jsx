import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

export default function DashboardHeader({ onOpenAbout }) {
  const { isDark, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtnRef = useRef(null);
  const menuRef = useRef(null);
  const [menuPos, setMenuPos] = useState({ top: 64, right: 20 });

  const toggleMenu = () => {
    if (!menuOpen && menuBtnRef.current) {
      const rect = menuBtnRef.current.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (!menuOpen) return;

    const handlePointerDown = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !menuBtnRef.current?.contains(e.target)
      ) {
        closeMenu();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeMenu();
    };

    const handleResize = () => {
      if (menuBtnRef.current) {
        const rect = menuBtnRef.current.getBoundingClientRect();
        setMenuPos({
          top: rect.bottom + 8,
          right: window.innerWidth - rect.right,
        });
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [menuOpen]);

  return (
    <>
      <header className="site-header dashboard-header">
        <div className="header-brand">
          <div className="brand-logo" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="brand-name">Azizi Yahya</span>
        </div>

        <div className="header-actions">
          {/* Quick theme toggle */}
          <button
            className="icon-btn"
            onClick={toggleTheme}
            title="Toggle theme"
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </svg>
            )}
          </button>

          {/* Menu button */}
          <div style={{ position: 'relative' }}>
            <button
              className="icon-btn"
              ref={menuBtnRef}
              onClick={toggleMenu}
              aria-label="Open menu"
              aria-expanded={menuOpen}
            >
              <svg
                className="menu-icon"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="5" r="1.5" fill="currentColor" stroke="none" />
                <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
                <circle cx="12" cy="19" r="1.5" fill="currentColor" stroke="none" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Popover Menu */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="dashboard-popover-menu"
          style={{ top: `${menuPos.top}px`, right: `${menuPos.right}px` }}
          role="menu"
        >
          <div className="popover-menu-header">Settings</div>
          <div className="popover-divider" />
          <div className="menu-item" onClick={toggleTheme} role="menuitem">
            <div className="menu-item-left">
              <div
                className="menu-item-icon"
                style={{
                  background: 'rgba(124, 111, 238, 0.12)',
                  color: 'var(--accent-1)',
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              </div>
              <span>Dark Mode</span>
            </div>
            <label className="switch" onClick={(e) => e.stopPropagation()}>
              <input
                type="checkbox"
                checked={isDark}
                onChange={toggleTheme}
              />
              <span className="slider" />
            </label>
          </div>
          <div className="popover-divider" />
          <button
            className="menu-item"
            onClick={() => {
              closeMenu();
              onOpenAbout();
            }}
            role="menuitem"
          >
            <div className="menu-item-left">
              <div
                className="menu-item-icon"
                style={{
                  background: 'rgba(6, 182, 212, 0.12)',
                  color: 'var(--accent-3)',
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              </div>
              <span>About</span>
            </div>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: 'var(--text-muted)' }}
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
