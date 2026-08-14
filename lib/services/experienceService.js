import { experienceRepository } from '../repositories/experienceRepository.js';
import { buildExperience, validateExperience } from '../models/experienceModel.js';
import { AppError, notFound } from '../handlers/AppError.js';

export const experienceService = {
  list: () => experienceRepository.findAll(),

  create(input) {
    const experience = buildExperience(input);
    const error = validateExperience(experience);
    if (error) throw new AppError(error);
    return experienceRepository.create(experience);
  },

  async update(id, patch) {
    const updated = await experienceRepository.update(id, patch);
    if (!updated) throw notFound('Experience');
    return updated;
  },

  async remove(id) {
    if (!(await experienceRepository.remove(id))) throw notFound('Experience');
    return { message: 'Experience deleted' };
  },
};
