import { DEFAULT_SETTINGS } from '../models/settingsModel.js';

/** Baseline content used when data.json is missing or reset. */
export const seedData = {
  experience: [
    {
      id: 'exp-1',
      period: '2026 · 3-Month Internship',
      role: 'Software Developer Intern',
      company: 'Betwo Tech PLC',
      kind: 'work',
      description:
        'Worked on both individual and team-based projects, contributing across frontend and backend development.',
      tags: [],
    },
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'Pharmacy Management System',
      description:
        'Pharmacy operations suite covering medicine stock, expiry tracking, sales and supplier management with clear reporting.',
      tags: ['Next.js', 'Laravel', 'PostgreSQL', 'Docker'],
      image: '/uploads/pharmacy-management-system.jpg',
      href: 'https://github.com/Amir3356/pharmacy-management-system',
    },
  ],
  messages: [],
  settings: DEFAULT_SETTINGS,
};
