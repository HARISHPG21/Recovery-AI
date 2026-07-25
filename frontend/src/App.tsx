import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { RecoveryProvider } from './context/RecoveryContext';
import { VoiceProvider } from './context/VoiceContext';

import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/Toast';
import { FloatingCoach } from './components/FloatingCoach';
import { BackgroundParticles } from './components/BackgroundParticles';

import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { VoiceCoachPage } from './pages/VoiceCoachPage';
import { EmergencyPage } from './pages/EmergencyPage';
import { CaregiverPage } from './pages/CaregiverPage';
import { EducationPage } from './pages/EducationPage';
import { CheckInPage } from './pages/CheckInPage';
import { SafetyPage } from './pages/SafetyPage';
import { BreathingPage } from './pages/BreathingPage';
import { ToolkitPage } from './pages/ToolkitPage';
import { ProgressPage } from './pages/ProgressPage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  return (
    <RecoveryProvider>
      <VoiceProvider>
        <Router>
          <div
            className="relative min-h-screen flex flex-col text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200"
            style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
          >
            {/* Skip to Main Content Link for Screen Readers */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded-lg focus:shadow-xl focus:outline-none"
            >
              Skip to main content
            </a>

            {/* Ambient Particle Mesh Canvas */}
            <BackgroundParticles />

            {/* Top Glass Navbar */}
            <Navbar />

            {/* Main Layout Container with Desktop Sidebar */}
            <div className="flex-1 flex max-w-[1600px] w-full mx-auto relative z-10">
              <Sidebar />
              <main id="main-content" tabIndex={-1} role="main" aria-label="Main Application Content" className="flex-1 min-w-0 pb-16 outline-none">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/coach" element={<VoiceCoachPage />} />
                  <Route path="/emergency" element={<EmergencyPage />} />
                  <Route path="/caregiver" element={<CaregiverPage />} />
                  <Route path="/education" element={<EducationPage />} />
                  <Route path="/checkin" element={<CheckInPage />} />
                  <Route path="/safety" element={<SafetyPage />} />
                  <Route path="/breathing" element={<BreathingPage />} />
                  <Route path="/toolkit" element={<ToolkitPage />} />
                  <Route path="/progress" element={<ProgressPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>

            {/* Persistent Floating AI Voice Companion Drawer */}
            <FloatingCoach />

            {/* Floating Toast Notification Container */}
            <ToastContainer />

            {/* Responsive Footer */}
            <Footer />
          </div>
        </Router>
      </VoiceProvider>
    </RecoveryProvider>
  );
};

export default App;
