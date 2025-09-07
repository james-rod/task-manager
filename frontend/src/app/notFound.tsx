// src/app/not-found.tsx
"use client";

import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <p className="text-lg mt-2 text-gray-700">Oops! Page not found.</p>
      <Link
        href="/"
        className="mt-6 px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        Go Home
      </Link>
    </div>
  );
}
