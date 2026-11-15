import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
	index('routes/home.tsx'),
	route('sitemap.xml', 'routes/sitemap.xml.ts'),
	route('robots.txt', 'routes/robots.txt.ts'),
	route('api/health', 'routes/api.health.ts'),
	route('api/analyze', 'routes/api.analyze.ts'),
	route('api/analyze/stream', 'routes/api.analyze.stream.ts'),
	// All analysis is request-only; no input text is persisted.
	route('api/*', 'routes/api.$.ts'),
] satisfies RouteConfig;
