"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 w-full bg-white border-b border-slate-300 shadow-sm z-20"
      aria-label="Main Navigation"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="text-2xl font-bold text-indigo-800 focus:outline focus:outline-2 focus:outline-indigo-800"
          onClick={() => setMenuOpen(false)}
        >
          MoodPlay
        </Link>
        {/* Hamburger button (visible on mobile) */}
        <button
          className="md:hidden text-indigo-800 focus:outline focus:outline-2 focus:outline-indigo-800"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
            <path
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d={menuOpen
                ? "M6 18L18 6M6 6l12 12" // X icon
                : "M4 6h16M4 12h16M4 18h16" // Hamburger icon
              }
            />
          </svg>
        </button>
        {/* Navigation links */}
        <ul
          className={`flex-col gap-2 absolute top-full left-0 w-full bg-white shadow-md border-b border-slate-200 py-4 px-4 md:static md:flex md:flex-row md:gap-6 md:w-auto md:bg-transparent md:shadow-none md:border-none md:py-0 md:px-0 ${
            menuOpen ? "flex" : "hidden"
          } md:flex`}
        >
          <li>
            <Link
              href="/"
              className="block text-indigo-800 hover:text-indigo-900 font-medium px-2 py-2 focus:outline focus:outline-2 focus:outline-indigo-800"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/blog"
              className="block text-indigo-800 hover:text-indigo-900 font-medium px-2 py-2 focus:outline focus:outline-2 focus:outline-indigo-800"
              onClick={() => setMenuOpen(false)}
            >
              Blog
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="block text-indigo-800 hover:text-indigo-900 font-medium px-2 py-2 focus:outline focus:outline-2 focus:outline-indigo-800"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="block text-indigo-800 hover:text-indigo-900 font-medium px-2 py-2 focus:outline focus:outline-2 focus:outline-indigo-800"
              onClick={() => setMenuOpen(false)}
            >
              Contact / Feedback
            </Link>
          </li>
          <li>
            <Link
              href="/suggest"
              className="block text-indigo-800 hover:text-indigo-900 font-medium px-2 py-2 focus:outline focus:outline-2 focus:outline-indigo-800"
              onClick={() => setMenuOpen(false)}
            >
              Suggest a Game
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}