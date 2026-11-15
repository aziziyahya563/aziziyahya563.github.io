import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import BackgroundMesh from '../../components/BackgroundMesh';
import GpaHeader from './GpaHeader';
import GradeModal from './GradeModal';
import SubjectsModal from './SubjectsModal';
import CourseEditModal from './CourseEditModal';
import PresetModal from './PresetModal';
import SettingsModal from './SettingsModal';
import AboutModal from '../../components/AboutModal';
import {
  STORAGE_KEY_GPA,
  STORAGE_KEY_COURSES,
  STORAGE_KEY_SCALE,
  STORAGE_KEY_CGPA_ENABLED,
  STORAGE_KEY_ACTIVE_SEM,
  SCALE_PRESETS,
  sem3Courses,
  sem4Courses,
  sem5Courses,
  getGradeColorStyle,
} from './gpaData';
import './gpaCalculator.css';

export default function GpaCalculator() {
  const { isDark } = useTheme();

  // ── State Initialization ──────────────────────────────
  const [scaleId, setScaleId] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_SCALE) || SCALE_PRESETS[0].id;
  });

  const activePreset = useMemo(() => {
    return SCALE_PRESETS.find((s) => s.id === scaleId) || SCALE_PRESETS[0];
  }, [scaleId]);

  const grades = activePreset.grades;

  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_COURSES);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return sem5Courses.map((c) => ({ ...c, id: c.code }));
  });

  const [gpaData, setGpaData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_GPA);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return { grades: {}, manual: { cgpa: null, credits: null } };
  });

  const [cgpaEnabled, setCgpaEnabled] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_CGPA_ENABLED) === 'true';
  });

  const [prevCgpa, setPrevCgpa] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_GPA);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.manual?.cgpa !== null && parsed.manual?.cgpa !== undefined) {
          return parsed.manual.cgpa.toString();
        }
      } catch (e) {
        console.error(e);
      }
    }
    return '';
  });

  const [prevCredits, setPrevCredits] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_GPA);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.manual?.credits !== null && parsed.manual?.credits !== undefined) {
          return parsed.manual.credits.toString();
        }
      } catch (e) {
        console.error(e);
      }
    }
    return '';
  });

  const [activeSem, setActiveSem] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_ACTIVE_SEM) || 'sem5';
  });

  // Modals state
  const [gradeModalCourse, setGradeModalCourse] = useState(null);
  const [subjectsModalOpen, setSubjectsModalOpen] = useState(false);
  const [courseEditModalOpen, setCourseEditModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [presetModalOpen, setPresetModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_COURSES, JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_GPA, JSON.stringify(gpaData));
  }, [gpaData]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SCALE, scaleId);
  }, [scaleId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CGPA_ENABLED, cgpaEnabled ? 'true' : 'false');
  }, [cgpaEnabled]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ACTIVE_SEM, activeSem);
  }, [activeSem]);

  // Body scroll lock when any modal is open
  const isAnyModalOpen =
    !!gradeModalCourse ||
    subjectsModalOpen ||
    courseEditModalOpen ||
    presetModalOpen ||
    settingsModalOpen ||
    aboutModalOpen;

  useEffect(() => {
    if (isAnyModalOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [isAnyModalOpen]);

  // Global Escape key listener to close top-most active modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (courseEditModalOpen) {
          setCourseEditModalOpen(false);
          setEditingCourse(null);
        } else if (gradeModalCourse) {
          setGradeModalCourse(null);
        } else if (subjectsModalOpen) {
          setSubjectsModalOpen(false);
        } else if (presetModalOpen) {
          setPresetModalOpen(false);
        } else if (settingsModalOpen) {
          setSettingsModalOpen(false);
        } else if (aboutModalOpen) {
          setAboutModalOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    courseEditModalOpen,
    gradeModalCourse,
    subjectsModalOpen,
    presetModalOpen,
    settingsModalOpen,
    aboutModalOpen,
  ]);

  // URL Hash / Query Parameter Presets check
  useEffect(() => {
    const checkUrlPreset = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const urlHash = window.location.hash.substring(1);
      const urlPreset = urlParams.get('preset') || (['sem3', 'sem4', 'sem5'].includes(urlHash) ? urlHash : null);

      if (urlPreset && ['sem3', 'sem4', 'sem5'].includes(urlPreset)) {
        loadPreset(urlPreset, true);
      }
    };
    checkUrlPreset();
    window.addEventListener('hashchange', checkUrlPreset);
    return () => window.removeEventListener('hashchange', checkUrlPreset);
  }, []);

  // ── Calculation ──────────────────────────────────────
  const { sgpa, semCredits } = useMemo(() => {
    let semPoints = 0;
    let semCreditsTotal = 0;

    courses.forEach((c) => {
      const w = gpaData.grades[c.id];
      if (w !== undefined && w !== '' && w !== null) {
        semPoints += parseFloat(w) * c.credits;
        semCreditsTotal += c.credits;
      }
    });

    const calculatedSgpa = semCreditsTotal === 0 ? 0 : semPoints / semCreditsTotal;
    return {
      sgpa: calculatedSgpa,
      semCredits: semCreditsTotal,
    };
  }, [courses, gpaData.grades]);

  const cgpa = useMemo(() => {
    if (!cgpaEnabled) return 0;
    const pCgpa = parseFloat(prevCgpa) || 0;
    const pCredits = parseFloat(prevCredits) || 0;

    const currentPoints = sgpa * semCredits;
    const totalPoints = pCgpa * pCredits + currentPoints;
    const totalCreditsCombined = pCredits + semCredits;

    return totalCreditsCombined === 0 ? 0 : totalPoints / totalCreditsCombined;
  }, [cgpaEnabled, prevCgpa, prevCredits, sgpa, semCredits]);

  // Pulse animation on score update
  const gpaScoreRef = useRef(null);
  useEffect(() => {
    if (gpaScoreRef.current) {
      gpaScoreRef.current.classList.remove('score-pulse');
      void gpaScoreRef.current.offsetWidth;
      gpaScoreRef.current.classList.add('score-pulse');
    }
  }, [sgpa]);

  const cgpaScoreRef = useRef(null);
  useEffect(() => {
    if (cgpaScoreRef.current) {
      cgpaScoreRef.current.classList.remove('score-pulse');
      void cgpaScoreRef.current.offsetWidth;
      cgpaScoreRef.current.classList.add('score-pulse');
    }
  }, [cgpa]);

  // ── Handlers ─────────────────────────────────────────
  const handleSelectGrade = (weight, gradeLabel) => {
    if (!gradeModalCourse) return;
    const courseId = gradeModalCourse.id;

    setGpaData((prev) => {
      const newGrades = { ...prev.grades };
      if (weight === '' || weight === null || weight === undefined) {
        delete newGrades[courseId];
      } else {
        newGrades[courseId] = weight.toString();
      }
      return {
        ...prev,
        grades: newGrades,
      };
    });

    setGradeModalCourse(null);
  };

  const loadPreset = (p, bypassConfirm = false) => {
    if (!bypassConfirm && !window.confirm('Load preset? This will clear your current subjects.')) {
      return;
    }

    let source = sem5Courses;
    if (p === 'sem3') source = sem3Courses;
    else if (p === 'sem4') source = sem4Courses;

    const newCourses = source.map((c) => ({ ...c, id: c.code }));
    setCourses(newCourses);
    setGpaData((prev) => ({
      ...prev,
      grades: {},
    }));
    setActiveSem(p);
    setPresetModalOpen(false);
  };

  const handleApplyScale = (newId) => {
    const oldScaleId = scaleId;
    const oldPreset = SCALE_PRESETS.find((s) => s.id === oldScaleId);
    const newPreset = SCALE_PRESETS.find((s) => s.id === newId);

    if (oldScaleId && oldScaleId !== newId && oldPreset && newPreset) {
      setGpaData((prev) => {
        const newGrades = { ...prev.grades };
        Object.keys(newGrades).forEach((courseId) => {
          const oldWeight = parseFloat(newGrades[courseId]);
          const oldGradeObj = oldPreset.grades.find(
            (g) => Math.abs(g.weight - oldWeight) < 0.01
          );

          if (oldGradeObj) {
            const newGradeObj = newPreset.grades.find((g) => g.grade === oldGradeObj.grade);
            if (newGradeObj) {
              newGrades[courseId] = newGradeObj.weight.toString();
            } else {
              delete newGrades[courseId];
            }
          } else {
            delete newGrades[courseId];
          }
        });
        return {
          ...prev,
          grades: newGrades,
        };
      });
    }

    setScaleId(newId);
  };

  const handleSaveCourse = ({ id, name, code, credits }) => {
    if (id) {
      setCourses((prev) =>
        prev.map((c) => (c.id === id ? { ...c, name, code, credits } : c))
      );
    } else {
      const newId = 'c_' + Date.now();
      setCourses((prev) => [...prev, { id: newId, name, code, credits }]);
    }
    setActiveSem('custom');
    setCourseEditModalOpen(false);
    setEditingCourse(null);
  };

  const handleDeleteCourse = (id) => {
    if (!window.confirm('Delete this subject?')) return;
    setCourses((prev) => prev.filter((c) => c.id !== id));
    setGpaData((prev) => {
      const nextGrades = { ...prev.grades };
      delete nextGrades[id];
      return { ...prev, grades: nextGrades };
    });
    setActiveSem('custom');
  };

  const handlePrevCgpaChange = (val) => {
    setPrevCgpa(val);
    setGpaData((prev) => ({
      ...prev,
      manual: {
        cgpa: parseFloat(val) || 0,
        credits: parseFloat(prevCredits) || 0,
      },
    }));
  };

  const handlePrevCreditsChange = (val) => {
    setPrevCredits(val);
    setGpaData((prev) => ({
      ...prev,
      manual: {
        cgpa: parseFloat(prevCgpa) || 0,
        credits: parseFloat(val) || 0,
      },
    }));
  };

  const handleExportConfig = () => {
    const config = {
      scale: scaleId,
      courses,
      gpaData,
      cgpaEnabled,
    };
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'gpa-config.json';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handleImportConfig = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target.result);
        if (config.courses) setCourses(config.courses);
        if (config.gpaData) setGpaData(config.gpaData);
        if (config.scale) handleApplyScale(config.scale);
        if (config.cgpaEnabled !== undefined) setCgpaEnabled(config.cgpaEnabled);
        alert('Configuration imported successfully!');
      } catch (err) {
        alert('Invalid config file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="gpa-page">
      <BackgroundMesh />

      <GpaHeader
        activeSem={activeSem}
        onOpenSubjects={() => setSubjectsModalOpen(true)}
        onOpenPresets={() => setPresetModalOpen(true)}
        onOpenSettings={() => setSettingsModalOpen(true)}
        onOpenAbout={() => setAboutModalOpen(true)}
      />

      <div className="gpa-container">
        <div className="dashboard-layout">
          {/* Left Column: Results & CGPA */}
          <div className="left-column">
            {/* GPA Card */}
            <div className="bento-grid">
              <div
                className="bento-card full"
                id="gpaCard"
                style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '130px' }}
              >
                <div className="score-value" ref={gpaScoreRef} id="total">
                  {sgpa.toFixed(2)}
                </div>
                <div
                  className="gpa-label"
                  style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    marginTop: '8px',
                  }}
                >
                  Projected GPA
                </div>
              </div>
            </div>

            {/* CGPA Section */}
            {cgpaEnabled && (
              <div className="cgpa-section-wrapper">
                <div className="bento-card full" id="cgpaCard" style={{ minHeight: '140px', padding: '24px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', alignItems: 'center' }}>
                    {/* Left: Result */}
                    <div style={{ textAlign: 'center' }}>
                      <div className="score-value" ref={cgpaScoreRef} id="cgpaTotal" style={{ fontSize: '2.6rem' }}>
                        {cgpa.toFixed(2)}
                      </div>
                      <div
                        className="cgpa-label"
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          color: 'var(--text-muted)',
                          textTransform: 'uppercase',
                          letterSpacing: '1.5px',
                          marginTop: '6px',
                        }}
                      >
                        Projected CGPA
                      </div>
                    </div>

                    {/* Right: Interactive Inputs */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        borderLeft: '1px solid var(--border)',
                        paddingLeft: '24px',
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label
                          className="cgpa-input-label"
                          style={{
                            fontSize: '10px',
                            fontWeight: 800,
                            color: 'var(--text-muted)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                          }}
                        >
                          Prev. CGPA
                        </label>
                        <input
                          type="number"
                          className="cgpa-input"
                          step="0.01"
                          min="0"
                          max="4"
                          placeholder="0.00"
                          value={prevCgpa}
                          onChange={(e) => handlePrevCgpaChange(e.target.value)}
                          style={{
                            background: 'var(--bg)',
                            border: '1px solid var(--border)',
                            borderRadius: '10px',
                            padding: '8px 12px',
                            fontSize: '14px',
                            fontWeight: 700,
                            color: 'var(--text-main)',
                            outline: 'none',
                            width: '100%',
                          }}
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label
                          className="cgpa-input-label"
                          style={{
                            fontSize: '10px',
                            fontWeight: 800,
                            color: 'var(--text-muted)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                          }}
                        >
                          Total Credits
                        </label>
                        <input
                          type="number"
                          className="cgpa-input"
                          min="0"
                          placeholder="0"
                          value={prevCredits}
                          onChange={(e) => handlePrevCreditsChange(e.target.value)}
                          style={{
                            background: 'var(--bg)',
                            border: '1px solid var(--border)',
                            borderRadius: '10px',
                            padding: '8px 12px',
                            fontSize: '14px',
                            fontWeight: 700,
                            color: 'var(--text-main)',
                            outline: 'none',
                            width: '100%',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Course List */}
          <div className="right-column">
            <div className="courses-list" id="coursesGrid">
              {courses.map((c) => {
                const sel = gpaData.grades[c.id];
                const selVal = sel !== undefined ? sel : '';
                const colorStyle = getGradeColorStyle(selVal, isDark);
                const gradeObj =
                  selVal !== ''
                    ? grades.find((g) => Math.abs(g.weight - parseFloat(selVal)) < 0.001)
                    : null;
                const currentGradeText = gradeObj ? gradeObj.grade : selVal !== '' ? selVal : 'Grade';

                return (
                  <div
                    key={c.id}
                    className="course-card"
                    onClick={() => setGradeModalCourse(c)}
                  >
                    <div
                      className="course-row-main"
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                      }}
                    >
                      <div className="course-info-col">
                        <div className="course-meta">
                          <span>{c.code}</span>
                          <span className="course-dot" />
                          <span style={{ color: 'var(--text-muted)', opacity: 0.8 }}>
                            {c.credits} Credits
                          </span>
                        </div>
                        <h3 className="course-title">{c.name}</h3>
                      </div>

                      {/* Shared Modal Trigger Button */}
                      <button
                        type="button"
                        className="grade-btn custom-select-trigger"
                        onClick={(e) => {
                          e.stopPropagation();
                          setGradeModalCourse(c);
                        }}
                        style={{
                          borderColor: colorStyle.border,
                          background: colorStyle.bg,
                          color: colorStyle.color,
                        }}
                      >
                        <span>{currentGradeText}</span>
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ width: '14px', height: '14px' }}
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <footer style={{ textAlign: 'center', padding: '32px 0 0', fontSize: '12px', color: 'var(--text-muted)', opacity: 0.6 }}>
          &copy; 2026 Azizi Yahya &middot; GPA Calculator &middot; v5.1
        </footer>
      </div>

      {/* ── Shared Grade Selector Modal ── */}
      <GradeModal
        isOpen={!!gradeModalCourse}
        course={gradeModalCourse}
        currentWeight={gradeModalCourse ? gpaData.grades[gradeModalCourse.id] : ''}
        grades={grades}
        isDark={isDark}
        onSelectGrade={handleSelectGrade}
        onClose={() => setGradeModalCourse(null)}
      />

      {/* ── Subjects Management Modal ── */}
      <SubjectsModal
        isOpen={subjectsModalOpen}
        courses={courses}
        onAddNew={() => {
          setEditingCourse(null);
          setCourseEditModalOpen(true);
        }}
        onEdit={(course) => {
          setEditingCourse(course);
          setCourseEditModalOpen(true);
        }}
        onDelete={handleDeleteCourse}
        onClose={() => setSubjectsModalOpen(false)}
      />

      {/* ── Add / Edit Course Modal ── */}
      <CourseEditModal
        isOpen={courseEditModalOpen}
        course={editingCourse}
        onSave={handleSaveCourse}
        onClose={() => {
          setCourseEditModalOpen(false);
          setEditingCourse(null);
        }}
      />

      {/* ── Quick Presets Modal ── */}
      <PresetModal
        isOpen={presetModalOpen}
        onSelectPreset={loadPreset}
        onClose={() => setPresetModalOpen(false)}
      />

      {/* ── Settings Modal ── */}
      <SettingsModal
        isOpen={settingsModalOpen}
        cgpaEnabled={cgpaEnabled}
        onToggleCgpa={setCgpaEnabled}
        activeScaleId={scaleId}
        onApplyScale={handleApplyScale}
        onExportConfig={handleExportConfig}
        onImportConfig={handleImportConfig}
        onClose={() => setSettingsModalOpen(false)}
      />

      {/* ── About Modal ── */}
      <AboutModal
        isOpen={aboutModalOpen}
        onClose={() => setAboutModalOpen(false)}
        title="GPA Calculator"
        version="v5.1"
        description={
          <>
            A simple academic tool designed to help students calculate and predict their{' '}
            <strong>semester GPA</strong> and <strong>cumulative GPA (CGPA)</strong> with ease.
          </>
        }
        icon={
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        }
        accentGradient="linear-gradient(135deg, #0ea5e9, #6366f1)"
        accentColor="#0ea5e9"
      />
    </div>
  );
}
