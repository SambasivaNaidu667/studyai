
export const DEMO_SUBJECTS = [
  {
    id: 'java',
    name: 'Java',
    color: 'accent',
    icon: '☕',
    topics: [
      { id: 'j1', name: 'OOP Concepts', done: true, notes: 'Polymorphism done!', priority: 'high', hours: 8 },
      { id: 'j2', name: 'Spring Boot', done: false, notes: 'Need to review annotations', priority: 'high', hours: 10 },
      { id: 'j3', name: 'Multithreading', done: false, notes: '', priority: 'med', hours: 6 },
    ],
  },
  {
    id: 'react',
    name: 'React',
    color: 'teal',
    icon: '⚛️',
    topics: [
      { id: 'r1', name: 'Hooks Overview', done: true, notes: 'useEffect is clear', priority: 'high', hours: 4 },
      { id: 'r2', name: 'State Management', done: false, notes: 'Redux context needed', priority: 'high', hours: 8 },
      { id: 'r3', name: 'React Router', done: false, notes: '', priority: 'med', hours: 5 },
    ],
  },
  {
    id: 'data-science',
    name: 'Data Science',
    color: 'amber',
    icon: '📊',
    topics: [
      { id: 'ds1', name: 'Pandas & NumPy', done: true, notes: 'Dataframes are easy', priority: 'high', hours: 6 },
      { id: 'ds2', name: 'Machine Learning Models', done: false, notes: 'Linear Regression', priority: 'high', hours: 12 },
      { id: 'ds3', name: 'Data Visualization', done: false, notes: '', priority: 'med', hours: 5 },
    ],
  },
]

export const DEMO_SCHEDULE = [
  { id: 's1', time: '08:00', subject: 'Java', topic: 'OOP Concepts', duration: 90, color: 'accent', done: false },
  { id: 's2', time: '10:00', subject: 'React', topic: 'Hooks Overview', duration: 120, color: 'teal', done: false },
  { id: 's3', time: '14:00', subject: 'Data Science', topic: 'Pandas & NumPy', duration: 90, color: 'amber', done: true },
  { id: 's4', time: '16:30', subject: 'Java', topic: 'Spring Boot', duration: 60, color: 'accent', done: false },
  { id: 's5', time: '19:00', subject: 'Revision', topic: 'Yesterday\'s topics', duration: 60, color: 'green', done: false },
]

export const STREAK_DATA = [
  3, 2, 4, 1, 0, 3, 4,
  2, 1, 0, 3, 4, 4, 2,
  0, 2, 4, 3, 1, 0, 4,
  4, 2, 3, 1, 0, 4, 4,
  4, 4, 4, 2, 0, 3, 3,
  0, 2, 4, 4, 4, 4, 3,
  0, 4, 4, 4, 4, 4, 4,
]



export const WEEK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export const COLOR_OPTIONS = ['accent', 'teal', 'amber', 'coral', 'green', 'blue']

export const SUBJECT_ICONS = ['💻', '☕', '⚛️', '📊', '📈', '🧠', '🤖', '🌐', '🚀', '🔥', '⚙️', '📱', '🎮']

export const PRIORITY_CONFIG = {
  high: { label: 'HIGH', color: 'var(--coral)', badge: 'badge-coral' },
  med: { label: 'MED', color: 'var(--amber)', badge: 'badge-amber' },
  low: { label: 'LOW', color: 'var(--green)', badge: 'badge-green' },
}

export const SUBJECT_COLOR_MAP = {
  accent: { bg: 'rgba(124,92,252,0.2)', border: 'rgba(124,92,252,0.3)', text: 'var(--accent2)', solid: 'var(--accent)' },
  teal: { bg: 'rgba(0,212,170,0.15)', border: 'rgba(0,212,170,0.25)', text: 'var(--teal2)', solid: 'var(--teal)' },
  amber: { bg: 'rgba(255,170,68,0.15)', border: 'rgba(255,170,68,0.25)', text: 'var(--amber2)', solid: 'var(--amber)' },
  coral: { bg: 'rgba(255,107,107,0.15)', border: 'rgba(255,107,107,0.25)', text: 'var(--coral2)', solid: 'var(--coral)' },
  green: { bg: 'rgba(68,217,136,0.15)', border: 'rgba(68,217,136,0.25)', text: 'var(--green2)', solid: 'var(--green)' },
  blue: { bg: 'rgba(68,153,255,0.15)', border: 'rgba(68,153,255,0.25)', text: 'var(--blue2)', solid: 'var(--blue)' },
}
