import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  colors,
  spacing,
  borderRadius,
  shadows,
  typography
} from '../../utils/theme';

const AnalysisLoading = ({
  progress,
  currentStep,
  type,
  contentName,
  status,
  onCompleteClick
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const [containerBounds, setContainerBounds] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0
  });

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

  // Added function to map status to user-friendly message
  const getStatusMessage = () => {
    if (!status) return steps[currentStep];

    const statusMessages = {
      initializing: 'Initializing analysis...',
      downloading_video: 'Downloading video content...',
      running_gemini_analysis: 'Running Gemini AI analysis...',
      running_clarifai_analysis: 'Running ClarifAI visual analysis...',
      download_complete: 'Download complete, preparing for analysis...',
      uploading_to_s3: 'Uploading to processing servers...',
      processing_with_ai_models: 'Processing with multiple AI models...',
      gemini_analysis_complete: 'Gemini analysis complete...',
      clarifai_analysis_complete: 'ClarifAI visual analysis complete...',
      generating_unified_analysis: 'Generating comprehensive insights...',
      validating_analysis: 'Validating and refining results...',
      finalizing_results: 'Finalizing results and visualizations...',
      completed: 'Analysis complete!',
      error: 'An error occurred. Please try again.'
    };

    return statusMessages[status] || steps[currentStep];
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
  const particles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    size: Math.random() * 8 + 4,
    color:
      i % 3 === 0
        ? colors.primary.light
        : i % 3 === 1
        ? colors.primary.main
        : colors.accent.blue,
    initialX: Math.random() * 100,
    initialY: Math.random() * 100
  }));

  const getProgressColor = () => {
    if (progress < 30) return colors.primary.light;
    if (progress < 60) return colors.primary.main;
    if (progress < 90) return colors.accent.blue;
    return colors.accent.green;
  };

  // Enhanced steps timeline
  const renderProgressTimeline = () => {
    // Define the major milestones
    const milestones = [
      { pct: 0, label: 'Start', status: 'initializing' },
      { pct: 20, label: 'Download', status: 'download_complete' },
      { pct: 40, label: 'AI Processing', status: 'processing_with_ai_models' },
      { pct: 70, label: 'Analysis', status: 'generating_unified_analysis' },
      { pct: 100, label: 'Complete', status: 'completed' }
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
          {/* Progress bar */}
          <div
            style={{
              position: 'absolute',
              height: '4px',
              backgroundColor: `${colors.neutral.lightGrey}`,
              width: '100%',
              top: '8px',
              zIndex: 1
            }}
          />

          {/* Progress fill */}
          <motion.div
            style={{
              position: 'absolute',
              height: '4px',
              backgroundColor: getProgressColor(),
              width: `${progress}%`,
              top: '8px',
              zIndex: 2,
              borderRadius: '2px'
            }}
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
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
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: isPassed
                      ? getProgressColor()
                      : colors.neutral.lightGrey,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: isActive
                      ? `0 0 0 4px ${colors.primary.light}30`
                      : 'none',
                    transition: 'all 0.3s ease'
                  }}
                  animate={{
                    scale: isActive ? 1.2 : 1,
                    backgroundColor: isPassed
                      ? getProgressColor()
                      : colors.neutral.lightGrey
                  }}
                >
                  {isPassed && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                          fill="white"
                        />
                      </svg>
                    </motion.div>
                  )}
                </motion.div>
                <div
                  style={{
                    marginTop: spacing.xs,
                    fontSize: typography.fontSize.xs,
                    color: isPassed
                      ? colors.primary.dark
                      : colors.neutral.darkGrey,
                    fontWeight: isActive ? 'bold' : 'normal'
                  }}
                >
                  {milestone.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.neutral.background,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Floating particles that respond to mouse movement */}
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          initial={{
            x: `${particle.initialX}%`,
            y: `${particle.initialY}%`,
            opacity: 0.2
          }}
          animate={{
            x: mousePosition.x
              ? `calc(${particle.initialX}% + ${
                  (mousePosition.x - containerBounds.width / 2) / 20
                }px)`
              : `${particle.initialX}%`,
            y: mousePosition.y
              ? `calc(${particle.initialY}% + ${
                  (mousePosition.y - containerBounds.height / 2) / 20
                }px)`
              : `${particle.initialY}%`,
            opacity: 0.5 + (Math.sin(Date.now() / 1000 + particle.id) + 1) / 4
          }}
          transition={{
            duration: 0.5,
            ease: 'easeOut'
          }}
          style={{
            position: 'absolute',
            width: particle.size,
            height: particle.size,
            borderRadius: '50%',
            backgroundColor: particle.color,
            filter: 'blur(1px)'
          }}
        />
      ))}

      <motion.div
        style={{
          backgroundColor: colors.neutral.white,
          borderRadius: borderRadius.lg,
          padding: spacing.xl,
          boxShadow: shadows.lg,
          textAlign: 'center',
          maxWidth: '700px',
          width: '90%',
          zIndex: 10
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2
            style={{
              fontSize: typography.fontSize.xl,
              color: colors.primary.dark,
              marginBottom: spacing.lg
            }}
          >
            Analyzing {type === 'url' ? 'URL' : 'Video'}
          </h2>

          {contentName && (
            <p
              style={{
                fontSize: typography.fontSize.md,
                color: colors.neutral.darkGrey,
                marginBottom: spacing.md
              }}
            >
              {type === 'url' ? contentName : `File: ${contentName}`}
            </p>
          )}

          <div
            style={{
              width: '100%',
              height: '8px',
              backgroundColor: `${colors.primary.light}50`,
              borderRadius: borderRadius.md,
              overflow: 'hidden',
              marginBottom: spacing.md
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut' }}
              style={{
                height: '100%',
                backgroundColor: colors.primary.main,
                borderRadius: borderRadius.md
              }}
            />
          </div>

          <div
            style={{
              fontSize: typography.fontSize.lg,
              fontWeight: 'bold',
              color: colors.primary.dark,
              marginBottom: spacing.md
            }}
          >
            {progress}% Complete
          </div>

          <motion.div
            key={status || currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{
              fontSize: typography.fontSize.md,
              color: colors.accent.blue,
              marginBottom: spacing.lg,
              minHeight: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div
              style={{
                width: '20px',
                height: '20px',
                marginRight: spacing.sm,
                borderRadius: '50%',
                border: `2px solid ${colors.accent.blue}`,
                borderTopColor: 'transparent',
                animation: 'spin 1s linear infinite'
              }}
            />
            {getStatusMessage()}
          </motion.div>

          {/* Progress Timeline */}
          {renderProgressTimeline()}

          {/* Processing steps - only need this section once */}
          {progress > 20 && progress < 70 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: spacing.md,
                marginBottom: spacing.lg,
                backgroundColor: `${colors.primary.light}20`,
                padding: spacing.md,
                borderRadius: borderRadius.md
              }}
            >
              <div
                style={{
                  flex: 1,
                  textAlign: 'center',
                  padding: spacing.sm,
                  borderRight: `1px solid ${colors.neutral.lightGrey}`
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontWeight: 'bold',
                    color: colors.primary.dark
                  }}
                >
                  Gemini AI
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: typography.fontSize.sm,
                    color: colors.neutral.darkGrey
                  }}
                >
                  Analyzing narratives & performance
                </p>
                <div
                  style={{
                    margin: `${spacing.xs} auto`,
                    width: '80%',
                    height: '6px',
                    backgroundColor: `${colors.primary.light}30`,
                    borderRadius: borderRadius.md,
                    overflow: 'hidden'
                  }}
                >
                  <motion.div
                    animate={{
                      width:
                        status === 'gemini_analysis_complete'
                          ? '100%'
                          : status === 'running_gemini_analysis'
                          ? '50%'
                          : '10%'
                    }}
                    transition={{ ease: 'easeOut' }}
                    style={{
                      height: '100%',
                      backgroundColor:
                        status === 'gemini_analysis_complete'
                          ? colors.accent.green
                          : colors.primary.main,
                      borderRadius: borderRadius.md
                    }}
                  />
                </div>
              </div>
              <div
                style={{
                  flex: 1,
                  textAlign: 'center',
                  padding: spacing.sm
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontWeight: 'bold',
                    color: colors.primary.dark
                  }}
                >
                  ClarifAI Models
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: typography.fontSize.sm,
                    color: colors.neutral.darkGrey
                  }}
                >
                  Processing visual elements
                </p>
                <div
                  style={{
                    margin: `${spacing.xs} auto`,
                    width: '80%',
                    height: '6px',
                    backgroundColor: `${colors.primary.light}30`,
                    borderRadius: borderRadius.md,
                    overflow: 'hidden'
                  }}
                >
                  <motion.div
                    animate={{
                      width:
                        status === 'clarifai_analysis_complete'
                          ? '100%'
                          : status === 'processing_with_ai_models'
                          ? '75%'
                          : status === 'running_clarifai_analysis'
                          ? '50%'
                          : '10%'
                    }}
                    transition={{ ease: 'easeOut' }}
                    style={{
                      height: '100%',
                      backgroundColor:
                        status === 'clarifai_analysis_complete'
                          ? colors.accent.green
                          : colors.primary.main,
                      borderRadius: borderRadius.md
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Continue to dashboard button - appears when analysis is complete */}
          {progress >= 100 && status === 'completed' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              style={{
                marginTop: spacing.lg,
                width: '100%',
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <button
                onClick={onCompleteClick}
                style={{
                  backgroundColor: colors.accent.green,
                  color: 'white',
                  padding: `${spacing.md} ${spacing.lg}`,
                  borderRadius: borderRadius.md,
                  border: 'none',
                  fontSize: typography.fontSize.md,
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: shadows.md,
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = shadows.lg;
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = shadows.md;
                }}
              >
                View Analysis Dashboard
                <span style={{ marginLeft: spacing.sm }}>→</span>
              </button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Add a style tag for the spinning animation */}
      <style>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </motion.div>
  );
};

export default AnalysisLoading;
