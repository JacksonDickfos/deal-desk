/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone', // Forces static file serving for images
  images: {
    domains: [
      process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', ''),
      'api.dicebear.com'
    ].filter(Boolean),
  }
}

module.exports = nextConfig 