/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./frontend/index.html",
    "./frontend/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        "primary-dark": "var(--color-primary-dark)",
        "primary-light": "var(--color-primary-light)",
        enterprise: {
          charcoal: {
            950: '#0d1117',
            900: '#111922',
            800: '#161f29',
            700: '#1b2733',
            600: '#1e2d3d',
          },
          steel: {
            700: '#374151',
            600: '#4b5563',
            500: '#6b7280',
            400: '#9ca3af',
            300: '#d1d5db',
          },
          teal: {
            700: '#0f766e',
            600: '#0d9488',
            500: '#14b8a6',
            400: '#a67c52',
            300: '#5eead4',
          },
          timber: {
            wheat: '#b78847',
            bark: '#3E2B23',
            rust: '#7D3A27',
          },
        },
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        timberland: {
          "primary": "#A67C52",
          "primary-content": "#fff8f0",
          "secondary": "#7D3A27",
          "secondary-content": "#f1e8e4",
          "accent": "#3E2B23",
          "accent-content": "#f1f5f9",
          "neutral": "#161f29",
          "neutral-content": "#94a3b8",
          "base-100": "#111922",
          "base-200": "#161f29",
          "base-300": "#1b2733",
          "base-content": "#f1f5f9",
          "info": "#3b82f6",
          "info-content": "#e0effe",
          "success": "#22c55e",
          "success-content": "#052e16",
          "warning": "#f59e0b",
          "warning-content": "#1c1001",
          "error": "#ef4444",
          "error-content": "#fef2f2",
        },
      },
    ],
    darkMode: "class",
  },
}
