import React, { useState } from "react";
import { Plus, Trash2, PlayCircle } from "lucide-react";
import { Card, Input, Button, IconButton, EmptyState, PageHeader, ConfirmDialog, Modal } from "@/components/ui";
import getYouTubeVideoId from "@/utils/getYouTubeVideoId";

const VideosPage = ({ user, data, updateData, showToast }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingVideo, setDeletingVideo] = useState(null);
  const [video, setVideo] = useState({ title: "", url: "" });
  const isManager = user.role === "manager";

  const handleAdd = (e) => {
    e.preventDefault();
    if (!video.title || !video.url) return;

    const newVideo = { id: Date.now(), title: video.title.trim(), url: video.url.trim() };
    updateData("videos", [...data.videos, newVideo]);
    showToast("Video added successfully!", "success");
    setVideo({ title: "", url: "" });
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    updateData("videos", data.videos.filter((v) => v.id !== deletingVideo.id));
    showToast("Video deleted!", "success");
    setDeletingVideo(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Training Videos"
        description="Onboarding and knowledge-transfer videos for interns."
        actions={
          isManager && (
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus size={16} className="mr-1.5" /> Add video
            </Button>
          )
        }
      />

      {data.videos.length === 0 ? (
        <EmptyState
          icon={PlayCircle}
          title="No training videos yet"
          description={isManager ? "Add your first training video to help interns get up to speed." : "Your manager hasn't added any training videos yet."}
          action={
            isManager && (
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus size={16} className="mr-1.5" /> Add the first video
              </Button>
            )
          }
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {data.videos.map((vid) => {
            const videoId = getYouTubeVideoId(vid.url);
            return (
              <Card key={vid.id} padding="sm">
                <div className="flex items-start justify-between gap-2 px-1 pt-1">
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-white">{vid.title}</h2>
                  {isManager && (
                    <IconButton
                      icon={Trash2}
                      label={`Delete ${vid.title}`}
                      variant="danger"
                      onClick={() => setDeletingVideo(vid)}
                    />
                  )}
                </div>
                <div className="mt-2 aspect-video overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                  {videoId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title={vid.title}
                      className="h-full w-full"
                      allowFullScreen
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate-400">
                      Invalid YouTube URL
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add training video">
        <form onSubmit={handleAdd} className="space-y-4">
          <Input
            label="Video title"
            value={video.title}
            onChange={(e) => setVideo({ ...video, title: e.target.value })}
            placeholder="Enter video title"
            required
          />
          <Input
            label="YouTube URL"
            type="url"
            value={video.url}
            onChange={(e) => setVideo({ ...video, url: e.target.value })}
            placeholder="https://www.youtube.com/watch?v=…"
            required
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              <Plus size={16} className="mr-1.5" /> Add video
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingVideo}
        onClose={() => setDeletingVideo(null)}
        onConfirm={confirmDelete}
        title="Delete video?"
        description={`This will remove "${deletingVideo?.title ?? ''}" from the training library.`}
        confirmLabel="Delete"
      />
    </div>
  );
};

export default VideosPage;
