"use client";
import dynamic from "next/dynamic";
import { Suspense } from 'react';
import Head from 'next/head';

const MixtapeClient = dynamic(() => import("./MixtapeClient"), { ssr: false });

export default function MixtapePage() {
  return (
    <Suspense fallback={<div className="text-indigo-500 text-lg font-semibold animate-pulse">Loading mixtape...</div>}>
      <MixtapeClient />
    </Suspense>
  );
}

// Removed duplicate MixtapeClient definition from page.jsx
