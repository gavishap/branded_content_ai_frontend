import React, { useState, useEffect, useCallback } from 'react';
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
    console.log('handleStartAnalysis called with:', content);
    setAnalysisContent(content); // Store type, content, and name

    // If it's a saved analysis being selected, handle differently
    // This logic might be moved if SavedAnalysesList handles the fetch directly
    if (content.type === 'saved') {
      console.log('Loading saved analysis:', content.id);
      // Trigger fetch for this ID and transition
      fetchAndDisplayAnalysis(content.id);
      return;
    }

    // For new file uploads, proceed with analysis request
    setAppState('loading');
    setLoadingProgress(0);
    setLoadingStep(0);
    setLoadingStatus('initializing');
    setAnalysisId(null); // Reset previous analysis ID

    try {
      // Ensure it's a file upload (URL removed)
      if (content.type !== 'file' || !content.content) {
        throw new Error('Invalid content type for starting analysis.');
      }

      const formData = new FormData();
      formData.append('file', content.content); // The File object
      // Add the analysis name to the form data
      if (content.name) {
        formData.append('name', content.name);
      }

      console.log(
        'Uploading file:',
        content.content.name,
        'Analysis Name:',
        content.name || '(Not provided)'
      );

      const response = await axios.post(
        `${API_BASE_URL}/api/analyze-unified`,
        formData,
        {
          headers: {
            // Content-Type is automatically set by browser for FormData
          }
        }
      );

      if (response.data && response.data.analysis_id) {
        console.log('Analysis started with ID:', response.data.analysis_id);
        setAnalysisId(response.data.analysis_id);
      } else {
        console.error('No analysis_id received in response:', response.data);
        alert('Failed to start analysis. Please check server logs.');
        setAppState('home');
      }
    } catch (error) {
      console.error('Error starting analysis:', error);
      alert(
        `Failed to start analysis: ${
          error.message || 'Unknown error'
        }. Please try again.`
      );
      setAppState('home');
    }
  };

  // Function to fetch and display a specific analysis
  const fetchAndDisplayAnalysis = async selectedAnalysisId => {
    console.log(`Fetching full data for saved analysis: ${selectedAnalysisId}`);
    setAppState('loading'); // Show loading indicator while fetching
    setLoadingStatus('loading_saved');
    setLoadingProgress(50); // Indicate progress

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/analysis/${selectedAnalysisId}`
      );
      if (response.data) {
        setAnalysisData(response.data);
        setAnalysisId(selectedAnalysisId); // Set the current ID
        setAppState('dashboard');
      } else {
        throw new Error('Analysis data not found in response.');
      }
    } catch (error) {
      console.error('Error fetching saved analysis:', error);
      alert(
        `Failed to load saved analysis: ${error.message || 'Unknown error'}`
      );
      setAnalysisData(null); // Clear any potentially stale data
      setAnalysisId(null);
      setAppState('home'); // Go back home on error
    }
  };

  // Callback passed from AnalysisLoading when backend signals completion
  const onAnalysisComplete = useCallback(async (resultId, metadata) => {
    console.log('Analysis complete callback with result ID:', resultId);
    if (!resultId) {
      console.error('onAnalysisComplete called without resultId');
      // Handle error state appropriately
      setAnalysisData({
        metadata: {
          error: 'Analysis completed without ID.',
          ...(metadata || {})
        },
        summary: { content_overview: 'Error: Analysis ID missing.' }
      });
      setAppState('dashboard');
      return;
    }

    // Use the existing retry logic to fetch the final data
    await fetchAndDisplayAnalysisWithRetry(resultId, metadata);
  }, []); // Empty dependency array if it doesn't depend on App state directly

  // Extracted fetch logic with retry (used by onAnalysisComplete)
  const fetchAndDisplayAnalysisWithRetry = async (
    resultId,
    metadata,
    retryCount = 0
  ) => {
    const maxRetries = 4;
    const retryDelay = 1500 * Math.pow(1.5, retryCount);

    try {
      console.log(
        `Attempt ${retryCount + 1}: Fetching analysis data for ID: ${resultId}`
      );
      const response = await axios.get(
        `${API_BASE_URL}/api/analysis/${resultId}`,
        { timeout: 10000 }
      );
      console.log('Full analysis response:', response);

      if (response.data) {
        const analysisResultData = response.data.analysis_data || response.data;
        console.log('Parsed analysis data:', analysisResultData);
        setAnalysisData(analysisResultData);
        setAppState('dashboard');
        return true;
      } else {
        console.warn('Received response but no analysis data');
        throw new Error('Empty data received');
      }
    } catch (error) {
      console.error(
        `Error fetching completed analysis (Attempt ${retryCount + 1}):`,
        error
      );
      if (
        (error.response?.status === 404 ||
          error.code === 'ECONNABORTED' ||
          error.message === 'Empty data received') &&
        retryCount < maxRetries
      ) {
        console.log(`Retrying fetch in ${retryDelay.toFixed(0)}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return fetchAndDisplayAnalysisWithRetry(
          resultId,
          metadata,
          retryCount + 1
        );
      } else {
        console.error('Max retries reached or non-retryable error.');
        setAnalysisData({
          metadata: {
            id: resultId,
            error: `Failed to fetch analysis after ${
              maxRetries + 1
            } attempts: ${error.message}`,
            ...(metadata || {})
          },
          summary: {
            content_overview: `Error loading analysis: ${error.message}`
          }
        });
        setAppState('dashboard');
        return false;
      }
    }
  };

  const handleBackToHome = () => {
    setAppState('home');
    setAnalysisData(null);
    setAnalysisId(null);
    setAnalysisContent(null);
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
          <HomePage
            onStartAnalysis={handleStartAnalysis}
            onAnalysisSelect={fetchAndDisplayAnalysis} // Pass fetcher for saved items
          />
        )}

        {appState === 'loading' && (
          <AnalysisLoading
            progress={loadingProgress}
            currentStep={loadingStep}
            status={loadingStatus}
            type={analysisContent?.type || 'file'}
            contentName={
              analysisContent?.name || // Use analysis name if provided
              analysisContent?.content?.name || // Fallback to filename
              'Video'
            }
            analysisId={analysisId}
            onAnalysisComplete={onAnalysisComplete}
            // Removed onCompleteClick as direct fetch is preferred
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
