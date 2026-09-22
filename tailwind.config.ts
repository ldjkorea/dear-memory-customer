import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          50: '#FAF8F5',
          100: '#F5F1EA',
          200: '#EBE3D5',
          300: '#DDD1BD',
          400: '#C7B698',
          500: '#B09A74',
          600: '#8F7A56',
          700: '#6E5C3D',
          800: '#4E412A',
          900: '#322A1B',
        },
      },
      fontFamily: {
        serif: ['Pretendard', 'Noto Serif KR', 'serif'],
        sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
