import React, { useState } from 'react';
import { Card, Input, Button } from '@/components/ui';
import { Plus, Trash2 } from 'lucide-react';
import getYouTubeVideoId from '@/utils/getYouTubeVideoId';

const HomePage = ({ user, data, updateData, showToast }) => {
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');

  const handleAddVideo = (e) => {
    e.preventDefault();
    if (!newVideoUrl || !newVideoTitle) return;

    const newVideo = {
      id: Date.now(),
      title: newVideoTitle.trim(),
      url: newVideoUrl.trim(),
    };

    updateData('videos', [...data.videos, newVideo]);
    setNewVideoUrl('');
    setNewVideoTitle('');
    showToast('Video added successfully!', 'success');
  };

  const handleDeleteVideo = (videoId) => {
    const updatedVideos = data.videos.filter((video) => video.id !== videoId);
    updateData('videos', updatedVideos);
    showToast('Video deleted successfully!', 'success');
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Header Section */}
        <section className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
            Welcome to AiEnsured Onboarding Portal
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Gain insights into what we do and explore our official platforms to stay updated.
          </p>
        </section>

        {/* Links and Video Form */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Official Links */}
          <Card className="p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 dark:text-white">Official Links</h2>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://linkedin.com/company/aiensured"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/aiensured"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://aiensured.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  Official Website
                </a>
              </li>
            </ul>
          </Card>

          {/* Video Form for Managers */}
          {user.role === 'manager' && (
            <Card className="p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">Add YouTube Video</h2>
              <form onSubmit={handleAddVideo} className="space-y-4">
                <Input
                  label="Video Title"
                  value={newVideoTitle}
                  onChange={(e) => setNewVideoTitle(e.target.value)}
                  placeholder="Enter video title"
                  required
                />
                <Input
                  label="YouTube URL"
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                />
                <Button type="submit" className="w-full flex justify-center items-center">
                  <Plus size={16} className="mr-2" />
                  Add Video
                </Button>
              </form>
            </Card>
          )}
        </section>
{/* Interns Section */}
{data.interns && (
  <section>
    <Card className="p-6 shadow-lg mt-12">
      <h2 className="text-2xl font-semibold mb-6 dark:text-white">Interns Information</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {data.interns.map((intern) => {
          const mentor = data.mentors.find((m) => m.id === intern.mentorId);
          return (
            <div
              key={intern.id}
              className="border rounded p-4 shadow bg-white dark:bg-gray-800"
            >
              <div className="space-y-2 text-gray-700 dark:text-gray-300">
                <div><strong>Name:</strong> {intern.name}</div>
                <div><strong>Email:</strong> {intern.email}</div>
                <div><strong>Department:</strong> {intern.department}</div>
                <div><strong>Mentor:</strong> {mentor ? mentor.name : 'N/A'}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  </section>
)}


        {/* Training Videos Section */}
        <section>
          <Card className="p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 dark:text-white">Training Videos</h2>
            {data.videos?.length > 0 ? (
              <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8">
                {data.videos.map((video) => {
                  const videoId = getYouTubeVideoId(video.url);
                  return (
                    <div key={video.id} className="space-y-3">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-medium dark:text-white">{video.title}</h3>
                        {user.role === 'manager' && (
                          <button
                            onClick={() => handleDeleteVideo(video.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete Video"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                      {videoId ? (
                        <div className="aspect-video overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700">
                          <iframe
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title={video.title}
                            className="w-full h-full"
                            frameBorder="0"
                            allowFullScreen
                          />
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Invalid YouTube URL
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No training videos available.</p>
            )}
          </Card>
        </section>
      </div>
    </main>
  );
};

export default HomePage;
