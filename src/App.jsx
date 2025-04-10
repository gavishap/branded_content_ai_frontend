import React, { useState, useEffect } from 'react';
import './App.css';
import AnalysisDashboard from './components/dashboard/AnalysisDashboard';
import HomePage from './components/landing/HomePage';
import AnalysisLoading from './components/loading/AnalysisLoading';
import { colors } from './utils/theme';
import axios from 'axios';
import { API_BASE_URL } from './config';

console.log(
  `[App] Using API base URL: ${API_BASE_URL} (${process.env.NODE_ENV} environment)`
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

  // Remove the polling effect since it's now handled in AnalysisLoading component

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
    setAnalysisId(null); // Reset analysisId when starting new analysis

    try {
      let response;

      if (content.type === 'url') {
        // API call for URL analysis
        console.log('Starting URL analysis for:', content.content);
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
        console.log('Analysis started with ID:', response.data.analysis_id);
        setAnalysisId(response.data.analysis_id);
      } else {
        // Handle error if no analysis ID
        console.error('No analysis_id received in response:', response.data);
        alert('Failed to start analysis. Please try again.');
        setAppState('home');
      }
    } catch (error) {
      console.error('Failed to start analysis:', error);
      alert(`Analysis failed to start: ${error.message}`);
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
            analysisId={analysisId}
            onAnalysisComplete={(resultId, metadata) => {
              console.log('Analysis complete with result ID:', resultId);
              // Fetch the analysis data
              (async () => {
                try {
                  if (resultId) {
                    console.log(`Fetching analysis data for ID: ${resultId}`);
                    const response = await axios.get(
                      `${API_BASE_URL}/api/analysis/${resultId}`
                    );

                    // Log the complete response for debugging
                    console.log('Full analysis response:', response);

                    if (response.data) {
                      // API might return analysis data directly or nested in analysis_data
                      const analysisData =
                        response.data.analysis_data || response.data;

                      console.log('Parsed analysis data:', analysisData);

                      // The dashboard expects a complete data structure
                      setAnalysisData(analysisData);
                      setAppState('dashboard');
                    } else {
                      console.warn('Received response but no analysis data');
                      // Create minimal data structure for dashboard
                      const fallbackData = {
                        metadata: {
                          id: resultId,
                          ...(metadata || {})
                        },
                        summary: {
                          content_overview:
                            'Analysis data incomplete or unavailable',
                          overall_performance_score: 0
                        }
                      };
                      setAnalysisData(fallbackData);
                      setAppState('dashboard');
                    }
                  }
                } catch (error) {
                  console.error('Error fetching completed analysis:', error);
                  // Create minimal data structure with error info
                  const errorData = {
                    metadata: {
                      id: resultId,
                      error: error.message,
                      ...(metadata || {})
                    },
                    summary: {
                      content_overview: `Error loading analysis: ${error.message}`,
                      overall_performance_score: 0
                    }
                  };
                  setAnalysisData(errorData);
                  setAppState('dashboard');
                }
              })();
            }}
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
