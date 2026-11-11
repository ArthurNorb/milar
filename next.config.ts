import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // sharp usa binários nativos; não deve ser empacotado.
  serverExternalPackages: ["sharp"],
  async redirects() {
    return [
      { source: "/portfolio", destination: "/projetos", permanent: true },
    ];
  },
  images: {
    // Menos larguras = menos variantes geradas pelo sharp na VPS.
    deviceSizes: [640, 828, 1200, 1920],
    imageSizes: [128, 256, 384],
    qualities: [75],
    // Uploads têm nome UUID imutável, então o TTL longo é seguro.
    minimumCacheTTL: 2678400,
    // Limita o cache de imagens otimizadas em disco (padrão: 50% do disco livre).
    maximumDiskCacheSize: 500_000_000,
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
