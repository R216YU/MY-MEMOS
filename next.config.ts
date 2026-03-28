import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  reactCompiler: true,
  images: {
    unoptimized: true,
  },
  redirects() {
    return [
      {
        source: "/auth",
        destination: "/auth/posts",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
