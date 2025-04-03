import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import Section from '../layout/Section';
import StrengthsImprovements from './StrengthsImprovements';
import {
  spacing,
  typography,
  colors,
  borderRadius,
  shadows
} from '../../utils/theme';

const SummarySection = ({
  contentOverview,
  strengths,
  improvements,
  metadata,
  contentScore
}) => {
  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Ensure colors object and its properties exist to prevent errors
  const safeColors = {
    primary: {
      light: colors?.primary?.light || '#e6f7ff',
      dark: colors?.primary?.dark || '#003a8c',
      main: colors?.primary?.main || '#1890ff'
    },
    success: {
      light: colors?.success?.light || '#f6ffed',
      dark: colors?.success?.dark || '#135200'
    },
    neutral: {
      white: colors?.neutral?.white || '#ffffff',
      lightGrey: colors?.neutral?.lightGrey || '#f0f0f0',
      darkGrey: colors?.neutral?.darkGrey || '#595959',
      black: colors?.neutral?.black || '#000000'
    }
  };

  return (
    <Section title="Content Summary">
      <motion.div
        variants={itemVariants}
        style={{
          backgroundColor: safeColors.neutral.white,
          borderRadius: borderRadius.lg,
          padding: spacing.lg,
          marginBottom: spacing.lg,
          boxShadow: shadows.md
        }}
      >
        {metadata && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: spacing.sm,
              marginBottom: spacing.md
            }}
          >
            {metadata.content_type && (
              <span
                style={{
                  backgroundColor: safeColors.primary.light,
                  color: safeColors.primary.dark,
                  padding: `${spacing.xs}px ${spacing.sm}px`,
                  borderRadius: borderRadius.sm,
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeights.medium
                }}
              >
                {metadata.content_type}
              </span>
            )}
            {contentScore && (
              <span
                style={{
                  backgroundColor: safeColors.success.light,
                  color: safeColors.success.dark,
                  padding: `${spacing.xs}px ${spacing.sm}px`,
                  borderRadius: borderRadius.sm,
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeights.medium
                }}
              >
                Score: {contentScore}/100
              </span>
            )}
            {metadata.confidence_index && (
              <span
                style={{
                  backgroundColor: safeColors.neutral.lightGrey,
                  color: safeColors.neutral.darkGrey,
                  padding: `${spacing.xs}px ${spacing.sm}px`,
                  borderRadius: borderRadius.sm,
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeights.medium
                }}
              >
                Confidence: {metadata.confidence_index}%
              </span>
            )}
          </div>
        )}

        <h3
          style={{
            margin: 0,
            marginBottom: spacing.sm,
            fontSize: typography.fontSize.lg,
            color: safeColors.primary.dark
          }}
        >
          Overview
        </h3>
        <p
          style={{
            fontSize: typography.fontSize.md,
            lineHeight: 1.6,
            color: safeColors.neutral.darkGrey
          }}
        >
          {contentOverview}
        </p>
      </motion.div>

      <StrengthsImprovements
        strengths={strengths}
        improvements={improvements}
        strengthsTitle="Key Strengths"
        improvementsTitle="Improvement Areas"
      />
    </Section>
  );
};

SummarySection.propTypes = {
  contentOverview: PropTypes.string.isRequired,
  strengths: PropTypes.arrayOf(PropTypes.string).isRequired,
  improvements: PropTypes.arrayOf(PropTypes.string).isRequired,
  metadata: PropTypes.shape({
    content_type: PropTypes.string,
    confidence_index: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    video_id: PropTypes.string,
    video_url: PropTypes.string
  }),
  contentScore: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default SummarySection;
