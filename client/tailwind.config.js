import tailwindAnimate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#94A3B8',
                secondary: '#FFFFFF',
                accent: '#92400E',
                background: '#F8FAFC',
                text: '#0F172A',
                cement: {
                    50: '#F8FAFC',
                    100: '#F1F5F9',
                    200: '#E2E8F0',
                    300: '#CBD5E1',
                    400: '#94A3B8',
                }
            }
        },
    },
    plugins: [
        tailwindAnimate
    ],
}
