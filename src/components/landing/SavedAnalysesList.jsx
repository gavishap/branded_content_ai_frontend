import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
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
import {
  FiTrash2,
  FiPlay,
  FiRefreshCw,
  FiAlertCircle,
  FiVideo
} from 'react-icons/fi';

// API URL configuration (use environment variable in production)
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const SavedAnalysesList = ({ onAnalysisSelect }) => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const limit = 6; // Number of analyses to display per page

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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
        stiffness: 260,
        damping: 20
      }
    }
  };

  useEffect(() => {
    fetchAnalyses();
  }, [page]);

  const fetchAnalyses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/saved-analyses?limit=${limit}&skip=${page * limit}`
      );

      if (response.data.success) {
        setAnalyses(response.data.analyses);
      } else {
        setError('Failed to load analyses');
      }
    } catch (err) {
      console.error('Error fetching saved analyses:', err);
      setError('Failed to load analyses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalysisSelect = async analysis => {
    try {
      // Fetch the full analysis data
      const response = await axios.get(
        `${API_BASE_URL}/api/saved-analyses/${analysis.id}`
      );

      if (response.data.success) {
        // Pass the analysis data to the parent component
        onAnalysisSelect(response.data.analysis);
      } else {
        console.error('Failed to load analysis:', response.data.error);
      }
    } catch (err) {
      console.error('Error loading analysis:', err);
    }
  };

  const handleDelete = async (e, analysisId) => {
    e.stopPropagation(); // Prevent triggering the card click

    if (
      window.confirm(
        'Are you sure you want to delete this analysis? This action cannot be undone.'
      )
    ) {
      try {
        const response = await axios.delete(
          `${API_BASE_URL}/api/saved-analyses/${analysisId}`
        );

        if (response.data.success) {
          // Refresh the list
          fetchAnalyses();
        } else {
          console.error('Failed to delete analysis:', response.data.error);
        }
      } catch (err) {
        console.error('Error deleting analysis:', err);
      }
    }
  };

  // Function to format content name for display
  const formatContentName = name => {
    if (!name) return 'Unknown Content';

    // Remove timestamp portion if present
    const nameParts = name.split('_');
    if (
      nameParts.length > 1 &&
      /^\d{8}_\d{6}$/.test(nameParts[nameParts.length - 1])
    ) {
      return nameParts.slice(0, -1).join('_');
    }

    return name;
  };

  return (
    <div style={{ marginBottom: spacing.xxl }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: spacing.lg
        }}
      >
        <h2
          style={{
            fontSize: typography.fontSize.xxl,
            margin: 0,
            background: gradients.blueTeal,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: typography.fontWeights.bold
          }}
        >
          Recent Analyses
        </h2>

        {!loading && !error && analyses.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchAnalyses}
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'none',
              border: 'none',
              color: colors.primary.main,
              marginLeft: 'auto',
              cursor: 'pointer',
              fontSize: typography.fontSize.md,
              gap: spacing.xs,
              padding: spacing.xs
            }}
          >
            <FiRefreshCw size={16} />
            <span>Refresh</span>
          </motion.button>
        )}
      </div>

      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            textAlign: 'center',
            padding: spacing.xl,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            borderRadius: borderRadius.xl,
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            boxShadow: shadows.sm
          }}
          className="glass"
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: spacing.md
            }}
          >
            <motion.div
              animate={{
                rotate: 360,
                transition: {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'linear'
                }
              }}
            >
              <FiRefreshCw size={32} color={colors.primary.main} />
            </motion.div>
            <p
              style={{
                color: colors.neutral.darkGrey,
                margin: 0,
                fontSize: typography.fontSize.lg
              }}
            >
              Loading saved analyses...
            </p>
          </div>
        </motion.div>
      ) : error ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            textAlign: 'center',
            padding: spacing.xl,
            backgroundColor: `${colors.status.error}10`,
            borderRadius: borderRadius.xl,
            color: colors.status.error,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: spacing.md,
            boxShadow: shadows.sm
          }}
        >
          <FiAlertCircle size={32} />
          <p
            style={{
              margin: 0,
              fontSize: typography.fontSize.lg
            }}
          >
            {error}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchAnalyses}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.sm,
              background: colors.neutral.white,
              border: `1px solid ${colors.neutral.lightGrey}`,
              borderRadius: borderRadius.lg,
              padding: `${spacing.sm}px ${spacing.md}px`,
              fontSize: typography.fontSize.md,
              color: colors.primary.dark,
              cursor: 'pointer',
              boxShadow: shadows.sm
            }}
          >
            <FiRefreshCw size={16} />
            <span>Try Again</span>
          </motion.button>
        </motion.div>
      ) : analyses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            textAlign: 'center',
            padding: spacing.xl,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderRadius: borderRadius.xl,
            boxShadow: shadows.sm,
            color: colors.neutral.darkGrey,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: spacing.md
          }}
          className="glass"
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: `${colors.accent.purple}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <FiVideo size={36} color={colors.accent.purple} />
          </div>
          <p
            style={{
              margin: 0,
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeights.medium
            }}
          >
            No saved analyses found. Analyze a video to get started!
          </p>
        </motion.div>
      ) : (
        <>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: spacing.lg
            }}
          >
            {analyses.map(analysis => (
              <motion.div
                key={analysis.id}
                variants={itemVariants}
                whileHover={{
                  scale: 1.03,
                  boxShadow: shadows.lg,
                  y: -5
                }}
                onClick={() => handleAnalysisSelect(analysis)}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: borderRadius.xl,
                  boxShadow: shadows.md,
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  overflow: 'hidden',
                  border: `1px solid rgba(255, 255, 255, 0.5)`,
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)'
                }}
                className="glass"
              >
                <motion.div
                  whileHover={{ opacity: 1 }}
                  style={{
                    position: 'absolute',
                    top: spacing.sm,
                    right: spacing.sm,
                    zIndex: 2
                  }}
                >
                  <motion.button
                    onClick={e => handleDelete(e, analysis.id)}
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: `${colors.status.error}30`
                    }}
                    whileTap={{ scale: 0.9 }}
                    style={{
                      background: `${colors.status.error}20`,
                      border: 'none',
                      cursor: 'pointer',
                      color: colors.status.error,
                      padding: spacing.sm,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: shadows.sm
                    }}
                    aria-label="Delete analysis"
                  >
                    <FiTrash2 size={16} />
                  </motion.button>
                </motion.div>

                <div
                  style={{
                    width: '100%',
                    height: '160px',
                    backgroundColor: `${colors.neutral.darkGrey}20`,
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {analysis.thumbnail ? (
                    <img
                      src={analysis.thumbnail}
                      alt={`Thumbnail for ${analysis.content_name}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        background: `linear-gradient(135deg, ${colors.primary.light}50, ${colors.accent.purple}50)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <FiVideo size={48} color="white" />
                    </div>
                  )}

                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'rgba(0,0,0,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: shadows.lg
                      }}
                    >
                      <FiPlay
                        size={24}
                        color={colors.primary.main}
                        style={{ marginLeft: '2px' }}
                      />
                    </motion.div>
                  </motion.div>
                </div>

                <div style={{ padding: spacing.md }}>
                  <h3
                    style={{
                      margin: 0,
                      marginBottom: spacing.xs,
                      fontSize: typography.fontSize.lg,
                      fontWeight: typography.fontWeights.medium,
                      color: colors.primary.dark,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {formatContentName(analysis.content_name)}
                  </h3>

                  <p
                    style={{
                      margin: 0,
                      fontSize: typography.fontSize.md,
                      color: colors.neutral.darkGrey
                    }}
                  >
                    {analysis.formatted_date}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {analyses.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: spacing.xl
              }}
            >
              <motion.button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                whileHover={
                  page === 0 ? {} : { scale: 1.05, boxShadow: shadows.md }
                }
                whileTap={page === 0 ? {} : { scale: 0.95 }}
                style={{
                  padding: `${spacing.sm} ${spacing.lg}`,
                  backgroundColor:
                    page === 0
                      ? colors.neutral.lightGrey
                      : 'rgba(255, 255, 255, 0.8)',
                  color:
                    page === 0 ? colors.neutral.darkGrey : colors.primary.dark,
                  border: `1px solid ${
                    page === 0 ? 'transparent' : colors.primary.main
                  }`,
                  borderRadius: borderRadius.lg,
                  marginRight: spacing.md,
                  cursor: page === 0 ? 'default' : 'pointer',
                  opacity: page === 0 ? 0.5 : 1,
                  fontWeight: typography.fontWeights.medium,
                  fontSize: typography.fontSize.md,
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.xs,
                  minWidth: '120px',
                  justifyContent: 'center',
                  boxShadow: page === 0 ? 'none' : shadows.sm,
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)'
                }}
                className={page === 0 ? '' : 'glass'}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
                Previous
              </motion.button>

              <motion.button
                onClick={() => setPage(page + 1)}
                disabled={analyses.length < limit}
                whileHover={
                  analyses.length < limit
                    ? {}
                    : { scale: 1.05, boxShadow: shadows.md }
                }
                whileTap={analyses.length < limit ? {} : { scale: 0.95 }}
                style={{
                  padding: `${spacing.sm} ${spacing.lg}`,
                  backgroundColor:
                    analyses.length < limit
                      ? colors.neutral.lightGrey
                      : 'rgba(255, 255, 255, 0.8)',
                  color:
                    analyses.length < limit
                      ? colors.neutral.darkGrey
                      : colors.primary.dark,
                  border: `1px solid ${
                    analyses.length < limit
                      ? 'transparent'
                      : colors.primary.main
                  }`,
                  borderRadius: borderRadius.lg,
                  cursor: analyses.length < limit ? 'default' : 'pointer',
                  opacity: analyses.length < limit ? 0.5 : 1,
                  fontWeight: typography.fontWeights.medium,
                  fontSize: typography.fontSize.md,
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.xs,
                  minWidth: '120px',
                  justifyContent: 'center',
                  boxShadow: analyses.length < limit ? 'none' : shadows.sm,
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)'
                }}
                className={analyses.length < limit ? '' : 'glass'}
              >
                Next
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </motion.button>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

SavedAnalysesList.propTypes = {
  onAnalysisSelect: PropTypes.func.isRequired
};

export default SavedAnalysesList;
