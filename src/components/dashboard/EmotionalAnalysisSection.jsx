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

  // Return empty component if no emotional data is available
  if (!emotionalData) {
    return (
      <Section title="Emotional Analysis">
        <div style={{ textAlign: 'center', padding: spacing.md }}>
          No emotional analysis data available.
        </div>
      </Section>
    );
  }

  // Format data for emotion chart
  const emotionColorMap = {
    // Primary emotions
    happiness: colors.accent.green,
    happy: colors.accent.green,
    joy: '#FFC107',
    neutral: colors.neutral.grey,
    surprise: colors.accent.purple,
    sadness: colors.accent.blue,
    sad: colors.accent.blue,
    fear: colors.accent.red,
    anger: colors.accent.orange,
    angry: colors.accent.orange,
    contempt: colors.accent.teal || '#607D8B',
    disgust: '#795548',

    // Combined emotions
    'sadness/contempt': '#9E9E9E',
    'mild contempt/surprise': '#BA68C8',
    'humor/amusement': '#8BC34A',

    // Secondary emotions
    amusement: '#8BC34A',
    'happiness/amusement': '#4CAF50',
    anticipation: '#FF9800',
    trust: '#2196F3',
    pensive: '#9C27B0',
    curiosity: '#00BCD4',
    excited: '#FF4081',
    worried: '#78909C',
    confused: '#FFEB3B',
    bored: '#BDBDBD',

    // Catch-all for other emotions
    other: '#607D8B'
  };

  // Helper function to find the closest matching color
  const getEmotionColor = emotion => {
    const lowerEmotion = emotion.toLowerCase();

    // Direct match
    if (emotionColorMap[lowerEmotion]) {
      return emotionColorMap[lowerEmotion];
    }

    // Check for partial matches
    for (const [key, value] of Object.entries(emotionColorMap)) {
      if (lowerEmotion.includes(key) || key.includes(lowerEmotion)) {
        return value;
      }
    }

    // Default color if no match
    return colors.primary.main;
  };

  // Get dominant emotions and assign values based on actual data
  // If no specific values are provided, distribute evenly with weighting based on position
  const dominantEmotions = {};

  // First check if we have emotion_percentages data
  if (
    emotionalData.emotion_percentages &&
    Object.keys(emotionalData.emotion_percentages).length > 0
  ) {
    // Use the provided percentages directly
    Object.entries(emotionalData.emotion_percentages).forEach(
      ([emotion, percentage]) => {
        dominantEmotions[emotion] = percentage / 100; // Convert percentage to decimal for chart
      }
    );
  } else {
    // Fall back to calculating based on dominant_emotions array
    (emotionalData.dominant_emotions || []).forEach((emotion, index) => {
      // If we have actual percentages in the data, use those
      if (
        emotionalData.emotion_percentages &&
        emotionalData.emotion_percentages[emotion]
      ) {
        dominantEmotions[emotion] =
          emotionalData.emotion_percentages[emotion] / 100;
      } else {
        // Otherwise distribute based on position (first emotion gets higher weight)
        dominantEmotions[emotion] = 1 / Math.pow(1.3, index);
      }
    });
  }

  // Add default emotions if none are available
  if (Object.keys(dominantEmotions).length === 0) {
    dominantEmotions.neutral = 1;
  }

  // Normalize values to ensure they sum to 1 for the chart
  const totalValue = Object.values(dominantEmotions).reduce(
    (sum, val) => sum + val,
    0
  );

  if (Math.abs(totalValue - 1) > 0.01) {
    // Only normalize if not already close to 1
    Object.keys(dominantEmotions).forEach(key => {
      dominantEmotions[key] = dominantEmotions[key] / totalValue;
    });
  }

  const emotionChartData = {
    // Format emotion names to be capitalized for better readability in the chart
    labels: Object.keys(dominantEmotions).map(emotion =>
      emotion
        .split('/')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('/')
    ),
    datasets: [
      {
        data: Object.values(dominantEmotions),
        backgroundColor: Object.keys(dominantEmotions).map(emotion =>
          getEmotionColor(emotion)
        ),
        borderWidth: 1,
        borderColor: colors.neutral.white
      }
    ]
  };

  // Create legend items showing emotion colors
  const EmotionLegend = () => (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: spacing.md,
        gap: spacing.sm
      }}
    >
      {Object.keys(dominantEmotions).map(emotion => {
        const formattedEmotion = emotion
          .split('/')
          .map(
            word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join('/');

        return (
          <div
            key={emotion}
            style={{
              display: 'flex',
              alignItems: 'center',
              margin: spacing.xs
            }}
          >
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: getEmotionColor(emotion),
                marginRight: spacing.xs
              }}
            />
            <span
              style={{
                fontSize: typography.fontSize.sm,
                color: colors.neutral.darkGrey
              }}
            >
              {formattedEmotion}
            </span>
          </div>
        );
      })}
    </div>
  );

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
              {/* Custom emotion legend */}
              <EmotionLegend />
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
