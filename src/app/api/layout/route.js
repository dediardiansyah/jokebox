import { NextResponse } from "next/server";
import { CanvasDesignService } from "@/services";

export async function GET() {
  try {
    // Gunakan service layer untuk mendapatkan semua desain
    const designs = await CanvasDesignService.findAll();

    return NextResponse.json(
      { data: designs, message: "Desain berhasil didapat dari database" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching designs:", error);
    return NextResponse.json(
      { message: "Gagal mengambil desain dari database", error: error.message },
      { status: 500 }
    );
  }
}
