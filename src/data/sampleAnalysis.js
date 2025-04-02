// Sample analysis data for testing the dashboard components
const sampleAnalysisData = {
  overall_score: 78,
  metadata: [
    { label: 'Content Type', value: 'Video Ad' },
    { label: 'Duration', value: '1:32' },
    { label: 'Brand', value: 'Example Brand' },
    { label: 'Campaign', value: 'Summer Collection 2023' },
    { label: 'Upload Date', value: '2023-06-15' },
    { label: 'Analyzed On', value: '2023-06-16' }
  ],
  engagement_metrics: {
    potential: 0.82,
    trend: 'up',
    retention: 0.76,
    metrics: [
      { name: 'Viewer Interest', value: 0.85 },
      { name: 'Call to Action', value: 0.7 },
      { name: 'Brand Alignment', value: 0.92 },
      { name: 'Visual Appeal', value: 0.88 },
      { name: 'Audio Quality', value: 0.75 },
      { name: 'Narrative Flow', value: 0.8 }
    ],
    time_analysis: [
      { time_point: 0, engagement_level: 0.65 },
      { time_point: 15, engagement_level: 0.72 },
      { time_point: 30, engagement_level: 0.85 },
      { time_point: 45, engagement_level: 0.92 },
      { time_point: 60, engagement_level: 0.88 },
      { time_point: 75, engagement_level: 0.78 },
      { time_point: 90, engagement_level: 0.95 }
    ]
  },
  sentiment_analysis: {
    score: 0.78,
    primary_sentiment: 'Positive',
    emotion_breakdown: [
      { name: 'Joy', level: 0.65 },
      { name: 'Trust', level: 0.58 },
      { name: 'Anticipation', level: 0.42 },
      { name: 'Surprise', level: 0.35 },
      { name: 'Fear', level: 0.12 },
      { name: 'Sadness', level: 0.08 }
    ]
  },
  demographic_data: {
    reach_score: 0.75,
    primary_demographic: '25-34 Urban Professionals',
    audience_match: 0.82,
    breakdown: [
      { group: '18-24', percentage: 22 },
      { group: '25-34', percentage: 45 },
      { group: '35-44', percentage: 18 },
      { group: '45-54', percentage: 10 },
      { group: '55+', percentage: 5 }
    ],
    region_data: [
      { name: 'North America', percentage: 45 },
      { name: 'Europe', percentage: 30 },
      { name: 'Asia', percentage: 15 },
      { name: 'South America', percentage: 7 },
      { name: 'Other', percentage: 3 }
    ]
  },
  content_structure: {
    score: 0.85,
    flow_rating: 0.82,
    sections: [
      { name: 'Intro', duration: 12, effectiveness: 0.78 },
      { name: 'Product Feature', duration: 32, effectiveness: 0.85 },
      { name: 'Customer Story', duration: 28, effectiveness: 0.92 },
      { name: 'Value Proposition', duration: 15, effectiveness: 0.88 },
      { name: 'Call to Action', duration: 5, effectiveness: 0.75 }
    ],
    pace_analysis: [
      { time_point: 0, pace_level: 0.4 },
      { time_point: 15, pace_level: 0.55 },
      { time_point: 30, pace_level: 0.75 },
      { time_point: 45, pace_level: 0.85 },
      { time_point: 60, pace_level: 0.9 },
      { time_point: 75, pace_level: 0.82 },
      { time_point: 90, pace_level: 0.65 }
    ]
  },
  color_scheme: {
    score: 0.88,
    dominant_colors: [
      { hex: '#2E5A88', percentage: 35 },
      { hex: '#F9F6EE', percentage: 25 },
      { hex: '#D64045', percentage: 18 },
      { hex: '#5C946E', percentage: 12 },
      { hex: '#2A2B2A', percentage: 10 }
    ],
    mood: 'Professional & Energetic',
    saturation_level: 'Medium-High',
    contrast_rating: 'Strong'
  },
  recommendations: [
    {
      area: 'Content Structure',
      recommendation:
        'Extend the call to action duration by 2-3 seconds to improve conversion potential.',
      impact: 'high',
      confidence: 0.88
    },
    {
      area: 'Demographics',
      recommendation:
        'Consider adding elements appealing to the 35-44 age group to broaden reach.',
      impact: 'medium',
      confidence: 0.75
    },
    {
      area: 'Engagement',
      recommendation:
        'Add interactive elements around the 75-second mark to maintain attention through the end.',
      impact: 'high',
      confidence: 0.92
    },
    {
      area: 'Audio',
      recommendation:
        'Increase background music volume by 10-15% during product showcase for emotional impact.',
      impact: 'low',
      confidence: 0.68
    },
    {
      area: 'Visuals',
      recommendation:
        'Reduce scene transitions by 20% to improve narrative flow.',
      impact: 'medium',
      confidence: 0.79
    }
  ],
  platform_optimizations: [
    {
      platform: 'Instagram',
      tips: [
        'Optimize for 4:5 aspect ratio for better feed presence',
        'Add captions for sound-off viewing',
        'Consider breaking into 15-second segments for Stories',
        'Highlight key message within first 3 seconds'
      ]
    },
    {
      platform: 'YouTube',
      tips: [
        'Keep original 16:9 aspect ratio',
        'Add end screen with related content links',
        'Optimize thumbnail with high contrast and clear text',
        'Consider adding longer descriptive content in description'
      ]
    },
    {
      platform: 'TikTok',
      tips: [
        'Reformat to 9:16 vertical format',
        'Increase pace by 15% for platform alignment',
        'Add trending sound or music elements',
        'Incorporate text overlays for key messages'
      ]
    },
    {
      platform: 'LinkedIn',
      tips: [
        'Emphasize professional elements and statistics',
        'Add captions for accessibility',
        'Consider adding an intro card with value proposition',
        'Optimize first 5 seconds for autoplay engagement'
      ]
    }
  ],
  strengths: [
    'Strong brand identity presentation throughout the content',
    'Excellent product feature demonstration with clear benefits',
    'High-quality visuals with professional color grading',
    'Effective emotional storytelling in the customer segment',
    'Clear and concise messaging that aligns with brand values'
  ],
  improvements: [
    'Call to action could be more prominent and appear earlier',
    'Audio mixing needs refinement in transition areas',
    'Consider more diverse casting to broaden demographic appeal',
    'Pacing inconsistencies between the 45-60 second mark',
    'Mobile viewing experience needs optimization for smaller screens'
  ]
};

export default sampleAnalysisData;
