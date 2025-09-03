/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable service worker in development to prevent 404 errors
  async rewrites() {
    return [
      {
        source: '/sw.js',
        destination: '/api/sw-fallback',
      },
    ];
  },

  // Optimize for development performance
  ...(process.env.NODE_ENV === "development" && {
    // Reduce build time
    swcMinify: false,
    
    // Disable static optimization for faster rebuilds
    staticPageGenerationTimeout: 0,
  }),

  // Minimal caching in development
  async headers() {
    if (process.env.NODE_ENV === "development") {
      return [
        {
          source: "/(.*)",
          headers: [
            {
              key: "Cache-Control",
              value: "no-cache, no-store, max-age=0",
            },
          ],
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
