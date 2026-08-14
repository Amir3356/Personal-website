/**
 * A techstack group: one card on the live Techstack section, holding a title,
 * a glyph icon and the list of skills shown beneath it.
 */
export function buildTechstack(input = {}) {
  return {
    id: 'tech-' + Date.now(),
    title: input.title || '',
    icon: input.icon || '◈',
    skills: normaliseSkills(input.skills),
  };
}

/**
 * Skills arrive either as an array (API clients) or as a comma-separated string
 * (the admin form's single-line input), so accept both and drop blanks.
 */
export function normaliseSkills(skills) {
  const list = Array.isArray(skills)
    ? skills
    : typeof skills === 'string'
      ? skills.split(',')
      : [];
  return list
    .map((skill) => String(skill).trim())
    .filter(Boolean)
    .slice(0, 30);
}

export function validateTechstack(group) {
  if (!group.title) return 'Title is required';
  if (!group.skills.length) return 'Add at least one skill';
  return null;
}
