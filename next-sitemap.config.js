module.exports = {
  siteUrl: 'https://moodplay-next.vercel.app',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/api', '/internal'] },
    ],
  },
  exclude: ['/api/*', '/internal/*'],
};
