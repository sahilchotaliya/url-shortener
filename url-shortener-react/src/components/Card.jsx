import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../contextApi/ThemeContext";

const Card = ({ title, desc }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 120 }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`${
        isDarkMode 
          ? "bg-gray-800 border-gray-700 shadow-black/30 hover:bg-gray-750" 
          : "bg-white border-gray-200 shadow-gray-200/50 hover:bg-gray-50"
      } border shadow-lg flex flex-col px-6 py-8 gap-3 rounded-lg transition-all duration-300 hover:translate-y-[-5px]`}
    >
      <h1 className={`${isDarkMode ? "text-gray-100" : "text-gray-800"} text-xl font-bold`}>{title}</h1>
      <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} text-sm`}>{desc}</p>
    </motion.div>
  );
};

export default Card;