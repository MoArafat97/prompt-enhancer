const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  buildExcludes: [/middleware-manifest\.json$/],
  disable: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
  },
  output: 'standalone',
  trailingSlash: false,
  webpack: (config, { isServer }) => {
    // Fix for Firebase and other client-side only packages
    if (isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }

    // Exclude Firebase from server-side bundle
    config.externals = config.externals || [];
    if (isServer) {
      config.externals.push({
        'firebase/app': 'commonjs firebase/app',
        'firebase/auth': 'commonjs firebase/auth',
        'firebase/firestore': 'commonjs firebase/firestore',
        'firebase/analytics': 'commonjs firebase/analytics',
      });
    }

    return config;
  },
  experimental: {
    esmExternals: 'loose',
  },
};

module.exports = withPWA(nextConfig);
