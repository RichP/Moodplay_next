import NavBar from '../components/NavBar';
import PageTransition from '../components/PageTransition';
import Footer from '../components/Footer';
import "./globals.css";

export const metadata = {
  title: "MoodPlay",
  description: "Find games to match your mood",
  openGraph: {
    title: "MoodPlay",
    description: "Find games to match your mood",
    url: "https://yourdomain.com",
    siteName: "MoodPlay",
    images: [
      {
        url: "/android-chrome-512x512.png", // Path in public/
        width: 512,
        height: 512,
        alt: "MoodPlay Logo",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MoodPlay",
    description: "Find games to match your mood",
    images: ["/android-chrome-512x512.png"],
    creator: "@yourtwitter",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "manifest",
        url: "/site.webmanifest",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="max-w-6xl mx-auto p-8 font-nunito bg-gradient-to-br from-indigo-50 to-slate-200 rounded-xl shadow-lg">
          <NavBar />
          <main id="main-content" tabIndex={-1} aria-label="Main Content">
            <div className="max-w-6xl mx-auto p-4 md:p-8 pt-4">
              {children}
            </div>
          </main>
          <Footer />
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
      </body>
    </html>
  );
}
