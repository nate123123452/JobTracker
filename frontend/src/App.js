import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/home';
import JobPage from './pages/job';
import ResumePage from './pages/resume';
import CalendarPage from './pages/calendar';
import LoginForm from './components/LoginForm';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs" element={<JobPage />} />
        <Route path="/resumes" element={<ResumePage />} />
        <Route path="/calendar" element={<CalendarPage />} />
      </Routes>
      <LoginForm />
    </Router>
  );
}

export default App;