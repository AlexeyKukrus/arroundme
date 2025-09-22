import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		alias: {
			'@app/*': 'src/*',
			'@modules/*': 'src/modules/*',
			'@shared/*': 'src/shared/*',
			'@helpers/*': 'src/helpers/*',
			'@api/*': 'src/routes/api/*'
		}
	}
};

export default config;
