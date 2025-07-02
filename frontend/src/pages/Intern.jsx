import React, { useState } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';

const Intern = ({ user, data, updateData, showToast }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIntern, setEditingIntern] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    mentorId: ''
  });

  const resetForm = () => {
    setFormData({ name: '', email: '', department: '', mentorId: '' });
    setEditingIntern(null);
    setIsModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newIntern = {
      ...formData,
      id: editingIntern ? editingIntern.id : Date.now(),
      mentorId: parseInt(formData.mentorId)
    };

    if (editingIntern) {
      const updated = (data?.interns || []).map((i) =>
        i.id === editingIntern.id ? newIntern : i
      );
      updateData('interns', updated);
      showToast('Intern updated!', 'success');
    } else {
      updateData('interns', [...(data?.interns || []), newIntern]);
      showToast('Intern added!', 'success');
    }

    resetForm();
  };

  const handleEdit = (intern) => {
    setEditingIntern(intern);
    setFormData({
      name: intern.name,
      email: intern.email,
      department: intern.department,
      mentorId: intern.mentorId.toString()
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    updateData('interns', (data?.interns || []).filter((i) => i.id !== id));
    showToast('Intern deleted successfully!', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Interns Information</h1>
        {user.role === 'manager' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center"
          >
            <Plus size={16} className="mr-2" /> Add Intern
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {(data?.interns || []).map((intern) => {
          const mentor = (data?.mentors || []).find((m) => m.id === intern.mentorId);
          return (
            <div
              key={intern.id}
              className="border rounded p-4 shadow bg-white dark:bg-gray-800"
            >
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-semibold dark:text-white">{intern.name}</h2>
                {user.role === 'manager' && (
                  <div className="flex space-x-2">
                    <button onClick={() => handleEdit(intern)} className="text-blue-600 hover:text-blue-800">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(intern.id)} className="text-red-600 hover:text-red-800">
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
              <div className="space-y-1 text-gray-700 dark:text-gray-300">
                <div><strong>Email:</strong> {intern.email}</div>
                <div><strong>Department:</strong> {intern.department}</div>
                <div><strong>Mentor:</strong> {mentor ? mentor.name : 'N/A'}</div>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingIntern ? 'Edit Intern' : 'Add Intern'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Intern Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                required
              >
                <option value="">Select Department</option>
                <option value="Development">Development</option>
                <option value="Testing">Testing</option>
                <option value="Design">Design</option>
              </select>
              <select
                value={formData.mentorId}
                onChange={(e) => setFormData({ ...formData, mentorId: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                required
              >
                <option value="">Select Mentor</option>
                {(data?.mentors || []).map((mentor) => (
                  <option key={mentor.id} value={mentor.id}>{mentor.name} - {mentor.field}</option>
                ))}
              </select>

              <div className="flex space-x-4">
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded w-full">
                  {editingIntern ? 'Update' : 'Add'} Intern
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-400 text-white px-4 py-2 rounded w-full"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Intern;
