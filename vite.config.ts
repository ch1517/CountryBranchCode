import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import path from "path";

export default defineConfig({
  plugins: [
		react(),
		checker({
			typescript: true,
			eslint: {
				lintCommand: 'eslint',
				dev: {
					logLevel: ['error', 'warning'],
				},
			},
		}),
	],
  define: {
    'process.env': {}
  },
	resolve: {
		alias: [
			{ find: "~", replacement: path.resolve(__dirname, "src") },
		],
	},
});
