import React from 'react';
import { getGradeColorStyle } from './gpaData';

export default function GradeModal({
  isOpen,
  course,
  currentWeight,
  grades,
  isDark,
  onSelectGrade,
  onClose,
}) {
  if (!isOpen || !course) return null;

  const hasGradeSelected = currentWeight !== undefined && currentWeight !== '' && currentWeight !== null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-content"
        style={{
          maxWidth: '420px',
          maxHeight: '85vh',
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
            padding: '20px 24px',
            background: 'var(--surface-solid)',
            zIndex: 20,
            borderBottom: '1px solid var(--border)',
            flexShrink: 0,
          }}
        >
          <div style={{ minWidth: 0, paddingRight: '12px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.5px' }}>
              Select Grade
            </h3>
            <div
              style={{
                fontSize: '12px',
                color: 'var(--text-muted)',
                fontWeight: 600,
                marginTop: '2px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{course.code}</span>
              {' \u2022 '}
              {course.name}
              {' '}
              <span style={{ opacity: 0.7 }}>({course.credits} Credits)</span>
            </div>
          </div>
          <button
            className="icon-btn"
            style={{ width: '36px', height: '36px', borderRadius: '12px', flexShrink: 0 }}
            onClick={onClose}
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div
          style={{
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            overflowY: 'auto',
          }}
        >
          <div className="grade-modal-grid">
            {grades.map((g) => {
              const isSelected =
                hasGradeSelected &&
                Math.abs(parseFloat(currentWeight) - parseFloat(g.weight)) < 0.001;
              const colorStyle = getGradeColorStyle(g.weight, isDark);

              return (
                <button
                  type="button"
                  key={g.grade}
                  className={`grade-modal-tile ${isSelected ? 'selected' : ''}`}
                  onClick={() => onSelectGrade(g.weight, g.grade)}
                  style={{
                    borderColor: isSelected ? 'var(--primary)' : colorStyle.border,
                    background: isSelected ? 'var(--primary-glow)' : colorStyle.bg,
                    boxShadow: isSelected ? '0 0 16px var(--primary-glow)' : 'none',
                  }}
                >
                  <div
                    className="tile-grade"
                    style={{ color: isSelected ? 'var(--primary)' : colorStyle.color }}
                  >
                    {g.grade}
                  </div>
                  <div className="tile-weight">
                    {g.weight.toFixed(2)}
                  </div>
                  {isSelected && (
                    <div className="tile-check">
                      <svg
                        width="12"
                        height="12"
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
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className="grade-modal-clear-btn"
            onClick={() => onSelectGrade('', 'Grade')}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Clear Grade (None)
          </button>
        </div>
      </div>
    </div>
  );
}
