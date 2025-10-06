/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tile.openstreetmap.org',
      },
    ],
  },
  // Optimize for production
  compress: true,
  poweredByHeader: false,
  // Reduce build output
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig
