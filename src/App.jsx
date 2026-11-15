import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import GpaCalculator from './pages/GpaCalculator/GpaCalculator';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/gpa-calculator" element={<GpaCalculator />} />
        <Route path="/gpa-calculator.html" element={<Navigate to="/gpa-calculator" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
