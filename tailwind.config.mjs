/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				serif: ['Crimson Text', 'serif'],
			},
			colors: {
				primary: '#000000',
				secondary: '#C2C0C0',
				tertiary: '#B7894E',
			},
		},
	},
	plugins: [],
}
