import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/home';
import JobPage from './pages/job';
import ResumePage from './pages/resume';
import CalendarPage from './pages/calendar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from './components/Modal';
import LoginForm from './components/LoginForm';

function App() {
  const [isModelOpen, setIsModelOpen] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [username, setUsername] = React.useState('');


  const toggleModal = () => setIsModelOpen(!isModelOpen);

  const handleLoginSuccess = (username) => {
    setIsLoggedIn(true);
    setUsername(username);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', username);
    toggleModal();
  }

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    toast.success('Logged out successfully', {
      position: 'top-center',
      autoClose: 1500,
    });
  }
  
  window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  }

  return (
    <Router>
      <Navbar 
        isLoggedIn={isLoggedIn} 
        username={username} 
        handleLogout={handleLogout} 
        toggleModal={toggleModal}
        setIsLoggedIn={setIsLoggedIn}
        setUsername={setUsername}
      />
      <Routes>
        <Route path="/" element={<HomePage onGetStartedClick={toggleModal} isLoggedIn={isLoggedIn}/>} />
        <Route path="/jobs" element={<JobPage />} />
        <Route path="/resumes" element={<ResumePage />} />
        <Route path="/calendar" element={<CalendarPage />} />
      </Routes>
      <Modal isOpen={isModelOpen} onClose={toggleModal}>
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      </Modal>
      <ToastContainer position="top-center" autoClose={1500} />
    </Router>
  );
}

export default App;