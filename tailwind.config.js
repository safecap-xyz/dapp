/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          main: 'var(--color-primary-main)',
          light: 'var(--color-primary-light)',
          dark: 'var(--color-primary-dark)',
          contrast: 'var(--color-primary-contrast)',
        },
        secondary: {
          main: 'var(--color-secondary-main)',
          light: 'var(--color-secondary-light)',
          dark: 'var(--color-secondary-dark)',
          contrast: 'var(--color-secondary-contrast)',
        },
        accent: {
          main: 'var(--color-accent-main)',
          light: 'var(--color-accent-light)',
          dark: 'var(--color-accent-dark)',
          contrast: 'var(--color-accent-contrast)',
        },
        success: {
          main: 'var(--color-success-main)',
        },
        warning: {
          main: 'var(--color-warning-main)',
        },
        error: {
          main: 'var(--color-error-main)',
        },
        neutral: {
          main: 'var(--color-neutral-main)',
          light: 'var(--color-neutral-light)',
          dark: 'var(--color-neutral-dark)',
          contrast: 'var(--color-neutral-contrast)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          disabled: 'var(--color-text-disabled)',
        },
      },
      fontFamily: {
        primary: ['var(--font-family-primary)'],
        secondary: ['var(--font-family-secondary)'],
        mono: ['var(--font-family-mono)'],
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
      borderRadius: {
        sm: 'var(--border-radius-sm)',
        md: 'var(--border-radius-md)',
        lg: 'var(--border-radius-lg)',
        xl: 'var(--border-radius-xl)',
      },
      spacing: {
        xs: 'var(--spacing-xs)',
        sm: 'var(--spacing-sm)',
        md: 'var(--spacing-md)',
        lg: 'var(--spacing-lg)',
        xl: 'var(--spacing-xl)',
      },
    },
  },
  plugins: [],
}
