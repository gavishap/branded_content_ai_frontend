/**
 * Utility functions for formatting data for display
 */

/**
 * Format a number (0-1) as a percentage
 * @param {number} value - The value to format (between 0 and 1)
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (value, decimals = 0) => {
  if (value === undefined || value === null) return 'N/A';

  // If value is already in percentage form (>1), don't multiply by 100
  const normalizedValue = value > 1 ? value : value * 100;
  return `${normalizedValue.toFixed(decimals)}%`;
};

/**
 * Extract main metrics from analysis data
 */
export const extractMainMetrics = analysisData => {
  if (!analysisData) return [];

  const metrics = [];

  if (analysisData.overall_score) {
    metrics.push({
      label: 'Overall Score',
      value: analysisData.overall_score
    });
  }

  if (analysisData.engagement_metrics?.potential) {
    metrics.push({
      label: 'Engagement',
      value: analysisData.engagement_metrics.potential,
      trend: analysisData.engagement_metrics.trend
    });
  }

  if (analysisData.sentiment_analysis?.score) {
    metrics.push({
      label: 'Sentiment',
      value: analysisData.sentiment_analysis.score,
      sentiment: analysisData.sentiment_analysis.primary_sentiment
    });
  }

  if (analysisData.demographic_data?.reach_score) {
    metrics.push({
      label: 'Audience Reach',
      value: analysisData.demographic_data.reach_score
    });
  }

  return metrics;
};

/**
 * Format audience match scores for visualization
 */
export const formatAudienceMatchScores = demographicData => {
  if (!demographicData || !demographicData.breakdown) return null;

  return {
    labels: demographicData.breakdown.map(item => item.group),
    datasets: [
      {
        label: 'Audience Match',
        data: demographicData.breakdown.map(item => item.percentage),
        backgroundColor: 'rgba(52, 152, 219, 0.6)',
        borderColor: 'rgba(52, 152, 219, 1)',
        borderWidth: 1
      }
    ]
  };
};

/**
 * Format demographics data for pie chart
 */
export const formatDemographicsForPieChart = demographicData => {
  if (!demographicData || !demographicData.breakdown) return null;

  return {
    labels: demographicData.breakdown.map(item => item.group),
    datasets: [
      {
        data: demographicData.breakdown.map(item => item.percentage),
        backgroundColor: [
          'rgba(52, 152, 219, 0.8)',
          'rgba(46, 204, 113, 0.8)',
          'rgba(230, 126, 34, 0.8)',
          'rgba(155, 89, 182, 0.8)',
          'rgba(241, 196, 15, 0.8)'
        ],
        borderColor: 'rgba(255, 255, 255, 0.8)',
        borderWidth: 1
      }
    ]
  };
};

/**
 * Format ethnicity data for bar chart
 */
export const formatEthnicityForBarChart = demographicData => {
  if (!demographicData || !demographicData.ethnicity) return null;

  return {
    labels: demographicData.ethnicity.map(item => item.group),
    datasets: [
      {
        label: 'Ethnic Distribution',
        data: demographicData.ethnicity.map(item => item.percentage),
        backgroundColor: 'rgba(46, 204, 113, 0.8)',
        borderColor: 'rgba(46, 204, 113, 1)',
        borderWidth: 1
      }
    ]
  };
};

/**
 * Format emotional analysis data for visualization
 */
export const formatEmotionalAnalysis = sentimentData => {
  if (!sentimentData || !sentimentData.emotion_breakdown) return null;

  return {
    labels: sentimentData.emotion_breakdown.map(item => item.name),
    datasets: [
      {
        label: 'Emotional Response',
        data: sentimentData.emotion_breakdown.map(item => item.level * 100),
        backgroundColor: 'rgba(155, 89, 182, 0.6)',
        borderColor: 'rgba(155, 89, 182, 1)',
        borderWidth: 1,
        fill: true
      }
    ]
  };
};

/**
 * Format performance metrics for radar chart
 */
export const formatPerformanceMetricsForRadar = engagementData => {
  if (!engagementData || !engagementData.metrics) return null;

  return {
    labels: engagementData.metrics.map(metric => metric.name),
    datasets: [
      {
        label: 'Performance Metrics',
        data: engagementData.metrics.map(metric => metric.value * 100),
        backgroundColor: 'rgba(52, 152, 219, 0.2)',
        borderColor: 'rgba(52, 152, 219, 1)',
        pointBackgroundColor: 'rgba(52, 152, 219, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(52, 152, 219, 1)'
      }
    ]
  };
};

/**
 * Format content quality metrics for radar chart
 */
export const formatContentQualityForRadar = contentData => {
  if (!contentData || !contentData.quality_metrics) return null;

  return {
    labels: contentData.quality_metrics.map(metric => metric.name),
    datasets: [
      {
        label: 'Content Quality',
        data: contentData.quality_metrics.map(metric => metric.score * 100),
        backgroundColor: 'rgba(46, 204, 113, 0.2)',
        borderColor: 'rgba(46, 204, 113, 1)',
        pointBackgroundColor: 'rgba(46, 204, 113, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(46, 204, 113, 1)'
      }
    ]
  };
};

/**
 * Format platform fit metrics for bar chart
 */
export const formatPlatformFitForBarChart = platformData => {
  if (!platformData) return null;

  return {
    labels: Object.keys(platformData),
    datasets: [
      {
        label: 'Platform Fit Score',
        data: Object.values(platformData),
        backgroundColor: 'rgba(52, 152, 219, 0.8)',
        borderColor: 'rgba(52, 152, 219, 1)',
        borderWidth: 1
      }
    ]
  };
};

/**
 * Format content overview data
 */
export const formatContentOverview = analysisData => {
  if (!analysisData) return [];

  const overview = [];

  if (analysisData.content_structure) {
    overview.push({
      label: 'Content Type',
      value: analysisData.content_structure.type || 'Not specified'
    });

    overview.push({
      label: 'Duration',
      value: analysisData.content_structure.duration || 'N/A'
    });

    overview.push({
      label: 'Structure Score',
      value: formatPercentage(analysisData.content_structure.score)
    });
  }

  if (analysisData.metadata) {
    analysisData.metadata.forEach(item => {
      overview.push({
        label: item.label,
        value: item.value
      });
    });
  }

  return overview;
};

/**
 * Format color scheme data
 */
export const formatColorScheme = colorData => {
  if (!colorData || !colorData.dominant_colors) return null;

  return {
    colors: colorData.dominant_colors.map(color => color.hex),
    percentages: colorData.dominant_colors.map(color => color.percentage),
    mood: colorData.mood,
    saturation: colorData.saturation_level,
    contrast: colorData.contrast_rating
  };
};

/**
 * Format optimization recommendations
 */
export const formatOptimizationRecommendations = recommendations => {
  if (!recommendations) return [];

  return recommendations.map(rec => ({
    area: rec.area,
    recommendation: rec.recommendation,
    impact: rec.impact || 'medium',
    confidence: rec.confidence
  }));
};

/**
 * Format platform-specific optimizations
 */
export const formatPlatformOptimizations = platformOptimizations => {
  if (!platformOptimizations) return {};

  const formatted = {};

  platformOptimizations.forEach(platform => {
    formatted[platform.platform] = platform.tips;
  });

  return formatted;
};

/**
 * Extract strengths and improvements
 */
export const extractStrengthsAndImprovements = analysisData => {
  return {
    strengths: analysisData.strengths || [],
    improvements: analysisData.improvements || []
  };
};

/**
 * Format metadata for display
 */
export const formatMetadata = metadata => {
  if (!metadata) return [];

  return metadata.map(item => ({
    label: item.label,
    value: item.value
  }));
};
