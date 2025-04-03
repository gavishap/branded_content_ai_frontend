import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  colors,
  spacing,
  borderRadius,
  shadows,
  typography
} from '../../utils/theme';

const AnalysisLoading = ({ progress, currentStep, type, contentName }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const [containerBounds, setContainerBounds] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0
  });

  // Analysis pipeline steps
  const steps = [
    'Initializing analysis...',
    'Downloading and preparing content...',
    'Running visual analysis with ClarifAI...',
    'Analyzing engagement patterns...',
    'Processing semantic content with Gemini...',
    'Generating detailed insights...',
    'Creating data visualizations...',
    'Finalizing results...'
  ];

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
            key={currentStep}
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
            {steps[currentStep]}
          </motion.div>

          {/* Progress Timeline */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: spacing.xl
            }}
          >
            {steps.map((step, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '12px',
                  position: 'relative'
                }}
              >
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor:
                      index < currentStep
                        ? colors.accent.green
                        : index === currentStep
                        ? colors.primary.main
                        : colors.neutral.lightGrey,
                    zIndex: 2
                  }}
                />
                {index < steps.length - 1 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '6px',
                      left: '12px',
                      width: `calc((100% - 12px) * ${8})`,
                      height: '2px',
                      backgroundColor:
                        index < currentStep
                          ? colors.accent.green
                          : colors.neutral.lightGrey,
                      zIndex: 1
                    }}
                  />
                )}
              </div>
            ))}
          </div>
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
