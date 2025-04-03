import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows
} from '../../utils/theme';

// Register required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({
  data,
  title,
  orientation = 'vertical',
  height = 250,
  animate = true
}) => {
  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: orientation === 'horizontal' ? 'y' : 'x',
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12,
            family: typography.fontFamily,
            weight: 'bold'
          },
          color: colors.neutral.darkGrey
        }
      },
      y: {
        grid: {
          color: colors.neutral.lightGrey,
          borderDash: [5, 5]
        },
        ticks: {
          font: {
            size: 11,
            family: typography.fontFamily
          },
          color: colors.neutral.darkGrey,
          padding: 10
        },
        beginAtZero: true,
        max: 100 // Set max to 100 for percentage scales
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          padding: 15,
          font: {
            size: 12,
            family: typography.fontFamily
          }
        }
      },
      tooltip: {
        backgroundColor: colors.neutral.darkGrey,
        titleFont: {
          size: 13,
          family: typography.fontFamily
        },
        bodyFont: {
          size: 12,
          family: typography.fontFamily
        },
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw}%`;
          }
        },
        padding: 10,
        cornerRadius: 4
      }
    },
    animation: animate
      ? {
          duration: 1200,
          easing: 'easeOutQuart'
        }
      : false,
    barPercentage: 0.8,
    categoryPercentage: 0.7,
    borderRadius: 6
  };

  // Animation variants for container
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      initial={animate ? 'hidden' : 'visible'}
      animate="visible"
      variants={containerVariants}
      style={{
        backgroundColor: colors.neutral.white,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        boxShadow: shadows.md,
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {title && (
        <h3
          style={{
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeights.medium,
            color: colors.neutral.darkGrey,
            margin: 0,
            marginBottom: spacing.md
          }}
        >
          {title}
        </h3>
      )}

      <div
        style={{
          flex: 1,
          position: 'relative',
          height: height || 'auto',
          minHeight: '200px'
        }}
      >
        <Bar data={data} options={chartOptions} />
      </div>
    </motion.div>
  );
};

BarChart.propTypes = {
  data: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
    datasets: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        data: PropTypes.arrayOf(PropTypes.number).isRequired,
        backgroundColor: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.arrayOf(PropTypes.string)
        ]),
        borderColor: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.arrayOf(PropTypes.string)
        ]),
        borderWidth: PropTypes.number
      })
    ).isRequired
  }).isRequired,
  title: PropTypes.string,
  orientation: PropTypes.oneOf(['vertical', 'horizontal']),
  height: PropTypes.number,
  animate: PropTypes.bool
};

export default BarChart;
