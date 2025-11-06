import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

// Pastikan inisialisasi Prisma Client menggunakan pola singleton
// agar tidak membuat instance baru setiap kali hot reload di development.
let prisma; //PrismaClient

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  // @ts-ignore
  if (!global.prisma) {
    // @ts-ignore
    global.prisma = new PrismaClient();
  }
  // @ts-ignore
  prisma = global.prisma;
}

export async function GET(req) {
  const newDesign = await prisma.canvasDesign.findMany({
    where: {
      is_active: true,
    },
  });

  // Kirim respons sukses
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
