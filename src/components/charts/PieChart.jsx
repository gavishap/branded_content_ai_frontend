import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
} from 'chart.js';
import {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows
} from '../../utils/theme';

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

const PieChart = ({
  data,
  title,
  height = 250,
  donut = false,
  animate = true
}) => {
  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: donut ? '60%' : 0,
    radius: '90%',
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
        padding: 10,
        cornerRadius: 4,
        callbacks: {
          label: function (context) {
            const value = context.raw;
            const total = context.chart.data.datasets[0].data.reduce(
              (sum, val) => sum + val,
              0
            );
            const percentage = Math.round((value / total) * 100);
            return `${context.label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    animation: animate
      ? {
          animateRotate: true,
          animateScale: true,
          duration: 1000,
          easing: 'easeOutQuart'
        }
      : false
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

  // Choose the right chart component
  const ChartComponent = donut ? Doughnut : Pie;

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
        <ChartComponent data={data} options={chartOptions} />
      </div>
    </motion.div>
  );
};

PieChart.propTypes = {
  data: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
    datasets: PropTypes.arrayOf(
      PropTypes.shape({
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
  height: PropTypes.number,
  donut: PropTypes.bool,
  animate: PropTypes.bool
};

export default PieChart;
