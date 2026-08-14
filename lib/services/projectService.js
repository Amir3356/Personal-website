import { projectRepository } from '../repositories/projectRepository.js';
import { buildProject, validateProject } from '../models/projectModel.js';
import { AppError, notFound } from '../handlers/AppError.js';

export const projectService = {
  list: () => projectRepository.findAll(),

  create(input) {
    const project = buildProject(input);
    const error = validateProject(project);
    if (error) throw new AppError(error);
    return projectRepository.create(project);
  },

  async update(id, patch) {
    const updated = await projectRepository.update(id, patch);
    if (!updated) throw notFound('Project');
    return updated;
  },

  async remove(id) {
    if (!(await projectRepository.remove(id))) throw notFound('Project');
    return { message: 'Project deleted' };
  },
};
