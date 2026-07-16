/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  transpilePackages: ['@splinetool/react-spline', '@splinetool/runtime'],
};

module.exports = nextConfig;
