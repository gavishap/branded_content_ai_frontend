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

const MetadataPanel = ({ metadata, animate = true }) => {
  if (!metadata || !metadata.length) {
    return null;
  }

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
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  };

  // Helper function to render the value, making URLs clickable
  const renderValue = item => {
    if (item.isUrl) {
      return (
        <a
          href={item.value}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: colors.primary.main,
            textDecoration: 'none',
            wordBreak: 'break-word',
            display: 'inline-block',
            maxWidth: '100%'
          }}
        >
          {item.value}
          <span style={{ marginLeft: spacing.xs }}>↗</span>
        </a>
      );
    }

    return (
      <div
        style={{
          fontSize: typography.fontSize.md,
          fontWeight: typography.fontWeights.semiBold,
          color: colors.neutral.black,
          wordBreak: 'break-word'
        }}
      >
        {item.value}
      </div>
    );
  };

  return (
    <motion.div
      initial={animate ? 'hidden' : 'visible'}
      animate="visible"
      variants={containerVariants}
      style={{
        backgroundColor: colors.neutral.white,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        boxShadow: shadows.md,
        marginBottom: spacing.xl
      }}
    >
      <h3
        style={{
          fontSize: typography.fontSize.lg,
          fontWeight: typography.fontWeights.semiBold,
          color: colors.neutral.black,
          margin: 0,
          marginBottom: spacing.md
        }}
      >
        Analysis Metadata
      </h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: spacing.md
        }}
      >
        {metadata.map((item, index) => (
          <motion.div
            key={`metadata-${index}`}
            variants={itemVariants}
            style={{
              padding: spacing.md,
              borderRadius: borderRadius.md,
              backgroundColor: `${colors.neutral.lightGrey}50`,
              border: `1px solid ${colors.neutral.lightGrey}`
            }}
          >
            <div
              style={{
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeights.medium,
                color: colors.neutral.darkGrey,
                marginBottom: spacing.xs
              }}
            >
              {item.label}
            </div>
            {renderValue(item)}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

MetadataPanel.propTypes = {
  metadata: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      isUrl: PropTypes.bool
    })
  ),
  animate: PropTypes.bool
};

export default MetadataPanel;
