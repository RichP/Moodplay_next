import React from "react";

export const metadata = {
  title: "Privacy Policy | Moodplay",
  description: "Read the privacy policy for the Moodplay app.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4">
        Moodplay (“we”, “us”, or “our”) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use the Moodplay app and website.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2">Information We Collect</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>We do not require you to create an account or provide personal information to use Moodplay.</li>
        <li>We may collect anonymous usage data to improve app performance and user experience.</li>
        <li>If you contact us for support, we may receive the information you provide through our feedback/contact form.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-2">How We Use Information</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>To operate and improve the Moodplay app and website.</li>
        <li>To respond to your support requests submitted via our feedback/contact form.</li>
        <li>To analyze usage trends and app performance (in aggregate, non-personal form).</li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-2">Data Sharing</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>We do not sell, trade, or share your personal information with third parties.</li>
        <li>We may share anonymous, aggregated data for analytics or reporting purposes.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-2">Children’s Privacy</h2>
      <p className="mb-4">
        Moodplay is not intended for children under 13. We do not knowingly collect personal information from children.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2">Contact Us</h2>
      <p className="mb-4">
        If you have any questions about this Privacy Policy, please use the feedback/contact form within the Moodplay app or website. We will respond to your inquiry as soon as possible.
      </p>
      <p className="text-sm text-gray-500 mt-8">
        Last updated: July 29, 2025
      </p>
    </main>
  );
}
