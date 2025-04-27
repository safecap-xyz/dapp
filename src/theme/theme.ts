// Theme configuration for SafeCap
export const theme = {
  // Color palette
  colors: {
    primary: {
      main: '#0A2463',      // Rich deep blue (header/footer background)
      light: '#3E5C97',
      dark: '#041542',
      contrast: '#ffffff',  // Text color on primary background
    },
    secondary: {
      main: '#1E88E5',      // Vibrant blue for buttons, links
      light: '#6AB7FF',
      dark: '#005CB2',
      contrast: '#ffffff',  // Text color on secondary background
    },
    accent: {
      main: '#FFD166',      // Vibrant gold for accents and highlights
      light: '#FFDD8C',
      dark: '#E5B93D',
      contrast: '#000000',  // Text color on accent background
    },
    success: {
      main: '#4caf50',
      light: '#80e27e',
      dark: '#087f23',
      contrast: '#ffffff',
    },
    warning: {
      main: '#ff9800',
      light: '#ffc947',
      dark: '#c66900',
      contrast: '#000000',
    },
    error: {
      main: '#f44336',
      light: '#ff7961',
      dark: '#ba000d',
      contrast: '#ffffff',
    },
    neutral: {
      main: '#f5f5f5',      // Light gray for backgrounds
      light: '#ffffff',
      dark: '#e0e0e0',
      contrast: '#000000',  // Text color on neutral background
    },
    text: {
      primary: '#212121',   // Main text color
      secondary: '#757575', // Secondary text color
      disabled: '#9e9e9e',  // Disabled text color
      hint: '#9e9e9e',      // Hint text color
    },
  },
  
  // Typography
  typography: {
    fontFamily: {
      primary: "'Montserrat', sans-serif",
      secondary: "'Playfair Display', serif",
      mono: "'Fira Code', monospace",
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
  
  // Shadows
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  
  // Transitions
  transitions: {
    default: '0.3s ease',
    fast: '0.15s ease',
    slow: '0.5s ease',
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
