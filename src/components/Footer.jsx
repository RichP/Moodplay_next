import Link from 'next/link';

import prisma from '../lib/prisma';

export default async function Footer() {
  let recentPosts = [];
  try {
    recentPosts = await prisma.blogPost.findMany({
      orderBy: { date: 'desc' },
      take: 3,
      select: { slug: true, title: true },
    });
  } catch (e) {
    // Optionally log error
    // console.error('Failed to load recent posts', e);
  }

  return (
    <footer
      className="w-full bg-white border-t border-slate-200 mt-12 py-6"
      role="contentinfo"
      aria-label="Footer"
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-6 md:flex-row md:items-start md:justify-between px-4">
        <div className="text-gray-700 text-sm mb-2 md:mb-0">
          &copy; {new Date().getFullYear()} MoodPlay. All rights reserved.
        </div>
        <nav aria-label="Footer Navigation">
          <ul className="flex gap-4 text-sm">
            <li>
              <Link href="/terms" className="text-indigo-700 hover:underline focus:outline focus:outline-2 focus:outline-indigo-700">Terms</Link>
            </li>
            <li>
              <Link href="/privacy" className="text-indigo-700 hover:underline focus:outline focus:outline-2 focus:outline-indigo-700">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/contact" className="text-indigo-700 hover:underline focus:outline focus:outline-2 focus:outline-indigo-700">Contact</Link>
            </li>
            <li>
              <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-700 hover:underline focus:outline focus:outline-2 focus:outline-indigo-700">Twitter</a>
            </li>
          </ul>
        </nav>
      </div>
      {/* Recent Articles Section - always below main row for better mobile UX */}
      <div className="max-w-6xl mx-auto px-4 mt-4">
        <h2 className="text-sm font-semibold text-gray-900 mb-2" id="recent-articles">Recent Articles</h2>
        <ul className="space-y-1" aria-labelledby="recent-articles">
          {recentPosts.length > 0 ? (
            recentPosts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-indigo-700 hover:underline focus:outline focus:outline-2 focus:outline-indigo-700 text-sm"
                >
                  {post.title}
                </Link>
              </li>
            ))
          ) : (
            <li className="text-gray-500 text-sm">No recent articles available.</li>
          )}
        </ul>
      </div>
    </footer>
  );
}
