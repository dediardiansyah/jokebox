// src/app/api/auth/login/route.js (App Router)
import { NextResponse } from "next/server";
import { serialize } from "cookie";

// Anggap ini adalah fungsi untuk memverifikasi kredensial di database
async function verifyUser(email, password) {
  // ... (Logika Database/ORM: cari user, bandingkan password, dll.)
  // Jika sukses, kembalikan data user dan token
  if (email === "test@example.com" && password === "password123") {
    return { success: true, token: "your_jwt_token_here", user: { name: "Test User" } };
  }
  return { success: false, message: "Invalid credentials" };
}

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    const result = await verifyUser(email, password);

    if (!result.success) {
      return NextResponse.json({ message: result.message }, { status: 401 });
    }

    // Buat cookie dengan token JWT
    const cookie = serialize("authToken", result.token, {
      httpOnly: true, // Untuk keamanan
      secure: process.env.NODE_ENV !== "development",
      maxAge: 60 * 60 * 24 * 7, // 1 minggu
      path: "/",
    });

    return NextResponse.json(
      { success: true, user: result.user, message: "Login successful" },
      {
        status: 200,
        headers: { "Set-Cookie": cookie }, // Set cookie di header
      }
    );
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
