/** Shape of a project entry, with defaults for anything the client omits. */
export function buildProject(input = {}) {
  return {
    id: 'proj-' + Date.now(),
    title: input.title || '',
    description: input.description || '',
    /** Long-form copy shown in the View Details popup. */
    detail: input.detail || '',
    tags: Array.isArray(input.tags) ? input.tags : [],
    image: input.image || '',
    href: input.href || '',
  };
}

export function validateProject(project) {
  if (!project.title) return 'Title is required';
  return null;
}
