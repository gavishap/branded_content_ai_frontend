/**
 * Theme configuration for the application
 * Contains colors, spacing, typography, and other styling constants
 */

export const colors = {
  primary: {
    light: '#a8d1ff',
    main: '#4361ee',
    dark: '#3a0ca3'
  },
  accent: {
    teal: '#4cc9f0',
    orange: '#fb8500',
    purple: '#7209b7',
    pink: '#f72585',
    green: '#06d6a0',
    red: '#e63946'
  },
  neutral: {
    white: '#ffffff',
    background: '#f8fafc',
    lightGrey: '#e2e8f0',
    grey: '#94a3b8',
    darkGrey: '#475569',
    black: '#1e293b'
  },
  status: {
    success: '#06d6a0',
    warning: '#fb8500',
    error: '#e63946',
    info: '#4361ee'
  }
};

// Extract gradients as a separate export
export const gradients = {
  primary: 'linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%)',
  purpleBlue: 'linear-gradient(135deg, #7209b7 0%, #3a0ca3 100%)',
  blueTeal: 'linear-gradient(135deg, #4361ee 0%, #4cc9f0 100%)',
  pinkPurple: 'linear-gradient(135deg, #f72585 0%, #7209b7 100%)',
  futuristic: 'linear-gradient(135deg, #3a0ca3 0%, #4361ee 50%, #4cc9f0 100%)',
  darkMode: 'linear-gradient(135deg, #121212 0%, #2d3748 100%)'
};

export const background = {
  light: '#f8fafc',
  dark: '#121212',
  purpleGradient:
    'linear-gradient(135deg, rgba(58,12,163,0.03) 0%, rgba(114,9,183,0.05) 100%)',
  blueGradient:
    'linear-gradient(135deg, rgba(67,97,238,0.03) 0%, rgba(76,201,240,0.05) 100%)'
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48
};

export const typography = {
  fontFamily:
    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    md: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem' // 36px
  },
  fontWeights: {
    light: 300,
    regular: 400,
    medium: 500,
    semiBold: 600,
    bold: 700
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75
  }
};

export const borderRadius = {
  none: '0',
  sm: '0.125rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  full: '9999px'
};

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  glow: '0 0 15px rgba(67, 97, 238, 0.3)',
  purpleGlow: '0 0 15px rgba(114, 9, 183, 0.3)',
  neon: '0 0 10px rgba(76, 201, 240, 0.5), 0 0 20px rgba(76, 201, 240, 0.3), 0 0 30px rgba(76, 201, 240, 0.1)',
  card: '0 10px 20px rgba(0, 0, 0, 0.08), 0 0 6px rgba(0, 0, 0, 0.05)'
};

export const transitions = {
  fast: 'all 0.2s ease',
  normal: 'all 0.3s ease',
  slow: 'all 0.5s ease',
  spring: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  bounce: 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
};

export const animations = {
  fadeIn: 'fadeIn 0.5s ease-in-out',
  slideUp: 'slideUp 0.5s ease-in-out',
  pulse: 'pulse 2s infinite',
  float: 'float 3s ease-in-out infinite',
  shimmer: 'shimmer 1.5s infinite linear'
};

export const breakpoints = {
  xs: '480px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
};

export const zIndices = {
  behind: -1,
  base: 0,
  raised: 1,
  dropdown: 10,
  sticky: 100,
  overlay: 1000,
  modal: 1100,
  popover: 1200,
  tooltip: 1300
};

export default {
  colors,
  gradients,
  background,
  spacing,
  typography,
  borderRadius,
  shadows,
  transitions,
  animations,
  breakpoints,
  zIndices
};
