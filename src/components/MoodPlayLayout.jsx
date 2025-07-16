import React from 'react';
import './App.css';
import NavBar from './NavBar';
import { Outlet, Link } from "react-router-dom";
import PageTransition from "./PageTransition";

function MoodPlayLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-slate-200 p-8 font-nunito">
      <NavBar />
      <header
        className="sticky top-0 left-0 w-full bg-white z-10 border-b border-slate-200 text-center py-6 mb-6"
        role="banner"
        aria-label="MoodPlay Header"
      >
        <h1 className="text-5xl font-extrabold text-indigo-700 mb-4">MoodPlay</h1>
        <p className="text-lg text-gray-700 mb-2">Find games to match your mood</p>
      </header>
      <main id="main-content" tabIndex={-1} aria-label="Main Content">
        <div className="max-w-6xl mx-auto p-4 md:p-8 pt-4">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </div>
      </main>
      <footer
        className="w-full bg-white border-t border-slate-200 mt-12 py-6"
        role="contentinfo"
        aria-label="Footer"
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-4">
          <div className="text-gray-700 text-sm mb-2 md:mb-0">
            &copy; {new Date().getFullYear()} MoodPlay. All rights reserved.
          </div>
          <nav aria-label="Footer Navigation">
            <ul className="flex gap-4 text-sm">
              <li>
                <Link to="/terms" className="text-indigo-700 hover:underline focus:outline focus:outline-2 focus:outline-indigo-700">Terms</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-indigo-700 hover:underline focus:outline focus:outline-2 focus:outline-indigo-700">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/contact" className="text-indigo-700 hover:underline focus:outline focus:outline-2 focus:outline-indigo-700">Contact</Link>
              </li>
              <li>
                <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-700 hover:underline focus:outline focus:outline-2 focus:outline-indigo-700">Twitter</a>
              </li>
            </ul>
          </nav>
        </div>
      </footer>
      <style>
        {`
          @keyframes fadeIn {
            to { opacity: 1; }
          }
          .animate-fade-in {
            opacity: 0;
            animation: fadeIn 0.6s forwards;
          }
        `}
      </style>
    </div>
  );
}

export default MoodPlayLayout;
