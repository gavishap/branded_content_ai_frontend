import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import Section from '../layout/Section';
import {
  spacing,
  colors,
  borderRadius,
  shadows,
  typography
} from '../../utils/theme';

const ContradictionAnalysisSection = ({ contradictionData = [] }) => {
  // If no contradiction data exists, don't render this section
  if (!contradictionData || contradictionData.length === 0) {
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Helper to get confidence color
  const getConfidenceColor = confidence => {
    if (typeof confidence === 'string') {
      const confidenceLower = confidence.toLowerCase();
      if (confidenceLower.includes('high')) return colors.accent.green;
      if (confidenceLower.includes('medium')) return colors.primary.main;
      if (confidenceLower.includes('low')) return colors.accent.orange;
    }
    return colors.neutral.grey;
  };

  return (
    <Section title="Analysis Contradiction Resolution">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <p
          style={{
            fontSize: typography.fontSize.md,
            color: colors.neutral.darkGrey,
            lineHeight: 1.6,
            marginTop: 0,
            marginBottom: spacing.lg
          }}
        >
          This section highlights differences in analysis from multiple sources
          and explains how they were reconciled.
        </p>

        {contradictionData.map((contradiction, index) => (
          <motion.div
            key={`contradiction-${index}`}
            variants={itemVariants}
            style={{
              backgroundColor: colors.neutral.white,
              borderRadius: borderRadius.lg,
              padding: spacing.lg,
              marginBottom: spacing.lg,
              boxShadow: shadows.md
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: spacing.sm
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: typography.fontSize.lg,
                  color: colors.primary.dark,
                  flex: 1
                }}
              >
                {contradiction.metric || 'Unknown Metric'}
              </h3>

              <div
                style={{
                  backgroundColor: `${getConfidenceColor(
                    contradiction.confidence_in_reconciliation
                  )}20`,
                  color: getConfidenceColor(
                    contradiction.confidence_in_reconciliation
                  ),
                  borderRadius: borderRadius.full,
                  padding: `${spacing.xs} ${spacing.sm}`,
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeights.medium
                }}
              >
                Confidence:{' '}
                {contradiction.confidence_in_reconciliation || 'Unknown'}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: spacing.lg,
                marginBottom: spacing.md
              }}
            >
              <div
                style={{
                  flex: '1 1 250px',
                  backgroundColor: `${colors.accent.green}10`,
                  borderRadius: borderRadius.md,
                  padding: spacing.md
                }}
              >
                <h4
                  style={{
                    margin: 0,
                    marginBottom: spacing.xs,
                    fontSize: typography.fontSize.md,
                    color: colors.accent.green
                  }}
                >
                  Gemini Assessment
                </h4>
                <p style={{ margin: 0 }}>
                  {contradiction.gemini_assessment || 'No data available'}
                </p>
              </div>

              <div
                style={{
                  flex: '1 1 250px',
                  backgroundColor: `${colors.accent.blue}10`,
                  borderRadius: borderRadius.md,
                  padding: spacing.md
                }}
              >
                <h4
                  style={{
                    margin: 0,
                    marginBottom: spacing.xs,
                    fontSize: typography.fontSize.md,
                    color: colors.accent.blue
                  }}
                >
                  ClarifAI Assessment
                </h4>
                <p style={{ margin: 0 }}>
                  {contradiction.clarifai_assessment || 'No data available'}
                </p>
              </div>
            </div>

            <div
              style={{
                backgroundColor: `${colors.primary.main}10`,
                borderRadius: borderRadius.md,
                padding: spacing.md
              }}
            >
              <h4
                style={{
                  margin: 0,
                  marginBottom: spacing.xs,
                  fontSize: typography.fontSize.md,
                  color: colors.primary.main
                }}
              >
                Reconciliation
              </h4>
              <p
                style={{
                  margin: 0,
                  lineHeight: 1.6
                }}
              >
                {contradiction.reconciliation || 'No reconciliation provided'}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
};

ContradictionAnalysisSection.propTypes = {
  contradictionData: PropTypes.array
};

export default ContradictionAnalysisSection;
