import React from 'react'
import ShortenItem from './ShortenItem'
import { useTheme } from '../../contextApi/ThemeContext'

const ShortenUrlList = ({ data }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`my-6 space-y-4 ${isDarkMode ? 'text-darkText' : ''}`}>
        {data.map((item) => (
            <ShortenItem key={item.id} {...item} />
        ))}
    </div>
  )
}

export default ShortenUrlList