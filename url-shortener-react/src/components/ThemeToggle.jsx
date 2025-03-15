import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../contextApi/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button 
      onClick={toggleTheme}
      className={`theme-toggle ${isDarkMode ? 'dark' : 'light'} ${className}`}
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      <span className="sr-only">Toggle theme</span>
      <span className="theme-toggle-thumb"></span>
      <span className="absolute right-1.5">
        {isDarkMode ? (
          <FaMoon className="text-indigo-200 text-xs" />
        ) : (
          <FaSun className="text-amber-400 text-xs" />
        )}
      </span>
    </button>
  );
};

export default ThemeToggle; 