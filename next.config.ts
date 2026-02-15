import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cheapflightsfrom.us",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/destinations",
        destination: "/",
        permanent: true,
      },
      {
        source: "/destinations/:path*",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
