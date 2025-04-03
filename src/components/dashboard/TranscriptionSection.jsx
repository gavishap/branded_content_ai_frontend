import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import Section from '../layout/Section';
import MetricCard from '../cards/MetricCard';
import {
  spacing,
  colors,
  borderRadius,
  shadows,
  typography
} from '../../utils/theme';

const TranscriptionSection = ({ transcriptionData = {} }) => {
  // Apply default values for null/undefined data
  const safeData = {
    available: transcriptionData.available || false,
    subtitle_coverage: transcriptionData.subtitle_coverage || {
      percentage: 0,
      missing_segments: [],
      quality_score: 0,
      issues: []
    },
    key_phrases: transcriptionData.key_phrases || [],
    confidence: transcriptionData.confidence || 'Low'
  };

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

  // Check if transcription is available
  if (!safeData.available) {
    return (
      <Section title="Transcription Analysis">
        <div
          style={{
            padding: spacing.lg,
            backgroundColor: colors.neutral.lightGrey,
            borderRadius: borderRadius.lg,
            textAlign: 'center'
          }}
        >
          <p>No transcription data available for this content.</p>
        </div>
      </Section>
    );
  }

  // Format missing segments to handle both string and object formats
  const formatMissingSegment = segment => {
    if (typeof segment === 'string') {
      return segment;
    }

    if (
      segment &&
      typeof segment === 'object' &&
      segment.start &&
      segment.end
    ) {
      return `${segment.start} - ${segment.end}`;
    }

    return 'Unknown segment';
  };

  return (
    <Section title="Transcription Analysis">
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
            marginBottom: spacing.xl
          }}
        >
          {/* Subtitle Coverage */}
          <motion.div
            variants={itemVariants}
            style={{
              flex: '1 1 350px',
              minWidth: '300px'
            }}
          >
            <MetricCard
              title="Subtitle Coverage"
              value={`${safeData.subtitle_coverage.percentage}%`}
              icon="📝"
              subtitle={`Quality Score: ${safeData.subtitle_coverage.quality_score}/100`}
              tooltipText="Percentage of content covered by subtitles"
            />

            {safeData.subtitle_coverage.missing_segments &&
              safeData.subtitle_coverage.missing_segments.length > 0 && (
                <div
                  style={{
                    marginTop: spacing.md,
                    backgroundColor: colors.neutral.white,
                    borderRadius: borderRadius.lg,
                    padding: spacing.md,
                    boxShadow: shadows.sm
                  }}
                >
                  <h4
                    style={{
                      margin: 0,
                      marginBottom: spacing.sm,
                      fontSize: typography.fontSize.md,
                      color: colors.accent.orange
                    }}
                  >
                    Missing Segments
                  </h4>

                  <ul
                    style={{
                      paddingLeft: spacing.lg,
                      margin: 0
                    }}
                  >
                    {safeData.subtitle_coverage.missing_segments.map(
                      (segment, index) => (
                        <li key={index} style={{ marginBottom: spacing.xs }}>
                          {formatMissingSegment(segment)}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

            {safeData.subtitle_coverage.issues &&
              safeData.subtitle_coverage.issues.length > 0 && (
                <div
                  style={{
                    marginTop: spacing.md,
                    backgroundColor: colors.neutral.white,
                    borderRadius: borderRadius.lg,
                    padding: spacing.md,
                    boxShadow: shadows.sm
                  }}
                >
                  <h4
                    style={{
                      margin: 0,
                      marginBottom: spacing.sm,
                      fontSize: typography.fontSize.md,
                      color: colors.accent.orange
                    }}
                  >
                    Issues
                  </h4>

                  <ul
                    style={{
                      paddingLeft: spacing.lg,
                      margin: 0
                    }}
                  >
                    {safeData.subtitle_coverage.issues.map((issue, index) => (
                      <li key={index} style={{ marginBottom: spacing.xs }}>
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </motion.div>

          {/* Key Phrases */}
          <motion.div
            variants={itemVariants}
            style={{
              flex: '1 1 350px',
              minWidth: '300px'
            }}
          >
            <div
              style={{
                backgroundColor: colors.neutral.white,
                borderRadius: borderRadius.lg,
                padding: spacing.lg,
                boxShadow: shadows.md,
                height: '100%'
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
                Key Phrases
                <span
                  style={{
                    fontSize: typography.fontSize.sm,
                    color: colors.neutral.darkGrey,
                    marginLeft: spacing.sm,
                    fontWeight: 'normal'
                  }}
                >
                  Confidence: {safeData.confidence}
                </span>
              </h3>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: spacing.sm
                }}
              >
                {safeData.key_phrases.length > 0 ? (
                  safeData.key_phrases.map((phrase, index) => (
                    <div
                      key={`phrase-${index}`}
                      style={{
                        backgroundColor: `${colors.primary.main}15`,
                        color: colors.primary.dark,
                        borderRadius: borderRadius.full,
                        padding: `${spacing.xs} ${spacing.md}`,
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeights.medium
                      }}
                    >
                      {phrase}
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      color: colors.neutral.darkGrey,
                      fontStyle: 'italic'
                    }}
                  >
                    No key phrases identified
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </Section>
  );
};

TranscriptionSection.propTypes = {
  transcriptionData: PropTypes.object
};

export default TranscriptionSection;
