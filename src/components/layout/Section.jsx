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

const Section = ({
  title,
  subtitle,
  children,
  style = {},
  animate = true,
  elevation = 'medium'
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

  // Animation variants
  const sectionVariants = {
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
      variants={sectionVariants}
      style={{
        backgroundColor: colors.neutral.white,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        marginBottom: spacing.lg,
        ...elevationStyles[elevation],
        ...style
      }}
    >
      {title && (
        <div style={{ marginBottom: spacing.md }}>
          <h3
            style={{
              fontSize: typography.fontSize.xl,
              fontWeight: typography.fontWeights.semiBold,
              color: colors.neutral.black,
              margin: 0,
              marginBottom: subtitle ? spacing.xs : 0
            }}
          >
            {title}
          </h3>

          {subtitle && (
            <p
              style={{
                fontSize: typography.fontSize.sm,
                color: colors.neutral.darkGrey,
                margin: 0
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}

      {children}
    </motion.div>
  );
};

Section.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  children: PropTypes.node,
  style: PropTypes.object,
  animate: PropTypes.bool,
  elevation: PropTypes.oneOf(['none', 'low', 'medium', 'high'])
};

export default Section;
