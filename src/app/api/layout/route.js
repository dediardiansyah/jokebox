// import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

// let prisma;

// if (process.env.NODE_ENV === "production") {
//   prisma = new PrismaClient();
// } else {
//   if (!global.prisma) {
//     global.prisma = new PrismaClient();
//   }
//   prisma = global.prisma;
// }

export async function GET(req) {
  const newDesign = await prisma.canvasDesign.findMany({
    where: {
      is_active: true,
    },
  });

  return NextResponse.json({ data: newDesign, message: "Desain berhasil didapat dari database" }, { status: 200 });
  //   const url = new URL(request.url);
  //   const name = url.searchParams.get("name") || "world";

  //   return NextResponse.json({
  //     ok: true,
  //     message: `Hello ${name} from Next.js route`,
  //     path: url.pathname,
  //     timestamp: new Date().toISOString(),
  //   });
}
