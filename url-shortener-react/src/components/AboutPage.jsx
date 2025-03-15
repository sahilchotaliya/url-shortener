import React from "react";
import { FaLink, FaShareAlt, FaShieldAlt, FaBolt } from "react-icons/fa";
import { motion } from "framer-motion";
import { useTheme } from "../contextApi/ThemeContext";

const FeatureItem = ({ icon, title, description, color }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`flex items-start p-6 ${
        isDarkMode 
          ? 'bg-darkCard border-darkBorder hover:border-darkHighlight shadow-dark-card' 
          : 'bg-white border-gray-200 hover:border-lightHighlight shadow-light-card'
      } rounded-lg border transition-all duration-300`}
    >
      <div className={`text-${color} text-3xl mr-5 mt-1`}>
        {icon}
      </div>
      <div>
        <h2 className={`text-xl font-bold ${isDarkMode ? 'text-darkText' : 'text-lightText'} mb-2`}>
          {title}
        </h2>
        <p className={`${isDarkMode ? 'text-darkTextSecondary' : 'text-lightTextSecondary'} leading-relaxed`}>
          {description}
        </p>
      </div>
    </motion.div>
  );
};

const AboutPage = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`${isDarkMode ? 'bg-darkBg text-darkText' : 'bg-lightBg text-lightText'} min-h-[calc(100vh-64px)] lg:px-14 sm:px-8 px-5 py-16 pt-20`}>

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-6">
            About <span className={`${isDarkMode ? 'text-darkHighlight' : 'text-lightHighlight'}`}>ZipURL</span>
          </h1>
          <p className={`${isDarkMode ? 'text-darkTextSecondary' : 'text-lightTextSecondary'} text-lg max-w-3xl mx-auto leading-relaxed`}>
            ZipURL simplifies URL shortening for efficient sharing across all platforms. Our powerful yet intuitive tools help you generate, manage, and track your shortened links with ease, providing valuable insights to optimize your online presence.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <FeatureItem 
            icon={<FaLink />}
            title="Simple URL Shortening"
            description="Experience the ease of creating short, memorable URLs in just a few clicks. Our intuitive interface and quick setup process ensure you can start shortening URLs without any hassle."
            color="indigo-500"
          />
          
          <FeatureItem 
            icon={<FaShareAlt />}
            title="Powerful Analytics"
            description="Gain insights into your link performance with our comprehensive analytics dashboard. Track clicks, geographical data, and referral sources to optimize your marketing strategies."
            color="blue-500"
          />
          
          <FeatureItem 
            icon={<FaShieldAlt />}
            title="Enhanced Security"
            description="Rest assured with our robust security measures. All shortened URLs are protected with advanced encryption, ensuring your data remains safe and secure at all times."
            color="purple-500"
          />
          
          <FeatureItem 
            icon={<FaBolt />}
            title="Fast and Reliable"
            description="Enjoy lightning-fast redirects and high uptime with our reliable infrastructure. Your shortened URLs will always be available and responsive, ensuring a seamless experience."
            color="amber-500"
          />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20 text-center"
        >
          <h2 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-darkText' : 'text-lightText'}`}>Ready to simplify your links?</h2>
          <p className={`${isDarkMode ? 'text-darkTextSecondary' : 'text-lightTextSecondary'} mb-8 max-w-2xl mx-auto`}>
            Join thousands of users who trust ZipURL for their link management needs.
          </p>
          <button className="btn-primary px-8 py-3 text-lg font-medium">
            Get Started Today
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;