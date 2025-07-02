import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { Button, Card, Input } from "@/components/ui"; // Adjust if needed
import Modal from "../components/Modal.jsx";
import { Plus, Edit, Trash2 } from "lucide-react"; // ✅ UNCOMMENTED

const ProjectsPages = ({ user, data, updateData, showToast }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    teamMembers: "",
    progress: 0,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const teamMembersArray = formData.teamMembers
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingProject) {
      const updated = data.projects.map((project) =>
        project.id === editingProject.id
          ? {
              ...project,
              ...formData,
              teamMembers: teamMembersArray,
              progress: Number(formData.progress),
            }
          : project
      );
      updateData("projects", updated);
      showToast("Project updated successfully!", "success");
    } else {
      const newProject = {
        id: Date.now(),
        ...formData,
        teamMembers: teamMembersArray,
        progress: Number(formData.progress),
      };
      updateData("projects", [...data.projects, newProject]);
      showToast("Project added successfully!", "success");
    }

    setIsModalOpen(false);
    setEditingProject(null);
    setFormData({ name: "", description: "", teamMembers: "", progress: 0 });
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description,
      teamMembers: project.teamMembers.join(", "),
      progress: project.progress || 0,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (projectId) => {
    updateData(
      "projects",
      data.projects.filter((project) => project.id !== projectId)
    );
    showToast("Project deleted successfully!", "success");
  };

  const selectedProject = data.projects.find(
    (p) => p.id.toString() === selectedProjectId
  );

  const chartData =
    selectedProject && typeof selectedProject.progress === "number"
      ? [
          {
            name: selectedProject.name,
            Completed: selectedProject.progress,
            Pending: 100 - selectedProject.progress,
          },
        ]
      : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Project Dashboard
        </h1>
        {user.role === "manager" && (
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={16} className="mr-2" />
            Add Project
          </Button>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select a Project to View Progress
        </label>
        <select
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 dark:text-white"
        >
          <option value="">-- Select Project --</option>
          {data.projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      {selectedProject ? (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
            Progress Overview - {selectedProject.name}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="name" stroke="#8884d8" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Completed" stackId="a" fill="#34d399" />
              <Bar dataKey="Pending" stackId="a" fill="#f87171" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400 italic">
          Select a project to view its progress chart.
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {data.projects.map((project) => (
          <Card
            key={project.id}
            className="p-5 shadow-lg border dark:bg-gray-900"
          >
            <div className="flex justify-between items-start mb-3">
              <h2 className="text-xl font-bold dark:text-white">
                {project.name}
              </h2>
              {user.role === "manager" && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(project)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {project.description}
            </p>
            <div className="mb-2">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Team:
              </span>
              <div className="flex flex-wrap gap-2 mt-1">
                {project.teamMembers.map((member, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                  >
                    {member}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                <span>Completed: {project.progress}%</span>
                <span>Pending: {100 - project.progress}%</span>
              </div>
              <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProject(null);
          setFormData({
            name: "",
            description: "",
            teamMembers: "",
            progress: 0,
          });
        }}
        title={editingProject ? "Edit Project" : "Add Project"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Project Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter project name"
            required
          />
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter description"
            />
          </div>
          <Input
            label="Team Members (comma separated)"
            value={formData.teamMembers}
            onChange={(e) =>
              setFormData({ ...formData, teamMembers: e.target.value })
            }
            placeholder="John, Alice, Bob"
            required
          />
          <Input
            label="Progress (%)"
            type="number"
            min={0}
            max={100}
            value={formData.progress}
            onChange={(e) =>
              setFormData({
                ...formData,
                progress: parseInt(e.target.value) || 0,
              })
            }
            placeholder="0 - 100"
            required
          />
          <div className="flex space-x-4">
            <Button type="submit" className="flex-1">
              {editingProject ? "Update" : "Add"} Project
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectsPages;
