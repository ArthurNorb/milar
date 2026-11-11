import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// CSP sem nonce: nonce obrigaria renderização dinâmica e mataria o cache das
// páginas públicas. 'unsafe-inline' em script-src é exigido pelo Next sem
// nonce; o resto (origens externas, frames, plugins, base, form) fica travado.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://images.unsplash.com",
  "font-src 'self'",
  "connect-src 'self'",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "frame-src 'none'",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  ...(isDev
    ? []
    : [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]),
];

const nextConfig: NextConfig = {
  // Gera .next/standalone (server.js + node_modules mínimos) para a imagem Docker.
  output: "standalone",
  poweredByHeader: false,
  // sharp usa binários nativos; não deve ser empacotado.
  serverExternalPackages: ["sharp"],
  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
      // Painel e login (/admin e /admin/**) nunca vão para cache compartilhado.
      {
        source: "/admin/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
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
