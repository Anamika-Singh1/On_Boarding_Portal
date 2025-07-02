import React, { useState } from "react";
import { Plus, Trash2, Edit } from "lucide-react";

const OnBoarding = ({ user, data, updateData, showToast }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    heading: "",
    subTopics: "",
    learningLink: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const subTopicsArray = formData.subTopics
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingItem) {
      const updated = data.onboardingEssentials.map((item) =>
        item.id === editingItem.id
          ? { ...item, ...formData, subTopics: subTopicsArray }
          : item
      );
      updateData("onboardingEssentials", updated);
      showToast("Onboarding updated!", "success");
    } else {
      const newItem = {
        id: Date.now(),
        ...formData,
        subTopics: subTopicsArray,
      };
      updateData("onboardingEssentials", [...data.onboardingEssentials, newItem]);
      showToast("New onboarding item added!", "success");
    }

    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({ heading: "", subTopics: "", learningLink: "" });
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      heading: item.heading,
      subTopics: item.subTopics.join(", "),
      learningLink: item.learningLink,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    const updated = data.onboardingEssentials.filter((item) => item.id !== id);
    updateData("onboardingEssentials", updated);
    showToast("Item deleted", "success");
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Onboarding Essentials</h1>
        {user.role === "manager" && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center"
          >
            <Plus size={16} className="mr-2" /> Add
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {data.onboardingEssentials.map((item) => (
          <div key={item.id} className="border p-4 rounded shadow bg-white dark:bg-gray-800">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">{item.heading}</h2>
              {user.role === "manager" && (
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(item)} className="text-blue-600">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-600">
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
              SubTopics: {item.subTopics.join(", ")}
            </p>
            <a
              href={item.learningLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline text-sm"
            >
              {item.learningLink}
            </a>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg space-y-4 w-full max-w-md"
          >
            <h2 className="text-xl font-semibold mb-4">
              {editingItem ? "Edit" : "Add"} Onboarding Item
            </h2>
            <input
              type="text"
              value={formData.heading}
              onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
              placeholder="Heading"
              required
              className="w-full px-4 py-2 border rounded"
            />
            <input
              type="text"
              value={formData.subTopics}
              onChange={(e) => setFormData({ ...formData, subTopics: e.target.value })}
              placeholder="Subtopics (comma separated)"
              required
              className="w-full px-4 py-2 border rounded"
            />
            <input
              type="url"
              value={formData.learningLink}
              onChange={(e) => setFormData({ ...formData, learningLink: e.target.value })}
              placeholder="Learning Link"
              required
              className="w-full px-4 py-2 border rounded"
            />
            <div className="flex justify-end space-x-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                {editingItem ? "Update" : "Add"}
              </button>
              <button
                type="button"
                className="border px-4 py-2 rounded"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingItem(null);
                  setFormData({ heading: "", subTopics: "", learningLink: "" });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default OnBoarding;
