import type { NextConfig } from "next";
import { hostname } from "os";

const nextConfig: NextConfig = {
  image: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
      },
    ],
  },
};

export default nextConfig;
