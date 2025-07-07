import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';

const Mentor = ({ user, data, updateData, showToast }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMentor, setEditingMentor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    field: '',
    project: '',
    skills: '',
    internsAssigned: 0,
  });

  const fetchMentors = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/mentors');
      const mentors = await res.json();
      updateData('mentors', mentors);
    } catch (err) {
      console.error('Error fetching mentors:', err);
      showToast('Failed to fetch mentors', 'error');
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const skillsArray = formData.skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      ...formData,
      skills: skillsArray,
      internsAssigned: Math.max(0, parseInt(formData.internsAssigned) || 0),
    };

    try {
      const endpoint = editingMentor
        ? `http://localhost:5000/api/mentors/${editingMentor._id}`
        : 'http://localhost:5000/api/mentors';

      const method = editingMentor ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || 'Error saving mentor');

      const updatedMentors = editingMentor
        ? data.mentors.map((m) => (m._id === result._id ? result : m))
        : [...data.mentors, result];

      updateData('mentors', updatedMentors);
      showToast(`Mentor ${editingMentor ? 'updated' : 'added'} successfully`, 'success');
      resetForm();
    } catch (err) {
      console.error('Error saving mentor:', err.message);
      showToast('Failed to save mentor', 'error');
    }
  };

  const handleEdit = (mentor) => {
    setEditingMentor(mentor);
    setFormData({
      name: mentor.name,
      department: mentor.department || '',
      field: mentor.field,
      project: mentor.project,
      skills: mentor.skills.join(', '),
      internsAssigned: mentor.internsAssigned,
    });
    setIsModalOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this mentor?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/mentors/${id}`, { method: 'DELETE' });

      if (!res.ok) throw new Error('Failed to delete');

      updateData('mentors', data.mentors.filter((m) => m._id !== id));
      showToast('Mentor deleted successfully', 'success');
    } catch (err) {
      console.error('Delete error:', err.message);
      showToast('Failed to delete mentor', 'error');
    }
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setEditingMentor(null);
    setFormData({ name: '', department: '', field: '', project: '', skills: '', internsAssigned: 0 });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mentors Information</h1>
        {user.role === 'manager' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center"
          >
            <Plus size={16} className="mr-2" /> Add Mentor
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {data.mentors.map((mentor) => {
          const assignedInterns = data.interns?.filter((i) => i.mentorId === mentor._id) || [];

          return (
            <div key={mentor._id} className="border rounded p-4 shadow bg-white dark:bg-gray-800">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold dark:text-white">{mentor.name}</h2>
                {user.role === 'manager' && (
                  <div className="flex space-x-2">
                    <button onClick={() => handleEdit(mentor)} className="text-blue-600 hover:text-blue-800">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(mentor._id)} className="text-red-600 hover:text-red-800">
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-2 text-gray-700 dark:text-gray-300">
                <div><strong>Department:</strong> {mentor.department}</div>
                <div><strong>Field:</strong> {mentor.field}</div>
                <div><strong>Project:</strong> {mentor.project}</div>
                <div>
                  <strong>Skills:</strong>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {mentor.skills.map((skill, i) => (
                      <span key={i} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <strong>Assigned Interns:</strong>
                  {assignedInterns.length > 0 ? (
                    <ul className="list-disc list-inside text-sm mt-1">
                      {assignedInterns.map((intern) => (
                        <li key={intern._id}>{intern.name} ({intern.email})</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No interns assigned.</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingMentor ? 'Edit Mentor' : 'Add Mentor'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {['name', 'department', 'field', 'project', 'skills', 'internsAssigned'].map((field) => (
                <input
                  key={field}
                  type={field === 'internsAssigned' ? 'number' : 'text'}
                  min={field === 'internsAssigned' ? 0 : undefined}
                  value={formData[field]}
                  onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                  placeholder={field === 'skills' ? 'Python, React' : `Enter ${field}`}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              ))}
              <div className="flex space-x-4">
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded w-full">
                  {editingMentor ? 'Update' : 'Add'} Mentor
                </button>
                <button type="button" onClick={resetForm} className="bg-gray-400 text-white px-4 py-2 rounded w-full">
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

export default Mentor;
