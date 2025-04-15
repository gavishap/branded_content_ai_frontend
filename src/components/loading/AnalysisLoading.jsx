import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
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
  const [statusMessage, setStatusMessage] = useState(
    'Initializing analysis...'
  );
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
  const pollingInterval = useRef(null);
  const errorCount = useRef(0);
  const [backoffTime, setBackoffTime] = useState(1500); // Initial backoff
  const isComplete = useRef(false); // Track if completion logic has run
  const abortControllerRef = useRef(null);
  const backoffTimeRef = useRef(2000); // Start with 2s, will increase on failures
  const isMountedRef = useRef(true);

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
  const getStatusMessage = useCallback(
    statusCode => {
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
    },
    [currentStep, status, steps]
  );

  // Calculate particle positions based on mouse movement - fixed to avoid infinite re-renders
  useEffect(() => {
    if (!containerRef.current) return;

    // Set initial bounds
    const updateBounds = () => {
      if (containerRef.current) {
        const bounds = containerRef.current.getBoundingClientRect();
        setContainerBounds({
          left: bounds.left,
          top: bounds.top,
          width: bounds.width,
          height: bounds.height
        });
      }
    };

    // Initialize bounds
    updateBounds();

    // Create handler function that uses the latest bounds from ref
    const handleMouseMove = event => {
      if (!containerRef.current) return;

      const bounds = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top
      });
    };

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', updateBounds);

    // Clean up on unmount
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', updateBounds);
    };
  }, []); // Empty dependency array means this effect runs once on mount

  // Generate particle array - moved outside of render to prevent recreating on each render
  const particles = useRef(
    Array.from({ length: 30 }, (_, i) => ({
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
    }))
  ).current;

  // Clean up resources on unmount
  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;

      // Cancel any ongoing API requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Clear polling interval
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
        pollingInterval.current = null;
      }
    };
  }, []);

  // Function to stop polling
  const stopPolling = useCallback(() => {
    if (pollingInterval.current) {
      console.log('Stopping polling interval');
      clearInterval(pollingInterval.current);
      pollingInterval.current = null;
    }
  }, []);

  // Function to handle errors during fetch
  const handleError = useCallback(
    error => {
      console.error('Error fetching analysis progress:', error);
      // Increase backoff time for subsequent errors
      setBackoffTime(prev => {
        const nextBackoff = Math.min(prev * 1.5, 30000); // Cap at 30s
        console.log(`Increased backoff time to ${nextBackoff}ms`);
        return nextBackoff;
      });
      errorCount.current += 1;

      // Consider stopping polling after too many consecutive errors?
      if (errorCount.current > 10) {
        console.error('Too many consecutive errors, stopping polling.');
        setStatus('error');
        setStatusMessage(
          `Failed to get progress after multiple attempts: ${
            error.message || 'Network Error'
          }`
        );
        stopPolling();
        // Optionally call onAnalysisComplete with error state?
        if (onAnalysisComplete && !isComplete.current) {
          isComplete.current = true;
          onAnalysisComplete(analysisId, {
            error: 'Polling failed after multiple errors'
          });
        }
      }
    },
    [stopPolling, analysisId, onAnalysisComplete]
  );

  // Function to update progress state
  const updateProgress = useCallback(
    data => {
      console.log('Progress data:', data);
      setProgress(data.progress);
      setCurrentStep(data.step);
      setStatus(data.status);
      // Optionally update statusMessage based on status/step
      setStatusMessage(getStatusMessage(data.status));
      setBackoffTime(1500); // Reset backoff on success
      errorCount.current = 0; // Reset error count on success
    },
    [getStatusMessage]
  );

  // Function to handle completion
  const handleCompletion = useCallback(
    resultData => {
      if (!isComplete.current) {
        isComplete.current = true; // Prevent multiple calls
        console.log('Analysis complete, calling onAnalysisComplete');
        stopPolling();
        setProgress(100);
        setStatus('completed');
        setStatusMessage('Analysis complete! Preparing dashboard...');
        if (onAnalysisComplete) {
          onAnalysisComplete(analysisId, resultData?.metadata); // Pass metadata if available
        }
      }
    },
    [analysisId, onAnalysisComplete, stopPolling]
  );

  // Function to fetch progress
  const fetchAnalysisProgress = useCallback(async () => {
    if (!analysisId || isComplete.current) {
      console.log('Skipping fetch: No analysis ID or already complete.');
      stopPolling();
      return;
    }

    console.log(`Fetching progress for analysis ${analysisId}`);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/analysis-progress/${analysisId}`,
        { timeout: 15000 } // 15 sec timeout for progress check
      );

      const data = response.data;
      updateProgress(data);

      // Check for completion status from backend
      if (data.status === 'completed') {
        handleCompletion(data.result); // Pass result data if available
      } else if (data.status === 'error') {
        console.error('Analysis reported an error:', data.result);
        setStatus('error');
        setStatusMessage(
          data.result?.message || data.result?.error || 'Analysis failed'
        );
        stopPolling();
        // Call completion handler with error info
        if (onAnalysisComplete && !isComplete.current) {
          isComplete.current = true;
          onAnalysisComplete(analysisId, {
            error:
              data.result?.message ||
              data.result?.error ||
              'Unknown analysis error'
          });
        }
      }
    } catch (error) {
      // *** IMPORTANT: Do NOT treat 404 as completion here ***
      if (error.response && error.response.status === 404) {
        console.warn(
          `Progress endpoint returned 404 for ${analysisId}. Analysis might be finished or ID invalid. Will rely on final fetch retry.`
        );
        // Optionally increase backoff or error count, but don't call handleCompletion
        errorCount.current += 1;
        setBackoffTime(prev => Math.min(prev * 1.5, 30000));
        if (errorCount.current > 5) {
          console.error(
            'Progress endpoint consistently 404, stopping polling.'
          );
          setStatus('error');
          setStatusMessage(
            'Failed to get progress (404). Final fetch will determine status.'
          );
          stopPolling();
          // Trigger the final fetch attempt immediately by calling onAnalysisComplete
          // This relies on App.jsx handling the retries for the final /api/analysis/{id} call
          if (onAnalysisComplete && !isComplete.current) {
            isComplete.current = true;
            onAnalysisComplete(analysisId, {
              error: 'Progress endpoint not found'
            });
          }
        }
      } else {
        // Handle other errors (network, timeout, etc.)
        handleError(error);
      }
    }
  }, [
    analysisId,
    stopPolling,
    updateProgress,
    handleCompletion,
    handleError
    // isComplete.current // isComplete is a ref, doesn't need to be dependency
  ]);

  // Effect for polling
  useEffect(() => {
    if (analysisId && status !== 'completed' && status !== 'error') {
      isComplete.current = false; // Reset completion flag for new analysis ID
      errorCount.current = 0; // Reset error count
      setBackoffTime(1500); // Reset backoff time

      console.log(
        `Starting polling for analysis progress with ID: ${analysisId}`
      );

      // Initial fetch
      fetchAnalysisProgress();

      // Set up interval
      const interval = () => {
        if (pollingInterval.current) {
          // If an interval is already running, clear it before setting a new one
          // This can happen with fast state updates, though less likely with useCallback
          clearInterval(pollingInterval.current);
        }
        pollingInterval.current = setInterval(() => {
          fetchAnalysisProgress();
        }, backoffTime);
      };

      interval(); // Start the interval

      // Cleanup function
      return () => {
        console.log('Cleaning up polling interval');
        stopPolling();
      };
    } else {
      // If no analysisId or already completed/error, ensure polling is stopped
      stopPolling();
    }
    // Rerun effect if analysisId or polling-related functions change
  }, [analysisId, fetchAnalysisProgress, stopPolling, status, backoffTime]);

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
          {statusMessage}
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
