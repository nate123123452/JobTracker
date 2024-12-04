import React, { useState, useEffect, useRef } from 'react';
import { AiOutlineClose, AiOutlineMenu, AiOutlineUser } from 'react-icons/ai';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Modal from './Modal';
import LoginForm from './LoginForm';


const Navbar = ({ handleLoginSuccess, isLoggedIn, setIsLoggedIn, username, setUsername, handleLogout, toggleModal, isModelOpen }) => {
    const [nav, setNav] = useState(false);
    const [showLogout, setShowLogout] = useState(false);
    const dropdownRef = useRef(null);
    const navRef = useRef(null);
    const modalRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const scrollToTop = () => window.scrollTo(0, 0);

    const handleNav = () => setNav(!nav);

    const handleLoginSuccessLocal = () => {
        handleLoginSuccess(username);
        handleNav();
        scrollToTop();
    };

    const handleLogoutMobile = () => {   
        handleLogout();
        handleNav();
        navigate('/');
        scrollToTop();
    };

    const handleLogoutDesktop = () => {
        handleLogout();
        navigate('/');
        scrollToTop();
    };

    const handleLogoClick = () => {
        if (location.pathname === '/') {
            window.location.reload();
        }
    };

    const getLinkClass = (path) => {
        return location.pathname === path ? 'text-[#586eff]' : 'hover:text-[#586eff]';
    };

    useEffect(() => {
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const storedUsername = localStorage.getItem('username');
        if (loggedIn && storedUsername) {
            setIsLoggedIn(true);
            setUsername(storedUsername);
        }
    }, [setIsLoggedIn, setUsername]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) setNav(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowLogout(false);
            }
            if (navRef.current && !navRef.current.contains(event.target)) {
                setNav(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showLogout, nav]);    
    
    return (
        <div className='relative'>
            <div className='fixed top-0 left-0 w-full bg-[#2d2d2d] z-50'>
                <div className='flex justify-between items-center h-24 w-full mx-auto px-4 md:px-16 text-white'>
                    <Link to= '/' onClick={handleLogoClick} className='cursor-pointer'>
                        <h1 className='w-full text-3xl font-bold text-[#586eff] font-montserrat ml-6'>JobTracker</h1>
                    </Link>
                    {/* Desktop Navigation */}
                    <ul className='hidden md:flex items-center'>
                        <li className={`p-4 ${getLinkClass('/')}`}>
                            <Link to="/" className='font-montserrat'>Home</Link>
                        </li>
                        <li className={`p-4 ${getLinkClass('/jobs')}`}>
                            <Link to="/jobs" className='font-montserrat'>Jobs</Link>
                        </li>
                        <li className={`p-4 ${getLinkClass('/resumes')}`}>
                            <Link to="/resumes" className='font-montserrat'>Resumes</Link>
                        </li>
                        <li className={`p-4 ${getLinkClass('/calendar')}`}>
                            <Link to="/calendar" className='font-montserrat'>Calendar</Link>
                        </li>
                        <li className='p-4 relative'>
                            {isLoggedIn ? (
                                <>
                                    <div
                                        className="cursor-pointer hover:text-[#586eff] transition-colors"
                                        onClick={() => setShowLogout(!showLogout)}
                                    >
                                        <AiOutlineUser size={30} />
                                    </div>
                                    {showLogout && (
                                        <div
                                            ref={dropdownRef}
                                            className="absolute right-4 mt-2 w-48 bg-white text-black rounded-lg shadow-lg transition-all ease-in-out duration-300 z-50"
                                        >
                                            <div className="px-4 py-2 text-sm">
                                                <span className="block text-[#586eff]">Logged in as:</span>
                                                <span className="font-bold max-w-[100px] overflow-hidden text-overflow-ellipsis whitespace-nowrap">{username}</span>
                                            </div>
                                            <hr className="border-gray-700" />
                                            <button
                                                onClick={handleLogoutDesktop}
                                                className="block px-4 py-2 text-sm hover:bg-red-600 transition-colors w-full text-left rounded-b text-red-500"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <button
                                    onClick={toggleModal}
                                    className='font-montserrat bg-[#586eff] text-white px-4 py-2 rounded'
                                >
                                    Login
                                </button>
                            )}
                        </li>
                    </ul>

                    {/* Hamburger Menu */}
                    <div onClick={handleNav} className='block md:hidden cursor-pointer mr-6'>
                        {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div
                ref={navRef}
                className={
                    nav
                        ? 'fixed left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#2d2d2d] ease-in-out duration-500 z-50 overflow-x-hidden'
                        : 'fixed left-[-100%]'
                }
            >
                <div className='flex ml-3 mt-3'>
                    <Link to='/' onClick={() => { handleNav(); handleLogoClick(); }} className='cursor-pointer'>
                        <h1 className='w-full text-3xl font-bold text-[#586eff] m-4 font-montserrat'>JobTracker</h1>
                    </Link>
                </div>
                <ul className='text-white uppercase p-4'>
                    {isLoggedIn && (
                        <li className='p-4 text-[#586eff] font-bold border-b border-gray-600'>
                            Logged in as: {username}
                        </li>
                    )}
                    <li className={`p-4 border-b border-gray-600 ${getLinkClass('/')}`}>
                        <Link to="/" onClick={handleNav} className='font-roboto'>Home</Link>
                    </li>
                    <li className={`p-4 border-b border-gray-600 ${getLinkClass('/jobs')}`}>
                        <Link to="/jobs" onClick={handleNav} className='font-roboto'>Jobs</Link>
                    </li>
                    <li className={`p-4 border-b border-gray-600 ${getLinkClass('/resumes')}`}>
                        <Link to="/resumes" onClick={handleNav} className='font-roboto'>Resumes</Link>
                    </li>
                    <li className={`p-4 border-b border-gray-600 ${getLinkClass('/calendar')}`}>
                        <Link to="/calendar" onClick={handleNav} className='font-roboto'>Calendar</Link>
                    </li>
                    <li className='p-4'>
                        {isLoggedIn ? (
                            <button
                                onClick={handleLogoutMobile}
                                className='font-montserrat bg-red-600 text-white px-4 py-2 rounded'
                            >
                                Logout
                            </button>
                        ) : (
                            <button
                                onClick={toggleModal}
                                className='font-montserrat bg-[#586eff] text-white px-4 py-2 rounded'
                            >
                                Login
                            </button>
                        )}
                    </li>
                </ul>
            </div>

            <Modal isOpen={isModelOpen} onClose={toggleModal} ref={modalRef}>
                <LoginForm onLoginSuccess={handleLoginSuccessLocal} />
            </Modal>
        </div>
    );
};

export default Navbar;