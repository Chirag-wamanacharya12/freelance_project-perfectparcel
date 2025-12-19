import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove remote patterns as we are using local images
  images: {
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'images.unsplash.com',
    //   },
    // ],
  },
};

export default nextConfig;
