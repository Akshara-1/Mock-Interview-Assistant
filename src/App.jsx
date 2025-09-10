// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './pages/Layout.jsx'; 
import Dashboard from './pages/Dashboard.js';
import ResumeUpload from './pages/ResumeUpload.js';

export default function App() {
  return (
    <div>
      <div className="p-4 bg-blue-100 text-blue-800 text-center">
        HMR Test: This message was added to App.jsx!
      </div>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/resumeupload" element={<ResumeUpload />} />
          <Route path="/mockinterview" element={<div>Mock Interview Page</div>} />
          <Route path="/results" element={<div>Results Page</div>} />
          <Route path="/jobmatches" element={<div>Job Matches Page</div>} />
          <Route path="/candidates" element={<div>Candidates Page</div>} />
        </Routes>
      </Layout>
    </div>
  );
}