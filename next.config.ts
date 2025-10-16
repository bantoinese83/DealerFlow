import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable ESLint during production builds to avoid blocking on lint errors
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Ignore TypeScript build errors to allow non-app code (e.g., Edge Functions) to coexist
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
