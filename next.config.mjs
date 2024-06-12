/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: (config) => {
		config.resolve.fallback = { fs: false, net: false, tls: false };
		config.externals.push(
			'pino-pretty',
			'lokijs',
			'encoding',
			'bufferutil',
			'utf-8-validate'
		);
		return config;
	},
	experimental: {
		appDir: true,
	},
};

export default nextConfig;
