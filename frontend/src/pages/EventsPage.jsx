import { API_BASE_URL as configuredApiBaseUrl } from '../utils/api';
import React, { useEffect, useRef, useState } from 'react';
import { Plus, Edit, Trash2, Bell, CalendarDays, Search, Link as LinkIcon } from 'lucide-react';
import {
  Card,
  Input,
  Textarea,
  Badge,
  Button,
  IconButton,
  EmptyState,
  PageHeader,
  ConfirmDialog,
  Modal,
  CardGridSkeleton,
} from '@/components/ui';

// const emptyForm = {
//   name: '', description: '', status: '', teamMembers: '', date: '',
//   startTime: '', endTime: '', purpose: '', eventCoordinator: '', calendarLink: '',
// };
const createEmptyForm = () => ({
  name: '',
  description: '',
  status: '',
  teamMembers: '',
  date: '',
  startTime: '',
  endTime: '',
  purpose: '',
  eventCoordinator: '',
  calendarLink: '',
});

const EventCard = ({ event, isManager, onEdit, onDelete }) => (
  <Card hover>
    <div className="flex items-start justify-between gap-3">
      <div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">{event.name}</h3>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{event.description}</p>
      </div>
      <Badge variant={event.status === 'upcoming' ? 'success' : 'neutral'}>{event.status}</Badge>
    </div>
    <dl className="mt-3 space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
      <div className="flex gap-1.5">
        <dt className="font-medium text-slate-500 dark:text-slate-400">Date:</dt>
        <dd>{event.date}</dd>
      </div>
      <div className="flex gap-1.5">
        <dt className="font-medium text-slate-500 dark:text-slate-400">Time:</dt>
        <dd>{event.startTime} – {event.endTime}</dd>
      </div>
      <div className="flex gap-1.5">
        <dt className="font-medium text-slate-500 dark:text-slate-400">Purpose:</dt>
        <dd>{event.purpose}</dd>
      </div>
      <div className="flex gap-1.5">
        <dt className="font-medium text-slate-500 dark:text-slate-400">Coordinator:</dt>
        <dd>{event.eventCoordinator}</dd>
      </div>
      {event.calendarLink && (
        <div className="flex items-center gap-1.5">
          <LinkIcon size={14} className="text-slate-400" />
          <a href={event.calendarLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline dark:text-blue-400">
            Join link
          </a>
        </div>
      )}
    </dl>
    {event.teamMembers?.length > 0 && (
      <div className="mt-3">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Team members</span>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {event.teamMembers.map((m, i) => (
            <Badge key={i} variant="neutral" withIcon={false}>{m}</Badge>
          ))}
        </div>
      </div>
    )}
    {isManager && (
      <div className="mt-4 flex justify-end gap-1 border-t border-slate-100 pt-3 dark:border-slate-800">
        <IconButton icon={Edit} label={`Edit ${event.name}`} onClick={() => onEdit(event)} />
        <IconButton icon={Trash2} label={`Delete ${event.name}`} variant="danger" onClick={() => onDelete(event)} />
      </div>
    )}
  </Card>
);

const EventsPage = ({ user, data, updateData, showToast }) => {
  const API_BASE_URL = configuredApiBaseUrl;
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deletingEvent, setDeletingEvent] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState(createEmptyForm());
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [todayNotifications, setTodayNotifications] = useState([]);
  const notifiedEventIds = useRef(new Set());
  const isManager = user?.role === 'manager';

  const fetchAndUpdateEvents = () => {
    fetch(`${API_BASE_URL}/api/events`)
      .then(async (res) => {
        const events = await res.json();
        if (!res.ok || !Array.isArray(events)) throw new Error(events?.message || 'Unable to load events');
        return events;
      })
      .then((events) => {
        const now = new Date();
        const updatedEvents = events.map((event) => {
          const eventEnd = new Date(`${event.date}T${event.endTime || '23:59'}`);
          if (event.status === 'upcoming' && eventEnd < now) {
            fetch(`${API_BASE_URL}/api/events/${event._id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...event, status: 'past' }),
            }).catch(console.error);
            return { ...event, status: 'past' };
          }
          return event;
        });
        updateData('events', updatedEvents);
      })
      .catch((err) => {
        console.error('Failed to fetch events:', err);
        showToast('Unable to load events. Please try again.', 'error');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAndUpdateEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayEvents = (data?.events || []).filter((event) => event.date === today);
    setTodayNotifications(todayEvents);

    if (!user?.name) return;
    todayEvents.forEach((event) => {
      if (notifiedEventIds.current.has(event._id)) return;
      const isOnTeam = event.teamMembers?.some(
        (member) => typeof member === 'string' && member.toLowerCase().includes(user.name.toLowerCase())
      );
      if (isOnTeam) {
        notifiedEventIds.current.add(event._id);
        showToast(`You have a meeting today: "${event.name}"`, 'info');
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.events, user]);

  const filteredEvents = (data?.events || []).filter((event) => {
    const name = (event.name || '').toLowerCase();
    const status = (event.status || '').toLowerCase();
    const matchesSearch = name.includes((search || '').toLowerCase());
    const matchesFilter = filter === 'all' || status === filter;
    return matchesSearch && matchesFilter;
  });

  const upcomingEvents = filteredEvents.filter((e) => e.status === 'upcoming');
  const pastEvents = filteredEvents.filter((e) => e.status === 'past');

const resetForm = () => {
  const freshForm = createEmptyForm();

  console.log('RESETTING FORM:', freshForm);

  setSubmitting(false);
  setEditingEvent(null);
  setFormData(freshForm);
  setIsModalOpen(false);
};
  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...formData, teamMembers: formData.teamMembers.split(',').map((t) => t.trim()), status: 'upcoming' };
    setSubmitting(true);

    if (editingEvent) {
      fetch(`${API_BASE_URL}/api/events/${editingEvent._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((updated) => {
          const updatedList = data.events.map((e) => (e._id === updated._id ? updated : e));
          updateData('events', updatedList);
          showToast('Event updated successfully!', 'success');
          resetForm();
        })
        .catch((err) => {
          console.error('Update event error:', err);
          showToast('Failed to update event', 'error');
        })
        .finally(() => setSubmitting(false));
    } else {
      fetch(`${API_BASE_URL}/api/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then(() => {
          fetchAndUpdateEvents();
          showToast('Event added successfully!', 'success');
          resetForm();
        })
        .catch((err) => {
          console.error('Add event error:', err);
          showToast('Failed to add event', 'error');
        })
        .finally(() => setSubmitting(false));
    }
  };

// const handleEdit = (event) => {
//   setEditingEvent(event);
//   setFormData({ ...emptyForm, ...event, teamMembers: event.teamMembers.join(', ') });
//   setIsModalOpen(true);
// };
const handleEdit = (event) => {
  setEditingEvent(event);

  setFormData({
    ...createEmptyForm(),
    ...event,
    teamMembers: Array.isArray(event.teamMembers)
      ? event.teamMembers.join(', ')
      : event.teamMembers || '',
  });

  setIsModalOpen(true);
};
  const handleDelete = () => {
    if (!deletingEvent) return;
    setDeleting(true);
    fetch(`${API_BASE_URL}/api/events/${deletingEvent._id}`, { method: 'DELETE' })
      .then(() => {
        const updated = data.events.filter((e) => e._id !== deletingEvent._id);
        updateData('events', updated);
        showToast('Event deleted successfully!', 'success');
      })
      .catch((err) => {
        console.error('Delete event error:', err);
        showToast('Failed to delete event', 'error');
      })
      .finally(() => {
        setDeleting(false);
        setDeletingEvent(null);
      });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Events"
        description="Orientation sessions, meetings, and other scheduled events."
        actions={
          isManager && (
<Button
  type="button"
  onClick={() => {
    setEditingEvent(null);
    setFormData({ ...createEmptyForm  });
    setSubmitting(false);
    setIsModalOpen(true);
  }}
>
  <Plus size={16} className="mr-1.5" />
  Add event
</Button>
          )
        }
      />

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search events by name…"
            className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        >
          <option value="all">All events</option>
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
        </select>
      </div>

      {todayNotifications.length > 0 && (
        <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-500/10 dark:text-amber-400">
          <Bell size={18} />
          <span>You have {todayNotifications.length} meeting(s) scheduled today.</span>
        </div>
      )}

      {loading ? (
        <CardGridSkeleton />
      ) : (
        <>
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Upcoming events</h2>
            {upcomingEvents.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {upcomingEvents.map((event) => (
                  <EventCard key={event._id} event={event} isManager={isManager} onEdit={handleEdit} onDelete={setDeletingEvent} />
                ))}
              </div>
            ) : (
              <EmptyState icon={CalendarDays} title="No upcoming events" description="No events match your current search or filter." />
            )}
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Past events</h2>
            {pastEvents.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {pastEvents.map((event) => (
                  <EventCard key={event._id} event={event} isManager={isManager} onEdit={handleEdit} onDelete={setDeletingEvent} />
                ))}
              </div>
            ) : (
              <EmptyState icon={CalendarDays} title="No past events" description="Events move here automatically once they end." />
            )}
          </section>
        </>
      )}

      <Modal isOpen={isModalOpen} onClose={resetForm} title={editingEvent ? 'Edit event' : 'Add event'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Event name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          <Input label="Coordinator" value={formData.eventCoordinator} onChange={(e) => setFormData({ ...formData, eventCoordinator: e.target.value })} required />
          <Input label="Purpose" value={formData.purpose} onChange={(e) => setFormData({ ...formData, purpose: e.target.value })} required />
          <Textarea label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="Date" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
            <Input label="Start time" type="time" value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} required />
            <Input label="End time" type="time" value={formData.endTime} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} required />
          </div>
          <Input
            label="Team members"
            hint="Comma separated"
            value={formData.teamMembers}
            onChange={(e) => setFormData({ ...formData, teamMembers: e.target.value })}
            required
          />
          <Input
            label="Meeting link"
            hint="Optional"
            type="url"
            value={formData.calendarLink}
            onChange={(e) => setFormData({ ...formData, calendarLink: e.target.value })}
            placeholder="https://meet.google.com/…"
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={resetForm} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              {editingEvent ? 'Save changes' : 'Add event'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingEvent}
        onClose={() => setDeletingEvent(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete event?"
        description={`This will permanently remove "${deletingEvent?.name ?? ''}".`}
        confirmLabel="Delete"
      />
    </div>
  );
};

export default EventsPage;
