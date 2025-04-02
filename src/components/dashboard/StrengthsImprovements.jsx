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

const StrengthsImprovements = ({ strengths, improvements, animate = true }) => {
  if (
    (!strengths || !strengths.length) &&
    (!improvements || !improvements.length)
  ) {
    return null;
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial={animate ? 'hidden' : 'visible'}
      animate="visible"
      variants={containerVariants}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: spacing.xl
      }}
    >
      {/* Strengths */}
      {strengths && strengths.length > 0 && (
        <motion.div
          variants={itemVariants}
          style={{
            backgroundColor: colors.neutral.white,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
            boxShadow: shadows.md,
            borderTop: `4px solid ${colors.accent.green}`
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: spacing.md
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: borderRadius.full,
                backgroundColor: `${colors.accent.green}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: spacing.md,
                fontSize: '1.5rem'
              }}
            >
              💪
            </div>
            <h3
              style={{
                margin: 0,
                fontSize: typography.fontSize.xl,
                fontWeight: typography.fontWeights.semiBold,
                color: colors.neutral.black
              }}
            >
              Key Strengths
            </h3>
          </div>

          <ul
            style={{
              listStyleType: 'none',
              padding: 0,
              margin: 0
            }}
          >
            {strengths.map((strength, index) => (
              <motion.li
                key={`strength-${index}`}
                variants={itemVariants}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  marginBottom: index < strengths.length - 1 ? spacing.md : 0,
                  paddingBottom: index < strengths.length - 1 ? spacing.md : 0,
                  borderBottom:
                    index < strengths.length - 1
                      ? `1px solid ${colors.neutral.lightGrey}`
                      : 'none'
                }}
              >
                <span
                  style={{
                    color: colors.accent.green,
                    marginRight: spacing.sm,
                    fontSize: typography.fontSize.lg
                  }}
                >
                  ✓
                </span>
                <span
                  style={{
                    fontSize: typography.fontSize.md,
                    lineHeight: 1.6,
                    color: colors.neutral.darkGrey
                  }}
                >
                  {strength}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Improvement Areas */}
      {improvements && improvements.length > 0 && (
        <motion.div
          variants={itemVariants}
          style={{
            backgroundColor: colors.neutral.white,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
            boxShadow: shadows.md,
            borderTop: `4px solid ${colors.accent.blue}`
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: spacing.md
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: borderRadius.full,
                backgroundColor: `${colors.accent.blue}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: spacing.md,
                fontSize: '1.5rem'
              }}
            >
              🚀
            </div>
            <h3
              style={{
                margin: 0,
                fontSize: typography.fontSize.xl,
                fontWeight: typography.fontWeights.semiBold,
                color: colors.neutral.black
              }}
            >
              Areas to Improve
            </h3>
          </div>

          <ul
            style={{
              listStyleType: 'none',
              padding: 0,
              margin: 0
            }}
          >
            {improvements.map((improvement, index) => (
              <motion.li
                key={`improvement-${index}`}
                variants={itemVariants}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  marginBottom:
                    index < improvements.length - 1 ? spacing.md : 0,
                  paddingBottom:
                    index < improvements.length - 1 ? spacing.md : 0,
                  borderBottom:
                    index < improvements.length - 1
                      ? `1px solid ${colors.neutral.lightGrey}`
                      : 'none'
                }}
              >
                <span
                  style={{
                    color: colors.accent.blue,
                    marginRight: spacing.sm,
                    fontSize: typography.fontSize.lg
                  }}
                >
                  →
                </span>
                <span
                  style={{
                    fontSize: typography.fontSize.md,
                    lineHeight: 1.6,
                    color: colors.neutral.darkGrey
                  }}
                >
                  {improvement}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}
    </motion.div>
  );
};

StrengthsImprovements.propTypes = {
  strengths: PropTypes.arrayOf(PropTypes.string),
  improvements: PropTypes.arrayOf(PropTypes.string),
  animate: PropTypes.bool
};

export default StrengthsImprovements;
