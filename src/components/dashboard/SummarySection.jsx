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

const SummarySection = ({ contentOverview, strengths, improvements }) => {
  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Section title="Content Summary">
      <motion.div
        variants={itemVariants}
        style={{
          backgroundColor: colors.neutral.white,
          borderRadius: borderRadius.lg,
          padding: spacing.lg,
          marginBottom: spacing.lg,
          boxShadow: shadows.md
        }}
      >
        <h3
          style={{
            margin: 0,
            marginBottom: spacing.sm,
            fontSize: typography.fontSize.lg,
            color: colors.primary.dark
          }}
        >
          Overview
        </h3>
        <p
          style={{
            fontSize: typography.fontSize.md,
            lineHeight: 1.6,
            color: colors.neutral.darkGrey
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
  improvements: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default SummarySection;
