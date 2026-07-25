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
          <div className="relative min-h-screen flex flex-col bg-[#090D16] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
            {/* Ambient Particle Mesh Canvas */}
            <BackgroundParticles />

            {/* Top Glass Navbar */}
            <Navbar />

            {/* Main Layout Container with Desktop Sidebar */}
            <div className="flex-1 flex max-w-[1600px] w-full mx-auto relative z-10">
              <Sidebar />
              <main className="flex-1 min-w-0 pb-16">
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
