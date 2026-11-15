import React from 'react';

export default function AboutModal({
  isOpen,
  onClose,
  title = "Azizi Yahya's Apps",
  version = "v2.5",
  description = (
    <>
      A personal collection of <strong>tools</strong>, <strong>calculators</strong>, and{' '}
      <strong>creative projects</strong> built for everyday use.
    </>
  ),
  icon,
  accentGradient,
  accentColor,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="aboutModalTitle"
    >
      <div className="info-modal-card" onClick={(e) => e.stopPropagation()}>
        <div
          className="info-modal-icon"
          aria-hidden="true"
          style={
            accentGradient
              ? {
                  background: accentGradient,
                  boxShadow: `0 12px 30px ${accentColor ? `color-mix(in srgb, ${accentColor} 40%, transparent)` : 'rgba(124, 111, 238, 0.35)'}`,
                }
              : undefined
          }
        >
          {icon || (
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
          )}
        </div>

        <div
          className="info-modal-version"
          style={
            accentColor
              ? {
                  color: accentColor,
                  background: `color-mix(in srgb, ${accentColor} 12%, transparent)`,
                }
              : undefined
          }
        >
          {version}
        </div>

        <h3 className="info-modal-title" id="aboutModalTitle">
          {title}
        </h3>

        <div className="info-modal-body">
          <p>{description}</p>
          <div style={{ marginTop: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
            &copy; 2026 Azizi Yahya
          </div>
        </div>

        <button
          className="info-modal-btn"
          onClick={onClose}
          style={
            accentGradient
              ? {
                  background: accentGradient,
                  boxShadow: `0 8px 20px ${accentColor ? `color-mix(in srgb, ${accentColor} 35%, transparent)` : 'rgba(124, 111, 238, 0.35)'}`,
                }
              : undefined
          }
        >
          Got it
        </button>
      </div>
    </div>
  );
}
