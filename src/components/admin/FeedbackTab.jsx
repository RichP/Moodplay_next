"use client";

export default function FeedbackTab({ feedback, loadingFeedback, handleDeleteFeedback }) {
  return (
    <div className="mb-10">
      <h3 className="text-lg font-semibold mb-2">User Feedback</h3>
      {loadingFeedback ? (
        <div className="flex justify-center p-4">
          <div className="text-indigo-500">Loading feedback...</div>
        </div>
      ) : feedback.length === 0 ? (
        <div className="text-gray-500 p-4 text-center">No feedback submissions yet.</div>
      ) : (
        <ul className="space-y-4">
          {feedback.map((item) => (
            <li key={item.id} className="bg-white rounded-lg shadow border p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="font-semibold text-indigo-700">{item.name}</div>
                <button
                  onClick={() => handleDeleteFeedback(item.id)}
                  className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
              <div className="text-xs text-gray-500 mb-2">Email: {item.email}</div>
              <div className="text-gray-700 whitespace-pre-line">{item.message}</div>
              <div className="text-xs text-gray-400 mt-2">
                {new Date(item.createdAt).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
