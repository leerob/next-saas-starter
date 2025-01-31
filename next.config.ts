import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    ppr: true,
    newDevOverlay: true
  }
};

export default nextConfig;
