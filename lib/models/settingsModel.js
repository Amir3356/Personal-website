/** Defaults keep the site rendering if data.json predates the settings block. */
export const DEFAULT_SETTINGS = {
  hero: {
    image: '/uploads/amir.png',
    cvUrl: '/cv.pdf',
    headingStart: 'Building Performance and ',
    /** Rotated by the typewriter effect in the hero heading */
    headingHighlights: ['scalable products', 'secure products'],
    intro:
      "Hi, I'm Amir Siraj, a full-stack developer who transforms ideas into powerful and scalable software solutions. I focus on building high-quality applications with clean code, strong performance, and intuitive user experiences.",
    ctaLabel: 'Contact Me',
  },
  experience: {
    heading: 'Experiences(3 years)',
    badge: 'Overall 3 Years Experiences',
  },
  contact: {
    email: 'amir@betwotech.com',
    phone: '',
    location: '',
    socials: [],
  },
};

/** Merges stored settings over the defaults so every field is always present. */
export function withDefaults(settings = {}) {
  return {
    hero: { ...DEFAULT_SETTINGS.hero, ...(settings.hero || {}) },
    experience: { ...DEFAULT_SETTINGS.experience, ...(settings.experience || {}) },
    contact: { ...DEFAULT_SETTINGS.contact, ...(settings.contact || {}) },
  };
}
