import { useNavigate } from "react-router-dom";
import React from "react";
import { motion } from "framer-motion";
import Card from "./Card";
import { useStoreContext } from "../contextApi/ContextApi";
import { useTheme } from "../contextApi/ThemeContext";

let desc =
  "Generate short, memorable links with ease using ZipURL's intuitive interface. Share URLs effortlessly across platforms. Optimize your sharing strategy with ZipURL. Track clicks and manage your links seamlessly to enhance your online presence. Generate short, memorable links with ease using ZipURL's intuitive interface. Share URLs effortlessly across platforms.";

const LandingPage = () => {
  const navigate = useNavigate();
  const { token } = useStoreContext();
  const { isDarkMode } = useTheme();

  const dashBoardNavigateHandler = () => {
    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className={`min-h-[calc(100vh-64px)] ${isDarkMode ? 'bg-darkBg text-darkText' : 'bg-lightBg text-lightText'} lg:px-14 sm:px-8 px-4`}>
      <div className="lg:flex-row flex-col lg:py-16 pt-16 lg:gap-16 gap-12 flex justify-between items-center">
        <div className="flex-1 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className={`font-bold font-montserrat ${isDarkMode ? 'text-darkText' : 'text-lightText'} md:text-5xl sm:text-4xl text-3xl md:leading-[60px] sm:leading-[50px] leading-[40px] mb-6`}>
              <span className={`${isDarkMode ? 'text-darkHighlight' : 'text-lightHighlight'}`}>ZipURL</span> Simplifies URL Shortening For Efficient Sharing
            </h1>
            <p className={`${isDarkMode ? 'text-darkTextSecondary' : 'text-lightTextSecondary'} text-lg mb-8 leading-relaxed`}>
              ZipURL streamlines the process of URL shortening, making sharing
              links effortless and efficient. With its user-friendly interface,
              ZipURL allows you to generate concise, easy-to-share URLs in
              seconds.
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <motion.button
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                onClick={() => dashBoardNavigateHandler()}
                className="btn-primary flex items-center justify-center w-44 h-12 text-lg font-medium"
              >
                Manage Links
              </motion.button>
              <motion.button
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                onClick={() => dashBoardNavigateHandler()}
                className="btn-secondary flex items-center justify-center w-44 h-12 text-lg font-medium"
              >
                Create Short Link
              </motion.button>
            </div>
          </motion.div>
        </div>
        <div className="flex-1 flex justify-center w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className={`absolute inset-0 ${isDarkMode ? 'bg-dark-gradient-highlight' : 'bg-light-gradient-accent'} opacity-20 blur-3xl rounded-full`}></div>
            <img
              className={`sm:w-[520px] w-[400px] object-cover rounded-lg ${isDarkMode ? 'shadow-dark-card' : 'shadow-light-card'} relative z-10`}
              src="/images/img2.png"
              alt="URL shortening illustration"
            />
          </motion.div>
        </div>
      </div>

      <div className="py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className={`${isDarkMode ? 'text-darkText' : 'text-lightText'} font-montserrat font-bold lg:w-[60%] md:w-[70%] sm:w-[80%] mx-auto text-4xl mb-4`}>
            Trusted by individuals and teams worldwide
          </h2>
          <p className={`${isDarkMode ? 'text-darkTextSecondary' : 'text-lightTextSecondary'} max-w-2xl mx-auto text-lg`}>
            Join thousands of users who rely on ZipURL for their link management needs
          </p>
        </motion.div>

        <div className="grid lg:gap-8 gap-6 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1">
          <Card
            title="Simple URL Shortening"
            desc="Experience the ease of creating short, memorable URLs in just a few clicks. Our intuitive interface ensures you can start shortening URLs without any hassle."
          />
          <Card
            title="Powerful Analytics"
            desc="Gain insights into your link performance with our comprehensive analytics dashboard. Track clicks, geographical data, and referral sources to optimize your strategies."
          />
          <Card
            title="Enhanced Security"
            desc="Rest assured with our robust security measures. All shortened URLs are protected with advanced encryption, ensuring your data remains safe and secure."
          />
          <Card
            title="Fast and Reliable"
            desc="Enjoy lightning-fast redirects and high uptime with our reliable infrastructure. Your shortened URLs will always be available and responsive."
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;