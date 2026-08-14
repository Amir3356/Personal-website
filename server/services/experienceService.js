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

  update(id, patch) {
    const updated = experienceRepository.update(id, patch);
    if (!updated) throw notFound('Experience');
    return updated;
  },

  remove(id) {
    if (!experienceRepository.remove(id)) throw notFound('Experience');
    return { message: 'Experience deleted' };
  },
};
