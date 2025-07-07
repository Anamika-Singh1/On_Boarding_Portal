import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Bell } from 'lucide-react';

const EventsPage = ({ user, data, updateData, showToast }) => {
  const API_BASE_URL = import.meta.env.VITE_API_URL || '';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: '', description: '', status: '', teamMembers: '', date: '',
    startTime: '', endTime: '', purpose: '', eventCoordinator: '', calendarLink: ''
  });
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [todayNotifications, setTodayNotifications] = useState([]);

  const fetchAndUpdateEvents = () => {
    fetch(`${API_BASE_URL}/api/events`)
      .then(res => res.json())
      .then(events => {
        const now = new Date();
        const updatedEvents = events.map(event => {
          const eventEnd = new Date(`${event.date}T${event.endTime || '23:59'}`);
          if (event.status === 'upcoming' && eventEnd < now) {
            fetch(`${API_BASE_URL}/api/events/${event._id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...event, status: 'past' })
            }).catch(console.error);
            return { ...event, status: 'past' };
          }
          return event;
        });
        updateData('events', updatedEvents);
      })
      .catch(err => console.error('Failed to fetch events:', err));
  };

  useEffect(() => {
    fetchAndUpdateEvents();
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayEvents = (data?.events || []).filter(event => event.date === today);
    setTodayNotifications(todayEvents);

    if (!user?.name) return;

    todayEvents.forEach(event => {
      event.teamMembers?.forEach(member => {
        if (typeof member === 'string' && typeof user.name === 'string') {
          if (member.toLowerCase().includes(user.name.toLowerCase())) {
            showToast(`You have a meeting today: "${event.name}"`, 'info');
          }
        }
      });
    });
  }, [data.events, user]);

  const filteredEvents = (data?.events || []).filter(event => {
    const name = (event.name || '').toLowerCase();
    const status = (event.status || '').toLowerCase();
    const matchesSearch = name.includes((search || '').toLowerCase());
    const matchesFilter = filter === 'all' || status === filter;
    return matchesSearch && matchesFilter;
  });

  const upcomingEvents = filteredEvents.filter(e => e.status === 'upcoming');
  const pastEvents = filteredEvents.filter(e => e.status === 'past');

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...formData, teamMembers: formData.teamMembers.split(',').map(t => t.trim()), status: 'upcoming' };

    if (editingEvent) {
      fetch(`${API_BASE_URL}/api/events/${editingEvent._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(res => res.json())
        .then(updated => {
          const updatedList = data.events.map(e => e._id === updated._id ? updated : e);
          updateData('events', updatedList);
          showToast('Event updated successfully!', 'success');
          resetForm();
        })
        .catch(err => {
          console.error('Update event error:', err);
          showToast('Failed to update event', 'error');
        });
    } else {
      fetch(`${API_BASE_URL}/api/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(res => res.json())
        .then(() => {
          fetchAndUpdateEvents();
          showToast('Event added successfully!', 'success');
          resetForm();
        })
        .catch(err => {
          console.error('Add event error:', err);
          showToast('Failed to add event', 'error');
        });
    }
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
    setFormData({
      name: '', description: '', status: '', teamMembers: '', date: '',
      startTime: '', endTime: '', purpose: '', eventCoordinator: '', calendarLink: ''
    });
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({ ...event, teamMembers: event.teamMembers.join(', ') });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this event?')) {
      fetch(`${API_BASE_URL}/api/events/${id}`, {
        method: 'DELETE'
      })
        .then(() => {
          const updated = data.events.filter(e => e._id !== id);
          updateData('events', updated);
          showToast('Event deleted successfully!', 'success');
        })
        .catch(err => {
          console.error('Delete event error:', err);
          showToast('Failed to delete event', 'error');
        });
    }
  };

  const EventCard = ({ event }) => (
    <div className="border rounded-xl p-4 bg-white dark:bg-gray-900 shadow-md">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{event.name}</h3>
          <p className="text-sm text-gray-500">{event.description}</p>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
          event.status === 'upcoming' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
        }`}>
          {event.status}
        </span>
      </div>
      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
        <li>📅 <strong>Date:</strong> {event.date}</li>
        <li>⏰ <strong>Time:</strong> {event.startTime} - {event.endTime}</li>
        <li>🎯 <strong>Purpose:</strong> {event.purpose}</li>
        <li>👤 <strong>Coordinator:</strong> {event.eventCoordinator}</li>
        {event.calendarLink && (
          <li>🔗 <a href={event.calendarLink} target="_blank" className="text-blue-600 hover:underline">Join Link</a></li>
        )}
      </ul>
      <div className="mt-3">
        <p className="text-sm font-medium mb-1">👥 Team Members:</p>
        <div className="flex flex-wrap gap-2">
          {event.teamMembers.map((m, i) => (
            <span key={i} className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-2 py-1 rounded text-xs">
              {m}
            </span>
          ))}
        </div>
      </div>
      {user?.role === 'manager' && (
        <div className="flex gap-3 mt-4">
          <button onClick={() => handleEdit(event)} className="text-blue-600 hover:text-blue-800">
            <Edit size={16} />
          </button>
          <button onClick={() => handleDelete(event._id)} className="text-red-600 hover:text-red-800">
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap gap-3 items-center justify-between border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">📅 Events</h1>
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Search by name..."
            className="border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md text-sm w-48"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md text-sm"
          >
            <option value="all">All</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
          {user?.role === 'manager' && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm flex items-center"
            >
              <Plus size={16} className="mr-1" /> Add Event
            </button>
          )}
        </div>
      </div>

      {todayNotifications.length > 0 && (
        <div className="bg-yellow-100 dark:bg-yellow-200/20 text-yellow-800 dark:text-yellow-400 px-4 py-3 rounded-md flex items-center gap-2 shadow-sm">
          <Bell size={18} />
          <span>You have {todayNotifications.length} meeting(s) scheduled today.</span>
        </div>
      )}

      <section>
        <h2 className="text-xl font-semibold">Upcoming Events</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {upcomingEvents.length > 0
            ? upcomingEvents.map(event => <EventCard key={event._id} event={event} />)
            : <p className="text-gray-500 text-sm italic">No upcoming events found.</p>}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Past Events</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {pastEvents.length > 0
            ? pastEvents.map(event => <EventCard key={event._id} event={event} />)
            : <p className="text-gray-500 text-sm italic">No past events found.</p>}
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">{editingEvent ? 'Edit Event' : 'Add Event'}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" placeholder="Event Name" className="w-full border px-3 py-2 rounded" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              <input type="text" placeholder="Coordinator" className="w-full border px-3 py-2 rounded" value={formData.eventCoordinator} onChange={(e) => setFormData({ ...formData, eventCoordinator: e.target.value })} required />
              <input type="text" placeholder="Purpose" className="w-full border px-3 py-2 rounded" value={formData.purpose} onChange={(e) => setFormData({ ...formData, purpose: e.target.value })} required />
              <textarea placeholder="Description" className="w-full border px-3 py-2 rounded" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
              <input type="date" className="w-full border px-3 py-2 rounded" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
              <input type="time" className="w-full border px-3 py-2 rounded" value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} required />
              <input type="time" className="w-full border px-3 py-2 rounded" value={formData.endTime} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} required />
              <input type="text" placeholder="Team Members (comma separated)" className="w-full border px-3 py-2 rounded" value={formData.teamMembers} onChange={(e) => setFormData({ ...formData, teamMembers: e.target.value })} required />
              <input type="url" placeholder="Google meet link" className="w-full border px-3 py-2 rounded" value={formData.calendarLink} onChange={(e) => setFormData({ ...formData, calendarLink: e.target.value })} />
              <div className="flex gap-3 justify-end">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{editingEvent ? 'Update' : 'Add'}</button>
                <button type="button" className="border px-4 py-2 rounded" onClick={resetForm}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
