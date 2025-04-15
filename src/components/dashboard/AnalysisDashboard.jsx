import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import Section from '../layout/Section';
import ScoreGauge from '../charts/ScoreGauge';
import SummarySection from './SummarySection';
import PerformanceMetricsSection from './PerformanceMetricsSection';
import AudienceAnalysisSection from './AudienceAnalysisSection';
import ContentQualitySection from './ContentQualitySection';
import EmotionalAnalysisSection from './EmotionalAnalysisSection';
import RecommendationsPanel from './RecommendationsPanel';
import TranscriptionSection from './TranscriptionSection';
import ContradictionAnalysisSection from './ContradictionAnalysisSection';
import StrengthsImprovements from './StrengthsImprovements';
import MetricCard from '../cards/MetricCard';
import MetadataPanel from './MetadataPanel';
import PlatformOptimizationTabs from './PlatformOptimizationTabs';
import RadarMetrics from '../charts/RadarMetrics';
import PieChart from '../charts/PieChart';
import BarChart from '../charts/BarChart';
import ColorSchemeDisplay from './ColorSchemeDisplay';
import {
  spacing,
  colors,
  borderRadius,
  shadows,
  typography
} from '../../utils/theme';

const AnalysisDashboard = ({ data }) => {
  // Check for null, undefined, or an object indicating a fetch error
  if (!data || Object.keys(data).length === 0 || data.metadata?.error) {
    const errorMessage = data?.metadata?.error || 'No analysis data available';
    return (
      <div
        style={{
          padding: spacing.xl,
          textAlign: 'center',
          color: colors.status.error,
          backgroundColor: `${colors.status.error}10`,
          borderRadius: borderRadius.lg,
          margin: spacing.xl
        }}
      >
        <h2>Error Loading Analysis</h2>
        <p>{errorMessage}</p>
      </div>
    );
  }

  // Ensure all required data structures exist to prevent errors
  const safeData = {
    metadata: data.metadata || {},
    summary: data.summary || {
      content_overview: 'No overview available',
      key_strengths: [],
      improvement_areas: [],
      overall_performance_score: 0
    },
    performance_metrics: data.performance_metrics || {},
    audience_analysis: data.audience_analysis || {},
    content_quality: data.content_quality || {},
    emotional_analysis: data.emotional_analysis || {},
    competitive_advantage: data.competitive_advantage || {
      uniqueness_factors: [],
      differentiation_score: 0,
      market_positioning: 'No data available',
      confidence: 'Low'
    },
    optimization_recommendations: Array.isArray(
      data.optimization_recommendations
    )
      ? data.optimization_recommendations
      : data.optimization_recommendations
      ? Object.values(data.optimization_recommendations).flat()
      : [],
    transcription_analysis: data.transcription_analysis || {},
    contradiction_analysis: data.contradiction_analysis || []
  };

  // Container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Format metadata for display
  const metadataItems = [
    { label: 'Video ID', value: safeData.metadata?.video_id || 'Unknown' },
    {
      label: 'Content Type',
      value: safeData.metadata?.content_type || 'Video'
    },
    {
      label: 'Analysis Date',
      value: safeData.metadata?.timestamp
        ? new Date(safeData.metadata.timestamp).toLocaleDateString()
        : 'Unknown'
    },
    {
      label: 'Confidence Index',
      value: `${safeData.metadata?.confidence_index || 0}%`
    },
    {
      label: 'Analysis Sources',
      value: Array.isArray(safeData.metadata?.analysis_sources)
        ? safeData.metadata.analysis_sources.join(', ')
        : 'Unknown'
    }
  ];

  // Add video URL to metadata if available
  if (safeData.metadata?.video_url) {
    metadataItems.push({
      label: 'Source URL',
      value: safeData.metadata.video_url,
      isUrl: true
    });
  }

  // Filter recommendations to ensure they are valid and have required fields
  const validRecommendations = safeData.optimization_recommendations.filter(
    rec =>
      rec &&
      rec.area &&
      rec.recommendation &&
      rec.expected_impact &&
      rec.confidence
  );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      style={{
        padding: spacing.xl,
        maxWidth: '1280px',
        margin: '0 auto'
      }}
    >
      {/* Header with metadata and overall score */}
      <Section title="Content Analysis Dashboard">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: spacing.lg,
            justifyContent: 'space-between',
            alignItems: 'flex-start'
          }}
        >
          <div style={{ flex: '1 1 600px' }}>
            <MetadataPanel metadata={metadataItems} />
          </div>
          <div
            style={{
              flex: '0 1 300px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: colors.neutral.white,
              padding: spacing.lg,
              borderRadius: borderRadius.lg,
              boxShadow: shadows.md
            }}
          >
            <h3
              style={{
                margin: 0,
                marginBottom: spacing.md,
                color: colors.primary.dark
              }}
            >
              Overall Performance
            </h3>
            <ScoreGauge
              score={
                typeof safeData.summary.overall_performance_score === 'number'
                  ? safeData.summary.overall_performance_score
                  : 0
              }
            />
            <div
              style={{
                marginTop: spacing.md,
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                gap: spacing.sm
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: `${spacing.xs} ${spacing.sm}`,
                  backgroundColor: `${colors.primary.light}15`,
                  borderRadius: borderRadius.md
                }}
              >
                <span>Engagement Potential:</span>
                <strong>
                  {safeData.performance_metrics?.engagement?.score || 0}/100
                </strong>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: `${spacing.xs} ${spacing.sm}`,
                  backgroundColor: `${colors.accent.blue}15`,
                  borderRadius: borderRadius.md
                }}
              >
                <span>Audience Match:</span>
                <strong>
                  {safeData.audience_analysis?.representation_metrics
                    ?.appeal_breadth || 0}
                  /100
                </strong>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: `${spacing.xs} ${spacing.sm}`,
                  backgroundColor: `${colors.accent.green}15`,
                  borderRadius: borderRadius.md
                }}
              >
                <span>Visual Quality:</span>
                <strong>
                  {safeData.content_quality?.visual_elements?.score || 0}/100
                </strong>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Main dashboard content */}
      <div
        style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl }}
      >
        {/* Summary Section */}
        <SummarySection
          contentOverview={
            safeData.summary?.content_overview ||
            'No content overview available.'
          }
          strengths={safeData.summary?.key_strengths || []}
          improvements={safeData.summary?.improvement_areas || []}
          metadata={{
            content_type: safeData.metadata?.content_type || 'Video',
            confidence_index: safeData.metadata?.confidence_index || 75,
            video_id: safeData.metadata?.video_id || 'Unknown',
            video_url: safeData.metadata?.video_url || ''
          }}
          contentScore={safeData.summary?.overall_performance_score}
        />

        {/* Performance metrics section */}
        <PerformanceMetricsSection metrics={safeData.performance_metrics} />

        {/* Audience analysis section */}
        <AudienceAnalysisSection audienceData={safeData.audience_analysis} />

        {/* Content quality section */}
        <ContentQualitySection
          visualElements={safeData.content_quality?.visual_elements}
          contentQuality={safeData.content_quality}
        />

        {/* Emotional analysis section */}
        <EmotionalAnalysisSection emotionalData={safeData.emotional_analysis} />

        {/* Competitive advantage section */}
        <Section title="Competitive Advantage">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: spacing.lg,
              marginBottom: spacing.lg
            }}
          >
            <div>
              <StrengthsImprovements
                strengths={
                  safeData.competitive_advantage?.uniqueness_factors || []
                }
                improvements={[]}
                strengthsTitle="Uniqueness Factors"
              />
            </div>
            <div>
              <MetricCard
                title="Differentiation Score"
                value={
                  safeData.competitive_advantage?.differentiation_score || 0
                }
                icon="📊"
                description="Score representing how differentiated this content is from competitors"
              />
            </div>
          </div>

          <div
            style={{
              backgroundColor: colors.neutral.white,
              borderRadius: borderRadius.lg,
              padding: spacing.lg,
              boxShadow: shadows.md,
              marginTop: spacing.md
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
              Market Positioning
            </h3>
            <p
              style={{
                lineHeight: 1.6,
                margin: 0,
                marginBottom: spacing.md
              }}
            >
              {safeData.competitive_advantage?.market_positioning ||
                'No data available'}
            </p>
            <div
              style={{
                display: 'inline-block',
                backgroundColor: `${colors.primary.main}15`,
                borderRadius: borderRadius.md,
                padding: `${spacing.xs}px ${spacing.sm}px`,
                fontSize: typography.fontSize.sm
              }}
            >
              <strong>Confidence:</strong>{' '}
              {safeData.competitive_advantage?.confidence || 'Low'}
            </div>
          </div>
        </Section>

        {/* Optimization recommendations section */}
        <RecommendationsPanel recommendations={validRecommendations} />

        {/* Transcription section */}
        <TranscriptionSection
          transcriptionData={safeData.transcription_analysis}
        />

        {/* Contradiction analysis section */}
        <ContradictionAnalysisSection
          contradictionData={safeData.contradiction_analysis || []}
        />
      </div>
    </motion.div>
  );
};

AnalysisDashboard.propTypes = {
  data: PropTypes.object.isRequired
};

export default AnalysisDashboard;
