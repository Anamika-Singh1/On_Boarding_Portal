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
    internsAssigned: 0
  });

  useEffect(() => {
    fetch('http://localhost:5000/api/mentors')
      .then(res => res.json())
      .then(mentors => {
        updateData('mentors', mentors);
      })
      .catch(err => console.error('Error fetching mentors:', err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const skillsArray = formData.skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const updatedMentor = {
      ...formData,
      skills: skillsArray,
      internsAssigned: parseInt(formData.internsAssigned),
    };

    if (editingMentor) {
      fetch(`http://localhost:5000/api/mentors/${editingMentor._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMentor),
      })
        .then(res => res.json())
        .then(updated => {
          const updatedList = data.mentors.map(m => m._id === updated._id ? updated : m);
          updateData('mentors', updatedList);
          showToast('Mentor updated successfully!', 'success');
          resetForm();
        });
    } else {
      fetch('http://localhost:5000/api/mentors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMentor),
      })
        .then(res => res.json())
        .then(newMentor => {
          updateData('mentors', [...data.mentors, newMentor]);
          showToast('Mentor added successfully!', 'success');
          resetForm();
        });
    }
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setEditingMentor(null);
    setFormData({ name: '', department: '', field: '', project: '', skills: '', internsAssigned: 0 });
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
  };

  const handleDelete = (mentorId) => {
    fetch(`http://localhost:5000/api/mentors/${mentorId}`, {
      method: 'DELETE'
    })
      .then(() => {
        updateData('mentors', data.mentors.filter((mentor) => mentor._id !== mentorId));
        showToast('Mentor deleted successfully!', 'success');
      });
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
          const assignedInterns = data.interns?.filter(
            (intern) => intern.mentorId === mentor._id
          ) || [];

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
                      <span
                        key={i}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full text-sm"
                      >
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
                        <li key={intern.id}>{intern.name} ({intern.email})</li>
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
                  value={formData[field]}
                  onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                  placeholder={field === 'skills' ? 'Python, React' : `Enter ${field}`}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              ))}
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded w-full"
                >
                  {editingMentor ? 'Update' : 'Add'} Mentor
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

export default Mentor;
