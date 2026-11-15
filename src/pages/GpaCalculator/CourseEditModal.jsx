import React, { useState, useEffect } from 'react';

export default function CourseEditModal({
  isOpen,
  course,
  onSave,
  onClose,
}) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [credits, setCredits] = useState('3');

  useEffect(() => {
    if (course) {
      setName(course.name || '');
      setCode(course.code || '');
      setCredits(course.credits ? course.credits.toString() : '3');
    } else {
      setName('');
      setCode('');
      setCredits('3');
    }
  }, [course, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedCode = code.trim().toUpperCase();
    const parsedCredits = parseInt(credits, 10);
    if (!trimmedName || !parsedCredits) return;

    onSave({
      id: course ? course.id : undefined,
      name: trimmedName,
      code: trimmedCode,
      credits: parsedCredits,
    });
  };

  return (
    <div
      className="modal-overlay"
      style={{ zIndex: 2000 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="modal-content"
        style={{ maxWidth: '400px', padding: '24px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.5px' }}>
            {course ? 'Edit Subject' : 'Add Subject'}
          </h3>
          <button
            className="icon-btn"
            style={{ width: '32px', height: '32px', borderRadius: '10px' }}
            onClick={onClose}
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="input-field">
            <label
              style={{
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: 800,
                color: 'var(--text-muted)',
                marginBottom: '4px',
                display: 'block',
              }}
            >
              Subject Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Data Structures"
              autoFocus
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                background: 'var(--bg)',
                color: 'var(--text-main)',
                fontWeight: 600,
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-field">
              <label
                style={{
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontWeight: 800,
                  color: 'var(--text-muted)',
                  marginBottom: '4px',
                  display: 'block',
                }}
              >
                Course Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="SUB101"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  background: 'var(--bg)',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                  outline: 'none',
                }}
              />
            </div>

            <div className="input-field">
              <label
                style={{
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontWeight: 800,
                  color: 'var(--text-muted)',
                  marginBottom: '4px',
                  display: 'block',
                }}
              >
                Credits
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
                placeholder="3"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  background: 'var(--bg)',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
            <button
              type="button"
              className="btn-primary"
              style={{
                flex: 1,
                background: 'var(--bg)',
                color: 'var(--text-main)',
                border: '1px solid var(--border)',
                boxShadow: 'none',
              }}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ flex: 1, boxShadow: '0 4px 12px var(--primary-glow)' }}
            >
              Save Subject
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
