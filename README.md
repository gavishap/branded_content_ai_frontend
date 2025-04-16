
# Branded Content AI - Frontend

## Overview

This is the React-based frontend for Branded Content AI, an advanced platform for analyzing video content with AI. The dashboard visualizes insights from multiple AI models (Google Gemini and ClarifAI) to help content creators optimize their videos.

## Features

- Interactive dashboard with visual metrics
- Demographic analysis visualizations
- Emotional content analysis charts
- Performance predictions with detailed breakdowns
- Content quality assessment
- Optimization recommendations by platform
- Real-time analysis progress tracking

## Installation

### Prerequisites

- Node.js 16+
- npm or yarn
- Backend API running (see backend README)

### Setup

1. Clone the repository
```bash
git clone [your-repo-url]
cd branded_content_ai/frontend
```

2. Install dependencies
```bash
npm install
# or with yarn
yarn install
```

3. Create a `.env.local` file with your API configuration
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_VERSION=0.1.0
```

## Running the Development Server

```bash
npm start
# or with yarn
yarn start
```

The app will be available at `http://localhost:3000`.

## Project Structure

```
src/
├── components/         # React components
│   ├── dashboard/      # Dashboard layout and sections
│   ├── charts/         # Chart components
│   ├── cards/          # Card components
│   ├── layout/         # Layout components
│   └── upload/         # Video upload components
├── utils/              # Utility functions
├── hooks/              # Custom React hooks
├── contexts/           # React contexts
├── data/               # Mock data and type definitions
├── assets/             # Static assets
└── App.js              # Main app component
```

## Key Components

### Dashboard Components

- `AnalysisDashboard`: Main dashboard container
- `EmotionalAnalysisSection`: Emotional analysis charts and insights
- `AudienceAnalysisSection`: Demographic analysis and platform fit
- `ContentQualitySection`: Visual and narrative quality metrics
- `PerformanceMetricsSection`: Engagement and viral potential metrics

### Visualization Components

- `PieChart`: Donut charts for distribution data
- `BarChart`: Bar charts for performance metrics
- `ScoreGauge`: Circular gauge for overall scores
- `MetricCard`: Cards displaying individual metrics

### User Interface Components

- `VideoUploader`: File uploading and URL input
- `ProgressTracker`: Analysis progress indicator
- `RecommendationsPanel`: Actionable recommendations

## State Management

The application uses React's Context API for global state management, particularly for:

- Analysis data
- Upload status
- User preferences

## Integration with Backend

The frontend communicates with the backend API using the following flow:

1. Video upload (file or URL) to `/api/analyze-unified`
2. Polling for progress via `/api/analysis-progress/{id}`
3. Fetching completed analysis from `/api/analysis/{id}`
4. Displaying analysis in the dashboard

## Customization

### Theme Customization

The app uses a custom theming system in `/src/utils/theme.js`. You can modify:

- Color palette
- Typography
- Spacing
- Shadows
- Border radius

### Adding New Visualizations

To add new visualization components:

1. Create a new chart component in `/src/components/charts/`
2. Import the necessary Chart.js or other visualization libraries
3. Connect it to the relevant data in the appropriate section component

## Building for Production

```bash
npm run build
# or with yarn
yarn build
```

This creates optimized files in the `build/` directory.

## Deployment

The frontend is designed to be deployed to platforms like Vercel:

```bash
npm run deploy
# or with yarn
yarn deploy
```

Or deploy the `build` directory to any static hosting service.

## Performance Considerations

- The dashboard uses code-splitting for faster initial load
- Charts are rendered with efficient Canvas-based libraries
- Large datasets are paginated where appropriate

## Browser Compatibility

Tested and supported in:
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Contributing

1. Create a feature branch: `git checkout -b feature/new-feature`
2. Make changes
3. Run tests: `npm test`
4. Submit a pull request

## License

[Your license here]
