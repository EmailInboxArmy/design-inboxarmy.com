import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable experimental features for better SSR
  // experimental: {
  //   // Improve server components stability
  //   serverComponentsExternalPackages: ['@apollo/client'],
  // },

  serverExternalPackages: ['@apollo/client', 'puppeteer'],

  // Configure images
  images: {
    domains: ['design-backend.inboxarmy.com'],
  },

  // Add build-time optimizations
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Disable static generation for problematic pages
  experimental: {
    // This will make pages render on-demand instead of at build time
    workerThreads: false,
    cpus: 1,
    serverComponentsExternalPackages: ['puppeteer'],
  },

  // Add webpack configuration for better error handling
  webpack: (config, { isServer, dev }) => {
    if (isServer) {
      // Add fallbacks for server-side rendering
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // Handle Puppeteer in production
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },

  // Add error handling for build failures
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
};

export default nextConfig;