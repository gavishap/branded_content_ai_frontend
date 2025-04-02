import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { colors, spacing, typography } from '../../utils/theme';
import { formatPercentage } from '../../utils/dataFormatters';

// Import all the components we've created
import Section from '../layout/Section';
import MetricCard from '../cards/MetricCard';
import ScoreGauge from '../charts/ScoreGauge';
import RadarMetrics from '../charts/RadarMetrics';
import BarChart from '../charts/BarChart';
import PieChart from '../charts/PieChart';
import ColorSchemeDisplay from './ColorSchemeDisplay';
import RecommendationsPanel from './RecommendationsPanel';
import PlatformOptimizationTabs from './PlatformOptimizationTabs';
import StrengthsImprovements from './StrengthsImprovements';
import MetadataPanel from './MetadataPanel';

const Dashboard = ({ analysisData }) => {
  const [selectedSection, setSelectedSection] = useState('overview');

  if (!analysisData || Object.keys(analysisData).length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: spacing.xl,
          color: colors.neutral.darkGrey
        }}
      >
        No analysis data available. Please upload content for analysis.
      </div>
    );
  }

  const {
    overall_score,
    metadata,
    engagement_metrics,
    sentiment_analysis,
    demographic_data,
    content_structure,
    color_scheme,
    recommendations,
    platform_optimizations,
    strengths,
    improvements
  } = analysisData;

  // Prepare navigation items based on available data
  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    engagement_metrics && { id: 'engagement', label: 'Engagement', icon: '👁️' },
    sentiment_analysis && { id: 'sentiment', label: 'Sentiment', icon: '😊' },
    demographic_data && {
      id: 'demographic',
      label: 'Demographics',
      icon: '👥'
    },
    content_structure && { id: 'structure', label: 'Structure', icon: '📋' },
    color_scheme && { id: 'colors', label: 'Color Scheme', icon: '🎨' },
    recommendations && {
      id: 'recommendations',
      label: 'Recommendations',
      icon: '💡'
    },
    (strengths || improvements) && {
      id: 'strengths',
      label: 'Strengths & Improvements',
      icon: '💪'
    }
  ].filter(Boolean);

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
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  // Render different sections based on selected tab
  const renderContent = () => {
    switch (selectedSection) {
      case 'overview':
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: spacing.md
              }}
            >
              <motion.div variants={itemVariants}>
                <ScoreGauge
                  score={overall_score}
                  title="Overall Content Score"
                  subtitle="Based on multiple factors"
                />
              </motion.div>

              {engagement_metrics && (
                <motion.div variants={itemVariants}>
                  <MetricCard
                    title="Engagement Potential"
                    value={formatPercentage(engagement_metrics.potential)}
                    icon="👁️"
                    trend={engagement_metrics.trend}
                    description="Expected viewer engagement"
                  />
                </motion.div>
              )}

              {sentiment_analysis && (
                <motion.div variants={itemVariants}>
                  <MetricCard
                    title="Sentiment Score"
                    value={formatPercentage(sentiment_analysis.score)}
                    icon="😊"
                    sentiment={sentiment_analysis.primary_sentiment}
                    description={`Primary: ${sentiment_analysis.primary_sentiment}`}
                  />
                </motion.div>
              )}

              {demographic_data && (
                <motion.div variants={itemVariants}>
                  <MetricCard
                    title="Demographic Reach"
                    value={formatPercentage(demographic_data.reach_score)}
                    icon="👥"
                    description={`Target: ${demographic_data.primary_demographic}`}
                  />
                </motion.div>
              )}
            </div>

            <motion.div variants={itemVariants}>
              <Section title="Key Metrics" style={{ marginTop: spacing.lg }}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: spacing.md
                  }}
                >
                  {engagement_metrics && engagement_metrics.metrics && (
                    <RadarMetrics
                      data={{
                        labels: engagement_metrics.metrics.map(
                          metric => metric.name
                        ),
                        datasets: [
                          {
                            label: 'Content Performance',
                            data: engagement_metrics.metrics.map(
                              metric => metric.value * 100
                            ),
                            backgroundColor: 'rgba(52, 152, 219, 0.2)',
                            borderColor: 'rgba(52, 152, 219, 1)',
                            pointBackgroundColor: 'rgba(52, 152, 219, 1)',
                            pointBorderColor: '#fff',
                            pointHoverBackgroundColor: '#fff',
                            pointHoverBorderColor: 'rgba(52, 152, 219, 1)'
                          }
                        ]
                      }}
                      title="Content Performance"
                    />
                  )}

                  {demographic_data && demographic_data.breakdown && (
                    <PieChart
                      data={{
                        labels: demographic_data.breakdown.map(
                          item => item.group
                        ),
                        datasets: [
                          {
                            data: demographic_data.breakdown.map(
                              item => item.percentage
                            ),
                            backgroundColor: [
                              'rgba(52, 152, 219, 0.8)',
                              'rgba(46, 204, 113, 0.8)',
                              'rgba(155, 89, 182, 0.8)',
                              'rgba(230, 126, 34, 0.8)',
                              'rgba(241, 196, 15, 0.8)'
                            ],
                            borderColor: 'rgba(255, 255, 255, 0.8)',
                            borderWidth: 1
                          }
                        ]
                      }}
                      title="Demographic Breakdown"
                      donut
                    />
                  )}

                  <div
                    style={{
                      position: 'relative',
                      height: '280px',
                      backgroundColor: colors.neutral.white,
                      borderRadius: '8px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <h4
                      style={{
                        textAlign: 'center',
                        margin: 0,
                        marginBottom: spacing.sm,
                        padding: spacing.md,
                        color: colors.neutral.darkGrey,
                        fontWeight: typography.fontWeights.medium,
                        fontSize: typography.fontSize.md
                      }}
                    >
                      Content Visualization
                    </h4>

                    <div
                      style={{
                        position: 'absolute',
                        top: '50px',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `linear-gradient(135deg, 
                        ${colors.primary.light} 0%, 
                        ${colors.primary.main} 50%, 
                        ${colors.primary.dark} 100%)`
                      }}
                    >
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          opacity: [0.7, 0.9, 0.7]
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          repeatType: 'reverse'
                        }}
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: '180px',
                          height: '180px',
                          borderRadius: '50%',
                          background: `radial-gradient(circle, 
                            rgba(255,255,255,0.8) 0%, 
                            rgba(255,255,255,0.1) 70%, 
                            rgba(255,255,255,0) 100%)`
                        }}
                      />
                      <motion.div
                        animate={{
                          rotate: 360
                        }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          ease: 'linear'
                        }}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundImage: `radial-gradient(circle at 20% 30%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 20%),
                                    radial-gradient(circle at 80% 30%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 20%),
                                    radial-gradient(circle at 50% 80%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 20%)`
                        }}
                      />

                      <div
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          padding: spacing.sm,
                          textAlign: 'center',
                          fontSize: typography.fontSize.xs,
                          color: 'white',
                          background: 'rgba(0, 0, 0, 0.2)',
                          backdropFilter: 'blur(2px)'
                        }}
                      >
                        Score: {overall_score}/100
                      </div>
                    </div>
                  </div>
                </div>
              </Section>
            </motion.div>

            {recommendations && recommendations.length > 0 && (
              <motion.div variants={itemVariants}>
                <Section
                  title="Top Recommendations"
                  style={{ marginTop: spacing.lg }}
                >
                  <RecommendationsPanel
                    recommendations={recommendations.slice(0, 3)}
                  />
                </Section>
              </motion.div>
            )}

            {metadata && metadata.length > 0 && (
              <motion.div variants={itemVariants}>
                <Section
                  title="Content Metadata"
                  style={{ marginTop: spacing.lg }}
                >
                  <MetadataPanel metadata={metadata} />
                </Section>
              </motion.div>
            )}
          </motion.div>
        );

      case 'engagement':
        return engagement_metrics ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Section title="Engagement Analysis">
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: spacing.md
                  }}
                >
                  <MetricCard
                    title="Engagement Potential"
                    value={formatPercentage(engagement_metrics.potential)}
                    icon="👁️"
                    trend={engagement_metrics.trend}
                    description="Expected viewer engagement"
                  />

                  <MetricCard
                    title="Attention Retention"
                    value={formatPercentage(
                      engagement_metrics.retention || 0.65
                    )}
                    icon="⏱️"
                    description="Viewer retention prediction"
                  />
                </div>
              </Section>
            </motion.div>

            {engagement_metrics.metrics && (
              <motion.div variants={itemVariants}>
                <Section
                  title="Detailed Metrics"
                  style={{ marginTop: spacing.lg }}
                >
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fill, minmax(280px, 1fr))',
                      gap: spacing.md
                    }}
                  >
                    <RadarMetrics
                      data={{
                        labels: engagement_metrics.metrics.map(
                          metric => metric.name
                        ),
                        datasets: [
                          {
                            label: 'Performance Metrics',
                            data: engagement_metrics.metrics.map(
                              metric => metric.value * 100
                            ),
                            backgroundColor: 'rgba(52, 152, 219, 0.2)',
                            borderColor: 'rgba(52, 152, 219, 1)',
                            pointBackgroundColor: 'rgba(52, 152, 219, 1)',
                            pointBorderColor: '#fff',
                            pointHoverBackgroundColor: '#fff',
                            pointHoverBorderColor: 'rgba(52, 152, 219, 1)'
                          }
                        ]
                      }}
                      title="Performance Metrics"
                    />

                    <BarChart
                      data={{
                        labels: engagement_metrics.metrics.map(
                          metric => metric.name
                        ),
                        datasets: [
                          {
                            label: 'Metric Comparison',
                            data: engagement_metrics.metrics.map(
                              metric => metric.value * 100
                            ),
                            backgroundColor: 'rgba(52, 152, 219, 0.8)',
                            borderColor: 'rgba(52, 152, 219, 1)',
                            borderWidth: 1
                          }
                        ]
                      }}
                      title="Metric Comparison"
                    />
                  </div>
                </Section>
              </motion.div>
            )}

            {engagement_metrics.time_analysis && (
              <motion.div variants={itemVariants}>
                <Section
                  title="Time-Based Analysis"
                  style={{ marginTop: spacing.lg }}
                >
                  <BarChart
                    data={{
                      labels: engagement_metrics.time_analysis.map(
                        point => `${point.time_point}s`
                      ),
                      datasets: [
                        {
                          label: 'Engagement Over Time',
                          data: engagement_metrics.time_analysis.map(
                            point => point.engagement_level * 100
                          ),
                          backgroundColor: 'rgba(52, 152, 219, 0.8)',
                          borderColor: 'rgba(52, 152, 219, 1)',
                          borderWidth: 1
                        }
                      ]
                    }}
                    title="Engagement Over Time"
                    orientation="horizontal"
                    height={350}
                  />
                </Section>
              </motion.div>
            )}
          </motion.div>
        ) : null;

      case 'sentiment':
        return sentiment_analysis ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Section title="Sentiment Analysis">
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: spacing.md
                  }}
                >
                  <MetricCard
                    title="Overall Sentiment"
                    value={formatPercentage(sentiment_analysis.score)}
                    icon="😊"
                    sentiment={sentiment_analysis.primary_sentiment}
                    description={`Primary: ${sentiment_analysis.primary_sentiment}`}
                  />

                  <ScoreGauge
                    score={sentiment_analysis.score * 100}
                    title="Sentiment Score"
                    subtitle={sentiment_analysis.primary_sentiment}
                  />
                </div>
              </Section>
            </motion.div>

            {sentiment_analysis.emotion_breakdown && (
              <motion.div variants={itemVariants}>
                <Section
                  title="Emotion Breakdown"
                  style={{ marginTop: spacing.lg }}
                >
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fill, minmax(280px, 1fr))',
                      gap: spacing.md
                    }}
                  >
                    <PieChart
                      data={{
                        labels: sentiment_analysis.emotion_breakdown.map(
                          emotion => emotion.name
                        ),
                        datasets: [
                          {
                            data: sentiment_analysis.emotion_breakdown.map(
                              emotion => emotion.level * 100
                            ),
                            backgroundColor: [
                              'rgba(46, 204, 113, 0.8)',
                              'rgba(52, 152, 219, 0.8)',
                              'rgba(155, 89, 182, 0.8)',
                              'rgba(230, 126, 34, 0.8)',
                              'rgba(241, 196, 15, 0.8)',
                              'rgba(231, 76, 60, 0.8)'
                            ],
                            borderColor: 'rgba(255, 255, 255, 0.8)',
                            borderWidth: 1
                          }
                        ]
                      }}
                      title="Emotional Response"
                    />

                    <BarChart
                      data={{
                        labels: sentiment_analysis.emotion_breakdown.map(
                          emotion => emotion.name
                        ),
                        datasets: [
                          {
                            label: 'Emotion Intensity',
                            data: sentiment_analysis.emotion_breakdown.map(
                              emotion => emotion.level * 100
                            ),
                            backgroundColor: 'rgba(155, 89, 182, 0.8)',
                            borderColor: 'rgba(155, 89, 182, 1)',
                            borderWidth: 1
                          }
                        ]
                      }}
                      title="Emotion Intensity"
                      orientation="horizontal"
                    />
                  </div>
                </Section>
              </motion.div>
            )}
          </motion.div>
        ) : null;

      case 'demographic':
        return demographic_data ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Section title="Demographic Analysis">
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: spacing.md
                  }}
                >
                  <MetricCard
                    title="Demographic Reach"
                    value={formatPercentage(demographic_data.reach_score)}
                    icon="👥"
                    description={`Target: ${demographic_data.primary_demographic}`}
                  />

                  <MetricCard
                    title="Audience Match"
                    value={formatPercentage(
                      demographic_data.audience_match || 0.82
                    )}
                    icon="🎯"
                    description="Match with target audience"
                  />
                </div>
              </Section>
            </motion.div>

            {demographic_data.breakdown && (
              <motion.div variants={itemVariants}>
                <Section
                  title="Demographic Breakdown"
                  style={{ marginTop: spacing.lg }}
                >
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fill, minmax(280px, 1fr))',
                      gap: spacing.md
                    }}
                  >
                    <PieChart
                      data={{
                        labels: demographic_data.breakdown.map(
                          item => item.group
                        ),
                        datasets: [
                          {
                            data: demographic_data.breakdown.map(
                              item => item.percentage
                            ),
                            backgroundColor: [
                              'rgba(52, 152, 219, 0.8)',
                              'rgba(46, 204, 113, 0.8)',
                              'rgba(155, 89, 182, 0.8)',
                              'rgba(230, 126, 34, 0.8)',
                              'rgba(241, 196, 15, 0.8)'
                            ],
                            borderColor: 'rgba(255, 255, 255, 0.8)',
                            borderWidth: 1
                          }
                        ]
                      }}
                      title="Audience Groups"
                      donut
                    />

                    <BarChart
                      data={{
                        labels: demographic_data.breakdown.map(
                          item => item.group
                        ),
                        datasets: [
                          {
                            label: 'Group Distribution',
                            data: demographic_data.breakdown.map(
                              item => item.percentage
                            ),
                            backgroundColor: 'rgba(46, 204, 113, 0.8)',
                            borderColor: 'rgba(46, 204, 113, 1)',
                            borderWidth: 1
                          }
                        ]
                      }}
                      title="Group Distribution"
                      orientation="horizontal"
                    />
                  </div>
                </Section>
              </motion.div>
            )}

            {demographic_data.region_data && (
              <motion.div variants={itemVariants}>
                <Section
                  title="Regional Distribution"
                  style={{ marginTop: spacing.lg }}
                >
                  <BarChart
                    data={{
                      labels: demographic_data.region_data.map(
                        region => region.name
                      ),
                      datasets: [
                        {
                          label: 'Regional Breakdown',
                          data: demographic_data.region_data.map(
                            region => region.percentage
                          ),
                          backgroundColor: 'rgba(230, 126, 34, 0.8)',
                          borderColor: 'rgba(230, 126, 34, 1)',
                          borderWidth: 1
                        }
                      ]
                    }}
                    title="Regional Breakdown"
                    orientation="horizontal"
                    height={350}
                  />
                </Section>
              </motion.div>
            )}
          </motion.div>
        ) : null;

      case 'structure':
        return content_structure ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Section title="Content Structure Analysis">
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: spacing.md
                  }}
                >
                  <MetricCard
                    title="Structure Score"
                    value={formatPercentage(content_structure.score)}
                    icon="📋"
                    description="Overall structure quality"
                  />

                  <MetricCard
                    title="Flow Rating"
                    value={formatPercentage(
                      content_structure.flow_rating || 0.75
                    )}
                    icon="🔄"
                    description="Narrative flow assessment"
                  />
                </div>
              </Section>
            </motion.div>

            {content_structure.sections && (
              <motion.div variants={itemVariants}>
                <Section
                  title="Content Sections"
                  style={{ marginTop: spacing.lg }}
                >
                  <BarChart
                    data={{
                      labels: content_structure.sections.map(
                        section => section.name
                      ),
                      datasets: [
                        {
                          label: 'Section Distribution',
                          data: content_structure.sections.map(
                            section => section.duration || section.length
                          ),
                          backgroundColor: 'rgba(52, 152, 219, 0.8)',
                          borderColor: 'rgba(52, 152, 219, 1)',
                          borderWidth: 1
                        }
                      ]
                    }}
                    title="Section Distribution"
                    orientation="horizontal"
                    height={350}
                  />
                </Section>
              </motion.div>
            )}

            {content_structure.pace_analysis && (
              <motion.div variants={itemVariants}>
                <Section
                  title="Pacing Analysis"
                  style={{ marginTop: spacing.lg }}
                >
                  <BarChart
                    data={{
                      labels: content_structure.pace_analysis.map(
                        point => `${point.time_point}s`
                      ),
                      datasets: [
                        {
                          label: 'Content Pacing',
                          data: content_structure.pace_analysis.map(
                            point => point.pace_level * 100
                          ),
                          backgroundColor: 'rgba(241, 196, 15, 0.8)',
                          borderColor: 'rgba(241, 196, 15, 1)',
                          borderWidth: 1
                        }
                      ]
                    }}
                    title="Content Pacing"
                  />
                </Section>
              </motion.div>
            )}
          </motion.div>
        ) : null;

      case 'colors':
        return color_scheme ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Section title="Color Scheme Analysis">
                <ColorSchemeDisplay colorScheme={color_scheme} />
              </Section>
            </motion.div>
          </motion.div>
        ) : null;

      case 'recommendations':
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Section title="Content Recommendations">
                {recommendations && (
                  <RecommendationsPanel recommendations={recommendations} />
                )}
              </Section>
            </motion.div>

            {platform_optimizations && (
              <motion.div variants={itemVariants}>
                <Section
                  title="Platform-Specific Optimizations"
                  style={{ marginTop: spacing.lg }}
                >
                  <PlatformOptimizationTabs
                    platformOptimizations={platform_optimizations}
                  />
                </Section>
              </motion.div>
            )}
          </motion.div>
        );

      case 'strengths':
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Section title="Strengths & Areas for Improvement">
                <StrengthsImprovements
                  strengths={strengths}
                  improvements={improvements}
                />
              </Section>
            </motion.div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ padding: spacing.md }}>
      <h2
        style={{
          color: colors.primary.dark,
          fontSize: typography.fontSize.xl,
          marginBottom: spacing.md
        }}
      >
        Content Analysis Dashboard
      </h2>

      {/* Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: spacing.xs,
          overflowX: 'auto',
          marginBottom: spacing.lg,
          padding: `${spacing.xs}px 0`,
          borderBottom: `1px solid ${colors.neutral.lightGrey}`
        }}
      >
        {navigationItems.map(item => (
          <button
            key={item.id}
            onClick={() => setSelectedSection(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.xs,
              padding: `${spacing.sm}px ${spacing.md}px`,
              border: 'none',
              borderRadius: '4px',
              background:
                selectedSection === item.id
                  ? colors.primary.light
                  : 'transparent',
              color:
                selectedSection === item.id
                  ? colors.primary.dark
                  : colors.neutral.darkGrey,
              fontWeight:
                selectedSection === item.id
                  ? typography.fontWeights.medium
                  : typography.fontWeights.regular,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'background 0.2s, color 0.2s'
            }}
          >
            <span style={{ fontSize: '18px' }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      {/* Dynamic Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedSection}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

Dashboard.propTypes = {
  analysisData: PropTypes.shape({
    overall_score: PropTypes.number,
    metadata: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.any.isRequired
      })
    ),
    engagement_metrics: PropTypes.object,
    sentiment_analysis: PropTypes.object,
    demographic_data: PropTypes.object,
    content_structure: PropTypes.object,
    color_scheme: PropTypes.object,
    recommendations: PropTypes.array,
    platform_optimizations: PropTypes.array,
    strengths: PropTypes.array,
    improvements: PropTypes.array
  })
};

export default Dashboard;
