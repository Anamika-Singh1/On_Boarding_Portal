import React, { useState } from "react";
import { Plus, Trash2, Edit, ExternalLink, ListChecks } from "lucide-react";
import { Card, Input, Button, IconButton, EmptyState, PageHeader, ConfirmDialog, Modal } from "@/components/ui";

const OnBoarding = ({ user, data, updateData, showToast }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState({ heading: "", subTopics: "", learningLink: "" });
  const isManager = user.role === "manager";

  const resetForm = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({ heading: "", subTopics: "", learningLink: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const subTopicsArray = formData.subTopics.split(",").map((s) => s.trim()).filter(Boolean);

    if (editingItem) {
      const updated = data.onboardingEssentials.map((item) =>
        item.id === editingItem.id ? { ...item, ...formData, subTopics: subTopicsArray } : item
      );
      updateData("onboardingEssentials", updated);
      showToast("Onboarding step updated!", "success");
    } else {
      const newItem = { id: Date.now(), ...formData, subTopics: subTopicsArray };
      updateData("onboardingEssentials", [...data.onboardingEssentials, newItem]);
      showToast("Onboarding step added!", "success");
    }
    resetForm();
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({ heading: item.heading, subTopics: item.subTopics.join(", "), learningLink: item.learningLink });
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    updateData("onboardingEssentials", data.onboardingEssentials.filter((item) => item.id !== deletingId));
    showToast("Onboarding step removed", "success");
    setDeletingId(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Onboarding Essentials"
        description="The resources and learning steps every new intern should work through."
        actions={
          isManager && (
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus size={16} className="mr-1.5" /> Add step
            </Button>
          )
        }
      />

      {data.onboardingEssentials.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title="No onboarding steps yet"
          description={
            isManager
              ? "Add the first learning resource to build out the onboarding checklist."
              : "Your manager hasn't published any onboarding steps yet. Check back soon."
          }
          action={
            isManager && (
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus size={16} className="mr-1.5" /> Add the first step
              </Button>
            )
          }
        />
      ) : (
        <ol className="space-y-3">
          {data.onboardingEssentials.map((item, index) => (
            <li key={item.id}>
              <Card className="flex flex-col gap-4 sm:flex-row sm:items-start" hover>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">{item.heading}</h2>
                    {isManager && (
                      <div className="flex gap-1">
                        <IconButton icon={Edit} label={`Edit ${item.heading}`} onClick={() => handleEdit(item)} />
                        <IconButton
                          icon={Trash2}
                          label={`Delete ${item.heading}`}
                          variant="danger"
                          onClick={() => setDeletingId(item.id)}
                        />
                      </div>
                    )}
                  </div>
                  {item.subTopics.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {item.subTopics.map((topic, i) => (
                        <span
                          key={i}
                          className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}
                  {item.learningLink && (
                    <a
                      href={item.learningLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                    >
                      Open resource <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </Card>
            </li>
          ))}
        </ol>
      )}

      <Modal isOpen={isModalOpen} onClose={resetForm} title={editingItem ? "Edit onboarding step" : "Add onboarding step"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Heading"
            value={formData.heading}
            onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
            placeholder="e.g. Set up your development environment"
            required
          />
          <Input
            label="Subtopics"
            hint="Comma separated"
            value={formData.subTopics}
            onChange={(e) => setFormData({ ...formData, subTopics: e.target.value })}
            placeholder="Git, VS Code, Docker"
            required
          />
          <Input
            label="Learning link"
            type="url"
            value={formData.learningLink}
            onChange={(e) => setFormData({ ...formData, learningLink: e.target.value })}
            placeholder="https://…"
            required
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button type="submit">{editingItem ? "Save changes" : "Add step"}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={confirmDelete}
        title="Delete onboarding step?"
        description="This will remove the step from every intern's checklist. This can't be undone."
        confirmLabel="Delete"
      />
    </div>
  );
};

export default OnBoarding;
