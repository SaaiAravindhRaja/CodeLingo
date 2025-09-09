import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ChatbotProvider } from './contexts/ChatbotContext';
import { ChatbotWidget } from './components/ChatbotWidget';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import CourseSelectionPage from './pages/CourseSelectionPage';
import LessonScreen from './pages/LessonScreen';
import ProfilePage from './pages/ProfilePage';
import './App.css';

function App() {
  return (
    <ChatbotProvider>
      <Router>
        <Header />
        <div className="App">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/courses" element={<CourseSelectionPage />} />
            <Route path="/lessons/:courseId" element={<LessonScreen />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </div>
        <Footer />
        <ChatbotWidget />
      </Router>
    </ChatbotProvider>
  );
}

export default App;
