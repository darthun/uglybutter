import withBundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzerWrapper = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    granularChunks: true
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
  webpack: (config, { isServer }) => {
    // Additional webpack optimizations can go here
    return config;
  },
};

export default withBundleAnalyzerWrapper(nextConfig);