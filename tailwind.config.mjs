// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ['./index.html', './src/**/*.{html,js,jsx,ts,tsx,md}'],
//   theme: {
//     extend: {
//       colors: {
//         primary: {
//           50: 'var(--color-primary-50)',
//           100: 'var(--color-primary-100)',
//           200: 'var(--color-primary-200)',
//           300: 'var(--color-primary-300)',
//           400: 'var(--color-primary-400)',
//           500: 'var(--color-primary-500)',
//           600: 'var(--color-primary-600)',
//           700: 'var(--color-primary-700)',
//           800: 'var(--color-primary-800)',
//           900: 'var(--color-primary-900)',
//         },
//         secondary: {
//           50: 'var(--color-secondary-50)',
//           100: 'var(--color-secondary-100)',
//           200: 'var(--color-secondary-200)',
//           300: 'var(--color-secondary-300)',
//           400: 'var(--color-secondary-400)',
//           500: 'var(--color-secondary-500)',
//           600: 'var(--color-secondary-600)',
//           700: 'var(--color-secondary-700)',
//           800: 'var(--color-secondary-800)',
//           900: 'var(--color-secondary-900)',
//         },
//         accent: {
//           50: 'var(--color-accent-50)',
//           100: 'var(--color-accent-100)',
//           200: 'var(--color-accent-200)',
//           300: 'var(--color-accent-300)',
//           400: 'var(--color-accent-400)',
//           500: 'var(--color-accent-500)',
//           600: 'var(--color-accent-600)',
//           700: 'var(--color-accent-700)',
//           800: 'var(--color-accent-800)',
//           900: 'var(--color-accent-900)',
//         },
//       },
//       fontFamily: {
//         sans: ['Inter', 'system-ui', 'sans-serif'],
//         heading: ['Poppins', 'system-ui', 'sans-serif'],
//       },
//       animation: {
//         'fade-in': 'fadeIn 0.5s ease-in-out',
//         'slide-up': 'slideUp 0.3s ease-out',
//       },
//       keyframes: {
//         fadeIn: {
//           '0%': { opacity: '0' },
//           '100%': { opacity: '1' },
//         },
//         slideUp: {
//           '0%': { transform: 'translateY(10px)', opacity: '0' },
//           '100%': { transform: 'translateY(0)', opacity: '1' },
//         },
//       },
//     },
//   },
//   plugins: [],
// };





/** @type {import('tailwindcss').Config} */

const withOpacity = (variable) => {
  return `rgb(var(${variable}) / <alpha-value>)`;
};

export default {
  content: ['./index.html', './src/**/*.{html,js,jsx,ts,tsx,md}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: withOpacity('--color-primary-50'),
          100: withOpacity('--color-primary-100'),
          200: withOpacity('--color-primary-200'),
          300: withOpacity('--color-primary-300'),
          400: withOpacity('--color-primary-400'),
          500: withOpacity('--color-primary-500'),
          600: withOpacity('--color-primary-600'),
          700: withOpacity('--color-primary-700'),
          800: withOpacity('--color-primary-800'),
          900: withOpacity('--color-primary-900'),
        },
        secondary: {
          50: withOpacity('--color-secondary-50'),
          100: withOpacity('--color-secondary-100'),
          200: withOpacity('--color-secondary-200'),
          300: withOpacity('--color-secondary-300'),
          400: withOpacity('--color-secondary-400'),
          500: withOpacity('--color-secondary-500'),
          600: withOpacity('--color-secondary-600'),
          700: withOpacity('--color-secondary-700'),
          800: withOpacity('--color-secondary-800'),
          900: withOpacity('--color-secondary-900'),
        },
        accent: {
          50: withOpacity('--color-accent-50'),
          100: withOpacity('--color-accent-100'),
          200: withOpacity('--color-accent-200'),
          300: withOpacity('--color-accent-300'),
          400: withOpacity('--color-accent-400'),
          500: withOpacity('--color-accent-500'),
          600: withOpacity('--color-accent-600'),
          700: withOpacity('--color-accent-700'),
          800: withOpacity('--color-accent-800'),
          900: withOpacity('--color-accent-900'),
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
