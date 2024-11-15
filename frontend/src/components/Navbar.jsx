import React, { useState, useEffect } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [nav, setNav] = useState(false);

    const handleNav = () => {
        setNav(!nav);
    };

    // Close mobile menu on resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) { // Adjust this value based on your breakpoint
                setNav(false); // Close the mobile menu
            }
        };

        window.addEventListener('resize', handleResize);

        // Cleanup the event listener on unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className='flex justify-between items-center h-24 w-full mx-auto px-16 mb-2 text-white 
'>
            <Link to="/">
              <h1 className='w-full text-3xl font-bold text-[#00df9a] font-montserrat'>JobTracker</h1>
            </Link>
            
            {/* Desktop Navigation */}
            <ul className='hidden md:flex'>
                <li className='p-4'>
                    <Link to="/" className='font-montserrat'>Home</Link>
                </li>
                <li className='p-4'>
                    <Link to="/jobs" className='font-montserrat'>Jobs</Link>
                </li>
                <li className='p-4'>
                    <Link to="/resumes" className='font-montserrat'>Resumes</Link>
                </li>
                <li className='p-4'>
                    <Link to="/calendar" className='font-montserrat'>Calendar</Link>
                </li>
            </ul>

            {/* Hamburger Menu Icon */}
            <div onClick={handleNav} className='block md:hidden cursor-pointer'>
                {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
            </div>

            {/* Mobile Navigation */}
            <div className={nav ? 'fixed left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#000300] ease-in-out duration-500 z-50' : 'fixed left-[-100%]'}>
                <h1 className='w-full text-3xl font-bold text-[#00df9a] m-4 font-montserrat'>JobTracker</h1>
                <ul className='uppercase p-4'>
                    <li className='p-4 border-b border-gray-600'>
                        <Link to="/" onClick={handleNav} className='font-roboto'>Home</Link>
                    </li>
                    <li className='p-4 border-b border-gray-600'>
                        <Link to="/jobs" onClick={handleNav} className='font-roboto'>Jobs</Link>
                    </li>
                    <li className='p-4 border-b border-gray-600'>
                        <Link to="/resumes" onClick={handleNav} className='font-roboto'>Resumes</Link>
                    </li>
                    <li className='p-4'>
                        <Link to="/calendar" onClick={handleNav} className='font-roboto'>Calendar</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Navbar;
