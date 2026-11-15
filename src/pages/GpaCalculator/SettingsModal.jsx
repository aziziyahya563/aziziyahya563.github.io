import React, { useRef } from 'react';
import { SCALE_PRESETS } from './gpaData';

export default function SettingsModal({
  isOpen,
  cgpaEnabled,
  onToggleCgpa,
  activeScaleId,
  onApplyScale,
  onExportConfig,
  onImportConfig,
  onClose,
}) {
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportConfig(file);
      e.target.value = '';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-content"
        style={{
          maxWidth: '500px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '24px',
            background: 'var(--surface-solid)',
            zIndex: 20,
            borderBottom: '1px solid var(--border)',
            flexShrink: 0,
          }}
        >
          <h3 style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.5px' }}>
            App Settings
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

        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
          {/* Features Section */}
          <div>
            <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                Features
              </span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            </div>

            <div className="scale-card" style={{ padding: '16px', cursor: 'default' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 800 }}>CGPA Calculator</h4>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Calculate overall CGPA based on previous results.
                  </p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={cgpaEnabled}
                    onChange={(e) => onToggleCgpa(e.target.checked)}
                  />
                  <span className="slider" />
                </label>
              </div>
            </div>
          </div>

          {/* Grading Scale Section */}
          <div>
            <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                Grading Scale
              </span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {SCALE_PRESETS.map((p) => {
                const isActive = p.id === activeScaleId;
                return (
                  <div
                    key={p.id}
                    className={`scale-card ${isActive ? 'active' : ''}`}
                    onClick={() => onApplyScale(p.id)}
                  >
                    {isActive && (
                      <div className="active-indicator">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}
                    <h4
                      style={{
                        fontSize: '14px',
                        fontWeight: 800,
                        color: isActive ? 'var(--primary)' : 'var(--text-main)',
                      }}
                    >
                      {p.name}
                    </h4>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '8px' }}>
                      {p.desc}
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '4px',
                        marginTop: '8px',
                        paddingTop: '8px',
                        borderTop: '1px dashed var(--border)',
                      }}
                    >
                      {p.grades.map((g) => (
                        <div
                          key={g.grade}
                          style={{
                            fontSize: '9px',
                            background: isActive ? 'var(--surface-solid)' : 'var(--bg)',
                            padding: '2px 6px',
                            borderRadius: '6px',
                            border: '1px solid var(--border)',
                            display: 'flex',
                            gap: '4px',
                          }}
                        >
                          <span style={{ fontWeight: 800 }}>{g.grade}</span>
                          <span style={{ opacity: 0.6 }}>{g.weight.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Data Management Section */}
          <div>
            <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                Data Management
              </span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                type="button"
                className="btn-primary"
                onClick={onExportConfig}
                style={{
                  width: '100%',
                  height: '50px',
                  background: 'var(--bg)',
                  color: 'var(--text-main)',
                  border: '1px solid var(--border)',
                  boxShadow: 'none',
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ marginRight: '8px' }}
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Export Configuration
              </button>

              <button
                type="button"
                className="btn-primary"
                onClick={() => fileInputRef.current?.click()}
                style={{ width: '100%', height: '50px' }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ marginRight: '8px' }}
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Import Configuration
              </button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept=".json"
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
