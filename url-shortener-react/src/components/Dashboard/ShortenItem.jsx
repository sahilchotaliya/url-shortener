import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard';
import { FaExternalLinkAlt, FaRegCalendarAlt } from 'react-icons/fa';
import { IoCopy } from 'react-icons/io5';
import { LiaCheckSolid } from 'react-icons/lia';
import { MdAnalytics, MdOutlineAdsClick } from 'react-icons/md';
import api from '../../api/api';
import { Link, useNavigate } from 'react-router-dom';
import { useStoreContext } from '../../contextApi/ContextApi';
import { Hourglass } from 'react-loader-spinner';
import Graph from './Graph';
import { useTheme } from '../../contextApi/ThemeContext';

const ShortenItem = ({ originalUrl, shortUrl, clickCount, createdDate }) => {
    const { token } = useStoreContext();
    const navigate = useNavigate();
    const [isCopied, setIsCopied] = useState(false);
    const [analyticToggle, setAnalyticToggle] = useState(false);
    const [loader, setLoader] = useState(false);
    const [selectedUrl, setSelectedUrl] = useState("");
    const [analyticsData, setAnalyticsData] = useState([]);
    const { isDarkMode } = useTheme();

    const subDomain = import.meta.env.VITE_REACT_FRONT_END_URL.replace(
        /^https?:\/\//,
        ""
    );

    const analyticsHandler = (shortUrl) => {
        if (!analyticToggle) {
            setSelectedUrl(shortUrl);
        }
        setAnalyticToggle(!analyticToggle);
    }

    const fetchMyShortUrl = async () => {
        setLoader(true);
        try {
            const { data } = await api.get(`/api/urls/analytics/${selectedUrl}?startDate=2024-12-01T00:00:00&endDate=2025-12-31T23:59:59`, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: "Bearer " + token,
                },
            });
            
            // Ensure data is in the correct format
            const processedData = Array.isArray(data) ? data.map(item => ({
                date: item.clickDate,
                count: Number(item.count)
            })) : [];
            
            setAnalyticsData(processedData);
            setSelectedUrl("");
        } catch (error) {
            navigate("/error");
            console.error(error);
        } finally {
            setLoader(false);
        }
    }

    useEffect(() => {
        if (selectedUrl) {
            fetchMyShortUrl();
        }
    }, [selectedUrl]);

  return (
    <div className={`${
      isDarkMode 
        ? 'bg-darkCard border-darkBorder shadow-dark-card' 
        : 'bg-slate-100 border-slate-500 shadow-lg'
    } border border-dotted px-4 sm:px-6 py-4 sm:py-5 rounded-md transition-all duration-100`}>
      <div className="flex flex-col sm:flex-row sm:justify-between w-full gap-4 sm:gap-0">
        <div className="flex-1 sm:space-y-1 max-w-full overflow-x-auto overflow-y-hidden">
          <div className={`${isDarkMode ? 'text-darkText' : 'text-slate-900'} pb-1 sm:pb-0 flex items-center gap-2`}>
            <Link
              target='_'
              className={`text-[15px] sm:text-[17px] font-montserrat font-[600] ${isDarkMode ? 'text-darkHighlight' : 'text-linkColor'}`}
              to={import.meta.env.VITE_REACT_FRONT_END_URL + "/s/" + `${shortUrl}`}>
                {subDomain + "/s/" + `${shortUrl}`}
            </Link>
            <FaExternalLinkAlt className={isDarkMode ? 'text-darkHighlight' : 'text-linkColor'} />
          </div>

          <div className="flex items-center gap-1">
            <h3 className={`${isDarkMode ? 'text-darkTextSecondary' : 'text-slate-700'} font-[400] text-[15px] sm:text-[17px] break-all`}>
              {originalUrl}
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-8 pt-4 sm:pt-6">
            <div className={`flex gap-1 items-center font-semibold ${isDarkMode ? 'text-green-400' : 'text-green-800'}`}>
              <span>
                <MdOutlineAdsClick className="text-[20px] sm:text-[22px] me-1" />
              </span>
              <span className="text-[15px] sm:text-[16px]">{clickCount}</span>
              <span className="text-[14px] sm:text-[15px]">
                {clickCount === 0 || clickCount === 1 ? "Click" : "Clicks"}
              </span>
            </div>

            <div className={`flex items-center gap-2 font-semibold text-lg ${isDarkMode ? 'text-darkTextSecondary' : 'text-slate-800'}`}>
              <span>
                <FaRegCalendarAlt />
              </span>
              <span className="text-[15px] sm:text-[17px]">
                {dayjs(createdDate).format("MMM DD, YYYY")}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-end items-stretch sm:items-center gap-3 sm:gap-4">
          <CopyToClipboard
            onCopy={() => setIsCopied(true)}
            text={`${import.meta.env.VITE_REACT_FRONT_END_URL + "/s/" + `${shortUrl}`}`}
          >
            <div className={`flex cursor-pointer gap-1 items-center justify-center ${
              isDarkMode ? 'bg-darkHighlight' : 'bg-btnColor'
            } py-2 font-semibold ${
              isDarkMode ? 'shadow-dark-glow' : 'shadow-md shadow-slate-500'
            } px-4 sm:px-6 rounded-md text-white`}>
              <button className="">{isCopied ? "Copied" : "Copy"}</button>
              {isCopied ? (
                <LiaCheckSolid className="text-md" />
              ) : (
                <IoCopy className="text-md" />
              )}
            </div>
          </CopyToClipboard>

          <div
            onClick={() => analyticsHandler(shortUrl)}
            className={`flex cursor-pointer gap-1 items-center justify-center ${
              isDarkMode ? 'bg-purple-700' : 'bg-rose-700'
            } py-2 font-semibold ${
              isDarkMode ? 'shadow-dark-glow' : 'shadow-md shadow-slate-500'
            } px-4 sm:px-6 rounded-md text-white`}
          >
            <button>Analytics</button>
            <MdAnalytics className="text-md" />
          </div>
        </div>
      </div>

      <React.Fragment>
        <div className={`${
          analyticToggle ? "flex" : "hidden"
        } max-h-96 sm:mt-0 mt-5 min-h-96 relative border-t-2 ${
          isDarkMode ? 'border-darkBorder' : ''
        } w-[100%] overflow-hidden`}>
          {loader ? (
            <div className="min-h-[calc(450px-140px)] flex justify-center items-center w-full">
              <div className="flex flex-col items-center gap-1">
                <Hourglass
                  visible={true}
                  height="50"
                  width="50"
                  ariaLabel="hourglass-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                  colors={isDarkMode ? ['#6366f1', '#818cf8'] : ['#306cce', '#72a1ed']}
                />
                <p className={isDarkMode ? 'text-darkTextSecondary' : 'text-slate-700'}>Please Wait...</p>
              </div>
            </div>
          ) : ( 
            <>{analyticsData.length === 0 && (
              <div className="absolute flex flex-col justify-center sm:items-center items-end w-full left-0 top-0 bottom-0 right-0 m-auto p-4">
                <h1 className={`${isDarkMode ? 'text-darkText' : 'text-slate-800'} font-serif sm:text-2xl text-[15px] font-bold mb-1 text-center`}>
                  No Data For This Time Period
                </h1>
                <h3 className={`sm:w-96 w-full text-center sm:text-lg text-[12px] ${isDarkMode ? 'text-darkTextSecondary' : 'text-slate-600'}`}>
                  Share your short link to view where your engagements are coming from
                </h3>
              </div>
            )}
              <div className="w-full h-full p-4">
                <Graph graphData={analyticsData} />
              </div>
            </>
          )}
        </div>
      </React.Fragment>
    </div>
  )
}

export default ShortenItem