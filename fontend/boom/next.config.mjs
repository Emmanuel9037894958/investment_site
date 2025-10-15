/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost/investment_site/api/:path*', // your PHP backend
      },
    ];
  },
};

export default nextConfig;
