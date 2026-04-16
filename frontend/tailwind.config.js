/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',  // ✅ ativa dark mode via classe "dark" no html
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}