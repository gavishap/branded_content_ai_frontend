import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  colors,
  gradients,
  spacing,
  borderRadius,
  shadows,
  typography
} from '../../utils/theme';
import { API_BASE_URL } from '../../config';

// Animation variants for staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24
    }
  }
};

const AnalysisLoading = ({
  progress: initialProgress,
  currentStep: initialStep,
  type,
  contentName,
  status: initialStatus,
  onCompleteClick,
  analysisId,
  onAnalysisComplete
}) => {
  const [progress, setProgress] = useState(initialProgress || 0);
  const [currentStep, setCurrentStep] = useState(initialStep || 0);
  const [status, setStatus] = useState(initialStatus || 'initializing');
  const [statusMessage, setStatusMessage] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const [containerBounds, setContainerBounds] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0
  });
  const [error, setError] = useState(null);
  const [analysisMetadata, setAnalysisMetadata] = useState({});
  const [pollingInterval, setPollingInterval] = useState(null);
  const [errorCount, setErrorCount] = useState(0);

  // Updated steps array with more detail
  const steps = [
    'Initializing analysis...',
    'Downloading video content...',
    'Running Gemini analysis...',
    'Running ClarifAI analysis...',
    'Uploading to processing servers...',
    'Processing with AI models...',
    'Gemini analysis complete...',
    'ClarifAI analysis complete...',
    'Generating unified analysis...',
    'Validating analysis results...',
    'Finalizing results...',
    'Analysis complete!'
  ];

  // Function to convert status to user-friendly message
  const getStatusMessage = statusCode => {
    // If no statusCode is provided, use component's status state
    const currentStatus = statusCode || status;

    // If no status is available, return the current step message
    if (
      !currentStatus &&
      currentStep !== undefined &&
      steps &&
      steps.length > 0
    ) {
      return steps[currentStep];
    }

    const statusMessages = {
      initializing: 'Initializing analysis...',
      downloading_video: 'Downloading video content...',
      download_complete: 'Download complete, preparing for analysis...',
      uploading_to_s3: 'Uploading to processing servers...',
      running_gemini_analysis: 'Running Gemini AI analysis...',
      running_clarifai_analysis: 'Running ClarifAI visual analysis...',
      processing_with_ai_models: 'Processing with multiple AI models...',
      gemini_started: 'Starting Gemini language-based analysis...',
      clarifai_started: 'Starting ClarifAI visual analysis...',
      gemini_complete: 'Gemini language analysis complete!',
      gemini_analysis_complete: 'Gemini analysis complete...',
      clarifai_complete: 'ClarifAI visual analysis complete!',
      clarifai_analysis_complete: 'ClarifAI visual analysis complete...',
      generating_unified_analysis: 'Generating comprehensive insights...',
      validating_unified: 'Validating and refining results...',
      validating_analysis: 'Validating and refining results...',
      finalizing_results: 'Finalizing results and visualizations...',
      completed: 'Analysis complete!',
      error: 'An error occurred during analysis.',
      captcha_error: 'YouTube CAPTCHA verification required.'
    };

    // Return the message if found, or a generic message with the raw status
    return (
      statusMessages[currentStatus] ||
      (steps && currentStep !== undefined
        ? steps[currentStep]
        : `Processing: ${currentStatus}`)
    );
  };

  // Calculate particle positions based on mouse movement
  useEffect(() => {
    if (containerRef.current) {
      const bounds = containerRef.current.getBoundingClientRect();
      setContainerBounds({
        left: bounds.left,
        top: bounds.top,
        width: bounds.width,
        height: bounds.height
      });
    }

    const handleMouseMove = event => {
      if (containerRef.current) {
        setMousePosition({
          x: event.clientX - containerBounds.left,
          y: event.clientY - containerBounds.top
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [containerBounds]);

  // Generate particle array
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    size: Math.random() * 12 + 4,
    color:
      i % 4 === 0
        ? colors.accent.teal
        : i % 4 === 1
        ? colors.primary.main
        : i % 4 === 2
        ? colors.accent.purple
        : colors.accent.pink,
    initialX: Math.random() * 100,
    initialY: Math.random() * 100,
    speed: Math.random() * 5 + 2
  }));

  const getProgressColor = () => {
    if (progress < 30) return colors.primary.main;
    if (progress < 60) return colors.accent.purple;
    if (progress < 90) return colors.accent.pink;
    return colors.accent.teal;
  };

  // Enhanced steps timeline with modern styling
  const renderProgressTimeline = () => {
    // Define the major milestones
    const milestones = [
      { pct: 0, label: 'Start', status: 'initializing', icon: '🚀' },
      { pct: 20, label: 'Download', status: 'download_complete', icon: '📥' },
      {
        pct: 40,
        label: 'AI Processing',
        status: 'processing_with_ai_models',
        icon: '🧠'
      },
      {
        pct: 70,
        label: 'Analysis',
        status: 'generating_unified_analysis',
        icon: '📊'
      },
      { pct: 100, label: 'Complete', status: 'completed', icon: '✅' }
    ];

    return (
      <div
        style={{
          width: '100%',
          marginTop: spacing.lg,
          marginBottom: spacing.lg
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            position: 'relative',
            marginBottom: spacing.md
          }}
        >
          {/* Progress bar background with gradient */}
          <div
            style={{
              position: 'absolute',
              height: '6px',
              background: `linear-gradient(to right, ${colors.neutral.lightGrey}20, ${colors.neutral.lightGrey}40)`,
              width: '100%',
              top: '10px',
              zIndex: 1,
              borderRadius: '3px'
            }}
          />

          {/* Progress fill with animated gradient */}
          <motion.div
            style={{
              position: 'absolute',
              height: '6px',
              background: `linear-gradient(to right, ${colors.primary.main}, ${colors.accent.purple}, ${colors.accent.teal})`,
              backgroundSize: '200% 200%',
              width: `${progress}%`,
              top: '10px',
              zIndex: 2,
              borderRadius: '3px',
              boxShadow: '0 0 10px rgba(67, 97, 238, 0.5)'
            }}
            initial={{ width: '0%' }}
            animate={{
              width: `${progress}%`,
              backgroundPosition: ['0% 0%', '100% 0%', '0% 0%']
            }}
            transition={{
              width: { duration: 0.5 },
              backgroundPosition: {
                duration: 3,
                repeat: Infinity,
                repeatType: 'loop',
                ease: 'linear'
              }
            }}
          />

          {/* Milestone markers */}
          {milestones.map((milestone, index) => {
            const isPassed = progress >= milestone.pct;
            const isActive =
              status === milestone.status ||
              (progress >= milestone.pct &&
                progress <
                  (index < milestones.length - 1
                    ? milestones[index + 1].pct
                    : 101));

            return (
              <div
                key={index}
                style={{
                  zIndex: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative',
                  width: '20px'
                }}
              >
                <motion.div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: isPassed
                      ? getProgressColor()
                      : colors.neutral.background,
                    border: `2px solid ${
                      isPassed ? getProgressColor() : colors.neutral.lightGrey
                    }`,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: isActive
                      ? `0 0 0 6px ${colors.primary.light}30, 0 0 20px rgba(114, 9, 183, 0.4)`
                      : isPassed
                      ? shadows.glow
                      : 'none'
                  }}
                  animate={{
                    scale: isActive ? [1, 1.1, 1] : 1,
                    backgroundColor: isPassed
                      ? getProgressColor()
                      : colors.neutral.background
                  }}
                  transition={{
                    scale: {
                      duration: 2,
                      repeat: isActive ? Infinity : 0,
                      repeatType: 'loop'
                    }
                  }}
                >
                  {isPassed && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {milestone.icon}
                    </motion.div>
                  )}
                </motion.div>
                <motion.div
                  style={{
                    marginTop: spacing.xs,
                    fontSize: typography.fontSize.sm,
                    color: isPassed
                      ? colors.primary.dark
                      : colors.neutral.darkGrey,
                    fontWeight: isActive ? 'bold' : 'normal'
                  }}
                  animate={{
                    y: isActive ? [0, -3, 0] : 0
                  }}
                  transition={{
                    y: {
                      duration: 2,
                      repeat: isActive ? Infinity : 0,
                      repeatType: 'loop'
                    }
                  }}
                >
                  {milestone.label}
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render different analysis modules being processed
  const renderAnalysisModules = () => {
    const modules = [
      {
        id: 'gemini',
        name: 'Gemini AI',
        description: 'Analyzing narratives & performance',
        progress:
          status === 'running_gemini_analysis'
            ? Math.min(progress * 1.5, 100)
            : status === 'gemini_analysis_complete'
            ? 100
            : Math.min(progress * 0.8, 90),
        color: colors.primary.main,
        icon: '🧠'
      },
      {
        id: 'clarifai',
        name: 'ClarifAI Models',
        description: 'Processing visual elements',
        progress:
          status === 'running_clarifai_analysis'
            ? Math.min(progress * 1.5, 100)
            : status === 'clarifai_analysis_complete'
            ? 100
            : Math.min(progress * 0.7, 85),
        color: colors.accent.purple,
        icon: '👁️'
      }
    ];

    return (
      <div style={{ marginTop: spacing.lg }}>
        {modules.map(module => (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 12 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: spacing.md,
              backgroundColor: colors.neutral.white,
              padding: spacing.sm,
              borderRadius: borderRadius.lg,
              boxShadow: shadows.sm
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                backgroundColor: `${module.color}15`,
                borderRadius: borderRadius.md,
                marginRight: spacing.md,
                fontSize: '20px'
              }}
            >
              {module.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div
                  style={{
                    fontSize: typography.fontSize.md,
                    fontWeight: typography.fontWeights.medium,
                    color: colors.neutral.black
                  }}
                >
                  {module.name}
                </div>
                <div
                  style={{
                    fontSize: typography.fontSize.sm,
                    color: colors.neutral.darkGrey
                  }}
                >
                  {Math.round(module.progress)}%
                </div>
              </div>
              <div
                style={{
                  fontSize: typography.fontSize.sm,
                  color: colors.neutral.darkGrey,
                  marginBottom: spacing.xs
                }}
              >
                {module.description}
              </div>
              <motion.div
                style={{
                  height: '6px',
                  backgroundColor: colors.neutral.lightGrey,
                  borderRadius: borderRadius.full,
                  overflow: 'hidden'
                }}
              >
                <motion.div
                  style={{
                    height: '100%',
                    backgroundImage: `linear-gradient(to right, ${module.color}, ${colors.accent.teal})`,
                    backgroundSize: '200% 100%',
                    borderRadius: borderRadius.full
                  }}
                  initial={{ width: '0%' }}
                  animate={{
                    width: `${module.progress}%`,
                    backgroundPosition: ['0% 0%', '100% 0%']
                  }}
                  transition={{
                    width: { duration: 0.8 },
                    backgroundPosition: {
                      duration: 2,
                      repeat: Infinity,
                      repeatType: 'reverse',
                      ease: 'linear'
                    }
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  // Clean up polling interval when component unmounts
  const stopPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
  };

  // Function to fetch analysis progress from the API
  const fetchAnalysisProgress = useCallback(async () => {
    if (!analysisId) {
      console.error('No analysis ID provided for progress check');
      setError('No analysis ID found. Please try again.');
      return;
    }

    try {
      console.log(`Fetching progress for analysis ${analysisId}`);
      const response = await fetch(
        `${API_BASE_URL}/api/analysis-progress/${analysisId}`
      );

      if (!response.ok) {
        setErrorCount(prev => prev + 1);
        console.error(
          `Error fetching analysis progress: ${response.status} ${response.statusText}`
        );

        if (response.status === 404) {
          console.log(
            'Analysis not found, might still be initializing or was lost'
          );
          // If we've tried several times and still getting 404, show a message
          if (errorCount > 5) {
            setError(
              'Analysis not found. It may have been lost or failed to start.'
            );
          }
          return;
        }

        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Progress data:', data);

      // Reset error count on successful response
      setErrorCount(0);

      if (data.metadata) {
        setAnalysisMetadata(data.metadata);
      }

      if (data.status === 'error') {
        // Check if it's a YouTube CAPTCHA error
        if (
          data.message &&
          (data.message.includes('CAPTCHA') || data.message.includes('YouTube'))
        ) {
          console.error('YouTube CAPTCHA error detected:', data.message);
          setError(
            `YouTube requires CAPTCHA verification for this video. Please try uploading the video file directly instead of using a YouTube URL.`
          );
        } else {
          console.error('Analysis error:', data.message);
          setError(
            data.message ||
              'An error occurred during analysis. Please try again.'
          );
        }

        // Update UI states
        setProgress(0);
        setCurrentStep(0);
        setStatus('error');
        return;
      }

      // Update UI states based on progress
      if (data.progress !== undefined) {
        setProgress(data.progress);
      }

      if (data.step !== undefined) {
        setCurrentStep(data.step);
      }

      if (data.status) {
        setStatus(data.status);
        setStatusMessage(data.message || getStatusMessage(data.status));
      }

      // If analysis is complete, notify parent component
      if (data.status === 'completed' && onAnalysisComplete) {
        console.log('Analysis complete, calling onAnalysisComplete');
        stopPolling();
        onAnalysisComplete(data.result_id || analysisId, data.metadata);
      }
    } catch (error) {
      console.error('Error fetching analysis progress:', error);
      setErrorCount(prev => prev + 1);

      // Only set error after several failed attempts to avoid flickering
      if (errorCount > 3) {
        setError(`Failed to check analysis progress. ${error.message}`);
      }
    }
  }, [analysisId, errorCount, onAnalysisComplete, stopPolling]);

  // Set up polling to check analysis progress
  useEffect(() => {
    if (analysisId) {
      console.log(
        'Starting polling for analysis progress with ID:',
        analysisId
      );
      // Initial fetch
      fetchAnalysisProgress();

      // Set up polling interval (every 2 seconds)
      const interval = setInterval(fetchAnalysisProgress, 2000);
      setPollingInterval(interval);

      // Clean up on unmount
      return () => {
        console.log('Cleaning up polling interval');
        stopPolling();
      };
    } else {
      console.log("No analysisId provided, polling won't start");
    }
  }, [analysisId, fetchAnalysisProgress]);

  return (
    <motion.div
      ref={containerRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        padding: spacing.xl,
        position: 'relative',
        overflow: 'hidden',
        background: `radial-gradient(circle at center, ${colors.neutral.background} 0%, #f0f4f8 100%)`
      }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Dynamic particles */}
      {particles.map((particle, index) => (
        <motion.div
          key={index}
          style={{
            position: 'absolute',
            width: particle.size,
            height: particle.size,
            borderRadius: '50%',
            backgroundColor: particle.color,
            opacity: 0.5,
            filter: `blur(${particle.size / 3}px)`,
            x: `${particle.initialX}%`,
            y: `${particle.initialY}%`
          }}
          animate={{
            x: [
              `${particle.initialX}%`,
              `${
                particle.initialX +
                (mousePosition.x / containerBounds.width) * 20
              }%`,
              `${particle.initialX}%`
            ],
            y: [
              `${particle.initialY}%`,
              `${
                particle.initialY +
                (mousePosition.y / containerBounds.height) * 20
              }%`,
              `${particle.initialY}%`
            ],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{
            duration: particle.speed,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut'
          }}
        />
      ))}

      {/* Error message display */}
      {error && (
        <div
          style={{
            backgroundColor: '#FEE2E2',
            color: '#B91C1C',
            padding: spacing.md,
            borderRadius: borderRadius.md,
            marginBottom: spacing.lg,
            textAlign: 'center',
            maxWidth: '90%',
            margin: '0 auto',
            marginBottom: spacing.lg,
            boxShadow: shadows.small
          }}
        >
          <p style={{ fontWeight: 'bold', marginBottom: spacing.sm }}>
            {error.includes('CAPTCHA') || error.includes('YouTube')
              ? 'YouTube CAPTCHA Required'
              : 'Analysis Error'}
          </p>
          <p>{error}</p>
          {(error.includes('CAPTCHA') || error.includes('YouTube')) && (
            <p style={{ marginTop: spacing.sm, color: '#4F46E5' }}>
              Please try uploading the video file directly instead of using a
              YouTube URL.
            </p>
          )}
          <button
            onClick={() => (window.location.href = '/')}
            style={{
              marginTop: spacing.md,
              backgroundColor: colors.primary.main,
              color: 'white',
              border: 'none',
              padding: `${spacing.sm} ${spacing.md}`,
              borderRadius: borderRadius.md,
              cursor: 'pointer'
            }}
          >
            Return to Home
          </button>
        </div>
      )}

      {/* Main content container with glass effect */}
      <motion.div
        className="glass"
        style={{
          maxWidth: '700px',
          width: '100%',
          padding: spacing.xl,
          borderRadius: borderRadius['2xl'],
          boxShadow: shadows.xl,
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
        variants={itemVariants}
      >
        <motion.h1
          className="gradient-text"
          style={{
            fontSize: typography.fontSize['3xl'],
            fontWeight: typography.fontWeights.bold,
            marginBottom: spacing.md,
            textAlign: 'center'
          }}
          variants={itemVariants}
        >
          Analyzing Video
        </motion.h1>

        <motion.div
          style={{
            fontSize: typography.fontSize.lg,
            color: colors.neutral.black,
            marginBottom: spacing.lg,
            textAlign: 'center',
            fontWeight: typography.fontWeights.medium
          }}
          variants={itemVariants}
        >
          File: {contentName}
        </motion.div>

        {/* Progress bar with animated gradient */}
        <motion.div
          style={{
            width: '100%',
            height: '8px',
            backgroundColor: `${colors.neutral.lightGrey}30`,
            borderRadius: borderRadius.full,
            marginBottom: spacing.md,
            overflow: 'hidden'
          }}
          variants={itemVariants}
        >
          <motion.div
            className="progress-bar"
            style={{
              height: '100%',
              width: `${progress}%`,
              borderRadius: borderRadius.full
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>

        <motion.div
          style={{
            fontSize: typography.fontSize.xl,
            fontWeight: typography.fontWeights.medium,
            color: colors.primary.dark,
            textAlign: 'center',
            marginBottom: spacing.lg
          }}
          variants={itemVariants}
        >
          {progress}% Complete
        </motion.div>

        <motion.div
          style={{
            fontSize: typography.fontSize.md,
            color: colors.neutral.darkGrey,
            textAlign: 'center',
            marginBottom: spacing.xl
          }}
          variants={itemVariants}
        >
          {getStatusMessage()}
        </motion.div>

        {/* Timeline */}
        <motion.div variants={itemVariants}>
          {renderProgressTimeline()}
        </motion.div>

        {/* Analysis modules */}
        <motion.div variants={itemVariants}>
          {renderAnalysisModules()}
        </motion.div>

        {/* Complete button */}
        {progress >= 100 && (
          <motion.div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: spacing.xl
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 10
            }}
          >
            <motion.button
              onClick={onCompleteClick}
              style={{
                padding: `${spacing.md}px ${spacing.lg}px`,
                background: gradients.primary,
                color: colors.neutral.white,
                border: 'none',
                borderRadius: borderRadius.lg,
                fontSize: typography.fontSize.md,
                fontWeight: typography.fontWeights.medium,
                cursor: 'pointer',
                boxShadow: shadows.lg,
                transition: 'all 0.3s ease'
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: shadows.glow
              }}
              whileTap={{ scale: 0.98 }}
            >
              View Analysis Results
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default AnalysisLoading;
