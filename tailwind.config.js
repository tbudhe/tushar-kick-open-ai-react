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
    themes: ["light", "dark"],
    darkMode: "class",
  },
}
