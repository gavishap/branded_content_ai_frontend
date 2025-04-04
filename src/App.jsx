import React, { useState, useEffect } from 'react';
import './App.css';
import AnalysisDashboard from './components/dashboard/AnalysisDashboard';
import HomePage from './components/landing/HomePage';
import AnalysisLoading from './components/loading/AnalysisLoading';
import { colors } from './utils/theme';
import axios from 'axios';

// API URL configuration
const API_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://branded-content-ai-a6ff96db0804.herokuapp.com'
    : 'http://localhost:5000';

console.log(
  `Using API base URL: ${API_BASE_URL} (${process.env.NODE_ENV} environment)`
);

function App() {
  const [appState, setAppState] = useState('home'); // 'home', 'loading', 'dashboard'
  const [analysisData, setAnalysisData] = useState(null);
  const [analysisContent, setAnalysisContent] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState('initializing');
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
          setLoadingStatus(status); // Store the status for display

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
          } else if (progress === 100 && status === 'completed') {
            // Handle case where result might be stored separately
            try {
              // Fetch the completed analysis result
              const resultResponse = await axios.get(
                `${API_BASE_URL}/api/analyses`
              );

              // Find our analysis
              const completedAnalysis = resultResponse.data.analyses.find(
                analysis => analysis.metadata.id === analysisId
              );

              if (completedAnalysis && completedAnalysis.analysis_data) {
                setAnalysisData(completedAnalysis.analysis_data);

                // Wait a moment to show 100% completion before switching to dashboard
                setTimeout(() => {
                  setAppState('dashboard');
                  // Stop polling
                  clearInterval(interval);
                  setPollingInterval(null);
                }, 1000);
              }
            } catch (resultError) {
              console.error('Error fetching completed analysis:', resultError);
            }
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

  // Add a timeout effect to handle case where 100% is reached but no transition happens
  useEffect(() => {
    // If loading is at 100% for more than 5 seconds, try to force transition
    if (appState === 'loading' && loadingProgress === 100) {
      const transitionTimeout = setTimeout(async () => {
        try {
          console.log(
            'Loading stuck at 100%, attempting to force transition...'
          );

          // Try to fetch the analyses
          const response = await axios.get(`${API_BASE_URL}/api/analyses`);

          // Find our analysis
          if (response.data && response.data.analyses) {
            const completedAnalysis = response.data.analyses.find(
              analysis => analysis.metadata.id === analysisId
            );

            if (completedAnalysis && completedAnalysis.analysis_data) {
              console.log(
                'Found completed analysis, transitioning to dashboard'
              );
              setAnalysisData(completedAnalysis.analysis_data);
              setAppState('dashboard');
            } else {
              // If we can't find the analysis, at least show the dashboard with a warning
              console.warn(
                "Couldn't find analysis data, showing empty dashboard"
              );
              setAnalysisData({});
              setAppState('dashboard');
            }
          }
        } catch (error) {
          console.error('Error forcing transition:', error);
          // As a last resort, just show the dashboard with empty data
          setAnalysisData({});
          setAppState('dashboard');
        }
      }, 5000);

      return () => clearTimeout(transitionTimeout);
    }
  }, [appState, loadingProgress, analysisId]);

  // Handle starting the analysis process
  const handleStartAnalysis = async content => {
    setAnalysisContent(content);

    // If it's a saved analysis, load it directly
    if (content.type === 'saved' && content.savedAnalysisData) {
      setAnalysisData(content.savedAnalysisData);
      setAppState('dashboard');
      return;
    }

    // For URLs and files, proceed with regular analysis
    setAppState('loading');
    setLoadingProgress(0);
    setLoadingStep(0);
    setLoadingStatus('initializing');

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

        console.log(
          'Uploading file:',
          content.content.name,
          'Size:',
          content.content.size,
          'Type:',
          content.content.type
        );

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
            status={loadingStatus}
            type={analysisContent?.type || 'file'}
            contentName={
              analysisContent?.type === 'url'
                ? analysisContent.content
                : analysisContent?.content?.name
            }
            onCompleteClick={() => {
              // Force transition to dashboard if button is clicked
              if (analysisData) {
                setAppState('dashboard');
              } else {
                // Try to get data from analyses list as fallback
                (async () => {
                  try {
                    const response = await axios.get(
                      `${API_BASE_URL}/api/analyses`
                    );
                    const completedAnalysis = response.data.analyses.find(
                      analysis => analysis.metadata.id === analysisId
                    );

                    if (completedAnalysis && completedAnalysis.analysis_data) {
                      setAnalysisData(completedAnalysis.analysis_data);
                      setAppState('dashboard');
                    } else {
                      // If we still can't get the data, show an empty dashboard
                      console.warn(
                        'No analysis data found, showing empty dashboard'
                      );
                      setAnalysisData({});
                      setAppState('dashboard');
                    }
                  } catch (error) {
                    console.error('Error fetching analysis data:', error);
                    setAnalysisData({});
                    setAppState('dashboard');
                  }
                })();
              }
            }}
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
