import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import {
  colors,
  borderRadius,
  shadows,
  spacing,
  typography
} from '../../utils/theme';

const TrendIndicator = ({ trend }) => {
  if (!trend) return null;

  const isUp = trend.toLowerCase() === 'up';
  const color = isUp ? colors.accent.green : colors.accent.orange;
  const arrow = isUp ? '↑' : '↓';

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: `${color}20`,
        color: color,
        borderRadius: borderRadius.full,
        padding: '2px 8px',
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeights.medium,
        marginLeft: spacing.xs
      }}
    >
      {arrow} {isUp ? 'Up' : 'Down'}
    </div>
  );
};

TrendIndicator.propTypes = {
  trend: PropTypes.string
};

const MetricCard = ({
  title,
  value,
  icon,
  description,
  trend,
  sentiment,
  color
}) => {
  // Get color based on props or automatically from sentiment
  const getCardColor = () => {
    if (color) return color;

    if (sentiment) {
      const sentimentLower = sentiment.toLowerCase();
      if (sentimentLower.includes('positive')) return colors.accent.green;
      if (sentimentLower.includes('negative')) return colors.accent.orange;
      if (sentimentLower.includes('neutral')) return colors.primary.main;
    }

    return colors.primary.main;
  };

  const cardColor = getCardColor();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{
        y: -5,
        boxShadow: shadows.lg,
        transition: { duration: 0.2 }
      }}
      style={{
        backgroundColor: colors.neutral.white,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        boxShadow: shadows.md,
        borderTop: `4px solid ${cardColor}`,
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}
      >
        <h3
          style={{
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeights.medium,
            color: colors.neutral.darkGrey,
            margin: 0
          }}
        >
          {title}
        </h3>

        {icon && (
          <span
            style={{
              fontSize: '1.5rem',
              backgroundColor: `${cardColor}20`,
              width: '40px',
              height: '40px',
              borderRadius: borderRadius.full,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: cardColor
            }}
          >
            {icon}
          </span>
        )}
      </div>

      <div
        style={{
          marginTop: 'auto',
          marginBottom: 'auto',
          paddingTop: spacing.md
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span
            style={{
              fontSize: typography.fontSize['3xl'],
              fontWeight: typography.fontWeights.bold,
              color: cardColor
            }}
          >
            {value}
          </span>

          {trend && <TrendIndicator trend={trend} />}
        </div>

        {(description || sentiment) && (
          <p
            style={{
              fontSize: typography.fontSize.sm,
              color: colors.neutral.darkGrey,
              margin: 0,
              marginTop: spacing.xs
            }}
          >
            {description || `Sentiment: ${sentiment}`}
          </p>
        )}
      </div>
    </motion.div>
  );
};

MetricCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.string,
  description: PropTypes.string,
  trend: PropTypes.string,
  sentiment: PropTypes.string,
  color: PropTypes.string
};

export default MetricCard;
