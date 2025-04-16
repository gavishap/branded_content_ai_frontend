import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import Section from '../layout/Section';
import MetricCard from '../cards/MetricCard';
import RadarMetrics from '../charts/RadarMetrics';
import { spacing, colors } from '../../utils/theme';

const PerformanceMetricsSection = ({ metrics }) => {
  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Return empty component if no metrics data is available
  if (!metrics) {
    return (
      <Section title="Performance Metrics">
        <div style={{ textAlign: 'center', padding: spacing.md }}>
          No performance metrics available.
        </div>
      </Section>
    );
  }

  // Safely extract metric values with fallbacks
  const engagement = metrics.engagement || {
    score: 0,
    confidence: 'N/A',
    breakdown: {}
  };
  const shareability = metrics.shareability || {
    score: 0,
    confidence: 'N/A',
    breakdown: {}
  };
  const conversion = metrics.conversion_potential || {
    score: 0,
    confidence: 'N/A',
    breakdown: {}
  };
  const virality = metrics.viral_potential || {
    score: 0,
    confidence: 'N/A',
    breakdown: {}
  };

  // Format data for radar chart
  const radarData = {
    labels: ['Engagement', 'Shareability', 'Conversion', 'Virality'],
    datasets: [
      {
        label: 'Performance Metrics',
        data: [
          engagement.score,
          shareability.score,
          conversion.score,
          virality.score
        ],
        backgroundColor: `${colors.primary.main}40`,
        borderColor: colors.primary.main,
        borderWidth: 2,
        pointBackgroundColor: colors.primary.main,
        pointBorderColor: colors.neutral.white,
        pointHoverBackgroundColor: colors.neutral.white,
        pointHoverBorderColor: colors.primary.main
      }
    ]
  };

  // Function to render a single metric with its breakdown
  const renderMetricBreakdown = (title, data, icon) => {
    // Ensure breakdown exists, use empty object as fallback
    const breakdownData = data.breakdown || {};

    const breakdown = Object.entries(breakdownData).map(([key, value]) => ({
      label: key
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      value
    }));

    return (
      <motion.div
        variants={itemVariants}
        style={{
          flex: '1 1 450px',
          minWidth: '300px',
          marginBottom: spacing.xl,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <MetricCard
          title={title}
          value={data.score}
          icon={icon}
          description={`Confidence: ${data.confidence}`}
        />

        <div
          style={{
            marginTop: spacing.lg,
            backgroundColor: colors.neutral.white,
            borderRadius: '8px',
            padding: spacing.md,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
        >
          <h4
            style={{
              marginTop: 0,
              marginBottom: spacing.md,
              color: colors.primary.dark
            }}
          >
            Breakdown
          </h4>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: spacing.md
            }}
          >
            {breakdown.map((item, index) => (
              <div
                key={index}
                style={{
                  flex: '1 1 180px',
                  padding: spacing.md,
                  backgroundColor: colors.neutral.lightGrey,
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <div style={{ fontWeight: 'bold', marginBottom: spacing.xs }}>
                  {item.label}
                </div>
                <div
                  style={{
                    fontSize: '1.25rem',
                    color: colors.primary.main,
                    fontWeight: 'bold'
                  }}
                >
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {data.insights && (
          <div
            style={{
              marginTop: spacing.md,
              backgroundColor: colors.neutral.white,
              borderRadius: '8px',
              padding: spacing.md,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            <h4
              style={{
                marginTop: 0,
                marginBottom: spacing.sm,
                color: colors.primary.dark
              }}
            >
              Insights
            </h4>
            <p style={{ lineHeight: 1.6, margin: 0 }}>{data.insights}</p>
          </div>
        )}

        {data.detailed_analysis && (
          <div
            style={{
              marginTop: spacing.md,
              backgroundColor: colors.neutral.white,
              borderRadius: '8px',
              padding: spacing.md,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            <h4
              style={{
                marginTop: 0,
                marginBottom: spacing.sm,
                color: colors.primary.dark
              }}
            >
              Detailed Analysis
            </h4>
            <p style={{ lineHeight: 1.6, margin: 0 }}>
              {data.detailed_analysis}
            </p>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <Section title="Performance Metrics">
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: spacing.xl,
          backgroundColor: colors.neutral.white,
          borderRadius: '12px',
          padding: spacing.lg,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{ width: '500px', maxWidth: '100%', height: '400px' }}>
          <h3
            style={{
              textAlign: 'center',
              margin: 0,
              marginBottom: spacing.md,
              color: colors.primary.dark
            }}
          >
            Performance Overview
          </h3>
          <RadarMetrics data={radarData} />
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: spacing.xl,
          justifyContent: 'space-between'
        }}
      >
        {renderMetricBreakdown('Engagement', engagement, '👁️')}
        {renderMetricBreakdown('Shareability', shareability, '🔄')}
        {renderMetricBreakdown('Conversion Potential', conversion, '🎯')}
        {renderMetricBreakdown('Viral Potential', virality, '📈')}
      </div>
    </Section>
  );
};

PerformanceMetricsSection.propTypes = {
  metrics: PropTypes.shape({
    engagement: PropTypes.object.isRequired,
    shareability: PropTypes.object.isRequired,
    conversion_potential: PropTypes.object.isRequired,
    viral_potential: PropTypes.object.isRequired
  }).isRequired
};

export default PerformanceMetricsSection;
