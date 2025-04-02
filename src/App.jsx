import React from 'react';
import './App.css';
import AnalysisDashboard from './components/dashboard/AnalysisDashboard';
import analysisData from './data/analysisData';
import { colors } from './utils/theme';

function App() {
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
          textAlign: 'center'
        }}
      >
        <h1 style={{ margin: 0 }}>Branded Content Analysis</h1>
      </header>

      <main>
        <AnalysisDashboard data={analysisData} />
      </main>

      <footer
        style={{
          padding: '20px',
          textAlign: 'center',
          color: colors.neutral.darkGrey,
          borderTop: `1px solid ${colors.neutral.lightGrey}`,
          marginTop: '30px'
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
