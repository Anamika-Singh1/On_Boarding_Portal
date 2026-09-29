import React, { useState } from "react";
import { Plus, Edit, Trash2, Layers } from "lucide-react";
import {
  Button,
  Card,
  Input,
  Badge,
  IconButton,
  EmptyState,
  PageHeader,
  ConfirmDialog,
  Modal,
} from "@/components/ui";

const emptyForm = { pipelineName: "", requiredSkills: "" };

const PipelineSkillsPage = ({ user, data, updateData, showToast }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [deletingSkill, setDeletingSkill] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const isManager = user.role === "manager";

  const resetForm = () => {
    setIsModalOpen(false);
    setEditingSkill(null);
    setFormData(emptyForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const skillsArray = formData.requiredSkills.split(",").map((s) => s.trim()).filter(Boolean);

    if (editingSkill) {
      const updated = data.pipelineSkills.map((skill) =>
        skill.id === editingSkill.id ? { ...skill, ...formData, requiredSkills: skillsArray } : skill
      );
      updateData("pipelineSkills", updated);
      showToast("Pipeline updated successfully!", "success");
    } else {
      const newSkill = { id: Date.now(), ...formData, requiredSkills: skillsArray };
      updateData("pipelineSkills", [...data.pipelineSkills, newSkill]);
      showToast("Pipeline added successfully!", "success");
    }
    resetForm();
  };

  const handleEdit = (skill) => {
    setEditingSkill(skill);
    setFormData({ pipelineName: skill.pipelineName, requiredSkills: skill.requiredSkills.join(", ") });
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    updateData("pipelineSkills", data.pipelineSkills.filter((skill) => skill.id !== deletingSkill.id));
    showToast("Pipeline deleted successfully!", "success");
    setDeletingSkill(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pipeline Skills"
        description="Skill requirements for each engineering pipeline."
        actions={
          isManager && (
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus size={16} className="mr-1.5" /> Add pipeline
            </Button>
          )
        }
      />

      {data.pipelineSkills.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No pipelines yet"
          description={isManager ? "Add a pipeline to define its required skills." : "No pipelines have been added yet."}
          action={
            isManager && (
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus size={16} className="mr-1.5" /> Add the first pipeline
              </Button>
            )
          }
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {data.pipelineSkills.map((skill) => (
            <Card key={skill.id} hover>
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{skill.pipelineName}</h2>
                {isManager && (
                  <div className="flex shrink-0 gap-1">
                    <IconButton icon={Edit} label={`Edit ${skill.pipelineName}`} onClick={() => handleEdit(skill)} />
                    <IconButton
                      icon={Trash2}
                      label={`Delete ${skill.pipelineName}`}
                      variant="danger"
                      onClick={() => setDeletingSkill(skill)}
                    />
                  </div>
                )}
              </div>
              <div className="mt-3">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Required skills</span>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {skill.requiredSkills.map((skillName, index) => (
                    <Badge key={index} variant="info" withIcon={false}>
                      {skillName}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={resetForm} title={editingSkill ? "Edit pipeline" : "Add pipeline"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Pipeline name"
            value={formData.pipelineName}
            onChange={(e) => setFormData({ ...formData, pipelineName: e.target.value })}
            required
          />
          <Input
            label="Required skills"
            hint="Comma separated"
            value={formData.requiredSkills}
            onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
            placeholder="Python, Docker, AWS, Kubernetes"
            required
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button type="submit">{editingSkill ? "Save changes" : "Add pipeline"}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingSkill}
        onClose={() => setDeletingSkill(null)}
        onConfirm={confirmDelete}
        title="Delete pipeline?"
        description={`This will permanently remove "${deletingSkill?.pipelineName ?? ''}".`}
        confirmLabel="Delete"
      />
    </div>
  );
};

export default PipelineSkillsPage;
