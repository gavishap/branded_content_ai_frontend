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

const RecommendationsPanel = ({ recommendations, animate = true }) => {
  if (!recommendations || !recommendations.length) {
    return null;
  }

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
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  // Helper function to get color based on impact
  const getImpactBorderColor = impact => {
    // If impact is a number between 0 and 1, convert it to a string category
    if (typeof impact === 'number') {
      if (impact >= 0.8) return colors.accent.green;
      if (impact >= 0.6) return colors.primary.main;
      if (impact >= 0.4) return colors.accent.orange;
      return colors.accent.red;
    }

    // Handle string values
    if (typeof impact === 'string') {
      const impactLower = impact.toLowerCase();
      if (impactLower.includes('high')) return colors.accent.green;
      if (impactLower.includes('medium')) return colors.primary.main;
      if (impactLower.includes('low')) return colors.accent.orange;
    }

    // Default case if impact is undefined or not recognized
    return colors.neutral.grey;
  };

  // Helper function to get confidence badge background
  const getConfidenceBg = confidence => {
    // If confidence is a number between 0 and 1, convert it to a string category
    if (typeof confidence === 'number') {
      if (confidence >= 0.8) return `${colors.accent.green}20`;
      if (confidence >= 0.6) return `${colors.primary.main}20`;
      if (confidence >= 0.4) return `${colors.accent.orange}20`;
      return `${colors.accent.red}20`;
    }

    // Handle string values
    if (typeof confidence === 'string') {
      const confidenceLower = confidence.toLowerCase();
      if (confidenceLower.includes('high')) return `${colors.accent.green}20`;
      if (confidenceLower.includes('medium')) return `${colors.primary.main}20`;
      if (confidenceLower.includes('low')) return `${colors.accent.orange}20`;
    }

    // Default case if confidence is undefined or not recognized
    return `${colors.neutral.grey}20`;
  };

  return (
    <motion.div
      initial={animate ? 'hidden' : 'visible'}
      animate="visible"
      variants={containerVariants}
    >
      {recommendations.map((recommendation, index) => (
        <motion.div
          key={`recommendation-${index}`}
          variants={itemVariants}
          style={{
            backgroundColor: colors.neutral.white,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
            marginBottom: spacing.md,
            boxShadow: shadows.md,
            borderLeft: `4px solid ${getImpactBorderColor(
              recommendation.impact
            )}`
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
                margin: 0,
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeights.semiBold,
                color: colors.neutral.black,
                marginBottom: spacing.xs
              }}
            >
              {recommendation.area}
            </h3>

            <div style={{ display: 'flex', gap: spacing.xs }}>
              <span
                style={{
                  backgroundColor: `${getImpactBorderColor(
                    recommendation.impact
                  )}20`,
                  color: getImpactBorderColor(recommendation.impact),
                  borderRadius: borderRadius.full,
                  padding: '4px 12px',
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeights.medium,
                  whiteSpace: 'nowrap'
                }}
              >
                <span style={{ marginRight: '4px' }}>Impact:</span>
                {typeof recommendation.impact === 'number'
                  ? `${Math.round(recommendation.impact * 100)}%`
                  : recommendation.impact}
              </span>

              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: getConfidenceBg(recommendation.confidence),
                  borderRadius: borderRadius.full,
                  padding: '4px 10px',
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeights.medium,
                  whiteSpace: 'nowrap'
                }}
              >
                <span style={{ marginRight: '4px' }}>Confidence:</span>
                {typeof recommendation.confidence === 'number'
                  ? `${Math.round(recommendation.confidence * 100)}%`
                  : recommendation.confidence}
              </span>
            </div>
          </div>

          <p
            style={{
              margin: 0,
              marginTop: spacing.sm,
              fontSize: typography.fontSize.md,
              color: colors.neutral.darkGrey,
              lineHeight: 1.6
            }}
          >
            {recommendation.recommendation}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
};

RecommendationsPanel.propTypes = {
  recommendations: PropTypes.arrayOf(
    PropTypes.shape({
      area: PropTypes.string.isRequired,
      recommendation: PropTypes.string.isRequired,
      impact: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      confidence: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired
    })
  ),
  animate: PropTypes.bool
};

export default RecommendationsPanel;
