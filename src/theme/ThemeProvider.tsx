import React, { ReactNode } from 'react';

// Simple theme provider component that just passes children through
// The actual theming is done through CSS variables in global.css
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return <>{children}</>;
};

export default ThemeProvider;
