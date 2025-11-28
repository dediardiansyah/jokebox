import { NextResponse } from "next/server";
import { CanvasDesignService } from "@/services";

/**
 * Handler untuk menyimpan data kanvas ke database PostgreSQL.
 * Endpoint: /api/save-canvas
 */
export async function POST(req) {
  // Ambil data dari body permintaan
  const { name, data, description, image_url, price } = await req.json();

  // Validasi dasar
  if (!name || !data) {
    return NextResponse.json(
      { message: "Judul dan data kanvas diperlukan" },
      { status: 400 }
    );
  }

  // Pastikan data adalah objek JSON yang valid
  if (typeof data !== "object") {
    return NextResponse.json(
      { message: "Data kanvas harus berupa objek JSON yang valid" },
      { status: 400 }
    );
  }

  try {
    // Gunakan service layer untuk membuat desain
    const savedDesign = await CanvasDesignService.create({
      name,
      data,
      description: description || null,
      image_url: image_url || null,
      price: price || 0,
    });

    // Kirim respons sukses
    return NextResponse.json(
      {
        message: "Desain berhasil disimpan ke database",
        designId: savedDesign.id,
        name: savedDesign.name,
        created_at: savedDesign.created_at,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Kesalahan Database saat menyimpan desain:", error);
    return NextResponse.json(
      {
        message: "Gagal menyimpan desain karena kesalahan internal server",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
