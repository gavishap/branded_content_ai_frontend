import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
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

const HomePage = ({ onStartAnalysis }) => {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [fileError, setFileError] = useState(null);
  const fileInputRef = useRef(null);

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
    // Always use file input now
    if (file) {
      const validation = validateFile(file);
      if (validation.isValid) {
        onStartAnalysis({ type: 'file', content: file });
      } else {
        setFileError(validation.error);
      }
    } else {
      setFileError('Please select a video file to upload.');
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
        margin: `${spacing.xxl} auto`,
        textAlign: 'center'
      }}
    >
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
        }}
        className="glass"
      >
        <h2
          style={{
            fontSize: typography.fontSize.xxl,
            marginBottom: spacing.lg,
            color: colors.primary.dark,
            fontWeight: typography.fontWeights.bold
          }}
        >
          Analyze Your Branded Content
        </h2>
        <p
          style={{
            fontSize: typography.fontSize.lg,
            marginBottom: spacing.xl,
            color: colors.neutral.darkGrey,
            maxWidth: '600px',
            margin: `0 auto ${spacing.xl} auto`
          }}
        >
          Upload your video file to get AI-powered insights and optimize its
          performance.
        </p>

        {/* File Upload Input Section */}
        <form onSubmit={handleSubmit} style={{ marginTop: spacing.lg }}>
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleBrowseClick} // Trigger file input on click
            style={{
              border: `2px dashed ${
                dragging ? colors.primary.main : colors.neutral.lightGrey
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
              style={{ display: 'none' }} // Hide the default input
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

          <motion.button
            type="submit"
            disabled={!file}
            whileHover={file ? { scale: 1.05, y: -2 } : {}}
            whileTap={file ? { scale: 0.95 } : {}}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: spacing.sm,
              padding: `${spacing.md} ${spacing.xl}`,
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeights.bold,
              color: colors.neutral.white,
              background: gradients.purplePrimary,
              border: 'none',
              borderRadius: borderRadius.lg,
              cursor: file ? 'pointer' : 'not-allowed',
              boxShadow: shadows.md,
              opacity: file ? 1 : 0.6,
              transition: 'all 0.3s ease'
            }}
          >
            <FiPlay size={20} />
            Analyze Video
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default HomePage;
