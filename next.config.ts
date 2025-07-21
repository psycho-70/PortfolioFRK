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
 
  
}

export default nextConfig