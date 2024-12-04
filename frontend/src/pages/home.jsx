import React, { useEffect }from 'react';
import { ReactTyped as Typed } from 'react-typed';
import jobImage from '../assets/job.jpg';
import resumeImage from '../assets/resume.png';
import calendarImage from '../assets/calendar.jpg';
import { motion, useInView } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const HomePage = ({ isLoggedIn, onGetStartedClick }) => {
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    navigate('/');
    onGetStartedClick();
  };


  // Refs and visibility states for each section
  const jobRef = React.useRef(null);
  const isJobInView = useInView(jobRef, { once: true });

  const resumeRef = React.useRef(null);
  const isResumeInView = useInView(resumeRef, { once: true });

  const calendarRef = React.useRef(null);
  const isCalendarInView = useInView(calendarRef, { once: true });  
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className='overflow-hidden'
    >
      {/* Hero Section */}
      <div className={`text-white w-full h-screen mx-auto text-center flex flex-col justify-center items-center`}>
          <p className="text-[#586eff] font-bold p-2 text-xl">Land Your Dream Job</p>
          <h1 className="md:text-6xl sm:text-5xl text-4xl font-bold md:py-6">Manage Your Career</h1>
          <div className="flex justify-center items-center overflow-auto">
            <p className="md:text-5xl sm:text-4xl text-xl font-bold py-3 whitespace-nowrap">Keep Your Job Searches</p>
            <Typed
              className="md:text-5xl sm:text-4xl text-2xl font-bold pl-2 whitespace-nowrap overflow-hidden max-w-full text-[#586eff]"
              strings={['Planned', 'Managed', 'Tracked']}
              typeSpeed={100}
              backSpeed={100}
              loop
            />
          </div>
          <p className="md:text-3xl text-2xl font-bold text-gray-500">Search, Apply, Repeat</p>
        {!isLoggedIn && (
          <button
            onClick={handleGetStartedClick}
            className="bg-[#586eff] w-[200px] rounded-md font-medium my-6 mx-auto py-3 text-black"
          >
            Get Started
          </button>
        )}
      </div>

      {/* Jobs Section */}
      <div ref={jobRef} className="w-full bg-gray-50 py-16 px-4 border-t border-gray-400">
        <motion.div
          className="max-w-[1240px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
          initial={{ opacity: 0, x: -100 }}
          animate={isJobInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.25}}
        >
          <img
            src={jobImage}
            alt="job-dashboard"
            className="w-full h-auto max-w-[600px] md:max-w-[700px] mx-auto mb-4 md:mb-0 rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
          />
          <div className="flex flex-col justify-center">
            <p className="text-[#586eff] font-bold">JOB DASHBOARD</p>
            <h1 className="md:text-4xl sm:text-3xl text-2xl font-bold py-2">Track Your Job Applications</h1>
            <p className="text-lg text-gray-700 mb-2">
              Stay organized in your job search and manage your applications effectively.
            </p>
            <p className="text-lg text-gray-700">
              Our platform allows you to track multiple applications, schedule interviews, and ensure you never miss an
              opportunity.
            </p>
            <Link to="/jobs">
              <button className="bg-[#2d2d2d] text-[#586eff] w-[200px] rounded-md font-medium my-6 mx-auto md:mx-0 py-3">
                Add Jobs
              </button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Resumes Section */}
      <div ref={resumeRef} className="w-full bg-gray-50 py-16 px-4 border-t border-gray-400">
        <motion.div
          className="max-w-[1240px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
          initial={{ opacity: 0, x: 100 }}
          animate={isResumeInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, ease: 'easeInOut', delay: 0.25 }}
        >
          <img
            src={resumeImage}
            alt="resume"
            className="w-full h-auto max-w-[300px] md:max-w-[400px] mx-auto mb-4 md:mb-0 rounded-lg shadow-md transition-transform duration-300 hover:scale-105 order-1 md:order-2"
          />
          <div className="flex flex-col justify-center order-2 md:order-1">
            <p className="text-[#586eff] font-bold">RESUME DASHBOARD</p>
            <h1 className="md:text-4xl sm:text-3xl text-2xl font-bold py-2">Organize and Track Your Resumes</h1>
            <p className="text-lg text-gray-700 mb-2">
              Keep all your resumes in one place for easy access and management.
            </p>
            <p className="text-lg text-gray-700">
              Upload, update, and monitor your resumes to stay prepared for job applications at any time.
            </p>
            <Link to="/resumes">
              <button className="bg-[#2d2d2d] text-[#586eff] w-[200px] rounded-md font-medium my-6 mx-auto md:mx-0 py-3">
                Upload Resume
              </button>
            </Link>
          </div>
          
          </motion.div>
      </div>

      {/* Calendar Section */}
      <div ref={calendarRef} className="w-full bg-gray-50 py-16 px-4 border-t border-gray-400">
        <motion.div
          className="max-w-[1240px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
          initial={{ opacity: 0, y: 100 }}
          animate={isCalendarInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: 'easeInOut', delay: 0.25 }}
        >
          <img
            src={calendarImage}
            alt="calendar-dashboard"
            className="w-full h-auto max-w-[400px] mx-auto mb-4 md:mb-0 rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
          />
          <div className="flex flex-col justify-center">
            <p className="text-[#586eff] font-bold">CALENDAR DASHBOARD</p>
            <h1 className="md:text-4xl sm:text-3xl text-2xl font-bold py-2">Manage Your Job Search Schedule</h1>
            <p className="text-lg text-gray-700 mb-2">
              Keep track of your upcoming interviews, deadlines, and follow-ups.
            </p>
            <p className="text-lg text-gray-700">
              Our Calendar Dashboard integrates all your job search activities so you can stay on top of your schedule and
              never miss an important event.
            </p>
            <Link to="/calendar">
              <button className="bg-[#2d2d2d] text-[#586eff] w-[200px] rounded-md font-medium my-6 mx-auto md:mx-0 py-3">
                View Calendar
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HomePage;
