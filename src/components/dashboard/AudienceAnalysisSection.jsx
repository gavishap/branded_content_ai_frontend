import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import Section from '../layout/Section';
import PieChart from '../charts/PieChart';
import BarChart from '../charts/BarChart';
import PlatformOptimizationTabs from './PlatformOptimizationTabs';
import {
  spacing,
  colors,
  borderRadius,
  shadows,
  typography
} from '../../utils/theme';

const AudienceAnalysisSection = ({ audienceData }) => {
  // Return placeholder if no audienceData is provided
  if (!audienceData || Object.keys(audienceData).length === 0) {
    return (
      <Section title="Audience Analysis">
        <div style={{ textAlign: 'center', padding: spacing.md }}>
          No audience analysis data available.
        </div>
      </Section>
    );
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

  // Format data for charts
  const formatDemographicData = distribution => {
    if (!distribution) return [];
    return Object.entries(distribution).map(([key, value]) => ({
      label: key,
      value: typeof value === 'number' ? value : 0
    }));
  };

  // Safely check for demographics data
  const demographics =
    audienceData?.representation_metrics?.demographics_breakdown ||
    // Check for representation_metrics at the parent level (separate from audienceData)
    audienceData.parentRepresentationMetrics?.demographics_breakdown ||
    {};
  const ageDistribution = demographics.age_distribution || {};
  const genderDistribution = demographics.gender_distribution || {};
  const ethnicityDistribution = demographics.ethnicity_distribution || {};

  const ageDistributionData = {
    labels: Object.keys(ageDistribution),
    datasets: [
      {
        label: 'Age Distribution',
        data: Object.entries(ageDistribution).map(([key, value]) => {
          // Ensure value is a number
          if (typeof value === 'number') {
            return value;
          }
          // Convert known text values to numbers
          if (typeof value === 'string') {
            const valueMap = {
              high: 80,
              'slightly higher': 65,
              moderate: 50,
              prominent: 60,
              some: 30,
              low: 20
            };
            return valueMap[value.toLowerCase()] || 0;
          }
          // Default to 0 for any other type (boolean, null, undefined, etc.)
          return 0;
        }),
        backgroundColor: [colors.primary.main, colors.accent.blue],
        borderWidth: 1
      }
    ]
  };

  const genderData = {
    labels: Object.keys(genderDistribution),
    datasets: [
      {
        label: 'Gender Distribution',
        data: Object.entries(genderDistribution).map(([key, value]) => {
          // Ensure value is a number
          if (typeof value === 'number') {
            return value;
          }
          // Convert known text values to numbers
          if (typeof value === 'string') {
            const valueMap = {
              high: 80,
              'slightly higher': 65,
              moderate: 50,
              prominent: 60,
              some: 30,
              low: 20
            };
            return valueMap[value.toLowerCase()] || 0;
          }
          // Default to 0 for any other type
          return 0;
        }),
        backgroundColor: [colors.accent.purple, colors.accent.blue],
        borderWidth: 1
      }
    ]
  };

  const ethnicityData = {
    labels: Object.keys(ethnicityDistribution),
    datasets: [
      {
        label: 'Ethnicity Distribution',
        data: Object.entries(ethnicityDistribution).map(([key, value]) => {
          // Ensure value is a number
          if (typeof value === 'number') {
            return value;
          }
          // Convert known text values to numbers
          if (typeof value === 'string') {
            const valueMap = {
              high: 80,
              'slightly higher': 65,
              moderate: 50,
              prominent: 60,
              some: 30,
              low: 20
            };
            return valueMap[value.toLowerCase()] || 0;
          }
          // Default to 0 for any other type
          return 0;
        }),
        backgroundColor: [
          colors.primary.main,
          colors.primary.light,
          colors.accent.green,
          colors.accent.blue,
          colors.accent.purple,
          colors.accent.orange
        ],
        borderWidth: 1
      }
    ]
  };

  // Ensure platforms are correctly ordered and capitalized for better presentation
  const formatPlatformFitData = () => {
    const platformMap = {
      facebook: { label: 'Facebook', color: '#3b5998' },
      instagram: { label: 'Instagram', color: '#C13584' },
      tiktok: { label: 'TikTok', color: '#69C9D0' },
      youtube: { label: 'YouTube', color: '#FF0000' }
    };

    // Get platform_fit from primary_audience or audience_fit, or use default empty object
    const platformFitData = audienceData?.primary_audience?.platform_fit ||
      audienceData?.audience_fit?.platform_fit || {
        // Default platform fit if neither exists
        Instagram: 50,
        TikTok: 50,
        YouTube: 50,
        Facebook: 50
      };

    const platforms = Object.keys(platformFitData);
    const formattedLabels = [];
    const formattedColors = [];

    platforms.forEach(platform => {
      const lowercasePlatform = platform.toLowerCase();
      if (platformMap[lowercasePlatform]) {
        formattedLabels.push(platformMap[lowercasePlatform].label);
        formattedColors.push(platformMap[lowercasePlatform].color);
      } else {
        formattedLabels.push(platform);
        formattedColors.push(colors.accent.blue);
      }
    });

    return {
      labels: formattedLabels,
      colors: formattedColors,
      data: Object.values(platformFitData)
    };
  };

  const platformFitFormatted = formatPlatformFitData();

  const platformFitData = {
    labels: platformFitFormatted.labels,
    datasets: [
      {
        label: 'Platform Fit Score',
        data: platformFitFormatted.data,
        backgroundColor: platformFitFormatted.colors,
        borderColor: platformFitFormatted.colors.map(color => color),
        borderWidth: 2
      }
    ]
  };

  // Secondary audience card
  const SecondaryAudienceCard = ({ audience, index }) => (
    <motion.div
      variants={itemVariants}
      style={{
        backgroundColor: colors.neutral.white,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.md,
        boxShadow: shadows.sm,
        flex: '1 1 300px'
      }}
    >
      <div
        style={{
          backgroundColor: `${colors.primary.main}15`,
          padding: spacing.xs,
          borderRadius: borderRadius.sm,
          marginBottom: spacing.sm,
          width: 'fit-content'
        }}
      >
        <span style={{ fontWeight: typography.fontWeights.medium }}>
          Confidence: {audience.confidence}
        </span>
      </div>

      <h4
        style={{
          margin: 0,
          marginBottom: spacing.sm,
          fontSize: typography.fontSize.md
        }}
      >
        {audience.demographic}
      </h4>

      <div>
        <h5
          style={{
            marginBottom: spacing.xs,
            fontSize: typography.fontSize.sm
          }}
        >
          Reasons:
        </h5>
        <ul style={{ paddingLeft: spacing.lg, margin: 0 }}>
          {audience.reasons.map((reason, idx) => (
            <li key={idx} style={{ marginBottom: spacing.xs }}>
              {reason}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );

  return (
    <Section title="Audience Analysis">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Primary Audience */}
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
              marginBottom: spacing.md,
              fontSize: typography.fontSize.lg,
              color: colors.primary.dark
            }}
          >
            Primary Audience
          </h3>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: spacing.lg,
              alignItems: 'flex-start'
            }}
          >
            <div style={{ flex: '1 1 400px' }}>
              <p
                style={{
                  fontSize: typography.fontSize.md,
                  lineHeight: 1.6,
                  marginTop: 0
                }}
              >
                <strong>Demographic:</strong>{' '}
                {audienceData?.primary_audience?.demographic ||
                  (Array.isArray(audienceData?.audience_fit?.primary_audience)
                    ? audienceData?.audience_fit?.primary_audience.join(', ')
                    : audienceData?.audience_fit?.primary_audience) ||
                  'General audience'}
              </p>
              <p
                style={{
                  fontSize: typography.fontSize.md,
                  lineHeight: 1.6
                }}
              >
                <strong>Confidence:</strong>{' '}
                {audienceData?.primary_audience?.confidence || 'Medium'}
              </p>
            </div>

            <div style={{ flex: '1 1 400px' }}>
              <h4 style={{ marginBottom: spacing.sm }}>Platform Fit</h4>
              <div style={{ height: '250px' }}>
                <BarChart
                  data={platformFitData}
                  horizontal={false}
                  animate={true}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Secondary Audiences */}
        <motion.div
          variants={itemVariants}
          style={{ marginBottom: spacing.lg }}
        >
          <h3
            style={{
              margin: 0,
              marginBottom: spacing.md,
              fontSize: typography.fontSize.lg,
              color: colors.primary.dark
            }}
          >
            Secondary Audiences
          </h3>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: spacing.md
            }}
          >
            {/* Get secondary audiences from either source, with fallback to empty array */}
            {(
              audienceData?.secondary_audiences ||
              audienceData?.audience_fit?.secondary_audiences ||
              []
            ).map((audience, index) => (
              <SecondaryAudienceCard
                key={index}
                audience={
                  typeof audience === 'string'
                    ? {
                        demographic: audience,
                        confidence: 'Medium',
                        reasons: ['Content relevance']
                      }
                    : audience
                }
                index={index}
              />
            ))}
          </div>
        </motion.div>

        {/* Demographics Breakdown */}
        <motion.div
          variants={itemVariants}
          style={{ marginBottom: spacing.lg }}
        >
          <h3
            style={{
              margin: 0,
              marginBottom: spacing.md,
              fontSize: typography.fontSize.lg,
              color: colors.primary.dark
            }}
          >
            Demographics Breakdown
          </h3>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: spacing.xl,
              marginBottom: spacing.lg
            }}
          >
            <div style={{ flex: '1 1 300px', minWidth: '250px' }}>
              <h4 style={{ textAlign: 'center', marginBottom: spacing.md }}>
                Age Distribution
              </h4>
              <div style={{ height: '250px' }}>
                <BarChart
                  data={ageDistributionData}
                  horizontal={false}
                  animate={true}
                />
              </div>
            </div>

            <div style={{ flex: '1 1 300px', minWidth: '250px' }}>
              <h4 style={{ textAlign: 'center', marginBottom: spacing.md }}>
                Gender Distribution
              </h4>
              <div style={{ height: '250px' }}>
                <PieChart data={genderData} donut={true} animate={true} />
              </div>
            </div>

            <div style={{ flex: '1 1 300px', minWidth: '250px' }}>
              <h4 style={{ textAlign: 'center', marginBottom: spacing.md }}>
                Ethnicity Distribution
              </h4>
              <div style={{ height: '250px' }}>
                <PieChart data={ethnicityData} animate={true} />
              </div>
            </div>
          </div>

          <motion.div
            variants={itemVariants}
            style={{
              backgroundColor: colors.neutral.white,
              borderRadius: borderRadius.lg,
              padding: spacing.lg,
              boxShadow: shadows.sm
            }}
          >
            <h4
              style={{
                margin: 0,
                marginBottom: spacing.sm,
                fontSize: typography.fontSize.md
              }}
            >
              Representation Metrics
            </h4>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: spacing.md,
                marginBottom: spacing.md
              }}
            >
              <div
                style={{
                  flex: '1 1 200px',
                  padding: spacing.sm,
                  backgroundColor: `${colors.primary.main}15`,
                  borderRadius: borderRadius.md,
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: typography.fontSize.sm }}>
                  Diversity Score
                </div>
                <div
                  style={{
                    fontSize: typography.fontSize.xl,
                    fontWeight: typography.fontWeights.bold,
                    color: colors.primary.main
                  }}
                >
                  {audienceData.representation_metrics?.diversity_score ||
                    audienceData.parentRepresentationMetrics?.diversity_score ||
                    audienceData.representation_metrics?.overall_score ||
                    audienceData.parentRepresentationMetrics?.overall_score ||
                    0}
                </div>
              </div>

              <div
                style={{
                  flex: '1 1 200px',
                  padding: spacing.sm,
                  backgroundColor: `${colors.accent.green}15`,
                  borderRadius: borderRadius.md,
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: typography.fontSize.sm }}>
                  Inclusion Rating
                </div>
                <div
                  style={{
                    fontSize: typography.fontSize.xl,
                    fontWeight: typography.fontWeights.bold,
                    color: colors.accent.green
                  }}
                >
                  {audienceData.representation_metrics?.inclusion_rating ||
                    audienceData.parentRepresentationMetrics
                      ?.inclusion_rating ||
                    Math.round(
                      (audienceData.representation_metrics?.overall_score ||
                        audienceData.parentRepresentationMetrics
                          ?.overall_score ||
                        0) * 0.9
                    )}
                </div>
              </div>

              <div
                style={{
                  flex: '1 1 200px',
                  padding: spacing.sm,
                  backgroundColor: `${colors.accent.blue}15`,
                  borderRadius: borderRadius.md,
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: typography.fontSize.sm }}>
                  Appeal Breadth
                </div>
                <div
                  style={{
                    fontSize: typography.fontSize.xl,
                    fontWeight: typography.fontWeights.bold,
                    color: colors.accent.blue
                  }}
                >
                  {audienceData.representation_metrics?.appeal_breadth ||
                    audienceData.parentRepresentationMetrics?.appeal_breadth ||
                    Math.round(
                      (audienceData.representation_metrics?.overall_score ||
                        audienceData.parentRepresentationMetrics
                          ?.overall_score ||
                        0) * 1.1
                    )}
                </div>
              </div>
            </div>

            <h4
              style={{
                margin: 0,
                marginBottom: spacing.sm,
                fontSize: typography.fontSize.md
              }}
            >
              Insights
            </h4>
            <p
              style={{
                lineHeight: 1.6,
                margin: 0
              }}
            >
              {audienceData.representation_metrics?.insights ||
                audienceData.parentRepresentationMetrics?.insights ||
                audienceData.representation_metrics?.comparative_analysis ||
                audienceData.parentRepresentationMetrics
                  ?.comparative_analysis ||
                'No detailed insights available for demographic representation.'}
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </Section>
  );
};

AudienceAnalysisSection.propTypes = {
  audienceData: PropTypes.object.isRequired
};

export default AudienceAnalysisSection;
