// import { PrismaClient } from "@prisma/client";
// const globalForPrisma = global as unknown as { prisma: PrismaClient };
// export const prisma = globalForPrisma.prisma || new PrismaClient();
// // if (process.env.NODE_ENV !== "production")
// globalForPrisma.prisma = prisma;

import { PrismaClient } from "@prisma/client";
//@ts-ignore
import { withPg } from '@prisma/adapter-pg';

let prisma;
if (!global.prisma) {
  global.prisma = new PrismaClient();
}
prisma = global.prisma;
export default prisma;
