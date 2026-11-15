import React from 'react';

export default function SubjectsModal({
  isOpen,
  courses,
  onAddNew,
  onEdit,
  onDelete,
  onClose,
}) {
  if (!isOpen) return null;

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
            Manage Subjects
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

        <div style={{ padding: '24px', overflowY: 'auto' }}>
          {/* Primary Action */}
          <button
            className="btn-primary"
            style={{
              width: '100%',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 20px var(--primary-glow)',
            }}
            onClick={onAddNew}
          >
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
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add New Subject
          </button>

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
              Current Course List
            </span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          </div>

          <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)' }}>
            {courses.length === 0 ? (
              <div
                style={{
                  padding: '40px 20px',
                  textAlign: 'center',
                  fontSize: '13px',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  style={{ opacity: 0.3 }}
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                No subjects added yet.
              </div>
            ) : (
              courses.map((c) => (
                <div
                  key={c.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    borderBottom: '1px solid var(--border)',
                    background: 'var(--surface-solid)',
                    transition: 'background 0.2s',
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      minWidth: 0,
                      paddingRight: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '10px',
                        fontWeight: 800,
                        color: 'var(--primary)',
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                      }}
                    >
                      <span>{c.code}</span>
                      <span
                        style={{
                          width: '3px',
                          height: '3px',
                          borderRadius: '50%',
                          background: 'var(--border)',
                          opacity: 0.6,
                        }}
                      />
                      <span style={{ color: 'var(--text-muted)', opacity: 0.8 }}>
                        {c.credits} Credits
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: 'var(--text-main)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {c.name}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="btn-primary"
                      onClick={() => onEdit(c)}
                      title="Edit"
                      style={{
                        width: '32px',
                        height: '32px',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'var(--bg)',
                        color: 'var(--text-main)',
                        border: '1px solid var(--border)',
                        borderRadius: '10px',
                      }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                      </svg>
                    </button>
                    <button
                      className="btn-primary"
                      onClick={() => onDelete(c.id)}
                      title="Delete"
                      style={{
                        width: '32px',
                        height: '32px',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#fee2e2',
                        color: '#ef4444',
                        border: 'none',
                        borderRadius: '10px',
                      }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
