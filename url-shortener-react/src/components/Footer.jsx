import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTheme } from "../contextApi/ThemeContext";

const Footer = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <footer className={`footer py-12 border-t ${
      isDarkMode ? 'bg-gray-850 text-darkText border-darkBorder' : 'bg-gray-50 text-lightText border-lightBorder'
    }`}>
      <div className="container mx-auto px-6 lg:px-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-darkHighlight' : 'text-lightHighlight'}`}>ZipURL</h2>
            <p className={`${isDarkMode ? 'text-darkTextSecondary' : 'text-lightTextSecondary'} max-w-xs`}>
              Simplifying URL shortening for efficient sharing across all your platforms.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className={`${isDarkMode ? 'text-darkTextSecondary hover:text-darkHighlight' : 'text-lightTextSecondary hover:text-lightHighlight'} transition-colors duration-200`}>
                <FaFacebook size={22} />
              </a>
              <a href="#" className={`${isDarkMode ? 'text-darkTextSecondary hover:text-darkHighlight' : 'text-lightTextSecondary hover:text-lightHighlight'} transition-colors duration-200`}>
                <FaTwitter size={22} />
              </a>
              <a href="#" className={`${isDarkMode ? 'text-darkTextSecondary hover:text-darkHighlight' : 'text-lightTextSecondary hover:text-lightHighlight'} transition-colors duration-200`}>
                <FaInstagram size={22} />
              </a>
              <a href="#" className={`${isDarkMode ? 'text-darkTextSecondary hover:text-darkHighlight' : 'text-lightTextSecondary hover:text-lightHighlight'} transition-colors duration-200`}>
                <FaLinkedin size={22} />
              </a>
              <a href="#" className={`${isDarkMode ? 'text-darkTextSecondary hover:text-darkHighlight' : 'text-lightTextSecondary hover:text-lightHighlight'} transition-colors duration-200`}>
                <FaGithub size={22} />
              </a>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-darkText' : 'text-lightText'}`}>Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className={`${isDarkMode ? 'text-darkTextSecondary hover:text-darkHighlight' : 'text-lightTextSecondary hover:text-lightHighlight'} transition-colors duration-200`}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className={`${isDarkMode ? 'text-darkTextSecondary hover:text-darkHighlight' : 'text-lightTextSecondary hover:text-lightHighlight'} transition-colors duration-200`}>
                  About
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className={`${isDarkMode ? 'text-darkTextSecondary hover:text-darkHighlight' : 'text-lightTextSecondary hover:text-lightHighlight'} transition-colors duration-200`}>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/login" className={`${isDarkMode ? 'text-darkTextSecondary hover:text-darkHighlight' : 'text-lightTextSecondary hover:text-lightHighlight'} transition-colors duration-200`}>
                  Login
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-darkText' : 'text-lightText'}`}>Contact</h3>
            <p className={`${isDarkMode ? 'text-darkTextSecondary' : 'text-lightTextSecondary'}`}>
              Have questions or feedback? Reach out to our team.
            </p>
            <a href="mailto:support@zipurl.com" className={`${isDarkMode ? 'text-darkHighlight' : 'text-lightHighlight'} hover:underline`}>
              support@zipurl.com
            </a>
          </div>
        </div>
        
        <div className={`border-t ${isDarkMode ? 'border-darkBorder' : 'border-lightBorder'} mt-10 pt-6 flex flex-col md:flex-row justify-between items-center`}>
          <p className={`${isDarkMode ? 'text-darkTextSecondary' : 'text-lightTextSecondary'} text-sm`}>
            &copy; {new Date().getFullYear()} ZipURL. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className={`${isDarkMode ? 'text-darkTextSecondary hover:text-darkHighlight' : 'text-lightTextSecondary hover:text-lightHighlight'} text-sm transition-colors duration-200`}>
              Privacy Policy
            </a>
            <a href="#" className={`${isDarkMode ? 'text-darkTextSecondary hover:text-darkHighlight' : 'text-lightTextSecondary hover:text-lightHighlight'} text-sm transition-colors duration-200`}>
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;