import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
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
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const RadarMetrics = ({ data, title, animate = true }) => {
  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: {
          color: colors.neutral.lightGrey
        },
        grid: {
          color: colors.neutral.lightGrey
        },
        pointLabels: {
          font: {
            size: 12,
            family: typography.fontFamily
          },
          color: colors.neutral.darkGrey
        },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: {
          stepSize: 20,
          backdropColor: 'rgba(0, 0, 0, 0)'
        }
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
        padding: 10,
        cornerRadius: 4,
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw}%`;
          }
        }
      }
    },
    animation: animate
      ? {
          duration: 1500,
          easing: 'easeOutQuart'
        }
      : false
  };

  // Animation variants
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

      <div style={{ flex: 1, position: 'relative', minHeight: '250px' }}>
        <Radar data={data} options={chartOptions} />
      </div>
    </motion.div>
  );
};

RadarMetrics.propTypes = {
  data: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
    datasets: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        data: PropTypes.arrayOf(PropTypes.number).isRequired,
        backgroundColor: PropTypes.string,
        borderColor: PropTypes.string,
        borderWidth: PropTypes.number
      })
    ).isRequired
  }).isRequired,
  title: PropTypes.string,
  animate: PropTypes.bool
};

export default RadarMetrics;
