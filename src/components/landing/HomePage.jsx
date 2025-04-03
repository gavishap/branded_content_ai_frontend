import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import SavedAnalysesList from './SavedAnalysesList';
import {
  colors,
  spacing,
  borderRadius,
  shadows,
  typography
} from '../../utils/theme';
import { FiUpload } from 'react-icons/fi';

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
  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);
  const [inputMethod, setInputMethod] = useState('url');
  const [dragging, setDragging] = useState(false);
  const [fileError, setFileError] = useState(null);
  const fileInputRef = useRef(null);

  const handleUrlChange = e => {
    setUrl(e.target.value);
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
        error: `Only video files are supported (${ALLOWED_VIDEO_EXTENSIONS.join(
          ', '
        )})`
      };
    }

    // Check file size (max 200MB)
    const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: 'File size exceeds the 200MB limit'
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
    }
  };

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
    if (!dragging) {
      setDragging(true);
    }
  };

  const handleDrop = e => {
    e.preventDefault();
    setDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      const validation = validateFile(droppedFile);

      if (validation.isValid) {
        setFile(droppedFile);
        setFileError(null);
      } else {
        setFile(null);
        setFileError(validation.error);
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = () => {
    if (inputMethod === 'url' && url) {
      onStartAnalysis({ type: 'url', content: url });
    } else if (inputMethod === 'file' && file) {
      onStartAnalysis({ type: 'file', content: file });
    }
  };

  const handleSavedAnalysisSelect = analysis => {
    onStartAnalysis({
      type: 'saved',
      content: analysis.id,
      savedAnalysisData: analysis.analysis_data
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.3,
        when: 'beforeChildren',
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: spacing.xl
      }}
    >
      <motion.div
        variants={itemVariants}
        style={{
          textAlign: 'center',
          marginBottom: spacing.xl
        }}
      >
        <h1
          style={{
            fontSize: typography.fontSize.xxl,
            color: colors.primary.dark,
            margin: 0,
            marginBottom: spacing.sm
          }}
        >
          Branded Content Analysis
        </h1>
        <p
          style={{
            fontSize: typography.fontSize.lg,
            color: colors.neutral.darkGrey,
            maxWidth: '600px',
            margin: '0 auto'
          }}
        >
          Get AI-powered insights on your branded videos to optimize engagement
          and performance
        </p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <SavedAnalysesList onAnalysisSelect={handleSavedAnalysisSelect} />
      </motion.div>

      <motion.div
        variants={itemVariants}
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: spacing.xl
        }}
      >
        <button
          onClick={() => setInputMethod('url')}
          style={{
            padding: `${spacing.sm} ${spacing.lg}`,
            margin: `0 ${spacing.sm}`,
            background:
              inputMethod === 'url'
                ? colors.primary.main
                : colors.neutral.white,
            color:
              inputMethod === 'url'
                ? colors.neutral.white
                : colors.neutral.darkGrey,
            border: `2px solid ${colors.primary.main}`,
            borderRadius: borderRadius.md,
            fontSize: typography.fontSize.md,
            cursor: 'pointer',
            boxShadow: inputMethod === 'url' ? shadows.md : 'none',
            transition: 'all 0.3s ease'
          }}
        >
          URL
        </button>
        <button
          onClick={() => setInputMethod('file')}
          style={{
            padding: `${spacing.sm} ${spacing.lg}`,
            margin: `0 ${spacing.sm}`,
            background:
              inputMethod === 'file'
                ? colors.primary.main
                : colors.neutral.white,
            color:
              inputMethod === 'file'
                ? colors.neutral.white
                : colors.neutral.darkGrey,
            border: `2px solid ${colors.primary.main}`,
            borderRadius: borderRadius.md,
            fontSize: typography.fontSize.md,
            cursor: 'pointer',
            boxShadow: inputMethod === 'file' ? shadows.md : 'none',
            transition: 'all 0.3s ease'
          }}
        >
          Upload File
        </button>
      </motion.div>

      <motion.div
        variants={itemVariants}
        style={{
          backgroundColor: colors.neutral.white,
          padding: spacing.lg,
          borderRadius: borderRadius.lg,
          boxShadow: shadows.md,
          marginBottom: spacing.xl
        }}
      >
        {inputMethod === 'url' ? (
          <div>
            <label
              htmlFor="url-input"
              style={{
                display: 'block',
                fontSize: typography.fontSize.md,
                color: colors.primary.dark,
                marginBottom: spacing.sm
              }}
            >
              Enter video URL:
            </label>
            <input
              id="url-input"
              type="text"
              value={url}
              onChange={handleUrlChange}
              placeholder="https://example.com/video"
              style={{
                width: '100%',
                padding: spacing.md,
                fontSize: typography.fontSize.md,
                border: `1px solid ${colors.neutral.lightGrey}`,
                borderRadius: borderRadius.md,
                marginBottom: spacing.md
              }}
            />
          </div>
        ) : (
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${
                dragging ? colors.primary.main : colors.neutral.lightGrey
              }`,
              borderRadius: borderRadius.lg,
              padding: spacing.xl,
              textAlign: 'center',
              backgroundColor: dragging
                ? `${colors.primary.light}20`
                : 'transparent',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onClick={handleButtonClick}
          >
            <input
              ref={fileInputRef}
              id="file-input"
              type="file"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              accept=".mp4,.mov,.avi,.mpeg,.webm,video/mp4,video/quicktime,video/x-msvideo,video/mpeg,video/webm"
            />
            <label
              htmlFor="file-input"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '200px',
                borderRadius: borderRadius.lg,
                border: '2px dashed',
                borderColor: dragging
                  ? colors.primary.main
                  : colors.neutral.lightGrey,
                backgroundColor: dragging
                  ? `${colors.primary.light}30`
                  : colors.neutral.white,
                color: colors.neutral.darkGrey,
                cursor: 'pointer',
                transition: 'all 0.3s',
                padding: spacing.lg
              }}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {file ? (
                <>
                  <FiUpload size={24} color={colors.primary.main} />
                  <p
                    style={{
                      marginTop: spacing.sm,
                      textAlign: 'center',
                      fontWeight: 'bold'
                    }}
                  >
                    Selected: {file.name}
                  </p>
                  <p
                    style={{
                      fontSize: typography.fontSize.sm,
                      color: colors.neutral.grey,
                      marginTop: spacing.xs
                    }}
                  >
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                  <p
                    style={{
                      fontSize: typography.fontSize.sm,
                      color: colors.status.success,
                      marginTop: spacing.xs
                    }}
                  >
                    Ready to upload - click "Analyze" below
                  </p>
                </>
              ) : (
                <>
                  <FiUpload size={32} color={colors.primary.main} />
                  <p style={{ marginTop: spacing.md, textAlign: 'center' }}>
                    Drag and drop your video file here or click to browse
                  </p>
                  <p
                    style={{
                      fontSize: typography.fontSize.sm,
                      color: colors.neutral.grey,
                      marginTop: spacing.xs
                    }}
                  >
                    Supported formats: MP4, MOV, AVI, MPEG, WebM (max 200MB)
                  </p>
                </>
              )}
            </label>

            {fileError && (
              <div
                style={{
                  color: colors.status.error,
                  backgroundColor: `${colors.status.error}15`,
                  padding: spacing.sm,
                  borderRadius: borderRadius.md,
                  marginTop: spacing.sm,
                  fontSize: typography.fontSize.sm
                }}
              >
                {fileError}
              </div>
            )}
          </div>
        )}
      </motion.div>

      <motion.div
        variants={itemVariants}
        style={{
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <button
          onClick={handleSubmit}
          disabled={
            (inputMethod === 'url' && !url) || (inputMethod === 'file' && !file)
          }
          style={{
            padding: `${spacing.md} ${spacing.xl}`,
            background:
              (inputMethod === 'url' && !url) ||
              (inputMethod === 'file' && !file)
                ? colors.neutral.lightGrey
                : colors.accent.green,
            color: colors.neutral.white,
            border: 'none',
            borderRadius: borderRadius.md,
            fontSize: typography.fontSize.lg,
            fontWeight: 'bold',
            cursor:
              (inputMethod === 'url' && !url) ||
              (inputMethod === 'file' && !file)
                ? 'not-allowed'
                : 'pointer',
            boxShadow: shadows.md,
            transition: 'all 0.3s ease'
          }}
        >
          Analyze Content
        </button>
      </motion.div>
    </motion.div>
  );
};

export default HomePage;
