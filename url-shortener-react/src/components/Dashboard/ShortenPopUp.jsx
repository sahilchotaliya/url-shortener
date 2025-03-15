import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contextApi/ThemeContext';

const ShortenPopUp = ({ isOpen, onClose, children, showCloseButton = true }) => {
  const { isDarkMode } = useTheme();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
          isDarkMode ? 'bg-black/50' : 'bg-black/30'
        }`}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.3 }}
          className={`relative w-full max-w-md rounded-lg shadow-xl ${
            isDarkMode ? 'bg-darkCard' : 'bg-white'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 sm:p-6">
            {children}
          </div>
          {showCloseButton && (
            <button
              onClick={onClose}
              className={`absolute top-2 right-2 p-1 rounded-full transition-colors ${
                isDarkMode 
                  ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ShortenPopUp;