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
  async headers() {
    return [
      {
        source: "/:path*\\.(svg|jpg|jpeg|png|webp|avif|ico|woff|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Old WordPress destinations pages
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
      // WordPress system URLs — redirect to homepage
      {
        source: "/wp-admin",
        destination: "/",
        permanent: true,
      },
      {
        source: "/wp-admin/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/wp-login.php",
        destination: "/",
        permanent: true,
      },
      {
        source: "/wp-content/:path*",
        destination: "/",
        permanent: false,
      },
      {
        source: "/feed",
        destination: "/",
        permanent: true,
      },
      {
        source: "/feed/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/author/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/category/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/tag/:path*",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
