import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Plus, Edit, Trash2, FolderKanban } from "lucide-react";
import {
  Button,
  Card,
  Input,
  Textarea,
  Badge,
  IconButton,
  EmptyState,
  PageHeader,
  ConfirmDialog,
  Modal,
} from "@/components/ui";

const emptyForm = { name: "", description: "", teamMembers: "", progress: 0 };

const ProjectsPages = ({ user, data, updateData, showToast }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deletingProject, setDeletingProject] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [formData, setFormData] = useState(emptyForm);
  const isManager = user.role === "manager";

  const resetForm = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setFormData(emptyForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const teamMembersArray = formData.teamMembers.split(",").map((s) => s.trim()).filter(Boolean);

    if (editingProject) {
      const updated = data.projects.map((project) =>
        project.id === editingProject.id
          ? { ...project, ...formData, teamMembers: teamMembersArray, progress: Number(formData.progress) }
          : project
      );
      updateData("projects", updated);
      showToast("Project updated successfully!", "success");
    } else {
      const newProject = { id: Date.now(), ...formData, teamMembers: teamMembersArray, progress: Number(formData.progress) };
      updateData("projects", [...data.projects, newProject]);
      showToast("Project added successfully!", "success");
    }
    resetForm();
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

  const confirmDelete = () => {
    updateData("projects", data.projects.filter((project) => project.id !== deletingProject.id));
    showToast("Project deleted successfully!", "success");
    setDeletingProject(null);
    if (selectedProjectId === deletingProject.id.toString()) setSelectedProjectId("");
  };

  const selectedProject = data.projects.find((p) => p.id.toString() === selectedProjectId);
  const chartData =
    selectedProject && typeof selectedProject.progress === "number"
      ? [{ name: selectedProject.name, Completed: selectedProject.progress, Pending: 100 - selectedProject.progress }]
      : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Project Dashboard"
        description="Track intern project assignments and progress."
        actions={
          isManager && (
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus size={16} className="mr-1.5" /> Add project
            </Button>
          )
        }
      />

      {data.projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description={isManager ? "Add a project to start tracking intern progress." : "No projects have been added yet."}
          action={
            isManager && (
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus size={16} className="mr-1.5" /> Add the first project
              </Button>
            )
          }
        />
      ) : (
        <>
          <Card>
            <label htmlFor="project-select" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              View progress for
            </label>
            <select
              id="project-select"
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="">— Select a project —</option>
              {data.projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>

            {selectedProject ? (
              <div className="mt-6">
                <h2 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">
                  Progress overview — {selectedProject.name}
                </h2>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                    <XAxis dataKey="name" stroke="currentColor" className="text-xs text-slate-500" />
                    <YAxis domain={[0, 100]} stroke="currentColor" className="text-xs text-slate-500" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Completed" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Pending" stackId="a" fill="#f87171" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="mt-6 text-center text-sm italic text-slate-400 dark:text-slate-500">
                Select a project above to see its progress chart.
              </p>
            )}
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {data.projects.map((project) => (
              <Card key={project.id} hover>
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{project.name}</h2>
                  {isManager && (
                    <div className="flex shrink-0 gap-1">
                      <IconButton icon={Edit} label={`Edit ${project.name}`} onClick={() => handleEdit(project)} />
                      <IconButton
                        icon={Trash2}
                        label={`Delete ${project.name}`}
                        variant="danger"
                        onClick={() => setDeletingProject(project)}
                      />
                    </div>
                  )}
                </div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{project.description}</p>

                {project.teamMembers?.length > 0 && (
                  <div className="mt-3">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Team</span>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {project.teamMembers.map((member, idx) => (
                        <Badge key={idx} variant="info" withIcon={false}>
                          {member}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>{project.progress}% complete</span>
                    <span>{100 - project.progress}% remaining</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800">
                    <div
                      className="h-2 rounded-full bg-emerald-500 transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      <Modal isOpen={isModalOpen} onClose={resetForm} title={editingProject ? "Edit project" : "Add project"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Project name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
          <Input
            label="Team members"
            hint="Comma separated"
            value={formData.teamMembers}
            onChange={(e) => setFormData({ ...formData, teamMembers: e.target.value })}
            placeholder="John, Alice, Bob"
            required
          />
          <Input
            label="Progress (%)"
            type="number"
            min={0}
            max={100}
            value={formData.progress}
            onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })}
            required
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button type="submit">{editingProject ? "Save changes" : "Add project"}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingProject}
        onClose={() => setDeletingProject(null)}
        onConfirm={confirmDelete}
        title="Delete project?"
        description={`This will permanently remove "${deletingProject?.name ?? ''}" and its progress data.`}
        confirmLabel="Delete"
      />
    </div>
  );
};

export default ProjectsPages;
