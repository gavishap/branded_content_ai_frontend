import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { colors, shadows, borderRadius, typography } from '../../utils/theme';

const MetricCard = ({
  title,
  value,
  color,
  icon: Icon,
  description,
  size = 'medium'
}) => {
  // Define size variations
  const sizeStyles = {
    small: {
      card: {
        padding: '1rem',
        height: '120px'
      },
      valueSize: '2.5rem',
      titleSize: '0.9rem',
      iconSize: 30
    },
    medium: {
      card: {
        padding: '1.5rem',
        height: '160px'
      },
      valueSize: '3rem',
      titleSize: '1rem',
      iconSize: 40
    },
    large: {
      card: {
        padding: '2rem',
        height: '200px'
      },
      valueSize: '3.5rem',
      titleSize: '1.2rem',
      iconSize: 50
    }
  };

  const currentSize = sizeStyles[size];

  return (
    <motion.div
      whileHover={{ scale: 1.03, boxShadow: shadows.lg }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        backgroundColor: colors.neutral.white,
        borderRadius: borderRadius.xl,
        boxShadow: shadows.md,
        border: `1px solid ${color || colors.primary.light}`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        ...currentSize.card
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: currentSize.valueSize,
              fontWeight: typography.fontWeights.bold,
              color: color || colors.primary.main,
              marginBottom: '0.5rem'
            }}
          >
            {typeof value === 'number' ? value.toFixed(0) : value}
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: currentSize.titleSize,
              fontWeight: typography.fontWeights.medium,
              color: colors.neutral.darkGrey,
              marginTop: '0.5rem'
            }}
          >
            {title}
          </p>
          {description && (
            <p
              style={{
                margin: 0,
                fontSize: '0.75rem',
                fontWeight: typography.fontWeights.regular,
                color: colors.neutral.grey,
                marginTop: '0.25rem'
              }}
            >
              {description}
            </p>
          )}
        </div>
        {Icon && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: `${color || colors.primary.light}20`,
              borderRadius: borderRadius.full,
              padding: '0.75rem',
              color: color || colors.primary.main
            }}
          >
            <Icon size={currentSize.iconSize} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

MetricCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  color: PropTypes.string,
  icon: PropTypes.elementType,
  description: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large'])
};

export default MetricCard;
