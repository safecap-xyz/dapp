// Theme configuration for SafeCap
export const theme = {
  // Color palette - Futuristic Cyberpunk Theme
  colors: {
    primary: {
      main: '#0B0E2D',      // Deep space blue (header/footer background)
      light: '#1E2359',
      dark: '#050718',
      contrast: '#ffffff',  // Text color on primary background
    },
    secondary: {
      main: '#00C2FF',      // Neon blue for buttons, links
      light: '#5EDFFF',
      dark: '#0097C4',
      contrast: '#000000',  // Text color on secondary background
    },
    accent: {
      main: '#FF00E4',      // Vibrant magenta for accents and highlights
      light: '#FF5EEF',
      dark: '#B100A0',
      contrast: '#ffffff',  // Text color on accent background
    },
    success: {
      main: '#00FF9D',
      light: '#66FFCA',
      dark: '#00B36F',
      contrast: '#000000',
    },
    warning: {
      main: '#FFB800',
      light: '#FFCF4D',
      dark: '#CC9400',
      contrast: '#000000',
    },
    error: {
      main: '#FF3D71',
      light: '#FF7A9E',
      dark: '#C30046',
      contrast: '#ffffff',
    },
    neutral: {
      main: '#121212',      // Dark background for futuristic look
      light: '#1E1E1E',
      dark: '#080808',
      contrast: '#ffffff',  // Text color on neutral background
    },
    text: {
      primary: '#E0E0FF',   // Main text color - soft blue-white
      secondary: '#A0A0C0', // Secondary text color - muted blue-gray
      disabled: '#6A6A8A',  // Disabled text color - darker blue-gray
      hint: '#8080A0',      // Hint text color - medium blue-gray
    },
  },

  // Typography
  typography: {
    fontFamily: {
      primary: "'Orbitron', sans-serif",
      secondary: "'Rajdhani', sans-serif",
      mono: "'JetBrains Mono', monospace",
      system: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
    },
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    fontSize: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
    },
    lineHeight: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
  },

  // Spacing
  spacing: {
    xs: '0.25rem',  // 4px
    sm: '0.5rem',   // 8px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
    '2xl': '2.5rem', // 40px
    '3xl': '3rem',   // 48px
  },

  // Border radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',    // 2px
    md: '0.25rem',     // 4px
    lg: '0.5rem',      // 8px
    xl: '0.75rem',     // 12px
    '2xl': '1rem',     // 16px
    full: '9999px',
  },

  // Shadows - with neon glow effects
  shadows: {
    none: 'none',
    sm: '0 1px 3px 0 rgba(0, 194, 255, 0.1)',
    md: '0 4px 8px -1px rgba(0, 194, 255, 0.15), 0 2px 4px -1px rgba(0, 194, 255, 0.1)',
    lg: '0 8px 15px -3px rgba(0, 194, 255, 0.2), 0 4px 6px -2px rgba(0, 194, 255, 0.15)',
    xl: '0 15px 25px -5px rgba(0, 194, 255, 0.25), 0 10px 10px -5px rgba(0, 194, 255, 0.2)',
    neon: '0 0 5px rgba(0, 194, 255, 0.5), 0 0 20px rgba(0, 194, 255, 0.3)',
    neonAccent: '0 0 5px rgba(255, 0, 228, 0.5), 0 0 20px rgba(255, 0, 228, 0.3)',
  },

  // Transitions
  transitions: {
    default: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fast: '0.15s cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: '0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)',
  },
};

// Type definitions for the theme
export type Theme = typeof theme;

// Helper functions to access theme values
export const getColor = (colorPath: string): string => {
  const parts = colorPath.split('.');
  let result: Record<string, unknown> = theme.colors;

  for (const part of parts) {
    if (typeof result !== 'object' || result === null || !(part in result)) {
      console.warn(`Color path "${colorPath}" not found in theme`);
      return '';
    }
    result = result[part] as Record<string, unknown>;
  }

  return result as unknown as string;
};

export default theme;
