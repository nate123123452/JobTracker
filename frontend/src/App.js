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
  // State variable to manage modal
  const [isModelOpen, setIsModelOpen] = React.useState(false);

  // State variable to manage login status
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  // State to manage stored username
  const [username, setUsername] = React.useState('');

  // Function to toggle modal
  const toggleModal = () => setIsModelOpen(!isModelOpen);

  // Function to handle login success
  const handleLoginSuccess = (username) => {
    setIsLoggedIn(true);
    setUsername(username);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', username);
    toggleModal();
  }

  // Function to handle logout
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
  
  // Scroll to top when component mounts
  window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  }

  return (
    <Router>

      {/* Navbar component */}
      <Navbar 
        isLoggedIn={isLoggedIn} 
        username={username} 
        handleLogout={handleLogout} 
        toggleModal={toggleModal}
        setIsLoggedIn={setIsLoggedIn}
        setUsername={setUsername}
      />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<HomePage onGetStartedClick={toggleModal} isLoggedIn={isLoggedIn}/>} />
        <Route path="/jobs" element={<JobPage />} />
        <Route path="/resumes" element={<ResumePage />} />
        <Route path="/calendar" element={<CalendarPage />} />
      </Routes>

      {/* Modal for login form */}
      <Modal isOpen={isModelOpen} onClose={toggleModal}>
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      </Modal>

      {/* Toast container */}
      <ToastContainer position="top-center" autoClose={1500} />
      
    </Router>
  );
}

export default App;