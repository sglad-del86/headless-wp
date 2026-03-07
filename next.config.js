/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cms.project8change.com',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;
