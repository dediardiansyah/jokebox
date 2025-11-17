// import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

// import { prisma } from "@/lib/prisma";
import prisma from "@/lib/prisma";

// let prisma;

// if (process.env.NODE_ENV === "production") {
//   prisma = new PrismaClient();
// } else {
//   if (!global.prisma) {
//     global.prisma = new PrismaClient();
//   }
//   prisma = global.prisma;
// }

/**
 * Handler untuk menyimpan data kanvas ke database PostgreSQL.
 * Endpoint: /api/save-canvas
 */
// export default async function handler(
//   req, //: NextApiRequest,
//   res //: NextApiResponse
// ) {
//   // Hanya izinkan metode POST
//   console.log(req.method);

//   if (req.method !== "POST") {
//     return res.status(405).json({ message: "Metode Tidak Diizinkan. Hanya POST yang didukung." });
//   }

//   // Ambil data dari body permintaan
//   const { name, data, description, imageurl, price } = req.body;

//   // Validasi dasar
//   if (!name || !data) {
//     return res.status(400).json({ message: "Judul dan data kanvas diperlukan." });
//   }

//   // Pastikan data adalah objek JSON yang valid (Prisma akan menanganinya,
//   // tetapi validasi sisi ini membantu).
//   if (typeof data !== "object") {
//     return res.status(400).json({ message: "Data kanvas harus berupa objek JSON yang valid." });
//   }

//   try {
//     // Gunakan Prisma Client untuk membuat catatan baru
//     const newDesign = await prisma.canvasDesign.create({
//       data: {
//         name: name, //as string
//         data: data, // Prisma secara otomatis memetakan objek JavaScript ke tipe Json PostgreSQL
//         description: description,
//         imageurl: imageurl,
//         price: price,
//       },
//     });

//     // Kirim respons sukses
//     return res.status(201).json({
//       message: "Desain berhasil disimpan ke database.",
//       designId: newDesign.id,
//       name: newDesign.name,
//       createdAt: newDesign.createdAt,
//     });
//   } catch (error) {
//     console.error("Kesalahan Database saat menyimpan desain:", error);
//     return res.status(500).json({
//       message: "Gagal menyimpan desain karena kesalahan internal server.",
//       error: error.message, //as Error
//     });
//   }
// }

export async function POST(req, res) {
  //   const config = {
  //     api: {
  //       bodyParser: false,
  //     },
  //   };

  //   const body = await req.json(); // Parses the JSON body
  //   console.log("Received body:", body);

  // Hanya izinkan metode POST
  //   console.log(req.method);

  if (req.method !== "POST") {
    // return res.status(405).json({ message: "Metode Tidak Diizinkan. Hanya POST yang didukung." });
    return NextResponse.json({ message: "Metode Tidak Diizinkan. Hanya POST yang didukung" }, { status: 405 });
  }

  // Ambil data dari body permintaan
  const { name, data, description, imageurl, price } = await req.json(); //req.body;

  // Validasi dasar
  if (!name || !data) {
    console.log(name);
    console.log(data);

    // return res.status(400).json({ message: "Judul dan data kanvas diperlukan." });
    return NextResponse.json({ message: "Judul dan data kanvas diperlukan" }, { status: 400 });
  }

  // Pastikan data adalah objek JSON yang valid (Prisma akan menanganinya,
  // tetapi validasi sisi ini membantu).
  if (typeof data !== "object") {
    // return res.status(400).json({ message: "Data kanvas harus berupa objek JSON yang valid." });
    return NextResponse.json({ message: "Data kanvas harus berupa objek JSON yang valid" }, { status: 400 });
  }

  try {
    // Gunakan Prisma Client untuk membuat catatan baru
    const newDesign = await prisma.canvasDesign.create({
      data: {
        name: name, //as string
        data: data, // Prisma secara otomatis memetakan objek JavaScript ke tipe Json PostgreSQL
        description: description,
        imageurl: imageurl,
        price: price,
      },
    });

    // Kirim respons sukses
    return NextResponse.json(
      { message: "Desain berhasil disimpan ke database", designId: newDesign.id, name: newDesign.name, createdAt: newDesign.createdAt },
      { status: 200 }
    );
    // return res.status(201).json({
    //   message: "Desain berhasil disimpan ke database.",
    //   designId: newDesign.id,
    //   name: newDesign.name,
    //   createdAt: newDesign.createdAt,
    // });
  } catch (error) {
    console.error("Kesalahan Database saat menyimpan desain:", error);
    return NextResponse.json({ message: "Gagal menyimpan desain karena kesalahan internal server", error: error.message }, { status: 500 });
    // return res.status(500).json({
    //   message: "Gagal menyimpan desain karena kesalahan internal server.",
    //   error: error.message, //as Error
    // });
  }

  //   const { token } = req.body;
  //   try {
  //     const response = await axios.post(
  //       `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY}&response=${token}`,
  //       {},
  //       { headers: { "Content-Type": "application/x-www-form-urlencoded; charset=utf-8" } }
  //     );
  //     if (response.data.success) {
  //       return NextResponse.json({ message: "reCAPTCHA verification successful" });
  //     } else {
  //       return NextResponse.json({ message: "reCAPTCHA verification failed" });
  //     }
  //   } catch (err) {
  //     return NextResponse.json({ message: "Internal server error" });
  //   }
}
