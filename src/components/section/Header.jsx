'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="bg-white shadow">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="text-xl font-bold text-gray-900">
                        Jokebox
                    </Link>

                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700"
                    >
                        ☰
                    </button>

                    <div className={`${ isOpen ? 'block' : 'hidden' } md:flex space-x-8`}>
                        <Link href="/" className="text-gray-700 hover:text-gray-900">
                            Home
                        </Link>
                        <Link href="/dashboard" className="text-gray-700 hover:text-gray-900">
                            Dashboard
                        </Link>
                        <Link href="/dashboard/frame" className="text-gray-700 hover:text-gray-900">
                            Frame
                        </Link>
                        <Link href="/dashboard/frame/create" className="text-gray-700 hover:text-gray-900">
                            Create Frame
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
    );
}