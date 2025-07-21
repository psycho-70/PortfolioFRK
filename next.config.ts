import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Add these configurations for better build output
  output: 'standalone', // Recommended for Vercel deployments
  distDir: '.next',
  // Enable proper CSS handling
  experimental: {
    optimizeCss: true,
  },
  // Webpack configuration to ensure all files are included
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(css)$/,
      use: ['style-loader', 'css-loader', 'postcss-loader']
    });
    return config;
  }
}

export default nextConfig