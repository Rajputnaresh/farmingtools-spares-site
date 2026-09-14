/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Mukta', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        brand: {
          green: "#1b7a43",
          deep: "#14532d",
          night: "#0e3d22",
          tint: "#e9f4ed",
          amber: "#f0b429",
          amberInk: "#3d2c00",
        },
        ink: {
          DEFAULT: "#1c2420",
          body: "#3d4a42",
          muted: "#5f6f66",
          label: "#63736a",
        },
        hairline: {
          DEFAULT: "#dbe7de",
          light: "#eef2ee",
        },
        page: "#f6f8f5",
        whatsapp: "#25d366",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        control: '12px',
        tile: '12px',
        card: '14px',
        xl: '0.75rem',
        '2xl': '1rem',
      }
    },
  },
  plugins: [],
}

