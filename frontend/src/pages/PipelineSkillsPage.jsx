import React, { useState } from "react";
import { Button, Card, Input} from "@/components/ui";
import Modal from "../components/Modal.jsx";
import { Plus, Edit, Trash2 } from "lucide-react";

const PipelineSkillsPage = ({ user, data, updateData, showToast }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [formData, setFormData] = useState({
    pipelineName: '',
    requiredSkills: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const skillsArray = formData.requiredSkills.split(',').map(s => s.trim()).filter(Boolean);
    
    if (editingSkill) {
      const updated = data.pipelineSkills.map(skill =>
        skill.id === editingSkill.id
          ? { ...skill, ...formData, requiredSkills: skillsArray }
          : skill
      );
      updateData('pipelineSkills', updated);
      showToast('Pipeline skill updated successfully!', 'success');
    } else {
      const newSkill = {
        id: Date.now(),
        ...formData,
        requiredSkills: skillsArray
      };
      updateData('pipelineSkills', [...data.pipelineSkills, newSkill]);
      showToast('Pipeline skill added successfully!', 'success');
    }
    
    setIsModalOpen(false);
    setEditingSkill(null);
    setFormData({ pipelineName: '', requiredSkills: '' });
  };

  const handleEdit = (skill) => {
    setEditingSkill(skill);
    setFormData({
      pipelineName: skill.pipelineName,
      requiredSkills: skill.requiredSkills.join(', ')
    });
    setIsModalOpen(true);
  };

  const handleDelete = (skillId) => {
    updateData('pipelineSkills', data.pipelineSkills.filter(skill => skill.id !== skillId));
    showToast('Pipeline skill deleted successfully!', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Pipeline Skills</h1>
        {user.role === 'manager' && (
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={16} className="mr-2" />
            Add Pipeline
          </Button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {data.pipelineSkills.map(skill => (
          <Card key={skill.id}>
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold dark:text-white">{skill.pipelineName}</h2>
              {user.role === 'manager' && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(skill)}
                    className="text-blue-600 hover:text-blue-800 p-1"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(skill.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
            
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Required Skills: </span>
              <div className="flex flex-wrap gap-2 mt-2">
                {skill.requiredSkills.map((skillName, index) => (
                  <span key={index} className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300 rounded-full text-sm font-medium">
                    {skillName}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSkill(null);
          setFormData({ pipelineName: '', requiredSkills: '' });
        }}
        title={editingSkill ? 'Edit Pipeline' : 'Add Pipeline'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Pipeline Name"
            value={formData.pipelineName}
            onChange={(e) => setFormData({...formData, pipelineName: e.target.value})}
            placeholder="Enter pipeline name"
            required
          />
          <Input
            label="Required Skills (comma separated)"
            value={formData.requiredSkills}
            onChange={(e) => setFormData({...formData, requiredSkills: e.target.value})}
            placeholder="Python, Docker, AWS, Kubernetes"
            required
          />
          <div className="flex space-x-4">
            <Button type="submit" className="flex-1">
              {editingSkill ? 'Update' : 'Add'} Pipeline
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
export default PipelineSkillsPage;


