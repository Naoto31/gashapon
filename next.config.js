/**
 * @format
 * @type {import('next').NextConfig}
 */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    REACT_APP_PINATA_KEY: process.env.REACT_APP_PINATA_KEY,
    REACT_APP_PINATA_SECRET: process.env.REACT_APP_PINATA_SECRET,
  },
}

module.exports = nextConfig
