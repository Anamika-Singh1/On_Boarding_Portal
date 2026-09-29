import { API_BASE_URL as configuredApiBaseUrl } from '../utils/api';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  ListChecks,
  Users as UsersIcon,
  GraduationCap,
  CalendarDays,
  PlayCircle,
  ArrowRight,
  FolderKanban,
} from 'lucide-react';
import { Card, CardHeader, Badge, EmptyState } from '@/components/ui';
import getYouTubeVideoId from '@/utils/getYouTubeVideoId';

const SOCIAL_LINKS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/aiensured/', icon: Linkedin },
  { label: 'X (Twitter)', href: 'https://x.com/AiEnsured', icon: Twitter },
  { label: 'Facebook', href: 'https://www.facebook.com/people/Aiensured/100083361199410/#', icon: Facebook },
  { label: 'Instagram', href: 'https://www.instagram.com/aiensured_com/', icon: Instagram },
  { label: 'YouTube', href: 'https://www.youtube.com/c/AiEnsured', icon: Youtube },
];

const StatTile = ({ icon: Icon, label, value, to }) => (
  <Link
    to={to}
    className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
  >
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
      {React.createElement(Icon, { className: 'h-5 w-5', 'aria-hidden': true })}
    </div>
    <div>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  </Link>
);

const QuickAction = ({ icon: Icon, label, to }) => (
  <Link
    to={to}
    className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-slate-800 dark:text-slate-200 dark:hover:border-blue-500/40 dark:hover:bg-blue-500/10"
  >
    <span className="flex items-center gap-2.5">
      {React.createElement(Icon, { className: 'h-4 w-4 text-slate-400', 'aria-hidden': true })}
      {label}
    </span>
    <ArrowRight className="h-4 w-4 text-slate-300" aria-hidden="true" />
  </Link>
);

const HomePage = ({ user, data }) => {
  const [mentorCount, setMentorCount] = useState(null);
  const [internCount, setInternCount] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [retry, setRetry] = useState(0);
  const apiBaseUrl = configuredApiBaseUrl;

  useEffect(() => {
    let cancelled = false;
    setLoadError(false);
    setMentorCount(null);
    setInternCount(null);
    const readList = async (response) => {
      if (!response.ok) throw new Error('Unable to load team');
      const list = await response.json();
      if (!Array.isArray(list)) throw new Error('Invalid team response');
      return list;
    };
    Promise.all([
      fetch(`${apiBaseUrl}/api/mentors`).then(readList),
      fetch(`${apiBaseUrl}/api/interns`).then(readList),
    ])
      .then(([mentors, interns]) => {
        if (cancelled) return;
        setMentorCount(Array.isArray(mentors) ? mentors.length : 0);
        setInternCount(Array.isArray(interns) ? interns.length : 0);
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError(true);
        }
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retry]);

  const upcomingEvents = (data.events || [])
    .filter((e) => e.status === 'upcoming')
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const previewVideos = (data.videos || []).slice(0, 3);
  const isManager = user.role === 'manager';

  const quickActions = isManager
    ? [
        { icon: UsersIcon, label: 'Manage mentors', to: '/mentors' },
        { icon: GraduationCap, label: 'Manage interns', to: '/interns' },
        { icon: CalendarDays, label: 'Schedule an event', to: '/events' },
        { icon: PlayCircle, label: 'Manage training videos', to: '/videos' },
      ]
    : [
        { icon: ListChecks, label: 'View onboarding checklist', to: '/onboarding' },
        { icon: UsersIcon, label: 'Meet your mentors', to: '/mentors' },
        { icon: CalendarDays, label: 'View upcoming events', to: '/events' },
        { icon: PlayCircle, label: 'Watch training videos', to: '/videos' },
      ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Your workspace, connected</p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Welcome back, {user.name?.split(' ')[0] || 'there'}.
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {isManager
            ? "Here's a snapshot of your onboarding program today."
            : "Here's what's happening in your onboarding portal today."}
        </p>
        </div>
        <p className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-900"><CalendarDays size={16} />{new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</p>
      </div>

      <section className="relative overflow-hidden rounded-3xl bg-slate-900 p-7 text-white sm:p-9">
        <div aria-hidden="true" className="absolute -right-16 -top-24 h-80 w-80 rounded-full border-[45px] border-blue-400/10" />
        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-xl"><span className="text-xs font-medium uppercase tracking-widest text-blue-300">A strong start. A brighter future.</span><h2 className="mt-3 text-3xl font-semibold tracking-tight">Turn potential into progress.</h2><p className="mt-3 text-sm leading-6 text-slate-300">Your people, projects, and learning in one place. Pick up where you left off and make today a step forward.</p></div>
          <Link to={isManager ? '/projects' : '/onboarding'} className="inline-flex items-center gap-3 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-blue-100">{isManager ? 'Explore projects' : 'Start learning'}<ArrowRight size={16} /></Link>
        </div>
      </section>
      {loadError && <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">Team totals are unavailable. Please try again.<button onClick={() => setRetry((value) => value + 1)} className="rounded-lg border border-current px-3 py-1 font-semibold">Retry</button></div>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile icon={UsersIcon} label="Mentors" value={mentorCount ?? '—'} to="/mentors" />
        <StatTile icon={GraduationCap} label="Interns" value={internCount ?? '—'} to="/interns" />
        <StatTile icon={CalendarDays} label="Upcoming events" value={upcomingEvents.length} to="/events" />
        <StatTile
          icon={ListChecks}
          label="Onboarding resources"
          value={(data.onboardingEssentials || []).length}
          to="/onboarding"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Quick actions" description="Jump straight to what you need." />
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {quickActions.map((action) => (
              <QuickAction key={action.to} {...action} />
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Official links" description="Stay connected with AiEnsured." />
          <ul className="mt-4 space-y-1">
            {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 rounded-md px-2 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400"
                >
                  {React.createElement(Icon, { className: 'h-4 w-4 text-slate-400', 'aria-hidden': true })}
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Upcoming"
            description="Your next scheduled events."
            actions={
              <Link to="/events" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
                View all
              </Link>
            }
          />
          <div className="mt-4">
            {upcomingEvents.length > 0 ? (
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {upcomingEvents.slice(0, 3).map((event) => (
                  <li key={event._id} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{event.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {event.date} {event.startTime && `· ${event.startTime}`}
                      </p>
                    </div>
                    <Badge variant="success">Upcoming</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                icon={CalendarDays}
                title="No upcoming events"
                description="Scheduled orientations and meetings will show up here."
              />
            )}
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Project progress"
            description="Keep your team's work moving forward."
            actions={<Link to="/projects" className="text-sm font-medium text-blue-600 dark:text-blue-400">View all</Link>}
          />
          <div className="mt-4">
            {(data.projects || []).length > 0 ? <ul className="space-y-5">{data.projects.slice(0, 3).map((project) => {
              const progress = Math.min(100, Math.max(0, Number(project.progress) || 0));
              return <li key={project.id}><div className="mb-2 flex items-center justify-between gap-3 text-sm"><Link to="/projects" className="truncate font-medium text-slate-700 hover:text-blue-600 dark:text-slate-200">{project.name}</Link><span className="text-xs text-slate-500">{progress}%</span></div><progress aria-label={`${project.name} completion`} max="100" value={progress} className="project-progress h-2 w-full overflow-hidden rounded-full" /></li>;
            })}</ul> : <EmptyState icon={FolderKanban} title="Your next project starts here" description="Projects and their progress will appear here as your team adds them." action={<Link to="/projects" className="text-sm font-semibold text-blue-600 dark:text-blue-400">Explore projects →</Link>} />}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Training videos"
          description="A quick look at what's available."
          actions={
            <Link to="/videos" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
              View all
            </Link>
          }
        />
        <div className="mt-4">
          {previewVideos.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-3">
              {previewVideos.map((video) => {
                const videoId = getYouTubeVideoId(video.url);
                return (
                  <Link
                    key={video.id}
                    to="/videos"
                    className="group overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800"
                  >
                    <div className="aspect-video bg-slate-100 dark:bg-slate-800">
                      {videoId && (
                        <img
                          src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                          alt=""
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      )}
                    </div>
                    <p className="truncate p-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                      {video.title}
                    </p>
                  </Link>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={PlayCircle}
              title="No training videos yet"
              description={
                isManager
                  ? 'Add your first training video to help interns get up to speed.'
                  : 'Your manager hasn’t added any training videos yet.'
              }
            />
          )}
        </div>
      </Card>
    </div>
  );
};

export default HomePage;
