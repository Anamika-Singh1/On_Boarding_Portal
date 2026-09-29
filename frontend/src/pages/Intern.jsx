import React, { useState, useEffect } from 'react';
import fetchList from '@/utils/fetchList';
import { Plus, Trash2, Edit, GraduationCap } from 'lucide-react';
import {
  Card,
  Input,
  Select,
  Button,
  IconButton,
  EmptyState,
  PageHeader,
  ConfirmDialog,
  Modal,
  CardGridSkeleton,
} from '@/components/ui';

const emptyForm = { name: '', email: '', department: '', mentorId: '' };

// The API returns mentorId populated as a full mentor object; this normalizes
// it back to a plain id string for form state either way.
const mentorIdOf = (mentorId) => (mentorId && typeof mentorId === 'object' ? mentorId._id : mentorId || '');

const Intern = ({ user, data, updateData, showToast }) => {
  const API_BASE_URL = import.meta.env.VITE_API_URL || '';
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIntern, setEditingIntern] = useState(null);
  const [deletingIntern, setDeletingIntern] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const isManager = user.role === 'manager';

const resetForm = () => {
  setIsModalOpen(false);
  setEditingIntern(null);
  setFormData({ ...emptyForm });
};

  const fetchInterns = async () => {
    setLoadError(false);
    try {
      const [interns, mentors] = await Promise.all([fetchList('interns'), fetchList('mentors')]);
      updateData('interns', interns);
      updateData('mentors', mentors);
    } catch (error) {
      console.error('Error fetching interns:', error);
      setLoadError(true);
      showToast('Unable to load interns. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const url = editingIntern ? `${API_BASE_URL}/api/interns/${editingIntern._id}` : `${API_BASE_URL}/api/interns`;

    setSubmitting(true);
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Something went wrong');

      showToast(editingIntern ? 'Intern updated!' : 'Intern added!', 'success');
      await fetchInterns();
      resetForm();
    } catch (err) {
      console.error('Intern submit error:', err);
      showToast('Failed to save intern', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (intern) => {
    setEditingIntern(intern);
    setFormData({
      name: intern.name,
      email: intern.email,
      department: intern.department,
      mentorId: mentorIdOf(intern.mentorId),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingIntern) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/interns/${deletingIntern._id}`, { method: 'DELETE' });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Delete failed');
      showToast('Intern deleted successfully!', 'success');
      await fetchInterns();
    } catch (err) {
      console.error('Delete error:', err);
      showToast('Failed to delete intern', 'error');
    } finally {
      setDeleting(false);
      setDeletingIntern(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Interns"
        description="Everyone currently going through onboarding."
        actions={
          isManager && (
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus size={16} className="mr-1.5" /> Add intern
            </Button>
          )
        }
      />

      {loadError ? (
        <EmptyState icon={GraduationCap} title="Unable to load the intern directory" description="Check your connection and try again." action={<Button onClick={() => { setLoading(true); fetchInterns(); }}>Try again</Button>} />
      ) : loading ? (
        <CardGridSkeleton />
      ) : (data?.interns || []).length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No interns yet"
          description={isManager ? 'Add an intern to start tracking their onboarding.' : 'No interns have been added yet.'}
          action={
            isManager && (
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus size={16} className="mr-1.5" /> Add the first intern
              </Button>
            )
          }
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {(data?.interns || []).map((intern) => {
            const mentor =
              intern.mentorId && typeof intern.mentorId === 'object'
                ? intern.mentorId
                : (data?.mentors || []).find((m) => m._id === intern.mentorId);
            return (
              <Card key={intern._id} hover>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{intern.name}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{intern.email}</p>
                  </div>
                  {isManager && (
                    <div className="flex shrink-0 gap-1">
                      <IconButton icon={Edit} label={`Edit ${intern.name}`} onClick={() => handleEdit(intern)} />
                      <IconButton
                        icon={Trash2}
                        label={`Delete ${intern.name}`}
                        variant="danger"
                        onClick={() => setDeletingIntern(intern)}
                      />
                    </div>
                  )}
                </div>
                <dl className="mt-4 space-y-1.5 text-sm">
                  <div className="flex gap-1.5">
                    <dt className="font-medium text-slate-500 dark:text-slate-400">Department:</dt>
                    <dd className="text-slate-700 dark:text-slate-300">{intern.department}</dd>
                  </div>
                  <div className="flex gap-1.5">
                    <dt className="font-medium text-slate-500 dark:text-slate-400">Mentor:</dt>
                    <dd className="text-slate-700 dark:text-slate-300">{mentor ? mentor.name : 'Unassigned'}</dd>
                  </div>
                </dl>
              </Card>
            );
          })}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={resetForm} title={editingIntern ? 'Edit intern' : 'Add intern'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Select
            label="Department"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            required
          >
            <option value="">Select department</option>
            <option value="Development">Development</option>
            <option value="Testing">Testing</option>
            <option value="Design">Design</option>
          </Select>
          <Select
            label="Mentor"
            value={formData.mentorId}
            onChange={(e) => setFormData({ ...formData, mentorId: e.target.value })}
            required
          >
            <option value="">Select mentor</option>
            {(data?.mentors || []).map((mentor) => (
              <option key={mentor._id} value={mentor._id}>
                {mentor.name} - {mentor.field}
              </option>
            ))}
          </Select>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={resetForm} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              {editingIntern ? 'Save changes' : 'Add intern'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingIntern}
        onClose={() => setDeletingIntern(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete intern?"
        description={`This will permanently remove ${deletingIntern?.name ?? 'this intern'} from the portal.`}
        confirmLabel="Delete"
      />
    </div>
  );
};

export default Intern;
