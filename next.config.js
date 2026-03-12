/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  experimental: {
    outputFileTracingRoot: undefined,
  },
}

module.exports = nextConfig
