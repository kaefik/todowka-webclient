/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  productionBrowserSourceMaps: false,
  
  experimental: {
    optimizePackageImports: ['@tanstack/react-query', 'date-fns', 'zustand'],
  },
}

export default nextConfig
