import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import {
  colors,
  borderRadius,
  shadows,
  spacing,
  typography
} from '../../utils/theme';

const ColorSchemeDisplay = ({ colorScheme, animate = true }) => {
  if (!colorScheme) {
    return null;
  }

  // Handle different possible data structures for dominant_colors
  let dominantColors = [];
  if (Array.isArray(colorScheme.dominant_colors)) {
    // Handle array of objects with hex and percentage properties
    if (
      colorScheme.dominant_colors.length > 0 &&
      typeof colorScheme.dominant_colors[0] === 'object'
    ) {
      dominantColors = colorScheme.dominant_colors;
    }
    // Handle array of hex strings (convert to objects with percentage)
    else if (
      colorScheme.dominant_colors.length > 0 &&
      typeof colorScheme.dominant_colors[0] === 'string'
    ) {
      dominantColors = colorScheme.dominant_colors.map((hex, index) => ({
        hex,
        percentage: Math.round(100 / colorScheme.dominant_colors.length)
      }));
    }
  }
  // Handle the case where dominant_colors is an object with numeric keys
  else if (
    colorScheme.dominant_colors &&
    typeof colorScheme.dominant_colors === 'object'
  ) {
    dominantColors = Object.entries(colorScheme.dominant_colors)
      .filter(([key, value]) => !isNaN(parseInt(key)))
      .map(([key, hex]) => ({
        hex,
        percentage: Math.round(
          100 / Object.keys(colorScheme.dominant_colors).length
        )
      }));
  }

  // If we still have no colors, return null
  if (dominantColors.length === 0) {
    return null;
  }

  // Get color mood text - handle different data structures
  const colorMood =
    typeof colorScheme.color_mood === 'string'
      ? colorScheme.color_mood
      : typeof colorScheme.mood === 'string'
      ? colorScheme.mood
      : 'N/A';

  // Handle numeric or string values for these properties
  const saturationLevel =
    colorScheme.saturation_level !== undefined
      ? colorScheme.saturation_level
      : colorScheme.saturation !== undefined
      ? colorScheme.saturation
      : 'N/A';

  const contrastRating =
    colorScheme.contrast_rating !== undefined
      ? colorScheme.contrast_rating
      : colorScheme.contrast !== undefined
      ? colorScheme.contrast
      : 'N/A';

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: 'beforeChildren',
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <motion.div
      initial={animate ? 'hidden' : 'visible'}
      animate="visible"
      variants={containerVariants}
    >
      <div style={{ marginBottom: spacing.md }}>
        <h3
          style={{
            fontSize: typography.fontSize.xl,
            fontWeight: typography.fontWeights.semiBold,
            color: colors.neutral.black,
            margin: 0,
            marginBottom: spacing.md
          }}
        >
          Dominant Colors
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.md }}>
          {dominantColors.map((color, index) => (
            <motion.div
              key={`color-${index}`}
              variants={itemVariants}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: color.hex,
                  borderRadius: borderRadius.md,
                  boxShadow: shadows.md,
                  marginBottom: spacing.xs,
                  border: `1px solid ${colors.neutral.lightGrey}`
                }}
              />
              <span
                style={{
                  fontSize: typography.fontSize.sm,
                  color: colors.neutral.darkGrey,
                  fontFamily: typography.fontFamily,
                  textAlign: 'center'
                }}
              >
                {color.hex}
                <br />
                <small>{color.percentage}%</small>
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: spacing.lg,
          marginTop: spacing.lg
        }}
      >
        <ColorInfoCard
          title="Color Mood"
          value={colorMood}
          icon="🎨"
          variants={itemVariants}
        />

        <ColorInfoCard
          title="Saturation Level"
          value={saturationLevel.toString()}
          icon="🌈"
          variants={itemVariants}
        />

        <ColorInfoCard
          title="Contrast Rating"
          value={contrastRating.toString()}
          icon="⚖️"
          variants={itemVariants}
        />
      </div>
    </motion.div>
  );
};

const ColorInfoCard = ({ title, value, icon, variants }) => {
  return (
    <motion.div
      variants={variants}
      style={{
        backgroundColor: colors.neutral.white,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        boxShadow: shadows.sm,
        display: 'flex',
        alignItems: 'center',
        border: `1px solid ${colors.neutral.lightGrey}`
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: borderRadius.full,
          backgroundColor: `${colors.primary.light}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: spacing.md,
          fontSize: '1.5rem'
        }}
      >
        {icon}
      </div>
      <div>
        <h4
          style={{
            margin: 0,
            fontSize: typography.fontSize.md,
            fontWeight: typography.fontWeights.medium,
            color: colors.neutral.darkGrey
          }}
        >
          {title}
        </h4>
        <p
          style={{
            margin: 0,
            marginTop: '4px',
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeights.semiBold,
            color: colors.neutral.black
          }}
        >
          {value}
        </p>
      </div>
    </motion.div>
  );
};

ColorInfoCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  variants: PropTypes.object
};

ColorSchemeDisplay.propTypes = {
  colorScheme: PropTypes.shape({
    dominant_colors: PropTypes.oneOfType([
      PropTypes.arrayOf(
        PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.shape({
            hex: PropTypes.string.isRequired,
            percentage: PropTypes.number
          })
        ])
      ),
      PropTypes.object
    ]),
    color_mood: PropTypes.string,
    mood: PropTypes.string,
    saturation_level: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    saturation: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    contrast_rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    contrast: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }),
  animate: PropTypes.bool
};

export default ColorSchemeDisplay;
