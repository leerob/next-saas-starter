import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    ppr: true,
    newDevOverlay: true
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' 
  }
};

export default nextConfig;
