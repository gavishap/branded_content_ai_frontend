import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  colors,
  borderRadius,
  shadows,
  spacing,
  typography
} from '../../utils/theme';

const PlatformOptimizationTabs = ({
  platformOptimizations,
  animate = true
}) => {
  // Initialize platforms from the array of platform objects
  const platforms =
    platformOptimizations && platformOptimizations.length
      ? platformOptimizations.map(item => item.platform)
      : [];

  const [activePlatform, setActivePlatform] = useState(
    platforms.length > 0 ? platforms[0] : ''
  );

  if (!platformOptimizations || platformOptimizations.length === 0) {
    return null;
  }

  // Find the current active platform object
  const activePlatformData = platformOptimizations.find(
    item => item.platform === activePlatform
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const tabContentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } }
  };

  // Get icon for platform
  const getPlatformIcon = platform => {
    const platform_lower = platform.toLowerCase();
    if (platform_lower.includes('instagram')) return '📸';
    if (platform_lower.includes('tiktok')) return '🎵';
    if (platform_lower.includes('youtube')) return '▶️';
    if (platform_lower.includes('facebook')) return '👍';
    if (platform_lower.includes('twitter') || platform_lower.includes('x'))
      return '🐦';
    if (platform_lower.includes('linkedin')) return '💼';
    if (platform_lower.includes('pinterest')) return '📌';
    if (platform_lower.includes('snapchat')) return '👻';
    return '📱';
  };

  return (
    <motion.div
      initial={animate ? 'hidden' : 'visible'}
      animate="visible"
      variants={containerVariants}
    >
      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          borderBottom: `1px solid ${colors.neutral.lightGrey}`,
          marginBottom: spacing.md,
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {platforms.map(platform => (
          <button
            key={platform}
            onClick={() => setActivePlatform(platform)}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: `${spacing.sm} ${spacing.md}`,
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: `3px solid ${
                activePlatform === platform
                  ? colors.primary.main
                  : 'transparent'
              }`,
              color:
                activePlatform === platform
                  ? colors.primary.main
                  : colors.neutral.darkGrey,
              fontFamily: typography.fontFamily,
              fontSize: typography.fontSize.md,
              fontWeight:
                activePlatform === platform
                  ? typography.fontWeights.semiBold
                  : typography.fontWeights.regular,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              marginRight: spacing.md,
              whiteSpace: 'nowrap'
            }}
          >
            <span style={{ marginRight: spacing.xs, fontSize: '1.2rem' }}>
              {getPlatformIcon(platform)}
            </span>
            {platform}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {activePlatformData && (
          <motion.div
            key={activePlatform}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={tabContentVariants}
            style={{
              backgroundColor: colors.neutral.white,
              borderRadius: borderRadius.lg,
              padding: spacing.lg,
              boxShadow: shadows.sm
            }}
          >
            <ul
              style={{
                listStyleType: 'none',
                margin: 0,
                padding: 0
              }}
            >
              {activePlatformData.tips.map((tip, index) => (
                <li
                  key={`tip-${index}`}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    marginBottom:
                      index < activePlatformData.tips.length - 1
                        ? spacing.md
                        : 0,
                    position: 'relative',
                    paddingLeft: '28px'
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '2px',
                      width: '20px',
                      height: '20px',
                      backgroundColor: `${colors.accent.green}20`,
                      color: colors.accent.green,
                      borderRadius: borderRadius.full,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeights.bold
                    }}
                  >
                    {index + 1}
                  </span>
                  <p
                    style={{
                      margin: 0,
                      fontSize: typography.fontSize.md,
                      lineHeight: 1.6,
                      color: colors.neutral.darkGrey
                    }}
                  >
                    {tip}
                  </p>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

PlatformOptimizationTabs.propTypes = {
  platformOptimizations: PropTypes.arrayOf(
    PropTypes.shape({
      platform: PropTypes.string.isRequired,
      tips: PropTypes.arrayOf(PropTypes.string).isRequired
    })
  ),
  animate: PropTypes.bool
};

export default PlatformOptimizationTabs;
