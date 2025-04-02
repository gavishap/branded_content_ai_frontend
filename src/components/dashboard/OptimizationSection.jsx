import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import Section from '../layout/Section';
import RecommendationsPanel from './RecommendationsPanel';
import PlatformOptimizationTabs from './PlatformOptimizationTabs';
import {
  spacing,
  colors,
  borderRadius,
  shadows,
  typography
} from '../../utils/theme';

const OptimizationSection = ({ optimizationData }) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Format platform specific data for tabs
  const platformOptimizations = Object.entries(
    optimizationData.platform_specific_optimizations
  ).map(([platform, tips]) => ({
    platform,
    tips
  }));

  return (
    <Section title="Optimization Recommendations">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Priority Improvements */}
        <motion.div
          variants={itemVariants}
          style={{ marginBottom: spacing.xl }}
        >
          <h3
            style={{
              margin: 0,
              marginBottom: spacing.md,
              fontSize: typography.fontSize.lg,
              color: colors.primary.dark
            }}
          >
            Priority Improvements
          </h3>

          <RecommendationsPanel
            recommendations={optimizationData.priority_improvements}
          />
        </motion.div>

        {/* A/B Testing Suggestions */}
        <motion.div
          variants={itemVariants}
          style={{ marginBottom: spacing.xl }}
        >
          <h3
            style={{
              margin: 0,
              marginBottom: spacing.md,
              fontSize: typography.fontSize.lg,
              color: colors.primary.dark
            }}
          >
            A/B Testing Suggestions
          </h3>

          {optimizationData.a_b_testing_suggestions.map((suggestion, index) => (
            <motion.div
              key={`ab-test-${index}`}
              variants={itemVariants}
              style={{
                backgroundColor: colors.neutral.white,
                borderRadius: borderRadius.lg,
                padding: spacing.lg,
                marginBottom: spacing.md,
                boxShadow: shadows.md
              }}
            >
              <h4
                style={{
                  margin: 0,
                  marginBottom: spacing.sm,
                  fontSize: typography.fontSize.md,
                  color: colors.primary.dark
                }}
              >
                {suggestion.element}
              </h4>

              <div
                style={{
                  backgroundColor: `${colors.primary.main}10`,
                  borderRadius: borderRadius.md,
                  padding: spacing.sm,
                  marginBottom: spacing.md
                }}
              >
                <strong>Expected Insights:</strong>{' '}
                {suggestion.expected_insights}
              </div>

              <h5
                style={{
                  marginBottom: spacing.sm,
                  fontSize: typography.fontSize.sm,
                  color: colors.neutral.darkGrey
                }}
              >
                Suggested Variations:
              </h5>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: spacing.sm
                }}
              >
                {suggestion.variations.map((variation, vIndex) => (
                  <div
                    key={`variation-${vIndex}`}
                    style={{
                      backgroundColor: colors.neutral.lightGrey,
                      borderRadius: borderRadius.md,
                      padding: `${spacing.xs} ${spacing.sm}`,
                      fontSize: typography.fontSize.sm
                    }}
                  >
                    {variation}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Platform Specific Optimizations */}
        <motion.div
          variants={itemVariants}
          style={{ marginBottom: spacing.xl }}
        >
          <h3
            style={{
              margin: 0,
              marginBottom: spacing.md,
              fontSize: typography.fontSize.lg,
              color: colors.primary.dark
            }}
          >
            Platform Specific Optimizations
          </h3>

          <PlatformOptimizationTabs
            platformOptimizations={platformOptimizations}
          />
        </motion.div>

        {/* Thumbnail Optimization */}
        <motion.div variants={itemVariants}>
          <h3
            style={{
              margin: 0,
              marginBottom: spacing.md,
              fontSize: typography.fontSize.lg,
              color: colors.primary.dark
            }}
          >
            Thumbnail Optimization
          </h3>

          <motion.div
            variants={itemVariants}
            style={{
              backgroundColor: colors.neutral.white,
              borderRadius: borderRadius.lg,
              padding: spacing.lg,
              boxShadow: shadows.md
            }}
          >
            <h4
              style={{
                margin: 0,
                marginBottom: spacing.md,
                fontSize: typography.fontSize.md,
                color: colors.primary.dark
              }}
            >
              Recommended Thumbnail Approaches
            </h4>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: spacing.md
              }}
            >
              {optimizationData.thumbnail_optimization.map(
                (suggestion, index) => (
                  <div
                    key={`thumbnail-${index}`}
                    style={{
                      backgroundColor: `${colors.primary.light}15`,
                      borderRadius: borderRadius.md,
                      padding: spacing.md,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: colors.primary.main,
                        color: colors.neutral.white,
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: spacing.md,
                        fontWeight: 'bold'
                      }}
                    >
                      {index + 1}
                    </div>
                    <div
                      style={{
                        fontSize: typography.fontSize.md,
                        lineHeight: 1.5
                      }}
                    >
                      {suggestion}
                    </div>
                  </div>
                )
              )}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </Section>
  );
};

OptimizationSection.propTypes = {
  optimizationData: PropTypes.object.isRequired
};

export default OptimizationSection;
