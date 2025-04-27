import { createContext } from 'react';
import { theme, Theme } from './theme';

// Create a context for the theme
export const ThemeContext = createContext<Theme>(theme);

export default ThemeContext;
