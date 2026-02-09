import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable Turbopack for faster builds (Next.js 16+)
  turbopack: {},
  
  // External packages configuration (updated for Next.js 16)
  serverExternalPackages: [],
  
  // Production optimizations
  poweredByHeader: false,
  compress: true,
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      }
    ],
    formats: ['image/webp', 'image/avif']
  },
  
  // Security headers
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'microphone=(self), camera=(), geolocation=()'
          }
        ]
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 's-maxage=0, stale-while-revalidate'
          }
        ]
      }
    ];
  },
  
  // Build output optimization for Vercel
  output: 'standalone',
  
  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Disable telemetry for builds
  telemetry: {
    enabled: false
  }
};

export default nextConfig;
