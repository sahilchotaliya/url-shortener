import React, { useState, useEffect } from 'react'
import Graph from './Graph'
import { useStoreContext } from '../../contextApi/ContextApi'
import { useFetchMyShortUrls, useFetchTotalClicks } from '../../hooks/useQuery'
import ShortenPopUp from './ShortenPopUp'
import { FaLink, FaPlus, FaChartLine, FaListUl, FaCog, FaSearch, FaBars, FaTimes, FaCopy, FaTrash } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import Loader from '../Loader'
import { motion } from 'framer-motion'
import { useTheme } from '../../contextApi/ThemeContext'
import ThemeToggle from '../ThemeToggle'
import CreateNewShorten from './CreateNewShorten'
import { toast } from 'react-hot-toast'
import api from '../../api/api'

const DashboardLayout = () => {
  const { token } = useStoreContext();
  const navigate = useNavigate();
  const [shortenPopUp, setShortenPopUp] = useState(false);
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('links');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Set to true by default
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  // Modified to keep sidebar open on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true); // Keep sidebar open on desktop
      } else {
        setIsSidebarOpen(false); // Close on mobile
      }
    };

    // Set initial state based on screen size
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function onError() {
    navigate("/error");
  }

  const {isLoading, data: myShortenUrls, refetch } = useFetchMyShortUrls(token, onError)
  const {isLoading: isLoadingClicks, data: totalClicks} = useFetchTotalClicks(token, onError)

  // Calculate total clicks from the data
  const totalClicksCount = totalClicks?.reduce((sum, item) => sum + (item.count || 0), 0) || 0;

  // Filter URLs based on search query
  const filteredUrls = myShortenUrls?.filter(url => 
    url.originalUrl?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    url.shortUrl?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (url.name && url.name.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("URL copied to clipboard!", {
      position: "bottom-center",
      duration: 2000,
    });
  };

  const handleDeleteLink = async (urlId) => {
    try {
      // Ensure urlId is a number if it's a numeric string
      const id = !isNaN(urlId) ? Number(urlId) : urlId;
      
      console.log(`Attempting to delete URL with ID: ${id} (original type: ${typeof urlId})`);
      console.log(`Using token: ${token.substring(0, 10)}...`);
      
      // First, check if the URL exists
      try {
        const checkResponse = await api.get(`/api/urls/debug/exists/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("URL existence check:", checkResponse.data);
        
        if (!checkResponse.data.exists) {
          toast.error("URL not found. It may have been already deleted.", {
            position: "bottom-center",
            duration: 3000,
          });
          setDeleteConfirmation(null);
          return;
        }
        
        if (!checkResponse.data.belongsToUser) {
          toast.error("You don't have permission to delete this URL.", {
            position: "bottom-center",
            duration: 3000,
          });
          setDeleteConfirmation(null);
          return;
        }
      } catch (error) {
        console.error("URL existence check failed:", error);
      }
      
      const response = await api.delete(`/api/urls/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log("Delete response:", response);
      
      toast.success("URL deleted successfully!", {
        position: "bottom-center",
        duration: 2000,
      });
      
      // Refresh the URL list
      refetch();
    } catch (error) {
      console.error("Error deleting URL:", error);
      
      // More detailed error logging
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
        
        // Show more specific error message based on status code
        if (error.response.status === 403) {
          toast.error("You don't have permission to delete this URL.", {
            position: "bottom-center",
            duration: 3000,
          });
        } else if (error.response.status === 404) {
          toast.error("URL not found. It may have been already deleted.", {
            position: "bottom-center",
            duration: 3000,
          });
        } else {
          toast.error(`Failed to delete URL: ${error.response.data.error || "Unknown error"}`, {
            position: "bottom-center",
            duration: 3000,
          });
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Error request:", error.request);
        toast.error("No response from server. Please check your connection.", {
          position: "bottom-center",
          duration: 3000,
        });
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", error.message);
        toast.error("Failed to delete URL. Please try again.", {
          position: "bottom-center",
          duration: 3000,
        });
      }
    } finally {
      setDeleteConfirmation(null);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'analytics':
        return (
          <div className={`dashboard-card p-4 sm:p-6 w-full`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-xl font-semibold flex items-center">
                <FaChartLine className={`${isDarkMode ? 'text-darkHighlight' : 'text-lightHighlight'} mr-2`} />
                Analytics Overview
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className={`${isDarkMode ? 'bg-gray-850' : 'bg-gray-50'} p-4 rounded-lg border ${isDarkMode ? 'border-darkBorder' : 'border-lightBorder'}`}>
                <h3 className={`${isDarkMode ? 'text-darkTextSecondary' : 'text-lightTextSecondary'} text-sm mb-2`}>Total Links</h3>
                <p className={`${isDarkMode ? 'text-darkText' : 'text-lightText'} text-2xl font-bold`}>{myShortenUrls?.length || 0}</p>
              </div>
              <div className={`${isDarkMode ? 'bg-gray-850' : 'bg-gray-50'} p-4 rounded-lg border ${isDarkMode ? 'border-darkBorder' : 'border-lightBorder'}`}>
                <h3 className={`${isDarkMode ? 'text-darkTextSecondary' : 'text-lightTextSecondary'} text-sm mb-2`}>Total Clicks</h3>
                <p className={`${isDarkMode ? 'text-darkText' : 'text-lightText'} text-2xl font-bold`}>{totalClicksCount}</p>
              </div>
              <div className={`${isDarkMode ? 'bg-gray-850' : 'bg-gray-50'} p-4 rounded-lg border ${isDarkMode ? 'border-darkBorder' : 'border-lightBorder'}`}>
                <h3 className={`${isDarkMode ? 'text-darkTextSecondary' : 'text-lightTextSecondary'} text-sm mb-2`}>Active Links</h3>
                <p className={`${isDarkMode ? 'text-darkText' : 'text-lightText'} text-2xl font-bold`}>{myShortenUrls?.filter(url => url.clickCount > 0).length || 0}</p>
              </div>
              <div className={`${isDarkMode ? 'bg-gray-850' : 'bg-gray-50'} p-4 rounded-lg border ${isDarkMode ? 'border-darkBorder' : 'border-lightBorder'}`}>
                <h3 className={`${isDarkMode ? 'text-darkTextSecondary' : 'text-lightTextSecondary'} text-sm mb-2`}>Average Clicks</h3>
                <p className={`${isDarkMode ? 'text-darkText' : 'text-lightText'} text-2xl font-bold`}>
                  {myShortenUrls?.length ? Math.round(totalClicksCount / myShortenUrls.length) : 0}
                </p>
              </div>
            </div>

            {/* Chart Container */}
            <div className={`${isDarkMode ? 'bg-gray-850' : 'bg-gray-50'} p-4 sm:p-6 rounded-lg border ${isDarkMode ? 'border-darkBorder' : 'border-lightBorder'}`}>
              <h3 className={`${isDarkMode ? 'text-darkText' : 'text-lightText'} text-lg font-semibold mb-4`}>Click Analytics</h3>
              <div style={{ height: '400px', width: '100%', position: 'relative' }}>
                {totalClicks && totalClicks.length > 0 ? (
                  <Graph graphData={totalClicks} />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <p className={`${isDarkMode ? 'text-darkTextSecondary' : 'text-lightTextSecondary'} text-lg font-medium mb-2`}>No click data available</p>
                    <p className={`${isDarkMode ? 'text-darkTextSecondary' : 'text-lightTextSecondary'} text-sm text-center`}>
                      Share your shortened URLs to start collecting click analytics
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'links':
        return (
          <div className={`dashboard-card p-4 sm:p-6 w-full`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-xl font-semibold flex items-center">
                <FaListUl className={`${isDarkMode ? 'text-darkHighlight' : 'text-lightHighlight'} mr-2`} />
                Your Shortened URLs
              </h2>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <div className={`relative flex items-center flex-1 sm:flex-none ${isDarkMode ? 'bg-gray-850' : 'bg-gray-50'} rounded-md px-3 py-2`}>
                  <FaSearch className={`${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mr-2`} />
                  <input 
                    type="text" 
                    placeholder="Search links..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`${isDarkMode ? 'bg-gray-850 text-darkText' : 'bg-gray-50 text-lightText'} border-none focus:ring-0 text-sm w-full sm:w-60`}
                  />
                </div>
                <button
                  className={`btn-primary flex items-center justify-center gap-2 px-4 py-2 w-full sm:w-auto`}
                  onClick={() => setShortenPopUp(true)}>
                  <FaPlus size={14} />
                  <span>Create New</span>
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader />
                </div>
              ) : filteredUrls?.length > 0 ? (
                <div className="space-y-4">
                  {filteredUrls.map((url) => (
                    <div 
                      key={url._id || url.id}
                      className={`${isDarkMode ? 'bg-gray-850' : 'bg-gray-50'} p-4 rounded-lg border ${isDarkMode ? 'border-darkBorder' : 'border-lightBorder'}`}
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex-1 min-w-0 w-full">
                          {url.name && (
                            <div className="mb-2">
                              <span className={`${isDarkMode ? 'text-darkHighlight' : 'text-lightHighlight'} font-semibold`}>
                                {url.name}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <FaLink className={`${isDarkMode ? 'text-darkHighlight' : 'text-lightHighlight'} flex-shrink-0`} />
                            <a 
                              href={`${import.meta.env.VITE_REACT_FRONT_END_URL}/s/${url.shortUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`${isDarkMode ? 'text-darkHighlight' : 'text-lightHighlight'} text-base font-medium truncate hover:underline break-all sm:break-normal`}
                            >
                              {`${import.meta.env.VITE_REACT_FRONT_END_URL}/s/${url.shortUrl}`}
                            </a>
                            <button
                              onClick={() => copyToClipboard(`${import.meta.env.VITE_REACT_FRONT_END_URL}/s/${url.shortUrl}`)}
                              className={`p-1.5 rounded hover:bg-gray-700 dark:hover:bg-gray-700 flex-shrink-0 ml-auto sm:ml-0`}
                            >
                              <FaCopy className="text-base" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2 mb-3 sm:mb-0">
                            <h3 className={`${isDarkMode ? 'text-darkText' : 'text-lightText'} font-medium truncate text-sm opacity-75 break-all sm:break-normal`}>
                              {url.originalUrl}
                            </h3>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-0 pt-3 sm:pt-0 mt-1 sm:mt-0">
                          <div className="text-center">
                            <p className={`${isDarkMode ? 'text-darkText' : 'text-lightText'} font-semibold`}>
                              {url.clickCount || 0}
                            </p>
                            <p className={`${isDarkMode ? 'text-darkTextSecondary' : 'text-lightTextSecondary'} text-sm`}>
                              Clicks
                            </p>
                          </div>
                          <div className="text-center">
                            <p className={`${isDarkMode ? 'text-darkText' : 'text-lightText'} font-semibold`}>
                              {new Date(url.createdAt || url.createdDate).toLocaleDateString()}
                            </p>
                            <p className={`${isDarkMode ? 'text-darkTextSecondary' : 'text-lightTextSecondary'} text-sm`}>
                              Created
                            </p>
                          </div>
                          <div className="flex items-center">
                            <button
                              onClick={() => {
                                // Store the URL ID and additional information for debugging
                                const urlToDelete = {
                                  id: url._id || url.id,
                                  shortUrl: url.shortUrl,
                                  originalUrl: url.originalUrl,
                                  name: url.name
                                };
                                console.log("Setting URL for deletion:", urlToDelete);
                                setDeleteConfirmation(urlToDelete);
                              }}
                              className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-800 hover:bg-red-900' : 'bg-gray-100 hover:bg-red-100'} transition-colors`}
                              title="Delete URL"
                            >
                              <FaTrash className={`${isDarkMode ? 'text-red-400' : 'text-red-500'}`} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`text-center py-12 ${isDarkMode ? 'text-darkTextSecondary' : 'text-lightTextSecondary'}`}>
                  <FaLink className="mx-auto text-4xl mb-4 opacity-50" />
                  <p className="text-lg">No shortened URLs found</p>
                  <p className="text-sm mt-2">
                    {searchQuery ? 'Try adjusting your search' : 'Create your first shortened URL to get started'}
                  </p>
                  <button
                    className={`btn-primary flex items-center justify-center gap-2 px-4 py-2 mt-4 mx-auto`}
                    onClick={() => setShortenPopUp(true)}>
                    <FaPlus size={14} />
                    <span>Create New URL</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className={`dashboard-card p-4 sm:p-6 w-full`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold flex items-center">
                <FaCog className={`${isDarkMode ? 'text-darkHighlight' : 'text-lightHighlight'} mr-2`} />
                Settings
              </h2>
            </div>
            
            <div className="space-y-6">
              <div className={`${isDarkMode ? 'bg-gray-850' : 'bg-gray-50'} border ${isDarkMode ? 'border-darkBorder' : 'border-lightBorder'} rounded-lg p-4 sm:p-6`}>
                <h3 className="text-lg font-medium mb-4">Appearance</h3>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className={`${isDarkMode ? 'text-darkText' : 'text-lightText'} font-medium`}>Theme</p>
                    <p className={`${isDarkMode ? 'text-darkTextSecondary' : 'text-lightTextSecondary'} text-sm`}>
                      Switch between dark and light mode
                    </p>
                  </div>
                  <ThemeToggle />
                </div>
              </div>
              
              <div className={`${isDarkMode ? 'bg-gray-850' : 'bg-gray-50'} border ${isDarkMode ? 'border-darkBorder' : 'border-lightBorder'} rounded-lg p-4 sm:p-6`}>
                <h3 className="text-lg font-medium mb-4">Account</h3>
                <div className="space-y-4">
                  <div>
                    <p className={`${isDarkMode ? 'text-darkText' : 'text-lightText'} font-medium`}>Email Notifications</p>
                    <p className={`${isDarkMode ? 'text-darkTextSecondary' : 'text-lightTextSecondary'} text-sm mb-2`}>
                      Receive email notifications for link activity
                    </p>
                    <div className="flex items-center">
                      <input type="checkbox" id="notifications" className="mr-2" />
                      <label htmlFor="notifications" className={`${isDarkMode ? 'text-darkTextSecondary' : 'text-lightTextSecondary'} text-sm`}>
                        Enable email notifications
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (isLoading || isLoadingClicks) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <Loader />
      </div>
    );
  }

  return (
    // Add a top margin to create space below the navbar (mt-4 adds 1rem/16px of margin)
    <div className={`min-h-[calc(100vh-64px)] lg:px-14 sm:px-8 px-5 py-16 pt-12`}>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full mx-auto py-8 sm:py-12"
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Dashboard</h1>
            <p className={`${isDarkMode ? 'text-darkTextSecondary' : 'text-lightTextSecondary'}`}>
              Track and manage your shortened URLs
            </p>
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Modified layout - Always display sidebar and content in flex row on desktop */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Always visible on desktop */}
          <div className={`lg:w-64 w-full ${isSidebarOpen ? 'block' : 'hidden lg:block'}`}>
            <div className={`dashboard-card p-4 sticky top-20`}>
              <div className="flex justify-between items-center mb-4 lg:hidden">
                <h3 className={`${isDarkMode ? 'text-darkText' : 'text-lightText'} font-semibold`}>Menu</h3>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <FaTimes />
                </button>
              </div>
              <nav className="space-y-2">
                <button
                  onClick={() => {
                    setActiveTab('analytics');
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                    activeTab === 'analytics'
                      ? isDarkMode
                        ? 'bg-darkHighlight text-white'
                        : 'bg-lightHighlight text-white'
                      : isDarkMode
                        ? 'text-darkText hover:bg-gray-850'
                        : 'text-lightText hover:bg-gray-50'
                  }`}
                >
                  <FaChartLine />
                  <span>Analytics</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('links');
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                    activeTab === 'links'
                      ? isDarkMode
                        ? 'bg-darkHighlight text-white'
                        : 'bg-lightHighlight text-white'
                      : isDarkMode
                        ? 'text-darkText hover:bg-gray-850'
                        : 'text-lightText hover:bg-gray-50'
                  }`}
                >
                  <FaLink />
                  <span>Links</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('settings');
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                    activeTab === 'settings'
                      ? isDarkMode
                        ? 'bg-darkHighlight text-white'
                        : 'bg-lightHighlight text-white'
                      : isDarkMode
                        ? 'text-darkText hover:bg-gray-850'
                        : 'text-lightText hover:bg-gray-50'
                  }`}
                >
                  <FaCog />
                  <span>Settings</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 w-full overflow-hidden">
            {renderTabContent()}
          </div>
        </div>
      </motion.div>

      {/* Create New URL Popup */}
      <ShortenPopUp 
        isOpen={shortenPopUp} 
        onClose={() => setShortenPopUp(false)}
        showCloseButton={false}
      >
        <CreateNewShorten 
          setOpen={setShortenPopUp} 
          refetch={refetch} 
        />
      </ShortenPopUp>

      {/* Delete Confirmation Popup */}
      <ShortenPopUp 
        isOpen={deleteConfirmation !== null} 
        onClose={() => setDeleteConfirmation(null)}
        showCloseButton={true}
      >
        <div className="p-4">
          <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-darkText' : 'text-lightText'}`}>Delete URL</h2>
          
          {deleteConfirmation && (
            <div className={`mb-4 p-3 rounded-md ${isDarkMode ? 'bg-gray-850 border border-darkBorder' : 'bg-gray-50 border border-lightBorder'}`}>
              {deleteConfirmation.name && (
                <p className={`${isDarkMode ? 'text-darkHighlight' : 'text-lightHighlight'} font-medium mb-1`}>
                  {deleteConfirmation.name}
                </p>
              )}
              <p className={`${isDarkMode ? 'text-darkTextSecondary' : 'text-lightTextSecondary'} text-sm mb-1`}>
                URL ID: <span className="font-mono">{deleteConfirmation.id}</span>
              </p>
              <p className={`${isDarkMode ? 'text-darkHighlight' : 'text-lightHighlight'} text-sm font-medium mb-1 break-all`}>
                {`${import.meta.env.VITE_REACT_FRONT_END_URL}/s/${deleteConfirmation.shortUrl}`}
              </p>
              <p className={`${isDarkMode ? 'text-darkText' : 'text-lightText'} text-sm opacity-75 break-all`}>
                {deleteConfirmation.originalUrl}
              </p>
            </div>
          )}
          
          <p className={`mb-6 ${isDarkMode ? 'text-darkTextSecondary' : 'text-lightTextSecondary'}`}>
            Are you sure you want to delete this shortened URL? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeleteConfirmation(null)}
              className={`px-4 py-2 rounded-md ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                console.log("Deleting URL with ID:", deleteConfirmation.id);
                handleDeleteLink(deleteConfirmation.id);
              }}
              className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </button>
          </div>
        </div>
      </ShortenPopUp>
    </div>
  );
};

export default DashboardLayout;