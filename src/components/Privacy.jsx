import React from "react";

export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow mt-8">
      <h1 className="text-3xl font-bold text-indigo-500 mb-4 text-center">Privacy Policy</h1>
      <p className="text-gray-700 mb-4 text-left">
        MoodPlay values your privacy. We do not collect personal information except what you provide in feedback or suggestions. Your data is never sold or shared with third parties.
      </p>
      <ul className="list-disc pl-6 text-gray-700 mb-4 text-left">
        <li>We use cookies only for basic site functionality.</li>
        <li>Feedback and suggestions are stored securely.</li>
        <li>You may request deletion of your data at any time.</li>
      </ul>
      <p className="text-gray-700 text-left">
        For privacy questions, please contact us at <a href="mailto:contact@moodplay.app" className="text-indigo-500 underline">contact@moodplay.app</a>.
      </p>
    </div>
  );
}