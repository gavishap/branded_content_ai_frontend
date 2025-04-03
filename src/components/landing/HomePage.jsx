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

const HomePage = ({ onStartAnalysis }) => {
  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [inputMethod, setInputMethod] = useState('url'); // 'url' or 'file'
  const fileInputRef = useRef(null);

  const handleUrlChange = e => {
    setUrl(e.target.value);
  };

  const handleFileChange = e => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragEnter = e => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = e => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = e => {
    e.preventDefault();
    e.stopPropagation();
    if (!dragActive) setDragActive(true);
  };

  const handleDrop = e => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setInputMethod('file');
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
                dragActive ? colors.primary.main : colors.neutral.lightGrey
              }`,
              borderRadius: borderRadius.lg,
              padding: spacing.xl,
              textAlign: 'center',
              backgroundColor: dragActive
                ? `${colors.primary.light}20`
                : 'transparent',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onClick={handleButtonClick}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <div
              style={{
                fontSize: typography.fontSize.md,
                color: colors.neutral.darkGrey,
                marginBottom: spacing.md
              }}
            >
              {file ? (
                <p>
                  Selected: <strong>{file.name}</strong>
                </p>
              ) : (
                <>
                  <p>Drag and drop your video file here</p>
                  <p>or</p>
                  <button
                    style={{
                      padding: `${spacing.sm} ${spacing.lg}`,
                      background: colors.primary.main,
                      color: colors.neutral.white,
                      border: 'none',
                      borderRadius: borderRadius.md,
                      fontSize: typography.fontSize.md,
                      cursor: 'pointer',
                      marginTop: spacing.sm
                    }}
                  >
                    Browse Files
                  </button>
                </>
              )}
            </div>
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
