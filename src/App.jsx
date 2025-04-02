import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Line, Radar, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import {
  FiUpload,
  FiEye,
  FiUsers,
  FiClock,
  FiBolt,
  FiScissors,
  FiMic,
  FiLink,
  FiRefreshCw
} from 'react-icons/fi';
import './App.css';

// API configuration
const API_BASE_URL = 'http://localhost:5000';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const MetricCard = ({ title, value }) => (
  <motion.div
    className="metric-card"
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.3 }}
  >
    <h3>{value}</h3>
    <p>{title}</p>
  </motion.div>
);

const Section = ({ title, content }) => (
  <div className="analysis-section">
    <h3>{title}</h3>
    <p>{content}</p>
  </div>
);

const App = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);
  const [urlInput, setUrlInput] = useState('');
  const [previousAnalyses, setPreviousAnalyses] = useState([]);
  const [selectedAnalysisId, setSelectedAnalysisId] = useState(null);
  const [urlAnalysis, setUrlAnalysis] = useState(null);

  // Fetch previous analyses on component mount
  useEffect(() => {
    fetchPreviousAnalyses();
  }, []);

  // Fetch previous analyses
  const fetchPreviousAnalyses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/analyses`);
      if (!response.ok) throw new Error('Failed to fetch previous analyses');
      const data = await response.json();
      setPreviousAnalyses(data.analyses);
    } catch (err) {
      console.error('Error fetching previous analyses:', err);
    }
  };

  // Handle file upload
  const onDrop = async acceptedFiles => {
    try {
      setIsUploading(true);
      setError(null);
      const file = acceptedFiles[0];

      const formData = new FormData();
      formData.append('file', file);

      setIsAnalyzing(true);
      const response = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Analysis failed');

      const data = await response.json();
      setDashboardData(data.dashboard_data);
      setSelectedAnalysisId(data.analysis_id);
      await fetchPreviousAnalyses(); // Refresh the list
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  };

  // Handle URL submission
  const handleUrlSubmit = async e => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    try {
      setIsAnalyzing(true);
      setError(null);
      setDashboardData(null); // Clear previous data

      const response = await fetch(`${API_BASE_URL}/api/analyze-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: urlInput })
      });

      if (!response.ok) throw new Error('URL analysis failed');

      const data = await response.json();
      setDashboardData(data);
      setUrlInput('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Load specific analysis
  const loadAnalysis = async analysisId => {
    try {
      setIsAnalyzing(true);
      setError(null);

      const response = await fetch(
        `${API_BASE_URL}/api/analysis/${analysisId}`
      );
      if (!response.ok) throw new Error('Failed to load analysis');

      const data = await response.json();
      setDashboardData(data);
      setSelectedAnalysisId(analysisId);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Delete analysis
  const deleteAnalysis = async analysisId => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/analysis/${analysisId}`,
        {
          method: 'DELETE'
        }
      );

      if (!response.ok) throw new Error('Failed to delete analysis');

      if (selectedAnalysisId === analysisId) {
        setDashboardData(null);
        setSelectedAnalysisId(null);
      }

      await fetchPreviousAnalyses(); // Refresh the list
    } catch (err) {
      setError(err.message);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/mp4': ['.mp4']
    },
    multiple: false
  });

  const renderUploadSection = () => (
    <motion.div
      className="upload-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'active' : ''}`}
      >
        <input {...getInputProps()} />
        <FiUpload size={48} />
        <h2>Drag & Drop your video here</h2>
        <p>or click to select a file</p>
      </div>

      <div className="url-input-section">
        <h3>Or analyze from URL</h3>
        <form onSubmit={handleUrlSubmit} className="url-form">
          <input
            type="url"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            placeholder="Enter video URL..."
            className="url-input"
          />
          <button type="submit" className="url-submit">
            <FiLink /> Analyze
          </button>
        </form>
      </div>

      {previousAnalyses.length > 0 && (
        <div className="previous-analyses">
          <h3>Previous Analyses</h3>
          <div className="analyses-list">
            {previousAnalyses.map(analysis => (
              <motion.div
                key={analysis.metadata.id}
                className="analysis-item"
                whileHover={{ scale: 1.02 }}
              >
                <span>{analysis.metadata.video_name}</span>
                <span>{analysis.metadata.analyzed_date}</span>
                <div className="analysis-actions">
                  <button
                    onClick={() => loadAnalysis(analysis.metadata.id)}
                    className="action-button view"
                  >
                    <FiEye /> View
                  </button>
                  <button
                    onClick={() => deleteAnalysis(analysis.metadata.id)}
                    className="action-button delete"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );

  const renderLoadingState = () => (
    <motion.div
      className="loading-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="loading-spinner"></div>
      <h3>{isUploading ? 'Uploading...' : 'Analyzing video...'}</h3>
    </motion.div>
  );

  const renderMetricCard = ({ value, label, color, icon: Icon }) => (
    <motion.div
      key={`metric-${label}`}
      className={`metric-card ${color}`}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <Icon size={24} />
      <h3>{value}</h3>
      <p>{label}</p>
    </motion.div>
  );

  const renderViralPotentialChart = data => {
    if (!data?.viral_potential?.criteria) {
      return (
        <div className="chart-container">No viral potential data available</div>
      );
    }

    const chartData = {
      labels: data.viral_potential.criteria.map(c => c.name),
      datasets: [
        {
          label: 'Viral Potential',
          data: data.viral_potential.criteria.map(c => c.value),
          backgroundColor: 'rgba(116, 185, 255, 0.2)',
          borderColor: 'rgb(116, 185, 255)',
          borderWidth: 2,
          pointBackgroundColor: 'rgb(116, 185, 255)'
        }
      ]
    };

    return (
      <div className="chart-container">
        <h3>Viral Potential Analysis</h3>
        <Radar
          data={chartData}
          options={{
            scales: {
              r: {
                beginAtZero: true,
                max: 100,
                ticks: { stepSize: 20 }
              }
            }
          }}
        />
      </div>
    );
  };

  const renderPlatformScores = data => {
    const chartData = {
      labels: Object.keys(data.social_media_insights.platform_scores),
      datasets: [
        {
          label: 'Platform Performance',
          data: Object.values(data.social_media_insights.platform_scores),
          backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1']
        }
      ]
    };

    return (
      <div className="chart-container">
        <h3>Platform Performance</h3>
        <Bar
          data={chartData}
          options={{
            scales: {
              y: {
                beginAtZero: true,
                max: 100
              }
            }
          }}
        />
      </div>
    );
  };

  const renderDashboard = () => (
    <motion.div
      key="dashboard"
      className="dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="dashboard-header">
        <h2>{dashboardData.metadata?.video_name || 'Video Analysis'}</h2>
        <div className="dashboard-actions">
          <button
            onClick={() => setDashboardData(null)}
            className="action-button"
          >
            Analyze New Video
          </button>
          {selectedAnalysisId && (
            <button
              onClick={() => deleteAnalysis(selectedAnalysisId)}
              className="action-button delete"
            >
              Delete Analysis
            </button>
          )}
        </div>
      </div>

      <div className="metrics-grid">
        {renderMetricCard({
          value: dashboardData.summary_metrics.attention_score.value,
          label: 'Attention Score',
          color: 'blue',
          icon: FiEye
        })}
        {renderMetricCard({
          value: dashboardData.summary_metrics.engagement.value,
          label: 'Engagement',
          color: 'green',
          icon: FiUsers
        })}
        {renderMetricCard({
          value: dashboardData.summary_metrics.retention.value,
          label: 'Retention',
          color: 'purple',
          icon: FiClock
        })}
      </div>

      <div className="charts-grid">
        {renderViralPotentialChart(dashboardData)}
        {renderPlatformScores(dashboardData)}
      </div>

      <div className="content-analysis">
        <h3>Content Analysis</h3>
        <div className="analysis-grid">
          {Object.entries(dashboardData.content_analysis).map(
            ([key, value]) => (
              <motion.div
                key={key}
                className="analysis-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
              >
                <h4>
                  {key
                    .split('_')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </h4>
                <p>{value.text}</p>
                <div className="metrics-detail">
                  {Object.entries(value.metrics).map(
                    ([metricKey, metricValue]) => {
                      if (
                        metricKey !== 'reasoning' &&
                        metricKey !== 'overall_score'
                      ) {
                        return (
                          <div key={metricKey} className="metric-bar">
                            <span>{metricKey.split('_').join(' ')}</span>
                            <div className="bar-container">
                              <motion.div
                                className="bar-fill"
                                initial={{ width: 0 }}
                                animate={{ width: `${metricValue}%` }}
                                transition={{ duration: 1 }}
                              />
                            </div>
                            <span>{metricValue}</span>
                          </div>
                        );
                      }
                      return null;
                    }
                  )}
                </div>
              </motion.div>
            )
          )}
        </div>
      </div>
    </motion.div>
  );

  const renderAnalysis = () => {
    const analysis = urlAnalysis || dashboardData;

    if (!analysis) return null;

    // Handle both old and new analysis formats
    const metrics =
      analysis.summary_metrics || analysis.analysis?.['Performance Metrics'];
    const details =
      analysis.content_analysis?.InDepthVideoAnalysis ||
      analysis.analysis?.['Detailed Analysis']?.['In-depth Video Analysis'];

    return (
      <div className="analysis-results">
        <h2>Performance Metrics</h2>
        <div className="metrics-grid">
          <MetricCard
            title="Attention Score"
            value={
              metrics?.attention_score?.value || metrics?.['Attention Score']
            }
          />
          <MetricCard
            title="Engagement Potential"
            value={
              metrics?.engagement?.value || metrics?.['Engagement Potential']
            }
          />
          <MetricCard
            title="Watch Time Retention"
            value={
              metrics?.retention?.value || metrics?.['Watch Time Retention']
            }
          />
        </div>

        <h2>Detailed Analysis</h2>
        <div className="detailed-analysis">
          <Section title="Hook" content={details?.Hook} />
          <Section title="Editing" content={details?.Editing} />
          <Section title="Tonality" content={details?.Tonality} />
        </div>
      </div>
    );
  };

  return (
    <div className="app">
      <header>
        <h1>Video Analysis Dashboard</h1>
      </header>

      <main>
        <AnimatePresence>
          {error && (
            <motion.div
              className="error"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {error}
            </motion.div>
          )}

          {(isUploading || isAnalyzing) && renderLoadingState()}
          {!dashboardData &&
            !isUploading &&
            !isAnalyzing &&
            renderUploadSection()}
          {dashboardData && !isUploading && !isAnalyzing && renderDashboard()}
          {urlAnalysis && !isUploading && !isAnalyzing && renderAnalysis()}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;
