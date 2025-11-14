"use client";

import { useAuth } from '@/components/AuthProvider'; // Jika Anda menggunakan Context
import { redirect } from 'next/navigation';

export default function ProtectedLayout({ children }) {
    // Ini adalah fallback untuk Client-side jika Middleware gagal/lambat
    // Dalam Next.js App Router, Middleware yang utama.

    // Jika menggunakan Context API, Anda akan cek status di sini:
    // const { isAuthenticated, isLoading } = useAuth();

    // Jika Anda hanya mengandalkan Middleware + Server Component:
    // Pastikan rute ini hanya bisa diakses oleh user yang terotentikasi.

    // Jika Anda ingin Client-Side protection tambahan:
    // if (isLoading) return <div>Loading...</div>
    // if (!isAuthenticated) redirect('/login');

    return (
        <div>
            <header>Welcome to Dashboard!</header>
            <main>{children}</main>
        </div>
    );
}