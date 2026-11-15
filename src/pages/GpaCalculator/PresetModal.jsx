import React from 'react';

export default function PresetModal({
  isOpen,
  onSelectPreset,
  onClose,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-content"
        style={{ maxWidth: '400px', padding: 0, overflow: 'hidden' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '24px',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <h3 style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.5px' }}>
            Quick Presets
          </h3>
          <button
            className="icon-btn"
            style={{ width: '36px', height: '36px', borderRadius: '12px' }}
            onClick={onClose}
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
            Instantly load a predefined set of subjects. This will clear your current list.
          </p>

          <button
            type="button"
            className="btn-primary"
            style={{
              background: 'var(--bg)',
              color: 'var(--text-main)',
              border: '1px solid var(--border)',
              textAlign: 'left',
              justifyContent: 'flex-start',
              padding: '16px',
            }}
            onClick={() => onSelectPreset('sem5')}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontWeight: 800 }}>Semester 5</span>
              <span style={{ fontSize: '11px', opacity: 0.6 }}>Load courses for Semester 5</span>
            </div>
          </button>

          <button
            type="button"
            className="btn-primary"
            style={{
              background: 'var(--bg)',
              color: 'var(--text-main)',
              border: '1px solid var(--border)',
              textAlign: 'left',
              justifyContent: 'flex-start',
              padding: '16px',
            }}
            onClick={() => onSelectPreset('sem4')}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontWeight: 800 }}>Semester 4</span>
              <span style={{ fontSize: '11px', opacity: 0.6 }}>Load courses for Semester 4</span>
            </div>
          </button>

          <button
            type="button"
            className="btn-primary"
            style={{
              background: 'var(--bg)',
              color: 'var(--text-main)',
              border: '1px solid var(--border)',
              textAlign: 'left',
              justifyContent: 'flex-start',
              padding: '16px',
            }}
            onClick={() => onSelectPreset('sem3')}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontWeight: 800 }}>Semester 3</span>
              <span style={{ fontSize: '11px', opacity: 0.6 }}>Load courses for Semester 3</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
