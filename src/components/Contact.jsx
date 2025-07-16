import React, { useState } from "react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    setSubmitted(true);
    // No preventDefault, so form will submit normally
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow mt-8">
      <h1 className="text-3xl font-bold text-indigo-500 mb-4">Contact / Feedback</h1>
      <p className="text-gray-700 mb-4">
        Have a suggestion or found a bug? Fill out the form below.
      </p>
      {submitted ? (
        <div className="text-green-600 font-semibold">Thank you for your feedback!</div>
      ) : (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit} action="https://formsubmit.co/richcpp+moodplay@googlemail.com" method="POST">
          <input
            type="text"
            required
            placeholder="Your name"
            className="border rounded px-4 py-2"
            name="name"
          />
          <input
            type="email"
            required
            placeholder="Your email"
            className="border rounded px-4 py-2"
            name="email"
          />
          <textarea
            required
            placeholder="Your message"
            className="border rounded px-4 py-2"
            name="message"
            rows={4}
          />
          <button
            type="submit"
            className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition"
          >
            Send Feedback
          </button>
        </form>
      )}
    </div>
  );
}