import React, { useState, useEffect } from 'react';
import fetchList from '@/utils/fetchList';
import { Plus, Trash2, Edit, Users as UsersIcon, Search, ArrowUpRight, GraduationCap, Building2, Briefcase, Sparkles, X } from 'lucide-react';
import {
  Card,
  Input,
  Button,
  IconButton,
  Badge,
  EmptyState,
  ConfirmDialog,
  Modal,
  CardGridSkeleton,
} from '@/components/ui';

const emptyForm = { name: '', department: '', field: '', project: '', skills: '' };

const Mentor = ({ user, data, updateData, showToast }) => {
  const API_BASE_URL = import.meta.env.VITE_API_URL || '';
  const [loadError, setLoadError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMentor, setEditingMentor] = useState(null);
  const [deletingMentor, setDeletingMentor] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const isManager = user.role === 'manager';
  const mentors = data.mentors || [];
  const departments = [...new Set(mentors.map((mentor) => mentor.department).filter(Boolean))].sort();
  const visibleMentors = mentors.filter((mentor) =>
    (!department || mentor.department === department) &&
    [mentor.name, mentor.field, mentor.department, mentor.project, ...(mentor.skills || [])]
      .filter(Boolean).join(' ').toLowerCase().includes(search.trim().toLowerCase())
  );
  const assignedCount = (data.interns || []).filter((intern) =>
    mentors.some((mentor) => mentor._id === (typeof intern.mentorId === 'object' ? intern.mentorId?._id : intern.mentorId))
  ).length;

  const fetchMentors = async () => {
    setLoadError(false);
    try {
      const [mentors, interns] = await Promise.all([fetchList('mentors'), fetchList('interns')]);
      updateData('mentors', mentors);
      updateData('interns', interns);
    } catch (err) {
      console.error('Error fetching mentors:', err);
      setLoadError(true);
      showToast('Unable to load mentors. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setIsModalOpen(false);
    setEditingMentor(null);
    setFormData({ ...emptyForm });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const skillsArray = formData.skills.split(',').map((s) => s.trim()).filter(Boolean);
    const payload = { ...formData, skills: skillsArray };

    setSubmitting(true);
    try {
      const url = editingMentor ? `${API_BASE_URL}/api/mentors/${editingMentor._id}` : `${API_BASE_URL}/api/mentors`;
      const method = editingMentor ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (!res.ok) {
        showToast(result.message || 'Something went wrong', 'error');
        return;
      }

      await fetchMentors();
      showToast(editingMentor ? 'Mentor updated successfully!' : 'Mentor added successfully!', 'success');
      resetForm();
    } catch (error) {
      console.error('Error submitting mentor:', error);
      showToast('Server error. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (mentor) => {
    setEditingMentor(mentor);
    setFormData({
      name: mentor.name,
      department: mentor.department || '',
      field: mentor.field,
      project: mentor.project,
      skills: (mentor.skills || []).join(', '),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingMentor) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/mentors/${deletingMentor._id}`, { method: 'DELETE' });

      if (!res.ok) {
        const contentType = res.headers.get('content-type');
        let errorMessage = 'Failed to delete mentor';
        if (contentType && contentType.includes('application/json')) {
          const result = await res.json();
          errorMessage = result.message || errorMessage;
        }
        showToast(errorMessage, 'error');
        return;
      }

      const result = await res.json();
      showToast(result.message || 'Mentor deleted successfully!', 'success');
      await fetchMentors();
    } catch (err) {
      console.error('Error deleting mentor:', err.message);
      showToast('Failed to delete mentor. Please try again.', 'error');
    } finally {
      setDeleting(false);
      setDeletingMentor(null);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">People & growth</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white">Your mentor network</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Great journeys start with the right guidance.</p>
        </div>
        {isManager && <Button onClick={() => setIsModalOpen(true)}><Plus size={16} /> Add mentor</Button>}
      </header>

      <section className="relative overflow-hidden rounded-3xl bg-slate-900 p-7 text-white sm:p-10" aria-label="Mentorship overview">
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-32 h-96 w-96 rounded-full border-[50px] border-blue-400/10" />
        <div aria-hidden="true" className="pointer-events-none absolute bottom-0 right-32 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-blue-200"><Sparkles size={13} /> Better together</span>
            <h2 className="mt-5 max-w-md text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">A little guidance.<br /><span className="text-blue-300">A world of possibility.</span></h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">Meet the people sharing their expertise, supporting your projects, and helping you take your next step.</p>
          </div>
          <dl className="grid grid-cols-3 gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-7">
            {[[UsersIcon, 'Mentors', mentors.length], [Building2, 'Departments', departments.length], [GraduationCap, 'Interns guided', assignedCount]].map(([Icon, label, value]) => (
              <div key={label} className="min-w-0">
                {React.createElement(Icon, { size: 20, className: 'mb-4 text-blue-300', 'aria-hidden': true })}
                <dd className="text-3xl font-semibold tracking-tight sm:text-4xl">{loading ? '—' : value}</dd>
                <dt className="mt-2 text-xs leading-5 text-slate-300">{label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="mentor-directory" className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="mentor-directory" className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">Meet your mentors <span className="ml-2 rounded-full bg-blue-50 px-2.5 py-1 align-middle text-xs text-blue-700 dark:bg-blue-950 dark:text-blue-300">{loading ? '…' : mentors.length}</span></h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Find expertise. Build connections. Grow together.</p>
          </div>
          <div className="flex w-full flex-wrap gap-3 sm:w-auto">
            <div className="relative min-w-0 flex-1 sm:w-72">
              <Search size={17} aria-hidden="true" className="absolute left-3.5 top-3 text-slate-400" />
              <input aria-label="Search mentors" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search names, skills, projects…" className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-9 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
              {search && <button type="button" aria-label="Clear search" onClick={() => setSearch('')} className="absolute right-2 top-2 rounded-md p-1.5 text-slate-500"><X size={16} /></button>}
            </div>
            <select aria-label="Filter by department" value={department} onChange={(event) => setDepartment(event.target.value)} className="h-11 max-w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
              <option value="">All departments</option>
              {departments.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
        </div>
        {!loading && (search || department) && <p role="status" className="text-sm text-slate-500 dark:text-slate-400">Showing {visibleMentors.length} of {mentors.length} mentors</p>}

      {loadError ? (
        <EmptyState icon={UsersIcon} title="Unable to load the mentor directory" description="Check your connection and try again." action={<Button onClick={() => { setLoading(true); fetchMentors(); }}>Try again</Button>} />
      ) : loading ? (
        <CardGridSkeleton />
      ) : mentors.length === 0 ? (
        <EmptyState
          icon={UsersIcon}
          title="No mentors yet"
          description={isManager ? 'Add a mentor so interns know who to reach out to.' : 'No mentors have been added yet.'}
          action={
            isManager && (
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus size={16} className="mr-1.5" /> Add the first mentor
              </Button>
            )
          }
        />
      ) : visibleMentors.length === 0 ? (
        <EmptyState icon={Search} title="No matching mentors" description="Try another name, skill, or department." action={<Button variant="outline" onClick={() => { setSearch(''); setDepartment(''); }}>Clear filters</Button>} />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleMentors.map((mentor) => {
            const assignedInterns = (data.interns || []).filter((intern) => {
              if (!intern.mentorId) return false;
              if (typeof intern.mentorId === 'object') return intern.mentorId._id === mentor._id;
              return intern.mentorId === mentor._id;
            });
            return (
              <Card key={mentor._id} hover className="flex min-w-0 flex-col !rounded-2xl !shadow-none hover:!border-blue-300 dark:hover:!border-blue-700">
                <div className="flex items-start justify-between gap-3">
                  <div aria-hidden="true" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 text-lg font-bold text-blue-700 dark:from-blue-950 dark:to-indigo-950 dark:text-blue-300">
                    {(mentor.name || '?').trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('')}
                  </div>
                  {isManager && (
                    <div className="flex shrink-0 gap-1">
                      <IconButton icon={Edit} label={`Edit ${mentor.name}`} onClick={() => handleEdit(mentor)} />
                      <IconButton icon={Trash2} label={`Delete ${mentor.name}`} variant="danger" onClick={() => setDeletingMentor(mentor)} />
                    </div>
                  )}
                </div>
                <div className="mt-4 break-words">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{mentor.name}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {mentor.field}
                    </p>
                    {mentor.department && <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400"><Building2 size={13} aria-hidden="true" />{mentor.department}</p>}
                </div>

                <dl className="mt-5 rounded-xl bg-slate-50 p-3.5 text-sm dark:bg-slate-800/60">
                  <div>
                    <dt className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400"><Briefcase size={13} aria-hidden="true" /> Current project</dt>
                    <dd className="mt-2 break-words font-medium text-slate-700 dark:text-slate-200">{mentor.project || 'No project assigned'}</dd>
                  </div>
                </dl>

                {mentor.skills?.length > 0 && (
                  <div className="mb-5 mt-4 flex flex-wrap gap-1.5">
                    {mentor.skills.map((skill, i) => (
                      <Badge key={i} variant="info" withIcon={false}>
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="mt-auto border-t border-slate-100 pt-4 text-sm dark:border-slate-800">
                  <p className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
                    <UsersIcon size={16} className="text-blue-500" aria-hidden="true" />
                    {assignedInterns.length} intern{assignedInterns.length === 1 ? '' : 's'} assigned
                  </p>
                  {assignedInterns.length > 0 && (
                    <details className="mt-3 text-slate-500 dark:text-slate-400">
                      <summary className="cursor-pointer text-xs font-medium text-blue-600 dark:text-blue-400">View assigned interns <ArrowUpRight size={12} className="inline" aria-hidden="true" /></summary>
                    <ul className="mt-3 space-y-2 break-words">
                      {assignedInterns.map((i) => (
                        <li key={i._id || i.id}>
                          {i.name} <span className="text-slate-400 dark:text-slate-500">({i.email})</span>
                        </li>
                      ))}
                    </ul>
                    </details>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
      </section>

      <Modal isOpen={isModalOpen} onClose={resetForm} title={editingMentor ? 'Edit mentor' : 'Add mentor'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Department"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            required
          />
          <Input
            label="Field"
            value={formData.field}
            onChange={(e) => setFormData({ ...formData, field: e.target.value })}
            placeholder="e.g. Machine Learning"
            required
          />
          <Input
            label="Project"
            value={formData.project}
            onChange={(e) => setFormData({ ...formData, project: e.target.value })}
            required
          />
          <Input
            label="Skills"
            hint="Comma separated"
            value={formData.skills}
            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
            placeholder="Python, React"
            required
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={resetForm} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              {editingMentor ? 'Save changes' : 'Add mentor'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingMentor}
        onClose={() => setDeletingMentor(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete mentor?"
        description={`This will remove ${deletingMentor?.name ?? 'this mentor'} from the portal. Assigned interns will keep their reference to this mentor until reassigned.`}
        confirmLabel="Delete"
      />
    </div>
  );
};

export default Mentor;
