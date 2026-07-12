import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow common placeholder and external image hosts used in mock data
    domains: ["picsum.photos", "images.unsplash.com", "image.tmdb.org", "m.media-amazon.com", "media.discordapp.net"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media.discordapp.net",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
