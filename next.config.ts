import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // sharp usa binários nativos; não deve ser empacotado.
  serverExternalPackages: ["sharp"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
