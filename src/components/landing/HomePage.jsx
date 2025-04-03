import React, { useState, useRef } from 'react';
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
import { FiUpload, FiLink, FiPlay } from 'react-icons/fi';
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
        delay: 0.2,
        when: 'beforeChildren',
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 12
      }
    }
  };

  // Background gradient circles for visual enhancement
  const decorativeCircles = [
    {
      size: 300,
      top: -100,
      left: -150,
      color: colors.accent.purple,
      opacity: 0.1
    },
    {
      size: 200,
      bottom: -50,
      right: -100,
      color: colors.accent.teal,
      opacity: 0.15
    },
    {
      size: 150,
      top: '40%',
      right: '5%',
      color: colors.primary.main,
      opacity: 0.12
    }
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: spacing.xl,
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100vh'
      }}
    >
      {/* Decorative background circles */}
      {decorativeCircles.map((circle, index) => (
        <motion.div
          key={index}
          style={{
            position: 'absolute',
            width: circle.size,
            height: circle.size,
            borderRadius: '50%',
            background: `radial-gradient(circle at center, ${circle.color} 0%, transparent 70%)`,
            opacity: circle.opacity,
            top: circle.top,
            left: circle.left,
            right: circle.right,
            bottom: circle.bottom,
            zIndex: -1
          }}
          animate={{
            scale: [1, 1.05, 1],
            opacity: [circle.opacity, circle.opacity * 1.5, circle.opacity]
          }}
          transition={{
            duration: 8 + index * 2,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut'
          }}
        />
      ))}

      <motion.div
        variants={itemVariants}
        className="glow"
        style={{
          textAlign: 'center',
          marginBottom: spacing.xxl,
          position: 'relative'
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'absolute',
            top: -30,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '150px',
            height: '150px',
            background: `linear-gradient(45deg, ${colors.accent.purple}30, ${colors.primary.main}30)`,
            borderRadius: '50%',
            filter: 'blur(40px)',
            zIndex: -1
          }}
        />

        <h1
          style={{
            fontSize: typography.fontSize.xxxl,
            background: gradients.purpleBlue,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0,
            marginBottom: spacing.md,
            fontWeight: typography.fontWeights.bold,
            textShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}
        >
          Branded Content Analysis
        </h1>

        <motion.p
          style={{
            fontSize: typography.fontSize.xl,
            color: colors.neutral.darkGrey,
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: 1.5
          }}
        >
          Get AI-powered insights on your branded videos to optimize engagement
          and performance
        </motion.p>
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
        className="glass"
      >
        <motion.button
          onClick={() => setInputMethod('url')}
          whileHover={{ scale: 1.03, boxShadow: shadows.glow }}
          whileTap={{ scale: 0.98 }}
          style={{
            padding: `${spacing.md} ${spacing.xl}`,
            margin: `0 ${spacing.md}`,
            background:
              inputMethod === 'url'
                ? gradients.purpleBlue
                : 'rgba(255, 255, 255, 0.8)',
            color:
              inputMethod === 'url'
                ? colors.neutral.white
                : colors.neutral.darkGrey,
            border: 'none',
            borderRadius: borderRadius.lg,
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeights.medium,
            cursor: 'pointer',
            boxShadow: inputMethod === 'url' ? shadows.md : 'none',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
            minWidth: '150px',
            justifyContent: 'center'
          }}
        >
          <FiLink size={20} /> URL
        </motion.button>

        <motion.button
          onClick={() => setInputMethod('file')}
          whileHover={{ scale: 1.03, boxShadow: shadows.glow }}
          whileTap={{ scale: 0.98 }}
          style={{
            padding: `${spacing.md} ${spacing.xl}`,
            margin: `0 ${spacing.md}`,
            background:
              inputMethod === 'file'
                ? gradients.blueTeal
                : 'rgba(255, 255, 255, 0.8)',
            color:
              inputMethod === 'file'
                ? colors.neutral.white
                : colors.neutral.darkGrey,
            border: 'none',
            borderRadius: borderRadius.lg,
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeights.medium,
            cursor: 'pointer',
            boxShadow: inputMethod === 'file' ? shadows.md : 'none',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
            minWidth: '150px',
            justifyContent: 'center'
          }}
        >
          <FiUpload size={20} /> Upload File
        </motion.button>
      </motion.div>

      <motion.div
        variants={itemVariants}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          padding: spacing.xl,
          borderRadius: borderRadius['2xl'],
          boxShadow: shadows.lg,
          marginBottom: spacing.xl,
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
        className="glass"
      >
        {inputMethod === 'url' ? (
          <div>
            <label
              htmlFor="url-input"
              style={{
                display: 'block',
                fontSize: typography.fontSize.xl,
                fontWeight: typography.fontWeights.medium,
                color: colors.primary.dark,
                marginBottom: spacing.md
              }}
            >
              <span
                style={{
                  background: gradients.purpleBlue,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Enter video URL:
              </span>
            </label>
            <div
              style={{
                position: 'relative',
                marginBottom: spacing.xl
              }}
            >
              <input
                id="url-input"
                type="text"
                value={url}
                onChange={handleUrlChange}
                placeholder="https://example.com/video"
                className="url-input-field"
                style={{
                  width: '100%',
                  padding: `${spacing.lg} ${spacing.xxl}`,
                  paddingRight: `${spacing.xxl + spacing.md}`,
                  fontSize: typography.fontSize.lg,
                  border: `2px solid ${
                    inputMethod === 'url' && url
                      ? colors.primary.main
                      : colors.neutral.lightGrey
                  }`,
                  borderRadius: borderRadius.xl,
                  transition: 'all 0.3s ease',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
                  outline: 'none',
                  height: '60px'
                }}
              />
              <FiLink
                style={{
                  position: 'absolute',
                  right: spacing.lg,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: typography.fontSize.xl,
                  color: colors.primary.main
                }}
                size={24}
              />
            </div>

            <div
              style={{
                padding: spacing.lg,
                backgroundColor: `${colors.accent.purple}15`,
                borderRadius: borderRadius.xl,
                display: 'flex',
                alignItems: 'center',
                gap: spacing.md,
                marginBottom: spacing.md
              }}
            >
              <FiPlay size={30} style={{ color: colors.accent.purple }} />
              <p
                style={{
                  margin: 0,
                  fontSize: typography.fontSize.md,
                  color: colors.neutral.darkGrey,
                  lineHeight: 1.5
                }}
              >
                Supports YouTube, Vimeo, and direct video links. For best
                results, ensure your video is publicly accessible.
              </p>
            </div>
          </div>
        ) : (
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            style={{
              borderRadius: borderRadius.xl,
              padding: spacing.lg,
              textAlign: 'center',
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
            <motion.label
              htmlFor="file-input"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '240px',
                borderRadius: borderRadius.xl,
                border: '2px dashed',
                borderColor: dragging
                  ? colors.primary.main
                  : colors.neutral.lightGrey,
                backgroundColor: dragging
                  ? `${colors.primary.light}20`
                  : 'rgba(255, 255, 255, 0.5)',
                color: colors.neutral.darkGrey,
                cursor: 'pointer',
                transition: 'all 0.3s',
                padding: spacing.xl
              }}
              animate={{
                borderColor: dragging
                  ? colors.primary.main
                  : colors.neutral.lightGrey,
                backgroundColor: dragging
                  ? `${colors.primary.light}20`
                  : 'rgba(255, 255, 255, 0.5)'
              }}
              whileHover={{
                backgroundColor: `${colors.primary.light}10`,
                boxShadow: shadows.glow
              }}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {file ? (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 260,
                      damping: 20
                    }}
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      backgroundColor: `${colors.primary.main}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: spacing.md
                    }}
                  >
                    <FiUpload size={32} color={colors.primary.main} />
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      marginTop: spacing.sm,
                      fontSize: typography.fontSize.lg,
                      fontWeight: typography.fontWeights.medium,
                      color: colors.primary.dark
                    }}
                  >
                    Selected: {file.name}
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    style={{
                      fontSize: typography.fontSize.md,
                      color: colors.neutral.grey,
                      marginTop: spacing.xs
                    }}
                  >
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    style={{
                      fontSize: typography.fontSize.md,
                      color: colors.status.success,
                      marginTop: spacing.xs,
                      fontWeight: typography.fontWeights.medium
                    }}
                  >
                    Ready to upload - click "Analyze" below
                  </motion.p>
                </>
              ) : (
                <>
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: 'reverse'
                    }}
                    style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      backgroundColor: `${colors.primary.main}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: spacing.lg
                    }}
                  >
                    <FiUpload size={40} color={colors.primary.main} />
                  </motion.div>

                  <p
                    style={{
                      fontSize: typography.fontSize.lg,
                      marginTop: spacing.md,
                      textAlign: 'center',
                      fontWeight: typography.fontWeights.medium,
                      color: colors.primary.dark
                    }}
                  >
                    Drag and drop your video file here or click to browse
                  </p>

                  <p
                    style={{
                      fontSize: typography.fontSize.md,
                      color: colors.neutral.darkGrey,
                      marginTop: spacing.sm
                    }}
                  >
                    Supported formats: MP4, MOV, AVI, MPEG, WebM (max 200MB)
                  </p>
                </>
              )}
            </motion.label>

            {fileError && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  color: colors.status.error,
                  backgroundColor: `${colors.status.error}15`,
                  padding: spacing.md,
                  borderRadius: borderRadius.lg,
                  marginTop: spacing.md,
                  fontSize: typography.fontSize.md,
                  fontWeight: typography.fontWeights.medium,
                  boxShadow: '0 2px 8px rgba(239, 68, 68, 0.2)'
                }}
              >
                {fileError}
              </motion.div>
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
        <motion.button
          onClick={handleSubmit}
          disabled={
            (inputMethod === 'url' && !url) || (inputMethod === 'file' && !file)
          }
          whileHover={{
            scale:
              (inputMethod === 'url' && !url) ||
              (inputMethod === 'file' && !file)
                ? 1
                : 1.05,
            boxShadow:
              (inputMethod === 'url' && !url) ||
              (inputMethod === 'file' && !file)
                ? 'none'
                : shadows.glow
          }}
          whileTap={{
            scale:
              (inputMethod === 'url' && !url) ||
              (inputMethod === 'file' && !file)
                ? 1
                : 0.95
          }}
          style={{
            padding: `${spacing.lg} ${spacing.xxl}`,
            background:
              (inputMethod === 'url' && !url) ||
              (inputMethod === 'file' && !file)
                ? colors.neutral.lightGrey
                : gradients.futuristic,
            color: colors.neutral.white,
            border: 'none',
            borderRadius: borderRadius.full,
            fontSize: typography.fontSize.xl,
            fontWeight: typography.fontWeights.bold,
            cursor:
              (inputMethod === 'url' && !url) ||
              (inputMethod === 'file' && !file)
                ? 'not-allowed'
                : 'pointer',
            boxShadow:
              (inputMethod === 'url' && !url) ||
              (inputMethod === 'file' && !file)
                ? 'none'
                : shadows.lg,
            transition: 'all 0.3s ease',
            minWidth: '300px',
            height: '70px',
            letterSpacing: '0.5px'
          }}
          className={
            (inputMethod === 'url' && !url) || (inputMethod === 'file' && !file)
              ? ''
              : 'shimmer'
          }
        >
          Analyze Content
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default HomePage;
