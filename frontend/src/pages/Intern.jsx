import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';

const Intern = ({ user, data, updateData, showToast }) => {
  const API_BASE_URL = import.meta.env.VITE_API_URL;

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

  const fetchInterns = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/interns`);
      const interns = await res.json();
      updateData('interns', interns);
    } catch (error) {
      console.error('Error fetching interns:', error);
    }
  };

  useEffect(() => {
    fetchInterns();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      email: formData.email,
      department: formData.department,
      mentorId: formData.mentorId,
    };

    const method = editingIntern ? 'PUT' : 'POST';
    const url = editingIntern
      ? `${API_BASE_URL}/api/interns/${editingIntern._id}`
      : `${API_BASE_URL}/api/interns`;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Something went wrong');

      showToast(editingIntern ? 'Intern updated!' : 'Intern added!', 'success');
      fetchInterns();
      resetForm();
    } catch (err) {
      console.error('Intern submit error:', err);
      showToast('Failed to save intern', 'error');
    }
  };

  const handleEdit = (intern) => {
    setEditingIntern(intern);
    setFormData({
      name: intern.name,
      email: intern.email,
      department: intern.department,
      mentorId: intern.mentorId
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (_id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/interns/${_id}`, {
        method: 'DELETE'
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Delete failed');
      showToast('Intern deleted successfully!', 'success');
      fetchInterns();
    } catch (err) {
      console.error('Delete error:', err);
      showToast('Failed to delete intern', 'error');
    }
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
          const mentor = (data?.mentors || []).find((m) => m._id === intern.mentorId);
          return (
            <div key={intern._id} className="border rounded p-4 shadow bg-white dark:bg-gray-800">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-semibold dark:text-white">{intern.name}</h2>
                {user.role === 'manager' && (
                  <div className="flex space-x-2">
                    <button onClick={() => handleEdit(intern)} className="text-blue-600 hover:text-blue-800">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(intern._id)} className="text-red-600 hover:text-red-800">
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
                  <option key={mentor._id} value={mentor._id}>
                    {mentor.name} - {mentor.field}
                  </option>
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
