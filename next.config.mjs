/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	images: {
		domains: [
			'media.rawg.io',
			'steamcdn-a.akamaihd.net',
			'moodplay.app',
			'avatars.githubusercontent.com',
			'lh3.googleusercontent.com',
			'cdn.cloudflare.steamstatic.com',
			'images.unsplash.com',
		],
	},
};
export default nextConfig;
