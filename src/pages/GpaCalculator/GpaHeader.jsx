import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

export default function GpaHeader({
  activeSem,
  onOpenSubjects,
  onOpenPresets,
  onOpenSettings,
  onOpenAbout,
}) {
  const { toggleTheme } = useTheme();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const menuBtnRef = useRef(null);

  // Always ensure menu starts closed when navigating to this route
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const handlePointerDown = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !menuBtnRef.current?.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  const getEyebrowText = () => {
    if (activeSem === 'sem3') return 'Semester 3';
    if (activeSem === 'sem4') return 'Semester 4';
    if (activeSem === 'sem5') return 'Semester 5';
    return '';
  };

  return (
    <header className="gpa-header site-header">
      <div className="header-left">
        <Link to="/" className="back-btn" aria-label="Back to home">
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="header-title-block">
          <div className="header-eyebrow" id="headerEyebrow">
            {getEyebrowText()}
          </div>
          <div className="header-title">GPA Calculator</div>
        </div>
      </div>

      <div className="header-actions">
        <button
          ref={menuBtnRef}
          className="icon-btn"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Menu"
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

        {menuOpen && (
          <div
            ref={menuRef}
            id="gpaPopoverMenu"
            className="gpa-popover-menu"
            role="menu"
          >
            <div className="menu-header">Academic</div>
            <div
              className="menu-item"
              role="menuitem"
              onClick={() => {
                setMenuOpen(false);
                onOpenSubjects();
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              <span>Manage Subjects</span>
            </div>
            <div
              className="menu-item"
              role="menuitem"
              onClick={() => {
                setMenuOpen(false);
                onOpenPresets();
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 19l7-7-7-7M5 19l7-7-7-7" />
              </svg>
              <span>Sem Selection</span>
            </div>

            <div style={{ height: '1px', background: 'var(--border)', margin: '4px 8px', opacity: 0.5 }} />
            <div className="menu-header">Config</div>
            <div
              className="menu-item"
              role="menuitem"
              onClick={() => {
                setMenuOpen(false);
                onOpenSettings();
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              <span>App Settings</span>
            </div>

            <div style={{ height: '1px', background: 'var(--border)', margin: '4px 8px', opacity: 0.5 }} />
            <div className="menu-header">System</div>
            <div
              className="menu-item"
              role="menuitem"
              onClick={() => {
                toggleTheme();
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
              <span>Toggle Dark Mode</span>
            </div>
            <div
              className="menu-item"
              role="menuitem"
              onClick={() => {
                setMenuOpen(false);
                onOpenAbout();
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span>About App</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
