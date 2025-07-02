import React, { useState } from "react";

const VideosPage = ({ user, data, updateData, showToast }) => {
  const [video, setVideo] = useState({ title: "", url: "" });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!video.title || !video.url) return;

    const newVideo = {
      id: Date.now(),
      title: video.title,
      url: video.url,
    };

    updateData("videos", [...data.videos, newVideo]);
    showToast("Video added successfully!", "success");
    setVideo({ title: "", url: "" });
  };

  const handleDelete = (id) => {
    const updated = data.videos.filter((vid) => vid.id !== id);
    updateData("videos", updated);
    showToast("Video deleted!", "success");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Onboarding Videos</h1>

      {user.role === "manager" && (
        <form onSubmit={handleAdd} className="space-y-4 bg-white dark:bg-gray-800 p-4 rounded shadow">
          <input
            type="text"
            placeholder="Video Title"
            value={video.title}
            onChange={(e) => setVideo({ ...video, title: e.target.value })}
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
            required
          />
          <input
            type="url"
            placeholder="YouTube Video URL"
            value={video.url}
            onChange={(e) => setVideo({ ...video, url: e.target.value })}
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Video
          </button>
        </form>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {data.videos.map((vid) => (
          <div key={vid.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow">
            <h2 className="text-lg font-semibold dark:text-white mb-2">{vid.title}</h2>
            <div className="aspect-video">
              <iframe
                width="100%"
                height="200"
                src={vid.url}
                title={vid.title}
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
            {user.role === "manager" && (
              <button
                onClick={() => handleDelete(vid.id)}
                className="mt-2 text-red-600 hover:underline"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideosPage;
