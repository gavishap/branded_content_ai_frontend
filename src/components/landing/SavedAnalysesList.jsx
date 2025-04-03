import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  colors,
  spacing,
  borderRadius,
  shadows,
  typography
} from '../../utils/theme';

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
      transition: { duration: 0.3 }
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
    <div style={{ marginBottom: spacing.xl }}>
      <h2
        style={{
          fontSize: typography.fontSize.xl,
          marginBottom: spacing.md,
          color: colors.primary.dark,
          textAlign: 'left'
        }}
      >
        Recent Analyses
      </h2>

      {loading ? (
        <div style={{ textAlign: 'center', padding: spacing.lg }}>
          <p>Loading saved analyses...</p>
        </div>
      ) : error ? (
        <div
          style={{
            textAlign: 'center',
            padding: spacing.lg,
            color: colors.accent.red
          }}
        >
          <p>{error}</p>
        </div>
      ) : analyses.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: spacing.lg,
            backgroundColor: colors.neutral.lightGrey,
            borderRadius: borderRadius.lg
          }}
        >
          <p>No saved analyses found. Analyze a video to get started!</p>
        </div>
      ) : (
        <>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: spacing.md
            }}
          >
            {analyses.map(analysis => (
              <motion.div
                key={analysis.id}
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
                onClick={() => handleAnalysisSelect(analysis)}
                style={{
                  backgroundColor: colors.neutral.white,
                  padding: spacing.md,
                  borderRadius: borderRadius.lg,
                  boxShadow: shadows.sm,
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  border: `1px solid ${colors.neutral.lightGrey}`
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: spacing.xs,
                    right: spacing.xs,
                    zIndex: 2
                  }}
                >
                  <button
                    onClick={e => handleDelete(e, analysis.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: colors.neutral.darkGrey,
                      padding: spacing.xs,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    aria-label="Delete analysis"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                </div>

                <div
                  style={{
                    width: '100%',
                    height: '120px',
                    backgroundColor: `${colors.primary.light}30`,
                    borderRadius: borderRadius.md,
                    marginBottom: spacing.sm,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
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
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"
                        fill={colors.primary.main}
                      />
                    </svg>
                  )}
                </div>

                <h3
                  style={{
                    margin: 0,
                    marginBottom: spacing.xs,
                    fontSize: typography.fontSize.md,
                    fontWeight: typography.fontWeights.medium,
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
                    fontSize: typography.fontSize.sm,
                    color: colors.neutral.darkGrey
                  }}
                >
                  {analysis.formatted_date}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {analyses.length > 0 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: spacing.lg
              }}
            >
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                style={{
                  padding: `${spacing.xs} ${spacing.md}`,
                  backgroundColor:
                    page === 0 ? colors.neutral.lightGrey : colors.primary.main,
                  color:
                    page === 0 ? colors.neutral.darkGrey : colors.neutral.white,
                  border: 'none',
                  borderRadius: borderRadius.md,
                  marginRight: spacing.sm,
                  cursor: page === 0 ? 'default' : 'pointer',
                  opacity: page === 0 ? 0.5 : 1
                }}
              >
                Previous
              </button>

              <button
                onClick={() => setPage(page + 1)}
                disabled={analyses.length < limit}
                style={{
                  padding: `${spacing.xs} ${spacing.md}`,
                  backgroundColor:
                    analyses.length < limit
                      ? colors.neutral.lightGrey
                      : colors.primary.main,
                  color:
                    analyses.length < limit
                      ? colors.neutral.darkGrey
                      : colors.neutral.white,
                  border: 'none',
                  borderRadius: borderRadius.md,
                  cursor: analyses.length < limit ? 'default' : 'pointer',
                  opacity: analyses.length < limit ? 0.5 : 1
                }}
              >
                Next
              </button>
            </div>
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
