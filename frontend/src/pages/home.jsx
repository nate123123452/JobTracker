import React, {useEffect} from 'react';
import { ReactTyped as Typed } from 'react-typed';
import jobImage from '../assets/job.jpg';
import resumeImage from '../assets/resume.png';
import calendarImage from '../assets/calendar.jpg';
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom';  

const HomePage = () => {
  useEffect(() => {
    console.log('Home component mounted');
    return () => {
      console.log('Home component unmounted');
    };
  }, []);
  return (
    <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 1, ease: "easeInOut" }}
    >
      {/* Hero Section */}
      <div className='text-white max-w-[800px] mt-[-96px] w-full h-screen mx-auto text-center flex flex-col justify-center'>
        <p className='text-[#00df9a] font-bold p-2 text-xl'>Land Your Dream Job</p>
        <h1 className='md:text-6xl sm:text-5xl text-4xl font-bold md:py-6'>Manage Your Career</h1>
        <div className='flex justify-center items-center'>
          <p className='md:text-5xl sm:text-4xl text-xl font-bold py-3'>Keep Your Job Searches</p>
          <Typed 
            className='md:text-5xl sm:text-4xl text-xl font-bold pl-1.5'
            strings={['Organized', 'Simplified', 'Optimized']} 
            typeSpeed={100} 
            backSpeed={100} 
            loop
          />
        </div>
        <p className='md:text-2xl text-xl font-bold text-gray-500'>Track, schedule, and manage your job search with ease</p>
        <button className='bg-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto py-3 text-black'>Get Started</button>
      </div>

      {/* Jobs Section */}
      <div className='w-full bg-gray-50 py-16 px-4 border-t border-gray-400'>
        <div className='max-w-[1240px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center'>
          <img
            src={jobImage}
            alt='job-dashboard'
            className='w-full h-auto max-w-[600px] md:max-w-[700px] mx-auto mb-4 md:mb-0 rounded-lg shadow-md transition-transform duration-300 hover:scale-105 order-1 md:order-1'
          />
          <div className='flex flex-col justify-center order-2 md:order-2'>
            <p className='text-[#00df9a] font-bold'>JOB DASHBOARD</p>
            <h1 className='md:text-4xl sm:text-3xl text-2xl font-bold py-2'>Track Your Job Applications</h1>
            <p className='text-lg text-gray-700 mb-2'>
              Stay organized in your job search and manage your applications effectively.
            </p>
            <p className='text-lg text-gray-700'>
              Our platform allows you to track multiple applications, schedule interviews, and ensure you never miss an opportunity.
            </p>
            <Link to='/jobs'>
              <button className='bg-black text-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto md:mx-0 py-3'>
                Add Jobs
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Resumes Section */}
      <div className='w-full bg-gray-50 py-16 px-4 border-t border-gray-400'>
        <div className='max-w-[1240px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center'>
          <div className='flex flex-col justify-center order-2 md:order-1'>
            <p className='text-[#00df9a] font-bold'>RESUME DASHBOARD</p>
            <h1 className='md:text-4xl sm:text-3xl text-2xl font-bold py-2'>Organize and Track Your Resumes</h1>
            <p className='text-lg text-gray-700 mb-2'>
              Keep all your resumes in one place for easy access and management.
            </p>
            <p className='text-lg text-gray-700'>
              Upload, update, and monitor your resumes to stay prepared for job applications at any time.
            </p>
            <Link to='/resumes'>
              <button className='bg-black text-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto md:mx-0 py-3'>
                Upload Resume
              </button>
            </Link>
          </div>
          <img
            src={resumeImage}
            alt='resume'
            className='w-full h-auto max-w-[300px] md:max-w-[400px] mx-auto mb-4 md:mb-0 rounded-lg shadow-md transition-transform duration-300 hover:scale-105 order-1 md:order-2'
          />
        </div>
      </div>

      {/* Calendar Section */}
      <div className='w-full bg-gray-50 py-16 px-4 border-t border-gray-400'>
        <div className='max-w-[1240px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center'>
          <img
            src={calendarImage}
            alt='calendar-dashboard'
            className='w-full h-auto max-w-[400px] mx-auto mb-4 md:mb-0 rounded-lg shadow-md transition-transform duration-300 hover:scale-105 order-1 md:order-1'
          />
          <div className='flex flex-col justify-center order-2 md:order-2'>
            <p className='text-[#00df9a] font-bold'>CALENDAR DASHBOARD</p>
            <h1 className='md:text-4xl sm:text-3xl text-2xl font-bold py-2'>Manage Your Job Search Schedule</h1>
            <p className='text-lg text-gray-700 mb-2'>
              Keep track of your upcoming interviews, deadlines, and follow-ups.
            </p>
            <p className='text-lg text-gray-700'>
              Our Calendar Dashboard integrates all your job search activities so you can stay on top of your schedule and never miss an important event.
            </p>
            <Link to='/calendar'>
              <button className='bg-black text-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto md:mx-0 py-3'>
                View Calendar
              </button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HomePage;
