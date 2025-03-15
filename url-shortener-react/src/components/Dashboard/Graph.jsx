import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useTheme } from "../../contextApi/ThemeContext";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Graph = ({ graphData }) => {
  const { isDarkMode } = useTheme();
  
  // Format data for chart
  const formatData = () => {
    if (!graphData || !Array.isArray(graphData) || graphData.length === 0) {
      // Return dummy data if no data is available
      return {
        labels: ['No Data'],
        datasets: [
          {
            label: 'Clicks',
            data: [0],
            backgroundColor: isDarkMode ? 'rgba(99, 102, 241, 0.5)' : 'rgba(79, 70, 229, 0.5)',
            borderColor: isDarkMode ? 'rgba(99, 102, 241, 1)' : 'rgba(79, 70, 229, 1)',
            borderWidth: 1,
          },
        ],
      };
    }

    // Extract dates and click counts
    const labels = graphData.map(item => {
      if (item.clickDate) {
        const date = new Date(item.clickDate);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
      return '';
    });

    const clickCounts = graphData.map(item => item.count || 0);

    return {
      labels,
      datasets: [
        {
          label: 'Clicks',
          data: clickCounts,
          backgroundColor: isDarkMode ? 'rgba(99, 102, 241, 0.5)' : 'rgba(79, 70, 229, 0.5)',
          borderColor: isDarkMode ? 'rgba(99, 102, 241, 1)' : 'rgba(79, 70, 229, 1)',
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    };
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: isDarkMode ? '#e2e8f0' : '#1e293b',
        },
      },
      title: {
        display: true,
        text: 'Click Analytics',
        color: isDarkMode ? '#e2e8f0' : '#1e293b',
      },
      tooltip: {
        backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
        titleColor: isDarkMode ? '#e2e8f0' : '#1e293b',
        bodyColor: isDarkMode ? '#e2e8f0' : '#1e293b',
        borderColor: isDarkMode ? '#334155' : '#e2e8f0',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: isDarkMode ? 'rgba(51, 65, 85, 0.5)' : 'rgba(226, 232, 240, 0.6)',
        },
        ticks: {
          color: isDarkMode ? '#94a3b8' : '#475569',
        },
        title: {
          display: true,
          text: 'Number of Clicks',
          color: isDarkMode ? '#e2e8f0' : '#1e293b',
        },
      },
      x: {
        grid: {
          color: isDarkMode ? 'rgba(51, 65, 85, 0.5)' : 'rgba(226, 232, 240, 0.6)',
        },
        ticks: {
          color: isDarkMode ? '#94a3b8' : '#475569',
        },
        title: {
          display: true,
          text: 'Date',
          color: isDarkMode ? '#e2e8f0' : '#1e293b',
        },
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Bar data={formatData()} options={options} />
    </div>
  );
};

export default Graph;