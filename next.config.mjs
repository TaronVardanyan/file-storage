/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'limitless-chickadee-146.convex.cloud',
      },
    ],
  },
};

export default nextConfig;
