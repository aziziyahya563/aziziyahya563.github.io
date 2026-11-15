import React from 'react';

export const APP_SECTIONS = [
  {
    id: 'tools',
    label: 'Tools',
    items: [
      {
        id: 'marks-calculator',
        name: 'Grade Calculator',
        desc: 'Track marks & estimate your final grade',
        tag: 'Education',
        accent: '#10b981',
        href: '/marks-calculator.html',
        isInternalRoute: false,
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
            <line x1="8" y1="10" x2="16" y2="10" />
            <line x1="8" y1="14" x2="16" y2="14" />
            <line x1="8" y1="6" x2="12" y2="6" />
          </svg>
        ),
      },
      {
        id: 'gpa-calculator',
        name: 'GPA Calculator',
        desc: 'Calculate and track your semester & GPA and cumulative GPA',
        tag: 'Education',
        accent: '#0ea5e9',
        href: '/gpa-calculator',
        isInternalRoute: true, // Uses React Router <Link>
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        ),
      },
      {
        id: 'story-card-maker',
        name: 'Story Card Maker',
        desc: 'Gradient story backgrounds in seconds',
        tag: 'Design',
        accent: '#a855f7',
        href: '/story-card-maker.html',
        isInternalRoute: false,
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="4" />
            <path d="M21.17 8A10 10 0 0 1 22 12" />
            <path d="M2.83 8A10 10 0 0 0 2 12" />
          </svg>
        ),
      },
    ],
  },
  {
    id: 'showcase',
    label: 'Showcase',
    items: [
      {
        id: 'desk-setups',
        name: 'Desk Setups',
        desc: 'My personal workspace configurations',
        tag: 'Showcase',
        accent: '#0ea5e9',
        href: '/desk-setups.html',
        isInternalRoute: false,
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        ),
      },
      {
        id: 'arduino-projects',
        name: 'Arduino Projects',
        desc: 'Electronics builds & experiments',
        tag: 'Electronics',
        accent: '#f97316',
        href: '/arduino-projects.html',
        isInternalRoute: false,
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
          </svg>
        ),
      },
    ],
  },
  {
    id: 'utilities',
    label: 'Utilities',
    items: [
      {
        id: 'hijri-converter',
        name: 'Hijri Converter',
        desc: 'Convert Gregorian dates to Hijri instantly',
        tag: 'Utility',
        accent: '#10b981',
        href: '/hijri-converter.html',
        isInternalRoute: false,
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        ),
      },
      {
        id: 'namelistupd',
        name: 'Name List Updater',
        desc: 'Quickly edit and sort name lists',
        tag: 'Utility',
        accent: '#f43f5e',
        href: '/namelistupd.html',
        isInternalRoute: false,
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
        ),
      },
      {
        id: 'namelistgen',
        name: 'Name List Generator',
        desc: 'Generate formatted numbered name lists',
        tag: 'Utility',
        accent: '#8b5cf6',
        href: '/namelistgen.html',
        isInternalRoute: false,
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <line x1="9" y1="15" x2="15" y2="15" />
          </svg>
        ),
      },
    ],
  },
];
