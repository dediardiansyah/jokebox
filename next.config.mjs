/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  outputFileTracingIncludes: {
    "/api/*/": ["./node_modules/.prisma/client/*/"],
    "/": ["./node_modules/.prisma/client//"],
  },
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "prisma"],
  },
};

export default nextConfig;
