import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import Section from '../layout/Section';
import MetricCard from '../cards/MetricCard';
import BarChart from '../charts/BarChart';
import ColorSchemeDisplay from './ColorSchemeDisplay';
import {
  spacing,
  colors,
  borderRadius,
  shadows,
  typography
} from '../../utils/theme';

const ContentQualitySection = ({ contentQuality = {} }) => {
  // Ensure all required nested objects exist
  const visualElements = contentQuality.visual_elements || {
    score: 0,
    confidence: 'Low',
    strengths: [],
    improvement_areas: [],
    color_scheme: {
      dominant_colors: [],
      color_mood: '',
      saturation_level: 0,
      contrast_rating: 0
    }
  };

  const audioElements = contentQuality.audio_elements || {
    score: 0,
    confidence: 'Low',
    strengths: [],
    improvement_areas: []
  };

  const narrativeStructure = contentQuality.narrative_structure || {
    score: 0,
    confidence: 'Low',
    strengths: [],
    improvement_areas: []
  };

  const pacingAndFlow = contentQuality.pacing_and_flow || {
    score: 0,
    confidence: 'Low',
    insights: '',
    editing_pace: {
      average_cuts_per_second: '',
      total_cut_count: 0,
      pacing_analysis: ''
    }
  };

  const productPresentation = contentQuality.product_presentation || {
    featured_products: [],
    overall_presentation_score: 0,
    confidence: 'Low'
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

  // Format data for visual elements chart
  const visualElementsData = {
    labels: [
      'Visual Elements',
      'Audio Elements',
      'Narrative Structure',
      'Pacing & Flow',
      'Presentation'
    ],
    datasets: [
      {
        label: 'Content Quality Scores',
        data: [
          visualElements.score,
          audioElements.score,
          narrativeStructure.score,
          pacingAndFlow.score,
          productPresentation.overall_presentation_score
        ],
        backgroundColor: `${colors.primary.main}80`,
        borderColor: colors.primary.main,
        borderWidth: 2
      }
    ]
  };

  // Component for displaying strengths and improvement areas
  const StrengthsImprovementsList = ({
    strengths = [],
    improvements = [],
    title
  }) => (
    <motion.div
      variants={itemVariants}
      style={{
        backgroundColor: colors.neutral.white,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.md,
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
        {title}
      </h4>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: spacing.lg
        }}
      >
        <div style={{ flex: '1 1 300px' }}>
          <h5
            style={{
              color: colors.accent.green,
              display: 'flex',
              alignItems: 'center',
              gap: spacing.xs
            }}
          >
            <span>💪</span> Strengths
          </h5>
          <ul
            style={{
              paddingLeft: spacing.lg,
              margin: 0,
              color: colors.neutral.darkGrey
            }}
          >
            {strengths.map((strength, index) => (
              <li key={index} style={{ marginBottom: spacing.xs }}>
                {strength}
              </li>
            ))}
            {strengths.length === 0 && (
              <li style={{ marginBottom: spacing.xs }}>
                No specific strengths identified
              </li>
            )}
          </ul>
        </div>

        <div style={{ flex: '1 1 300px' }}>
          <h5
            style={{
              color: colors.accent.blue,
              display: 'flex',
              alignItems: 'center',
              gap: spacing.xs
            }}
          >
            <span>🚀</span> Improvement Areas
          </h5>
          <ul
            style={{
              paddingLeft: spacing.lg,
              margin: 0,
              color: colors.neutral.darkGrey
            }}
          >
            {improvements.map((improvement, index) => (
              <li key={index} style={{ marginBottom: spacing.xs }}>
                {improvement}
              </li>
            ))}
            {improvements.length === 0 && (
              <li style={{ marginBottom: spacing.xs }}>
                No specific improvement areas identified
              </li>
            )}
          </ul>
        </div>
      </div>
    </motion.div>
  );

  return (
    <Section title="Content Quality">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Overview Chart */}
        <motion.div
          variants={itemVariants}
          style={{
            marginBottom: spacing.xl,
            height: '300px'
          }}
        >
          <BarChart
            data={visualElementsData}
            horizontal={false}
            animate={true}
          />
        </motion.div>

        {/* Visual Elements */}
        <motion.div
          variants={itemVariants}
          style={{
            marginBottom: spacing.xl,
            backgroundColor: colors.neutral.white,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
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
            Visual Elements
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
              <MetricCard
                title="Visual Elements Score"
                value={visualElements.score}
                icon="🎬"
                description={`Confidence: ${visualElements.confidence}`}
              />

              <div style={{ marginTop: spacing.lg }}>
                <div
                  style={{
                    backgroundColor: `${colors.neutral.lightGrey}20`,
                    borderRadius: borderRadius.lg,
                    padding: spacing.md
                  }}
                >
                  <h4
                    style={{
                      marginTop: 0,
                      marginBottom: spacing.sm,
                      color: colors.primary.dark
                    }}
                  >
                    Visual Assessment
                  </h4>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: spacing.lg
                    }}
                  >
                    <div style={{ flex: '1 1 300px' }}>
                      <h5
                        style={{
                          color: colors.accent.green,
                          display: 'flex',
                          alignItems: 'center',
                          gap: spacing.xs,
                          margin: `${spacing.xs} 0`
                        }}
                      >
                        <span>💪</span> Strengths
                      </h5>
                      <ul
                        style={{
                          paddingLeft: spacing.lg,
                          margin: 0,
                          color: colors.neutral.darkGrey
                        }}
                      >
                        {visualElements.strengths.map((strength, index) => (
                          <li key={index} style={{ marginBottom: spacing.xs }}>
                            {strength}
                          </li>
                        ))}
                        {visualElements.strengths.length === 0 && (
                          <li style={{ marginBottom: spacing.xs }}>
                            No specific strengths identified
                          </li>
                        )}
                      </ul>
                    </div>

                    <div style={{ flex: '1 1 300px' }}>
                      <h5
                        style={{
                          color: colors.accent.blue,
                          display: 'flex',
                          alignItems: 'center',
                          gap: spacing.xs,
                          margin: `${spacing.xs} 0`
                        }}
                      >
                        <span>🚀</span> Improvement Areas
                      </h5>
                      <ul
                        style={{
                          paddingLeft: spacing.lg,
                          margin: 0,
                          color: colors.neutral.darkGrey
                        }}
                      >
                        {visualElements.improvement_areas.map(
                          (improvement, index) => (
                            <li
                              key={index}
                              style={{ marginBottom: spacing.xs }}
                            >
                              {improvement}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ flex: '1 1 400px' }}>
              <h4 style={{ marginBottom: spacing.sm }}>Color Scheme</h4>
              <ColorSchemeDisplay colorScheme={visualElements.color_scheme} />
            </div>
          </div>
        </motion.div>

        {/* Audio Elements */}
        <motion.div
          variants={itemVariants}
          style={{
            marginBottom: spacing.xl,
            backgroundColor: colors.neutral.white,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
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
            Audio Elements
          </h3>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: spacing.lg
            }}
          >
            <div style={{ flex: '1 1 300px' }}>
              <MetricCard
                title="Audio Elements Score"
                value={audioElements.score}
                icon="🔊"
                description={`Confidence: ${audioElements.confidence}`}
              />
            </div>

            <div style={{ flex: '1 1 500px' }}>
              <div
                style={{
                  backgroundColor: `${colors.neutral.lightGrey}20`,
                  borderRadius: borderRadius.lg,
                  padding: spacing.md
                }}
              >
                <h4
                  style={{
                    marginTop: 0,
                    marginBottom: spacing.sm,
                    color: colors.primary.dark
                  }}
                >
                  Audio Assessment
                </h4>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: spacing.lg
                  }}
                >
                  <div style={{ flex: '1 1 300px' }}>
                    <h5
                      style={{
                        color: colors.accent.green,
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing.xs,
                        margin: `${spacing.xs} 0`
                      }}
                    >
                      <span>💪</span> Strengths
                    </h5>
                    <ul
                      style={{
                        paddingLeft: spacing.lg,
                        margin: 0,
                        color: colors.neutral.darkGrey
                      }}
                    >
                      {audioElements.strengths.map((strength, index) => (
                        <li key={index} style={{ marginBottom: spacing.xs }}>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ flex: '1 1 300px' }}>
                    <h5
                      style={{
                        color: colors.accent.blue,
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing.xs,
                        margin: `${spacing.xs} 0`
                      }}
                    >
                      <span>🚀</span> Improvement Areas
                    </h5>
                    <ul
                      style={{
                        paddingLeft: spacing.lg,
                        margin: 0,
                        color: colors.neutral.darkGrey
                      }}
                    >
                      {audioElements.improvement_areas.map(
                        (improvement, index) => (
                          <li key={index} style={{ marginBottom: spacing.xs }}>
                            {improvement}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Narrative Structure */}
        <motion.div
          variants={itemVariants}
          style={{
            marginBottom: spacing.xl,
            backgroundColor: colors.neutral.white,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
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
            Narrative Structure
          </h3>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: spacing.lg
            }}
          >
            <div style={{ flex: '1 1 300px' }}>
              <MetricCard
                title="Narrative Structure Score"
                value={narrativeStructure.score}
                icon="📝"
                description={`Confidence: ${narrativeStructure.confidence}`}
              />
            </div>

            <div style={{ flex: '1 1 500px' }}>
              <div
                style={{
                  backgroundColor: `${colors.neutral.lightGrey}20`,
                  borderRadius: borderRadius.lg,
                  padding: spacing.md
                }}
              >
                <h4
                  style={{
                    marginTop: 0,
                    marginBottom: spacing.sm,
                    color: colors.primary.dark
                  }}
                >
                  Narrative Assessment
                </h4>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: spacing.lg
                  }}
                >
                  <div style={{ flex: '1 1 300px' }}>
                    <h5
                      style={{
                        color: colors.accent.green,
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing.xs,
                        margin: `${spacing.xs} 0`
                      }}
                    >
                      <span>💪</span> Strengths
                    </h5>
                    <ul
                      style={{
                        paddingLeft: spacing.lg,
                        margin: 0,
                        color: colors.neutral.darkGrey
                      }}
                    >
                      {narrativeStructure.strengths.map((strength, index) => (
                        <li key={index} style={{ marginBottom: spacing.xs }}>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ flex: '1 1 300px' }}>
                    <h5
                      style={{
                        color: colors.accent.blue,
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing.xs,
                        margin: `${spacing.xs} 0`
                      }}
                    >
                      <span>🚀</span> Improvement Areas
                    </h5>
                    <ul
                      style={{
                        paddingLeft: spacing.lg,
                        margin: 0,
                        color: colors.neutral.darkGrey
                      }}
                    >
                      {narrativeStructure.improvement_areas.map(
                        (improvement, index) => (
                          <li key={index} style={{ marginBottom: spacing.xs }}>
                            {improvement}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Pacing and Flow Section */}
        <motion.div
          variants={itemVariants}
          style={{
            marginBottom: spacing.xl,
            backgroundColor: colors.neutral.white,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
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
            Pacing and Flow
          </h3>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: spacing.lg
            }}
          >
            <div style={{ flex: '1 1 300px' }}>
              <MetricCard
                title="Pacing & Flow Score"
                value={pacingAndFlow.score}
                icon="⏱️"
                description={`Confidence: ${pacingAndFlow.confidence}`}
              />

              {/* Editing Pace Section - Inside Pacing and Flow */}
              <div
                style={{
                  marginTop: spacing.md,
                  backgroundColor: `${colors.neutral.lightGrey}20`,
                  borderRadius: borderRadius.lg,
                  padding: spacing.md
                }}
              >
                <h4
                  style={{
                    marginTop: 0,
                    marginBottom: spacing.sm,
                    color: colors.primary.dark
                  }}
                >
                  Editing Pace
                </h4>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: spacing.md
                  }}
                >
                  <div
                    style={{
                      flex: '1 0 auto',
                      padding: spacing.sm,
                      backgroundColor: colors.neutral.white,
                      borderRadius: borderRadius.md,
                      boxShadow: shadows.sm
                    }}
                  >
                    <strong>Average Cuts:</strong>{' '}
                    {pacingAndFlow.editing_pace.average_cuts_per_second}
                  </div>
                  <div
                    style={{
                      flex: '1 0 auto',
                      padding: spacing.sm,
                      backgroundColor: colors.neutral.white,
                      borderRadius: borderRadius.md,
                      boxShadow: shadows.sm
                    }}
                  >
                    <strong>Total Cuts:</strong>{' '}
                    {pacingAndFlow.editing_pace.total_cut_count}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ flex: '1 1 500px' }}>
              <div
                style={{
                  backgroundColor: `${colors.neutral.lightGrey}20`,
                  borderRadius: borderRadius.lg,
                  padding: spacing.md,
                  marginBottom: spacing.md
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
                <p style={{ lineHeight: 1.6, margin: 0 }}>
                  {pacingAndFlow.insights}
                </p>
              </div>

              <div
                style={{
                  backgroundColor: `${colors.neutral.lightGrey}20`,
                  borderRadius: borderRadius.lg,
                  padding: spacing.md
                }}
              >
                <h4
                  style={{
                    marginTop: 0,
                    marginBottom: spacing.sm,
                    color: colors.primary.dark
                  }}
                >
                  Pacing Analysis
                </h4>
                <p style={{ lineHeight: 1.6, margin: 0 }}>
                  {pacingAndFlow.editing_pace.pacing_analysis}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Product Presentation */}
        <motion.div
          variants={itemVariants}
          style={{
            marginBottom: spacing.xl,
            backgroundColor: colors.neutral.white,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
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
            Product Presentation
          </h3>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: spacing.lg
            }}
          >
            <div style={{ flex: '1 1 300px' }}>
              <MetricCard
                title="Product Presentation Score"
                value={productPresentation.overall_presentation_score}
                icon="✨"
                description={`Confidence: ${productPresentation.confidence}`}
              />
            </div>

            <div style={{ flex: '1 1 500px' }}>
              <div
                style={{
                  backgroundColor: `${colors.neutral.lightGrey}20`,
                  borderRadius: borderRadius.lg,
                  padding: spacing.md
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
                <p style={{ lineHeight: 1.6, margin: 0 }}>
                  {productPresentation.insights}
                </p>
              </div>
            </div>
          </div>

          {/* Featured Products */}
          {productPresentation.featured_products &&
          productPresentation.featured_products.length > 0 ? (
            <div
              style={{
                marginTop: spacing.md,
                backgroundColor: `${colors.neutral.lightGrey}20`,
                borderRadius: borderRadius.lg,
                padding: spacing.md
              }}
            >
              <h4
                style={{
                  marginTop: 0,
                  marginBottom: spacing.sm,
                  color: colors.primary.dark
                }}
              >
                Featured Products
              </h4>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: spacing.md
                }}
              >
                {productPresentation.featured_products.map((product, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: colors.neutral.white,
                      borderRadius: borderRadius.md,
                      padding: spacing.md,
                      boxShadow: shadows.sm
                    }}
                  >
                    <h5 style={{ margin: 0, marginBottom: spacing.xs }}>
                      {product.name}
                    </h5>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: spacing.xs
                      }}
                    >
                      <div>
                        <strong>Screen Time:</strong> {product.screen_time}
                      </div>
                      <div>
                        <strong>Display Quality:</strong>{' '}
                        {product.presentation_quality}
                      </div>
                      {product.timestamp && (
                        <div>
                          <strong>Timestamp:</strong> {product.timestamp}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </motion.div>
      </motion.div>
    </Section>
  );
};

ContentQualitySection.propTypes = {
  contentQuality: PropTypes.object
};

export default ContentQualitySection;
