import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import Section from '../layout/Section';
import MetricCard from '../cards/MetricCard';
import ScoreGauge from '../charts/ScoreGauge';
import RadarMetrics from '../charts/RadarMetrics';
import PieChart from '../charts/PieChart';
import BarChart from '../charts/BarChart';
import RecommendationsPanel from './RecommendationsPanel';
import ColorSchemeDisplay from './ColorSchemeDisplay';
import StrengthsImprovements from './StrengthsImprovements';
import MetadataPanel from './MetadataPanel';
import PlatformOptimizationTabs from './PlatformOptimizationTabs';
import {
  spacing,
  colors,
  borderRadius,
  shadows,
  typography
} from '../../utils/theme';

// New components for specific sections
import SummarySection from './SummarySection';
import PerformanceMetricsSection from './PerformanceMetricsSection';
import AudienceAnalysisSection from './AudienceAnalysisSection';
import ContentQualitySection from './ContentQualitySection';
import EmotionalAnalysisSection from './EmotionalAnalysisSection';
import OptimizationSection from './OptimizationSection';
import TranscriptionSection from './TranscriptionSection';
import ContradictionAnalysisSection from './ContradictionAnalysisSection';

const AnalysisDashboard = ({ data }) => {
  if (!data) {
    return <div>No analysis data available</div>;
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
    optimization_recommendations: data.optimization_recommendations || {},
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
          <MetadataPanel metadata={metadataItems} />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: colors.neutral.white,
              padding: spacing.lg,
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              minWidth: '250px'
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
          </div>
        </div>
      </Section>

      {/* Summary Section */}
      <SummarySection
        contentOverview={safeData.summary.content_overview}
        strengths={safeData.summary.key_strengths || []}
        improvements={safeData.summary.improvement_areas || []}
      />

      {/* Performance Metrics Section */}
      <PerformanceMetricsSection metrics={safeData.performance_metrics} />

      {/* Audience Analysis Section */}
      <AudienceAnalysisSection audienceData={safeData.audience_analysis} />

      {/* Content Quality Section */}
      <ContentQualitySection contentQuality={safeData.content_quality} />

      {/* Emotional Analysis Section */}
      <EmotionalAnalysisSection emotionalData={safeData.emotional_analysis} />

      {/* Competitive Advantage Section */}
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
                safeData.competitive_advantage.uniqueness_factors || []
              }
              improvements={[]}
              strengthsTitle="Uniqueness Factors"
            />
          </div>
          <div>
            <MetricCard
              title="Differentiation Score"
              value={safeData.competitive_advantage.differentiation_score || 0}
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
          <p style={{ lineHeight: 1.6, margin: 0, marginBottom: spacing.md }}>
            {safeData.competitive_advantage.market_positioning ||
              'No data available'}
          </p>
          <div
            style={{
              display: 'inline-block',
              backgroundColor: `${colors.primary.main}15`,
              borderRadius: borderRadius.md,
              padding: `${spacing.xs} ${spacing.sm}`,
              fontSize: typography.fontSize.sm
            }}
          >
            <strong>Confidence:</strong>{' '}
            {safeData.competitive_advantage.confidence || 'Low'}
          </div>
        </div>
      </Section>

      {/* Optimization Recommendations Section */}
      <OptimizationSection
        optimizationData={safeData.optimization_recommendations}
      />

      {/* Transcription Analysis */}
      <TranscriptionSection
        transcriptionData={safeData.transcription_analysis}
      />

      {/* Contradiction Analysis */}
      <ContradictionAnalysisSection
        contradictionData={safeData.contradiction_analysis || []}
      />
    </motion.div>
  );
};

AnalysisDashboard.propTypes = {
  data: PropTypes.object.isRequired
};

export default AnalysisDashboard;
