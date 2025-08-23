/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/**/*.{js,ts,jsx,tsx}",
        "./maven-resources/**/*.{html,ftl}",
    ],
    theme: {
        extend: {},
    },
    plugins: [
        require('tailwind-scrollbar')({ nocompatible: true }),
    ],
}
