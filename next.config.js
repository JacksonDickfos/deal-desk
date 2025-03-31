/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  distDir: '.next',
  publicRuntimeConfig: {
    staticFolder: '/static',
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.(png|jpg|gif|svg)$/i,
      type: 'asset/resource',
      generator: {
        filename: 'static/[path][name][ext]'
      }
    });
    return config;
  },
}

module.exports = nextConfig 