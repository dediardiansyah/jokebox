/** @type {import('next').NextConfig} */

const path = require("path");

const nextConfig = {
  /* config options here */
  // outputFileTracingIncludes: {
  //   "/api/*/": ["./node_modules/.prisma/client/*/"],
  //   "/": ["./node_modules/.prisma/client//"],
  // },
  experimental: {
    //outputFileTracingRoot gotta get the non package prisma-generated/
    outputFileTracingRoot: path.join(__dirname, ".."),
  },
  // experimental: {
  //   optimizePackageImports: ["@prisma/client"],
  //   serverComponentsExternalPackages: ["@prisma/client", "prisma"],
  // },
};

export default nextConfig;
