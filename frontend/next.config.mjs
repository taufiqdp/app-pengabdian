/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "is3.cloudhost.id",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
