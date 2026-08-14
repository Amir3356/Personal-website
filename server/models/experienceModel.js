/** Shape of an experience entry, with defaults for anything the client omits. */
export function buildExperience(input = {}) {
  return {
    id: 'exp-' + Date.now(),
    role: input.role || '',
    company: input.company || '',
    period: input.period || '',
    description: input.description || '',
    kind: input.kind || 'work',
    tags: Array.isArray(input.tags) ? input.tags : [],
  };
}

export function validateExperience(experience) {
  if (!experience.role || !experience.company) {
    return 'Role and company are required';
  }
  return null;
}
