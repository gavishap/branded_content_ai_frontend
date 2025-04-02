// Sample analysis data from unified_analysis_20250402_212752.json
const analysisData = {
  metadata: {
    timestamp: '2025-04-02T22:00:00.000000Z',
    video_id: 'tesla_model_y_unboxing',
    confidence_index: 88,
    analysis_sources: ['Gemini', 'ClarifAI']
  },
  summary: {
    content_overview:
      "An enthusiastic unboxing and review of a 1:18 scale Tesla Model Y diecast model, highlighting its detailed features and the presenter's excitement.",
    key_strengths: [
      'High-quality visuals and close-ups',
      'Engaging presenter enthusiasm',
      'Detailed product showcase',
      'Strong appeal to Tesla enthusiasts'
    ],
    improvement_areas: [
      'Clearer call to action',
      'More varied camera angles',
      'Broader emotional appeal for wider virality',
      'Consider incorporating B-roll footage or lifestyle shots'
    ],
    overall_performance_score: 79
  },
  performance_metrics: {
    engagement: {
      score: 82,
      confidence: 'Medium',
      insights:
        "Gemini's higher engagement scores (88 Attention, 92 Potential) likely stem from focusing on the presenter's energy and the product's niche appeal. ClarifAI's lower score (70) considers a broader audience and the relatively neutral emotional tone outside the presenter's enthusiasm. The unified score balances these perspectives.",
      breakdown: {
        hook_effectiveness: 85,
        emotional_impact: 72,
        audience_retention: 75,
        attention_score: 88
      }
    },
    shareability: {
      score: 70,
      confidence: 'Medium',
      insights:
        'Gemini emphasizes strong niche shareability (75), while ClarifAI suggests a lower overall score (60) possibly due to limited broad appeal beyond the Tesla community. The unified score reflects the potential for niche virality.',
      breakdown: {
        uniqueness: 72,
        relevance: 70,
        trending_potential: 65
      }
    },
    conversion_potential: {
      score: 62,
      confidence: 'Low',
      insights:
        'Lack of a specific call to action beyond commenting limits conversion potential. Value proposition is high for Tesla enthusiasts. Adding a clear CTA could significantly improve this metric.',
      breakdown: {
        call_to_action_clarity: 40,
        value_proposition: 80,
        persuasiveness: 65
      }
    },
    viral_potential: {
      score: 72,
      confidence: 'Medium',
      detailed_analysis:
        'Moderate viral potential within the Tesla niche due to strong product appeal and execution. Wider virality is limited by a lack of broader emotional hooks beyond product enthusiasm. Strategic additions like humor or relatable scenarios could enhance viral potential.',
      breakdown: {
        visuals_quality: 85,
        emotional_resonance: 62,
        shareability_factor: 75,
        relatability: 70,
        uniqueness: 72
      }
    }
  },
  audience_analysis: {
    primary_audience: {
      demographic:
        'Millennial and Gen Z Tesla enthusiasts (primarily men, significant female presence), interested in technology, business, and automotive.',
      confidence: 'High',
      platform_fit: {
        instagram: 85,
        tiktok: 80,
        youtube: 80,
        facebook: 70
      }
    },
    secondary_audiences: [
      {
        demographic: 'Diecast model collectors',
        confidence: 'Medium',
        reasons: [
          'Interest in detailed scale models',
          'Potential overlap with car enthusiasts'
        ]
      },
      {
        demographic: 'General car enthusiasts',
        confidence: 'Low',
        reasons: [
          'Interest in new car models',
          'Appreciation for detailed replicas'
        ]
      }
    ],
    representation_metrics: {
      diversity_score: 68,
      inclusion_rating: 62,
      appeal_breadth: 70,
      insights:
        'While diverse in age and gender, ethnic representation skews towards White and East Asian. Improving inclusivity could broaden appeal.  Gathering more data on viewership demographics could increase the confidence of these assessments.',
      demographics_breakdown: {
        age_distribution: {
          '20-29': 'high',
          '30-39': 'moderate'
        },
        gender_distribution: {
          male: 'slightly higher',
          female: 'prominent'
        },
        ethnicity_distribution: {
          White: 'high',
          'East Asian': 'high',
          'Southeast Asian': 'some',
          'Middle Eastern': 'some',
          Black: 'some',
          'Hispanic/Latinx': 'low'
        }
      }
    }
  },
  content_quality: {
    visual_elements: {
      score: 85,
      confidence: 'High',
      strengths: [
        'Clear, well-lit footage',
        'Excellent close-ups',
        'Good contrast'
      ],
      improvement_areas: [
        'More varied camera angles',
        'Incorporating B-roll footage for visual interest'
      ],
      color_scheme: {
        dominant_colors: ['#FFFFFF', '#000000', '#808080'],
        color_mood: 'Neutral/Modern',
        saturation_level: 70,
        contrast_rating: 85
      }
    },
    audio_elements: {
      score: 75,
      confidence: 'Medium',
      strengths: ['Clear presenter delivery'],
      improvement_areas: [
        'Ensure consistent audio levels',
        'Consider adding background music'
      ]
    },
    narrative_structure: {
      score: 80,
      confidence: 'High',
      strengths: ['Effective hook', 'Engaging pacing'],
      improvement_areas: ['Stronger call to action', 'More concise conclusion']
    },
    pacing_and_flow: {
      score: 80,
      confidence: 'High',
      insights:
        'Pacing effectively balances quick reveals with detailed shots.  Slight variations in pacing between intro and product focus maintain viewer engagement.',
      editing_pace: {
        average_cuts_per_second: 'Approximately 0.4 cuts per second',
        total_cut_count: 23,
        pacing_analysis:
          'The pacing is generally good, allowing viewers to see details but keeping the video moving. Starts faster, slows for detail shots.'
      }
    },
    product_presentation: {
      featured_products: [
        {
          name: 'Tesla Model Y 1:18 Scale Diecast Model',
          screen_time: 'Approximately 50 seconds',
          presentation_quality: 90
        }
      ],
      overall_presentation_score: 90,
      confidence: 'High'
    }
  },
  emotional_analysis: {
    dominant_emotions: ['happiness', 'neutral', 'surprise'],
    emotional_arc:
      "Neutral with peaks of happiness and surprise during product reveals. Subtle hints of sadness/contempt and fear were also detected by ClarifAI, potentially indicating slight concern about the frunk not opening or the product's delicacy.",
    emotional_resonance_score: 72,
    confidence: 'Medium',
    insights:
      "Gemini highlights the presenter's enthusiasm, while ClarifAI provides a more nuanced view, detecting subtle secondary emotions.  Further analysis could explore the specific triggers for these nuanced emotions."
  },
  competitive_advantage: {
    uniqueness_factors: [
      'Detailed product showcase',
      'Enthusiastic presenter',
      'Newness of the diecast model',
      'High-quality video production'
    ],
    differentiation_score: 75,
    market_positioning:
      'Appeals strongly to the niche Tesla and diecast collector communities. Has the potential to reach broader car enthusiast audiences with targeted promotion.',
    confidence: 'Medium'
  },
  optimization_recommendations: {
    priority_improvements: [
      {
        area: 'Call to Action',
        recommendation:
          'Include a clear call to action (e.g., link to product page, discount code, or social media follow)',
        expected_impact: 'High',
        confidence: 'High'
      },
      {
        area: 'Visual Variety',
        recommendation:
          'Incorporate more diverse camera angles and B-roll footage to enhance visual appeal and maintain viewer interest.',
        expected_impact: 'Medium',
        confidence: 'Medium'
      },
      {
        area: 'Emotional Breadth',
        recommendation:
          'Explore incorporating broader emotional hooks for wider appeal (e.g., humor, relatable situations, aspirational messaging).',
        expected_impact: 'Medium',
        confidence: 'Low'
      }
    ],
    a_b_testing_suggestions: [
      {
        element: 'Call to action',
        variations: [
          'Link to product page',
          'Prompt to join a Tesla community',
          'Offer a limited-time discount'
        ],
        expected_insights: 'Determine which CTA drives higher conversions.'
      },
      {
        element: 'Thumbnail',
        variations: [
          'High-contrast image of presenter holding model',
          "Close-up of the model's details",
          "Text overlay like 'Tesla Sent Me THIS!'"
        ],
        expected_insights:
          'Identify the thumbnail that generates the most clicks.'
      }
    ],
    platform_specific_optimizations: {
      instagram: [
        'Use Reels format with quick cuts',
        'Relevant hashtags like #Tesla #ModelY #Diecast #Unboxing'
      ],
      tiktok: [
        'Utilize trending sounds',
        "Emphasize 'wow' features",
        'Engage with comments and duets'
      ],
      youtube: [
        'Concise format',
        'Clear text overlays for details',
        'Include cards and end screens'
      ],
      facebook: [
        'Target Tesla groups and pages',
        'Run targeted ads',
        'Boost posts for wider reach'
      ]
    },
    thumbnail_optimization: [
      'High-contrast image of presenter holding model',
      "Text overlay like 'Tesla Sent Me THIS!'",
      'Close-up detail shot of the car'
    ]
  },
  transcription_analysis: {
    available: true,
    subtitle_coverage: {
      percentage: 100,
      missing_segments: [],
      quality_score: 95,
      issues: [
        'Subtitles cover product occasionally',
        'Timing slightly fast in some segments'
      ]
    },
    key_phrases: [
      'Tesla Model Y',
      'diecast model',
      'unboxing',
      'attention to detail',
      'scale model'
    ],
    confidence: 'High'
  },
  contradiction_analysis: [
    {
      metric: 'Engagement Score',
      gemini_assessment: 'High (88 Attention, 92 Potential)',
      clarifai_assessment: 'Moderate (70)',
      reconciliation:
        'Gemini focuses on niche enthusiasm, ClarifAI considers broader audience and more neutral overall tone. The unified score balances these perspectives, recognizing strong engagement within the target audience but acknowledging room for improvement in broader appeal.',
      confidence_in_reconciliation: 'High'
    },
    {
      metric: 'Shareability',
      gemini_assessment: 'High (75 within niche)',
      clarifai_assessment: 'Moderate (60 overall)',
      reconciliation:
        'Difference reflects niche vs. broad audience perspective.  The unified score leans towards higher shareability given the strong engagement within the core audience, but recognizes limitations for broader virality.',
      confidence_in_reconciliation: 'Medium'
    }
  ]
};

export default analysisData;
