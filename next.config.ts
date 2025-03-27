import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    file: '.env.development'
  },
  images: {
    remotePatterns: [
      {
        // https://www.pexels.com/photo/clear-glass-footed-drinking-glass-with-orange-juice-338713/
        protocol: 'https',
        hostname: 'www.pexels.com',
        port: '',
        pathname: '/photo/clear-glass-footed-drinking-glass-with-orange-juice-338713/',
        search: '',
      },
    ],
  },
};

export default nextConfig;
