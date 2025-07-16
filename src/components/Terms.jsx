import React from "react";

export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow mt-8">
      <h1 className="text-3xl font-bold text-indigo-500 mb-4 text-center">Terms of Service</h1>
      <p className="text-gray-700 mb-4 text-left">
        By using MoodPlay, you agree to abide by all applicable laws and regulations. The content and features provided are for personal, non-commercial use only. We reserve the right to update these terms at any time.
      </p>
      <ul className="list-disc pl-6 text-gray-700 mb-4 text-left">
        <li>No abusive or illegal activity.</li>
        <li>Respect other users and their suggestions.</li>
        <li>We do not guarantee the accuracy of game information.</li>
      </ul>
      <p className="text-gray-700 text-left">
        For questions about these terms, please contact us at <a href="mailto:contact@moodplay.app" className="text-indigo-500 underline">contact@moodplay.app</a>.
      </p>
    </div>
  );
}