import React, { useState, useEffect } from 'react';
import { AiOutlineClose, AiOutlineMenu, AiOutlineUser } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import Modal from './Modal';
import LoginForm from './LoginForm';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Navbar = () => {
    const [nav, setNav] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLogout, setShowLogout] = useState(false);
    const [username, setUsername] = useState('');

    const navigate = useNavigate();

    const handleNav = () => setNav(!nav);
    const toggleModal = () => setIsModalOpen(!isModalOpen);
    const closeModal = () => setIsModalOpen(false);

    const handleLoginSuccess = (username) => {
        setIsLoggedIn(true);
        setUsername(username);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        closeModal();
        setNav(false);

        toast.success(`Welcome back, ${username}!`, {
            position: 'top-center',
            autoClose: 1500,
        });
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setShowLogout(false);
        setUsername('');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/');
        setNav(false);

        toast.success(`Logged Out Successfully!`, {
            position: 'top-center',
            autoClose: 1500,
        });
    };

    useEffect(() => {
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const storedUsername = localStorage.getItem('username');
        if (loggedIn && storedUsername) {
            setIsLoggedIn(true);
            setUsername(storedUsername);
        }
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) setNav(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className='relative'>
            <div className='flex justify-between items-center h-24 w-full mx-auto px-16 mb-2 text-white'>
                <Link to="/">
                    <h1 className='w-full text-3xl font-bold text-[#00df9a] font-montserrat'>JobTracker</h1>
                </Link>

                {/* Desktop Navigation */}
                <ul className='hidden md:flex items-center'>
                    <li className='p-4 hover:text-[#00df9a]'>
                        <Link to="/" className='font-montserrat'>Home</Link>
                    </li>
                    <li className='p-4 hover:text-[#00df9a]'>
                        <Link to="/jobs" className='font-montserrat'>Jobs</Link>
                    </li>
                    <li className='p-4 hover:text-[#00df9a]'>
                        <Link to="/resumes" className='font-montserrat'>Resumes</Link>
                    </li>
                    <li className='p-4 hover:text-[#00df9a]'>
                        <Link to="/calendar" className='font-montserrat'>Calendar</Link>
                    </li>
                    <li className='p-4 relative'>
                        {isLoggedIn ? (
                            <>
                                <div
                                    className="cursor-pointer hover:text-[#00df9a] transition-colors"
                                    onClick={() => setShowLogout(!showLogout)}
                                >
                                    <AiOutlineUser size={30} />
                                </div>
                                {showLogout && (
                                    <div
                                        className="absolute right-4 mt-2 w-48 bg-white text-black rounded-lg shadow-lg transition-all ease-in-out duration-300 z-50"
                                        onClick={() => setShowLogout(false)}
                                    >
                                        <div className="px-4 py-2 text-sm">
                                            <span className="block text-[#00df9a]">Logged in as:</span>
                                            <span className="font-bold">{username}</span>
                                        </div>
                                        <hr className="border-gray-700" />
                                        <button
                                            onClick={handleLogout}
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
                                className='font-montserrat bg-[#00df9a] text-white px-4 py-2 rounded'
                            >
                                Login
                            </button>
                        )}
                    </li>
                </ul>

                {/* Hamburger Menu */}
                <div onClick={handleNav} className='block md:hidden cursor-pointer'>
                    {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
                </div>
            </div>

            {/* Mobile Navigation */}
            <div
                className={
                    nav
                        ? 'fixed left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#000300] ease-in-out duration-500 z-50'
                        : 'fixed left-[-100%]'
                }
            >
                <Link to="/" onClick={handleNav}>
                    <h1 className='w-full text-3xl font-bold text-[#00df9a] m-4 font-montserrat'>JobTracker</h1>
                </Link>
                <ul className='text-white uppercase p-4'>
                    {isLoggedIn && (
                        <li className='p-4 text-[#00df9a] font-bold border-b border-gray-600'>
                            Logged in as: {username}
                        </li>
                    )}
                    <li className='p-4 border-b border-gray-600 hover:text-[#00df9a]'>
                        <Link to="/" onClick={handleNav} className='font-roboto'>Home</Link>
                    </li>
                    <li className='p-4 border-b border-gray-600 hover:text-[#00df9a]'>
                        <Link to="/jobs" onClick={handleNav} className='font-roboto'>Jobs</Link>
                    </li>
                    <li className='p-4 border-b border-gray-600 hover:text-[#00df9a]'>
                        <Link to="/resumes" onClick={handleNav} className='font-roboto'>Resumes</Link>
                    </li>
                    <li className='p-4 border-b border-gray-600 hover:text-[#00df9a]'>
                        <Link to="/calendar" onClick={handleNav} className='font-roboto'>Calendar</Link>
                    </li>
                    <li className='p-4'>
                        {isLoggedIn ? (
                            <button
                                onClick={handleLogout}
                                className='font-montserrat bg-red-600 text-white px-4 py-2 rounded'
                            >
                                Logout
                            </button>
                        ) : (
                            <button
                                onClick={toggleModal}
                                className='font-montserrat bg-[#00df9a] text-white px-4 py-2 rounded'
                            >
                                Login
                            </button>
                        )}
                    </li>
                </ul>
            </div>

            <Modal isOpen={isModalOpen} onClose={toggleModal}>
                <LoginForm onLoginSuccess={handleLoginSuccess} />
            </Modal>
        </div>
    );
};

export default Navbar;