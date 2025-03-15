import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoIosMenu } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { useStoreContext } from "../contextApi/ContextApi";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../contextApi/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const navigate = useNavigate();
  const { token, setToken } = useStoreContext();
  const { isDarkMode } = useTheme();
  const path = useLocation().pathname;
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const onLogOutHandler = () => {
    setToken(null);
    localStorage.removeItem("JWT_TOKEN");
    navigate("/login");
  };

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    ...(token ? [{ path: "/dashboard", label: "Dashboard" }] : []),
  ];

  return (
    <motion.div 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`navbar fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? isDarkMode 
            ? 'bg-darkCard/95 backdrop-blur-md shadow-dark-card' 
            : 'bg-white/95 backdrop-blur-md shadow-md'
          : isDarkMode 
            ? 'bg-transparent' 
            : 'bg-transparent'
      }`}
    >
      <div className="lg:px-14 sm:px-8 px-4 h-16 flex justify-between items-center">
        <Link to="/" className="flex items-center group">
          <motion.h1 
            className={`font-bold text-3xl ${
              isDarkMode 
                ? 'text-darkHighlight group-hover:text-indigo-400' 
                : 'text-lightHighlight group-hover:text-indigo-600'
            } italic transition-colors duration-200`}
            whileHover={{ scale: 1.05 }}
          >
            ZipURL
          </motion.h1>
        </Link>
        
        <div className="flex items-center">
          <ThemeToggle className="mr-6" />
          
          {/* Desktop Navigation */}
          <ul className="hidden sm:flex items-center gap-8">
            {navItems.map((item) => (
              <motion.li 
                key={item.path}
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <Link
                  to={item.path}
                  className={`font-medium transition-colors duration-200 ${
                    path === item.path 
                      ? isDarkMode 
                        ? 'text-darkHighlight' 
                        : 'text-lightHighlight'
                      : isDarkMode 
                        ? 'text-darkText hover:text-darkHighlight' 
                        : 'text-lightText hover:text-lightHighlight'
                  }`}
                >
                  {item.label}
                </Link>
                {path === item.path && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className={`absolute -bottom-1 left-0 right-0 h-0.5 ${
                      isDarkMode ? 'bg-darkHighlight' : 'bg-lightHighlight'
                    }`}
                  />
                )}
              </motion.li>
            ))}
          </ul>

          {/* Auth Buttons */}
          <div className="hidden sm:flex items-center gap-4 ml-8">
            {!token ? (
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`${
                    isDarkMode 
                      ? 'bg-dark-gradient-highlight hover:bg-darkHighlight' 
                      : 'bg-lightHighlight hover:bg-indigo-600'
                  } text-white px-6 py-2 rounded-md font-semibold transition-colors duration-200`}
                >
                  Login
                </motion.button>
              </Link>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onLogOutHandler}
                className={`${
                  isDarkMode 
                    ? 'border-darkHighlight text-darkHighlight hover:bg-darkHighlight hover:text-white' 
                    : 'border-lightHighlight text-lightHighlight hover:bg-lightHighlight hover:text-white'
                } border px-6 py-2 rounded-md font-semibold transition-colors duration-200`}
              >
                Log Out
              </motion.button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setNavbarOpen(!navbarOpen)}
            className={`sm:hidden flex items-center ${
              isDarkMode 
                ? 'text-darkText hover:text-darkHighlight' 
                : 'text-lightText hover:text-lightHighlight'
            } transition-colors duration-200`}
          >
            {navbarOpen ? (
              <RxCross2 className="text-2xl" />
            ) : (
              <IoIosMenu className="text-2xl" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {navbarOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className={`sm:hidden ${
              isDarkMode 
                ? 'bg-darkCard border-darkBorder' 
                : 'bg-white border-lightBorder'
            } border-t`}
          >
            <ul className="px-4 py-4 space-y-4">
              {navItems.map((item) => (
                <motion.li 
                  key={item.path}
                  whileHover={{ x: 5 }}
                  className="relative"
                >
                  <Link
                    to={item.path}
                    onClick={() => setNavbarOpen(false)}
                    className={`block font-medium transition-colors duration-200 ${
                      path === item.path 
                        ? isDarkMode 
                          ? 'text-darkHighlight' 
                          : 'text-lightHighlight'
                        : isDarkMode 
                          ? 'text-darkText hover:text-darkHighlight' 
                          : 'text-lightText hover:text-lightHighlight'
                    }`}
                  >
                    {item.label}
                  </Link>
                  {path === item.path && (
                    <motion.div
                      layoutId="mobile-navbar-indicator"
                      className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 ${
                        isDarkMode ? 'bg-darkHighlight' : 'bg-lightHighlight'
                      } rounded-full`}
                    />
                  )}
                </motion.li>
              ))}
              {!token ? (
                <motion.li whileHover={{ x: 5 }}>
                  <Link
                    to="/login"
                    onClick={() => setNavbarOpen(false)}
                    className={`block ${
                      isDarkMode 
                        ? 'bg-dark-gradient-highlight hover:bg-darkHighlight' 
                        : 'bg-lightHighlight hover:bg-indigo-600'
                    } text-white px-4 py-2 rounded-md font-semibold text-center transition-colors duration-200`}
                  >
                    Login
                  </Link>
                </motion.li>
              ) : (
                <motion.li whileHover={{ x: 5 }}>
                  <button
                    onClick={() => {
                      onLogOutHandler();
                      setNavbarOpen(false);
                    }}
                    className={`w-full ${
                      isDarkMode 
                        ? 'border-darkHighlight text-darkHighlight hover:bg-darkHighlight hover:text-white' 
                        : 'border-lightHighlight text-lightHighlight hover:bg-lightHighlight hover:text-white'
                    } border px-4 py-2 rounded-md font-semibold transition-colors duration-200`}
                  >
                    Log Out
                  </button>
                </motion.li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Navbar;