import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import {
  colors,
  shadows,
  borderRadius,
  typography,
  spacing
} from '../../utils/theme';

const Section = ({
  title,
  subtitle,
  children,
  icon: Icon,
  color = colors.primary.main,
  elevation = 'medium',
  noPadding = false,
  animate = true,
  className = ''
}) => {
  // Define elevation styles
  const elevationStyles = {
    none: {
      boxShadow: 'none',
      border: `1px solid ${colors.neutral.lightGrey}`
    },
    low: {
      boxShadow: shadows.sm
    },
    medium: {
      boxShadow: shadows.md
    },
    high: {
      boxShadow: shadows.lg
    }
  };

  const currentElevation = elevationStyles[elevation];

  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className={`dashboard-section ${className}`}
      initial={animate ? 'hidden' : undefined}
      animate={animate ? 'visible' : undefined}
      variants={sectionVariants}
      transition={{ duration: 0.5 }}
      style={{
        backgroundColor: colors.neutral.white,
        borderRadius: borderRadius.xl,
        padding: noPadding ? 0 : spacing.lg,
        marginBottom: spacing.xl,
        overflow: 'hidden',
        ...currentElevation
      }}
    >
      {(title || subtitle) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: subtitle ? spacing.md : children ? spacing.md : 0,
            padding: noPadding ? spacing.lg : 0,
            borderBottom: subtitle
              ? `1px solid ${colors.neutral.lightGrey}`
              : 'none',
            paddingBottom: subtitle ? spacing.md : 0
          }}
        >
          {Icon && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: `${color}20`,
                borderRadius: borderRadius.full,
                padding: '0.5rem',
                marginRight: spacing.md,
                color: color
              }}
            >
              <Icon size={24} />
            </div>
          )}

          <div>
            {title && (
              <h3
                style={{
                  margin: 0,
                  fontSize: typography.fontSize.xl,
                  fontWeight: typography.fontWeights.semiBold,
                  color: colors.neutral.black,
                  marginBottom: subtitle ? spacing.xs : 0
                }}
              >
                {title}
              </h3>
            )}

            {subtitle && (
              <p
                style={{
                  margin: 0,
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeights.regular,
                  color: colors.neutral.grey
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>
      )}

      <div
        style={{ padding: noPadding && (title || subtitle) ? spacing.lg : 0 }}
      >
        {children}
      </div>
    </motion.div>
  );
};

Section.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  children: PropTypes.node,
  icon: PropTypes.elementType,
  color: PropTypes.string,
  elevation: PropTypes.oneOf(['none', 'low', 'medium', 'high']),
  noPadding: PropTypes.bool,
  animate: PropTypes.bool,
  className: PropTypes.string
};

export default Section;
