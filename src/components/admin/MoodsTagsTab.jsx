"use client";

export default function MoodsTagsTab({ 
  moods,
  moodEditId,
  moodEditValue,
  tagEditId,
  tagEditValue,
  addingTagMoodId,
  newTagValue,
  setMoodEditValue,
  saveMoodEdit,
  cancelMoodEdit,
  startMoodEdit,
  deleteMood,
  setTagEditValue,
  saveTagEdit,
  cancelTagEdit,
  startTagEdit,
  deleteTag,
  setNewTagValue,
  saveNewTag,
  cancelAddTag,
  startAddTag,
  fetchMoods
}) {

  return (
    <div className="mb-10">
      <h3 className="text-lg font-semibold mb-2">Moods & Tags</h3>
      <ul>
        {moods.map(mood => (
          <li key={mood.id} className="mb-4 border-b pb-2">
            <div className="flex items-center gap-2">
              {moodEditId === mood.id ? (
                <>
                  <input value={moodEditValue} onChange={e => setMoodEditValue(e.target.value)} className="border p-1" />
                  <button onClick={() => saveMoodEdit(mood.id)} className="bg-green-500 text-white px-2 py-1 rounded">Save</button>
                  <button onClick={cancelMoodEdit} className="bg-gray-400 text-white px-2 py-1 rounded">Cancel</button>
                </>
              ) : (
                <>
                  <span className="font-semibold text-indigo-600">{mood.mood}</span>
                  <button onClick={() => startMoodEdit(mood)} className="bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
                  <button onClick={() => deleteMood(mood.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                </>
              )}
            </div>
            {/* Show tags only when editing this mood */}
            {moodEditId === mood.id && (
              <div className="ml-4 mt-2">
                <span className="font-medium">Tags:</span>
                <ul className="flex flex-col gap-2 mt-1">
                  {mood.tags.map(tag => (
                    <li key={tag.id} className="flex items-center gap-2">
                      {tagEditId === tag.id ? (
                        <>
                          <input value={tagEditValue} onChange={e => setTagEditValue(e.target.value)} className="border p-1" />
                          <button onClick={() => saveTagEdit(tag.id)} className="bg-green-500 text-white px-1 py-0.5 rounded text-xs">Save</button>
                          <button onClick={cancelTagEdit} className="bg-gray-400 text-white px-1 py-0.5 rounded text-xs">Cancel</button>
                        </>
                      ) : (
                        <>
                          <span className="bg-gray-200 px-2 py-0.5 rounded text-sm">{tag.value}</span>
                          <button onClick={() => startTagEdit(tag)} className="bg-blue-500 text-white px-1 py-0.5 rounded text-xs">Edit</button>
                          <button onClick={() => deleteTag(tag.id)} className="bg-red-500 text-white px-1 py-0.5 rounded text-xs">Delete</button>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
                {/* Add Tag Section */}
                {addingTagMoodId === mood.id ? (
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      value={newTagValue}
                      onChange={e => setNewTagValue(e.target.value)}
                      className="border p-1"
                      placeholder="New tag value"
                    />
                    <button onClick={() => saveNewTag(mood.id)} className="bg-green-500 text-white px-2 py-1 rounded text-xs">Add</button>
                    <button onClick={cancelAddTag} className="bg-gray-400 text-white px-2 py-1 rounded text-xs">Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => startAddTag(mood.id)} className="bg-indigo-500 text-white px-2 py-1 rounded text-xs mt-2">+ Add Tag</button>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
