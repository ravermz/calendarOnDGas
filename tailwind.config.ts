import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0A84FF',
          light: '#5AC8FA',
          dark: '#007AFF',
        },
        accent: {
          DEFAULT: '#FF453A',
          light: '#FF6961',
          dark: '#D32F2F',
        },
        background: {
          DEFAULT: '#1C1C1E',
          dark: '#2C2C2E',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#8E8E93',
        },
        border: {
          DEFAULT: '#3A3A3C',
        },
      },
    },
  },  
  plugins: [],
}
export default config
