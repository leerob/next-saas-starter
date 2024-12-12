import type { NextConfig } from 'next';
require('./lib/env');

const nextConfig: NextConfig = {
  experimental: {
    ppr: true,
  },
};

export default nextConfig;
