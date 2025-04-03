import React, { useState, useEffect } from 'react';
import './App.css';
import AnalysisDashboard from './components/dashboard/AnalysisDashboard';
import HomePage from './components/landing/HomePage';
import AnalysisLoading from './components/loading/AnalysisLoading';
import { colors } from './utils/theme';
import axios from 'axios';

// API URL configuration (use environment variable in production)
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

function App() {
  const [appState, setAppState] = useState('home'); // 'home', 'loading', 'dashboard'
  const [analysisData, setAnalysisData] = useState(null);
  const [analysisContent, setAnalysisContent] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState(0);
  const [analysisId, setAnalysisId] = useState(null);
  const [pollingInterval, setPollingInterval] = useState(null);

  // Poll for analysis progress when in loading state
  useEffect(() => {
    if (appState === 'loading' && analysisId) {
      // Set up polling interval to check progress
      const interval = setInterval(async () => {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/api/analysis-progress/${analysisId}`
          );
          const { progress, step, status, result } = response.data;

          // Update UI with progress
          setLoadingProgress(progress);
          setLoadingStep(step);

          // If analysis is complete, show the dashboard
          if (status === 'completed' && result) {
            setAnalysisData(result);
            setLoadingProgress(100);

            // Wait a moment to show 100% completion before switching to dashboard
            setTimeout(() => {
              setAppState('dashboard');
              // Stop polling
              clearInterval(interval);
              setPollingInterval(null);
            }, 1000);
          } else if (status === 'error') {
            // Handle error state
            alert('Analysis failed. Please try again.');
            setAppState('home');
            // Stop polling
            clearInterval(interval);
            setPollingInterval(null);
          }
        } catch (error) {
          console.error('Error checking analysis progress:', error);
        }
      }, 2000); // Check every 2 seconds

      setPollingInterval(interval);

      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    }
  }, [appState, analysisId]);

  // Clean up polling when component unmounts
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  // Handle starting the analysis process
  const handleStartAnalysis = async content => {
    setAnalysisContent(content);
    setAppState('loading');
    setLoadingProgress(0);
    setLoadingStep(0);

    try {
      let response;

      if (content.type === 'url') {
        // API call for URL analysis
        response = await axios.post(`${API_BASE_URL}/api/analyze-unified`, {
          url: content.content
        });
      } else {
        // API call for file upload
        const formData = new FormData();
        formData.append('file', content.content);

        response = await axios.post(
          `${API_BASE_URL}/api/analyze-unified`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }

      // On successful request, store the analysis ID and continue to loading screen
      if (response.data && response.data.analysis_id) {
        setAnalysisId(response.data.analysis_id);
      } else {
        // Handle error if no analysis ID
        alert('Failed to start analysis. Please try again.');
        setAppState('home');
      }
    } catch (error) {
      console.error('Failed to start analysis:', error);
      alert('Analysis failed to start. Please try again.');
      setAppState('home');
    }
  };

  // Handle returning to home from dashboard
  const handleBackToHome = () => {
    setAppState('home');
    setAnalysisData(null);
    setAnalysisContent(null);
    setAnalysisId(null);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: colors.neutral.background,
        fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif"
      }}
    >
      <header
        style={{
          padding: '20px',
          background: colors.primary.dark,
          color: 'white',
          textAlign: 'center',
          display: appState === 'loading' ? 'none' : 'block'
        }}
      >
        <h1 style={{ margin: 0 }}>Branded Content Analysis</h1>
      </header>

      <main>
        {appState === 'home' && (
          <HomePage onStartAnalysis={handleStartAnalysis} />
        )}

        {appState === 'loading' && (
          <AnalysisLoading
            progress={loadingProgress}
            currentStep={loadingStep}
            type={analysisContent?.type || 'file'}
            contentName={
              analysisContent?.type === 'url'
                ? analysisContent.content
                : analysisContent?.content?.name
            }
          />
        )}

        {appState === 'dashboard' && analysisData && (
          <div>
            <div
              style={{
                padding: '10px 20px',
                marginBottom: '20px',
                backgroundColor: colors.neutral.white,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <button
                onClick={handleBackToHome}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: colors.primary.main,
                  fontSize: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '5px'
                }}
              >
                ← Back to Home
              </button>
            </div>
            <AnalysisDashboard data={analysisData} />
          </div>
        )}
      </main>

      <footer
        style={{
          padding: '20px',
          textAlign: 'center',
          color: colors.neutral.darkGrey,
          borderTop: `1px solid ${colors.neutral.lightGrey}`,
          marginTop: '30px',
          display: appState === 'loading' ? 'none' : 'block'
        }}
      >
        <p style={{ margin: 0 }}>
          Branded Content AI Analysis Dashboard - © 2023
        </p>
      </footer>
    </div>
  );
}

export default App;
