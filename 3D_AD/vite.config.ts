import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
	plugins: [viteSingleFile()],
	build: {
		assetsInlineLimit: 100000000, // Forces Vite to turn all textures/images into Base64 strings directly in the HTML file
		cssCodeSplit: false,
		rollupOptions: {
			output: {
				inlineDynamicImports: true,
			},
		},
	},
})