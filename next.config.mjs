/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  outputFileTracingIncludes: {
    "/api/*/": ["./node_modules/.prisma/client/*/"],
    "/": ["./node_modules/.prisma/client//"],
  },
};

export default nextConfig;
