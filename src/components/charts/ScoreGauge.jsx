import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows
} from '../../utils/theme';

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const ScoreGauge = ({ score, title, subtitle, animate = true }) => {
  // Normalize score to 0-100 if it's a decimal
  const normalizedScore = score > 1 ? score : score * 100;

  // Determine color based on score
  const getGaugeColor = () => {
    if (normalizedScore >= 80) return colors.accent.green;
    if (normalizedScore >= 60) return colors.primary.main;
    if (normalizedScore >= 40) return colors.accent.orange;
    return colors.accent.red;
  };

  // Chart data
  const chartData = {
    datasets: [
      {
        data: [normalizedScore, 100 - normalizedScore],
        backgroundColor: [getGaugeColor(), colors.neutral.lightGrey],
        borderWidth: 0,
        circumference: 180,
        rotation: 270
      }
    ]
  };

  // Chart options
  const chartOptions = {
    cutout: '75%',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        enabled: false
      },
      legend: {
        display: false
      }
    },
    animation: animate
      ? {
          duration: 1500,
          easing: 'easeOutQuart'
        }
      : false
  };

  // Animation variants for text
  const textVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: 0.5 }
    }
  };

  return (
    <div
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
            marginBottom: subtitle ? spacing.xs : spacing.md
          }}
        >
          {title}
        </h3>
      )}

      {subtitle && (
        <p
          style={{
            fontSize: typography.fontSize.sm,
            color: colors.neutral.grey,
            margin: 0,
            marginBottom: spacing.md
          }}
        >
          {subtitle}
        </p>
      )}

      <div
        style={{
          position: 'relative',
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div style={{ height: '160px', width: '100%' }}>
          <Doughnut data={chartData} options={chartOptions} />
        </div>

        <motion.div
          initial={animate ? 'hidden' : 'visible'}
          animate="visible"
          variants={textVariants}
          style={{
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <span
            style={{
              fontSize: typography.fontSize['3xl'],
              fontWeight: typography.fontWeights.bold,
              color: getGaugeColor()
            }}
          >
            {Math.round(normalizedScore)}
          </span>
          <span
            style={{
              fontSize: typography.fontSize.sm,
              color: colors.neutral.darkGrey
            }}
          >
            out of 100
          </span>
        </motion.div>
      </div>
    </div>
  );
};

ScoreGauge.propTypes = {
  score: PropTypes.number.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  animate: PropTypes.bool
};

export default ScoreGauge;
