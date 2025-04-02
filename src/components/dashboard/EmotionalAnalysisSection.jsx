import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import Section from '../layout/Section';
import MetricCard from '../cards/MetricCard';
import PieChart from '../charts/PieChart';
import {
  spacing,
  colors,
  borderRadius,
  shadows,
  typography
} from '../../utils/theme';

const EmotionalAnalysisSection = ({ emotionalData }) => {
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

  // Format data for emotion chart
  const emotionColorMap = {
    happiness: colors.accent.green,
    neutral: colors.neutral.grey,
    surprise: colors.accent.purple,
    sadness: colors.accent.blue,
    fear: colors.accent.red,
    anger: colors.accent.orange,
    contempt: colors.primary.dark,
    disgust: '#795548'
  };

  const emotionValues = {
    happiness: 0.4,
    neutral: 0.3,
    surprise: 0.2,
    sadness: 0.05,
    fear: 0.05
  };

  // Get dominant emotions and assign values
  const dominantEmotions = emotionalData.dominant_emotions.reduce(
    (acc, emotion, index) => {
      // If we have actual values, use them, otherwise use calculated values based on position
      const value = emotionValues[emotion] || 0.5 / Math.pow(1.5, index);
      acc[emotion] = value;
      return acc;
    },
    {}
  );

  const emotionChartData = {
    labels: Object.keys(dominantEmotions),
    datasets: [
      {
        data: Object.values(dominantEmotions),
        backgroundColor: Object.keys(dominantEmotions).map(
          emotion => emotionColorMap[emotion] || colors.primary.main
        ),
        borderWidth: 1
      }
    ]
  };

  return (
    <Section title="Emotional Analysis">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: spacing.xl,
            alignItems: 'flex-start'
          }}
        >
          {/* Emotion Chart */}
          <motion.div
            variants={itemVariants}
            style={{
              flex: '1 1 300px',
              minWidth: '250px'
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ marginBottom: spacing.md }}>Dominant Emotions</h3>
              <div style={{ height: '300px' }}>
                <PieChart data={emotionChartData} donut={true} animate={true} />
              </div>
            </div>
          </motion.div>

          {/* Emotional Resonance Score */}
          <motion.div
            variants={itemVariants}
            style={{
              flex: '1 1 300px',
              minWidth: '250px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <MetricCard
              title="Emotional Resonance Score"
              value={emotionalData.emotional_resonance_score}
              icon="💖"
              subtitle={`Confidence: ${emotionalData.confidence}`}
            />
          </motion.div>
        </div>

        {/* Emotional Arc */}
        <motion.div
          variants={itemVariants}
          style={{
            backgroundColor: colors.neutral.white,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
            marginTop: spacing.xl,
            boxShadow: shadows.md
          }}
        >
          <h3
            style={{
              margin: 0,
              marginBottom: spacing.md,
              fontSize: typography.fontSize.lg,
              color: colors.primary.dark
            }}
          >
            Emotional Arc
          </h3>

          <p
            style={{
              fontSize: typography.fontSize.md,
              lineHeight: 1.6,
              color: colors.neutral.darkGrey,
              margin: 0
            }}
          >
            {emotionalData.emotional_arc}
          </p>
        </motion.div>

        {/* Insights */}
        <motion.div
          variants={itemVariants}
          style={{
            backgroundColor: colors.neutral.white,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
            marginTop: spacing.lg,
            boxShadow: shadows.md
          }}
        >
          <h3
            style={{
              margin: 0,
              marginBottom: spacing.md,
              fontSize: typography.fontSize.lg,
              color: colors.primary.dark
            }}
          >
            Insights
          </h3>

          <p
            style={{
              fontSize: typography.fontSize.md,
              lineHeight: 1.6,
              color: colors.neutral.darkGrey,
              margin: 0
            }}
          >
            {emotionalData.insights}
          </p>
        </motion.div>
      </motion.div>
    </Section>
  );
};

EmotionalAnalysisSection.propTypes = {
  emotionalData: PropTypes.object.isRequired
};

export default EmotionalAnalysisSection;
