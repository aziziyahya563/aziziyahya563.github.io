export const STORAGE_KEY_GPA = "REACT_GPA_DATA_V1";
export const STORAGE_KEY_COURSES = "REACT_GPA_COURSES_V1";
export const STORAGE_KEY_SCALE = "REACT_GPA_SCALE_V1";
export const STORAGE_KEY_CGPA_ENABLED = "REACT_GPA_CGPA_ENABLED_V1";
export const STORAGE_KEY_ACTIVE_SEM = "REACT_GPA_ACTIVE_SEM_V1";

export const SCALE_PRESETS = [
  {
    id: "standard",
    name: "Standard 4.0 Scale",
    desc: "The most common academic scale featuring plus and minus grades (A=4.0, A-=3.75, B+=3.5).",
    grades: [
      { grade: "A", weight: 4.0 }, { grade: "A-", weight: 3.75 }, { grade: "B+", weight: 3.5 },
      { grade: "B", weight: 3.0 }, { grade: "B-", weight: 2.75 }, { grade: "C+", weight: 2.5 },
      { grade: "C", weight: 2.0 }, { grade: "C-", weight: 1.75 }, { grade: "D+", weight: 1.5 },
      { grade: "D", weight: 1.0 }, { grade: "D-", weight: 0.75 }, { grade: "F", weight: 0.0 },
    ],
  },
  {
    id: "public-uni",
    name: "Public University Scale",
    desc: "Commonly used in public institutions with specific weightings (A=4.0, A-=3.67, B+=3.33).",
    grades: [
      { grade: "A", weight: 4.0 }, { grade: "A-", weight: 3.67 }, { grade: "B+", weight: 3.33 },
      { grade: "B", weight: 3.0 }, { grade: "B-", weight: 2.67 }, { grade: "C+", weight: 2.33 },
      { grade: "C", weight: 2.0 }, { grade: "C-", weight: 1.67 }, { grade: "D", weight: 1.0 },
      { grade: "E", weight: 0.67 }, { grade: "F", weight: 0.0 },
    ],
  },
];

export const sem3Courses = [
  { code: "NMT21305", name: "Embedded System Programming Tool", credits: 5 },
  { code: "NMT21403", name: "Network Security Implementation", credits: 3 },
  { code: "NMT21503", name: "Professional Practices", credits: 3 },
  { code: "NMT21602", name: "Data Acquisition Technology", credits: 2 },
  { code: "SMB11802", name: "Preparatory German Language", credits: 2 },
  { code: "SMB31202", name: "English For Technical Communication", credits: 2 },
];

export const sem4Courses = [
  { code: "NMT22104", name: "Data Acquisition Technology and Analysis 2", credits: 4 },
  { code: "NMT22202", name: "System Optimization Technology 1", credits: 2 },
  { code: "NMT22302", name: "Application System Development 1", credits: 2 },
  { code: "NMT22404", name: "Operation Management Technology", credits: 4 },
  { code: "NMT22504", name: "Technopreneur Project 1", credits: 4 },
  { code: "SMU22402", name: "Engineering Entrepreneurship", credits: 2 },
];

export const sem5Courses = [
  { code: "NMT31104", name: "System Optimization Technology 2", credits: 4 },
  { code: "NMT31204", name: "Application System Development 2", credits: 4 },
  { code: "NMT31404", name: "Technopreneur Project 2", credits: 4 },
  { code: "NMT32105", name: "System Integration Design", credits: 5 },
  { code: "SMU13102", name: "Appreciation Of Ethics And Civilization", credits: 2 },
];

export function getGradeColorStyle(weightStr, isDark) {
  if (weightStr === "" || weightStr === undefined || weightStr === null) {
    return {
      border: "var(--border)",
      bg: "var(--bg)",
      color: "var(--text-main)",
    };
  }
  const w = parseFloat(weightStr);

  if (w >= 3.5) {
    return {
      border: "rgba(16, 185, 129, 0.4)",
      bg: isDark ? "rgba(16, 185, 129, 0.15)" : "rgba(16, 185, 129, 0.08)",
      color: "#10b981",
    };
  } else if (w >= 2.5) {
    return {
      border: "rgba(99, 102, 241, 0.4)",
      bg: isDark ? "rgba(99, 102, 241, 0.15)" : "rgba(99, 102, 241, 0.08)",
      color: "#6366f1",
    };
  } else if (w >= 1.5) {
    return {
      border: "rgba(245, 158, 11, 0.4)",
      bg: isDark ? "rgba(245, 158, 11, 0.15)" : "rgba(245, 158, 11, 0.08)",
      color: "#f59e0b",
    };
  } else if (w > 0) {
    return {
      border: "rgba(239, 68, 68, 0.4)",
      bg: isDark ? "rgba(239, 68, 68, 0.15)" : "rgba(239, 68, 68, 0.08)",
      color: "#ef4444",
    };
  } else {
    return {
      border: "rgba(220, 38, 38, 0.6)",
      bg: isDark ? "rgba(220, 38, 38, 0.25)" : "rgba(220, 38, 38, 0.15)",
      color: "#dc2626",
    };
  }
}
