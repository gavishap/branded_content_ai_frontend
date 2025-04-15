import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import SavedAnalysesList from './SavedAnalysesList';
import {
  colors,
  gradients,
  spacing,
  borderRadius,
  shadows,
  typography,
  animations
} from '../../utils/theme';
import { FiUpload, FiPlay } from 'react-icons/fi';
import './HomePage.css'; // Import CSS file for custom styles

// Define accepted video MIME types
const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/quicktime', // .mov
  'video/x-msvideo', // .avi
  'video/mpeg', // .mpeg
  'video/webm' // .webm
];

// Also check file extensions for cases where MIME type detection fails
const ALLOWED_VIDEO_EXTENSIONS = ['.mp4', '.mov', '.avi', '.mpeg', '.webm'];

const HomePage = ({ onStartAnalysis, onAnalysisSelect }) => {
  const [file, setFile] = useState(null);
  const [analysisName, setAnalysisName] = useState('');
  const [dragging, setDragging] = useState(false);
  const [fileError, setFileError] = useState(null);
  const [nameError, setNameError] = useState(null);
  const fileInputRef = useRef(null);

  // Handle name change
  const handleNameChange = e => {
    setAnalysisName(e.target.value);
    if (e.target.value.trim()) {
      setNameError(null);
    }
  };

  // Validation function to check if file is valid
  const validateFile = file => {
    // Check if file exists
    if (!file) {
      return { isValid: false, error: 'No file selected' };
    }

    // Check file type by MIME type
    const fileType = file.type;
    const fileExtension = file.name
      .toLowerCase()
      .substring(file.name.lastIndexOf('.'));

    console.log(
      'Validating file:',
      file.name,
      'Type:',
      fileType,
      'Extension:',
      fileExtension
    );

    // Check MIME type OR file extension (for greater compatibility)
    const isValidType =
      ALLOWED_VIDEO_TYPES.includes(fileType) ||
      ALLOWED_VIDEO_EXTENSIONS.includes(fileExtension);

    if (!isValidType) {
      return {
        isValid: false,
        error: `Invalid file type. Please upload a valid video file (${ALLOWED_VIDEO_EXTENSIONS.join(
          ', '
        )}).`
      };
    }

    // Check file size (e.g., max 500MB)
    const maxSize = 500 * 1024 * 1024; // 500MB
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `File is too large (max ${maxSize / 1024 / 1024}MB).`
      };
    }

    return { isValid: true, error: null };
  };

  const handleFileChange = e => {
    const selectedFile = e.target.files[0];
    const validation = validateFile(selectedFile);
    if (validation.isValid) {
      setFile(selectedFile);
      setFileError(null);
    } else {
      setFile(null);
      setFileError(validation.error);
      // Clear the file input value if the file is invalid
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    let isValid = true;

    // Validate name
    if (!analysisName.trim()) {
      setNameError('Please enter a name for the analysis.');
      isValid = false;
    } else {
      setNameError(null);
    }

    // Validate file
    if (!file) {
      setFileError('Please select a video file to upload.');
      isValid = false;
    } else {
      const validation = validateFile(file);
      if (!validation.isValid) {
        setFileError(validation.error);
        isValid = false;
      } else {
        setFileError(null);
      }
    }

    // Proceed if both are valid
    if (isValid) {
      onStartAnalysis({
        type: 'file',
        content: file,
        name: analysisName.trim()
      });
    }
  };

  // Drag and drop handlers
  const handleDragEnter = e => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = e => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDragOver = e => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true); // Keep dragging state active
  };

  const handleDrop = e => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);

    let droppedFile = null;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      droppedFile = e.dataTransfer.files[0];
    }

    const validation = validateFile(droppedFile);
    if (validation.isValid) {
      setFile(droppedFile);
      setFileError(null);
    } else {
      setFile(null);
      setFileError(validation.error);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={animations.springEntry}
      style={{
        padding: spacing.xl,
        maxWidth: '900px',
        margin: `${spacing.xl} auto`
      }}
    >
      {/* REORDERED: Recent Analyses Section FIRST */}
      <div style={{ marginBottom: spacing.xxl }}>
        <SavedAnalysesList onAnalysisSelect={onAnalysisSelect} />
      </div>

      {/* Main Call to Action / Input Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, ...animations.springEntry }}
        style={{
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: borderRadius.xl,
          padding: spacing.xl,
          boxShadow: shadows.lg,
          border: '1px solid rgba(255, 255, 255, 0.3)'
          // Removed marginBottom here as SavedAnalysesList is now separate
        }}
        className="glass"
      >
        <h2
          style={{
            fontSize: typography.fontSize.xxl,
            marginBottom: spacing.lg,
            color: colors.primary.dark,
            fontWeight: typography.fontWeights.bold,
            textAlign: 'center' // Center title
          }}
        >
          Analyze New Content
        </h2>
        <p
          style={{
            fontSize: typography.fontSize.lg,
            marginBottom: spacing.xl,
            color: colors.neutral.darkGrey,
            maxWidth: '600px',
            margin: `0 auto ${spacing.xl} auto`,
            textAlign: 'center' // Center paragraph
          }}
        >
          Enter a name, then upload your video file to get AI-powered insights.
        </p>

        {/* File Upload Input Section */}
        <form onSubmit={handleSubmit} style={{ marginTop: spacing.lg }}>
          {/* Analysis Name Input */}
          <div style={{ marginBottom: spacing.lg }}>
            <label
              htmlFor="analysis-name-input"
              style={{
                display: 'block',
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeights.medium,
                color: colors.primary.dark,
                marginBottom: spacing.sm,
                textAlign: 'left'
              }}
            >
              Analysis Name:{' '}
              <span style={{ color: colors.status.error }}>*</span>
            </label>
            <input
              id="analysis-name-input"
              type="text"
              value={analysisName}
              onChange={handleNameChange}
              placeholder="e.g., Summer Campaign Video v1"
              style={{
                width: '100%',
                padding: `${spacing.md} ${spacing.lg}`,
                fontSize: typography.fontSize.lg,
                border: `2px solid ${
                  nameError ? colors.status.error : colors.neutral.lightGrey
                }`,
                borderRadius: borderRadius.lg,
                transition: 'all 0.3s ease',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)',
                outline: 'none',
                height: '50px'
              }}
            />
            {nameError && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  color: colors.status.error,
                  fontSize: typography.fontSize.sm,
                  marginTop: spacing.xs,
                  textAlign: 'left'
                }}
              >
                {nameError}
              </motion.p>
            )}
          </div>

          {/* File Input Area */}
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleBrowseClick}
            style={{
              border: `2px dashed ${
                dragging
                  ? colors.primary.main
                  : fileError
                  ? colors.status.error
                  : colors.neutral.lightGrey
              }`,
              borderRadius: borderRadius.lg,
              padding: spacing.xl,
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: dragging
                ? `${colors.primary.light}15`
                : 'rgba(255, 255, 255, 0.5)',
              transition: 'all 0.3s ease',
              marginBottom: spacing.lg
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept={ALLOWED_VIDEO_TYPES.join(',')}
              style={{ display: 'none' }}
            />
            <FiUpload
              size={48}
              color={colors.primary.main}
              style={{ marginBottom: spacing.md }}
            />
            {file ? (
              <p style={{ margin: 0, color: colors.primary.dark }}>
                <strong>Selected:</strong> {file.name}
              </p>
            ) : (
              <p style={{ margin: 0, color: colors.neutral.darkGrey }}>
                Drag & drop your video file here, or click to browse
              </p>
            )}
            <p
              style={{
                fontSize: typography.fontSize.sm,
                color: colors.neutral.grey,
                marginTop: spacing.sm
              }}
            >
              Supported formats: {ALLOWED_VIDEO_EXTENSIONS.join(', ')} (Max
              500MB)
            </p>
          </div>

          {fileError && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                color: colors.status.error,
                fontSize: typography.fontSize.md,
                marginBottom: spacing.lg,
                fontWeight: typography.fontWeights.medium
              }}
            >
              {fileError}
            </motion.p>
          )}

          {/* Submit Button Area - Centered */}
          <div style={{ textAlign: 'center' }}>
            <motion.button
              type="submit"
              disabled={!file || !analysisName.trim()}
              whileHover={
                file && analysisName.trim() ? { scale: 1.05, y: -2 } : {}
              }
              whileTap={file && analysisName.trim() ? { scale: 0.95 } : {}}
              style={{
                // Basic styles (keep consistent)
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing.md,
                padding: `${spacing.lg} ${spacing.xxl}`,
                fontSize: typography.fontSize.xl,
                fontWeight: typography.fontWeights.bold,
                border: 'none',
                borderRadius: borderRadius.xl,
                boxShadow:
                  file && analysisName.trim()
                    ? `0 8px 20px rgba(89, 56, 175, 0.4)`
                    : `0 4px 12px rgba(0, 0, 0, 0.1)`,
                transition: 'all 0.3s ease',
                minWidth: '280px',
                position: 'relative',
                overflow: 'hidden',

                // --- Conditional Styles ---
                cursor: file && analysisName.trim() ? 'pointer' : 'not-allowed',
                background:
                  file && analysisName.trim()
                    ? 'linear-gradient(135deg, #6942ef 0%, #9d41e0 100%)' // Rich purple gradient
                    : '#f0f0f7', // Light gray for disabled
                color: file && analysisName.trim() ? '#ffffff' : '#5c5c7a', // White for enabled, muted purple-gray for disabled
                opacity: 1,
                transform: 'translateY(0)',
                letterSpacing: '0.5px',
                textShadow:
                  file && analysisName.trim()
                    ? '0 1px 2px rgba(0,0,0,0.2)'
                    : 'none'
              }}
            >
              {/* Add pseudo-element glow effect for enabled state */}
              {file && analysisName.trim() && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background:
                      'radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
                    opacity: 0.6,
                    pointerEvents: 'none'
                  }}
                />
              )}

              <FiPlay
                size={28}
                style={{
                  filter:
                    file && analysisName.trim()
                      ? 'drop-shadow(0 2px 3px rgba(0,0,0,0.2))'
                      : 'none',
                  opacity: file && analysisName.trim() ? 1 : 0.5
                }}
              />
              <span>Analyze Video</span>
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default HomePage;
