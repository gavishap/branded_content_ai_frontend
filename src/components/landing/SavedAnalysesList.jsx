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
  FiVideo,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import { API_BASE_URL } from '../../config';

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
    setError(null);

    try {
      console.log(
        `Fetching analyses from ${API_BASE_URL}/api/saved-analyses (Page: ${page})`
      );
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await axios.get(
        `${API_BASE_URL}/api/saved-analyses?limit=${limit}&skip=${
          page * limit
        }`,
        {
          signal: controller.signal,
          withCredentials: false,
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          }
        }
      );
      clearTimeout(timeoutId);
      console.log('Response received:', response.data);

      if (response.data && response.data.analyses) {
        setAnalyses(response.data.analyses || []);
      } else {
        console.error(
          'Malformed API response for saved analyses:',
          response.data
        );
        setError('Failed to load analyses. Unexpected API response format.');
        setAnalyses([]);
      }
    } catch (err) {
      console.error('Error details:', err);
      if (err.name === 'CanceledError' || err.name === 'AbortError') {
        console.error('Request timed out or was canceled');
        setError('Request timed out. Could not load saved analyses.');
      } else if (err.code === 'ERR_NETWORK') {
        console.error('Network error:', err);
        setError('Network error. The backend server may be unreachable.');
      } else if (err.response && err.response.status === 0) {
        console.error('CORS error:', err);
        setError(
          'CORS error. The backend is not configured to accept requests from this domain.'
        );
      } else if (err.response) {
        console.error(
          `Server responded with ${err.response.status}:`,
          err.response.data
        );
        setError(
          `Server error (${err.response.status}): ${
            err.response.data?.error || 'Failed to load'
          }`
        );
      } else {
        console.error('Error fetching saved analyses:', err);
        setError('Failed to load analyses. Please try again later.');
      }
      setAnalyses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = analysisId => {
    console.log(`Selected saved analysis ID: ${analysisId}`);
    onAnalysisSelect(analysisId);
  };

  const formatDate = isoString => {
    if (!isoString) return 'Unknown Date';
    try {
      return new Date(isoString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return 'Invalid Date';
    }
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
                onClick={() => handleCardClick(analysis.id)}
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
                <div
                  style={{
                    width: '100%',
                    height: '160px',
                    backgroundColor: `${colors.neutral.lightGrey}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}
                >
                  <FiVideo size={48} color={colors.neutral.grey} />
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
                    title={analysis.analysis_name}
                  >
                    {analysis.analysis_name ||
                      `Analysis ${analysis.id.substring(0, 8)}...`}
                  </h3>

                  <p
                    style={{
                      margin: 0,
                      fontSize: typography.fontSize.md,
                      color: colors.neutral.darkGrey
                    }}
                  >
                    {formatDate(analysis.timestamp)}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

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
              <FiChevronLeft size={18} />
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
                  analyses.length < limit ? 'transparent' : colors.primary.main
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
              <FiChevronRight size={18} />
            </motion.button>
          </motion.div>
        </>
      )}
    </div>
  );
};

SavedAnalysesList.propTypes = {
  onAnalysisSelect: PropTypes.func.isRequired
};

export default SavedAnalysesList;
