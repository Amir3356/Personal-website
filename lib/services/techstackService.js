import { techstackRepository } from '../repositories/techstackRepository.js';
import {
  buildTechstack,
  validateTechstack,
  normaliseSkills,
} from '../models/techstackModel.js';
import { AppError, notFound } from '../handlers/AppError.js';

export const techstackService = {
  list: () => techstackRepository.findAll(),

  create(input) {
    const group = buildTechstack(input);
    const error = validateTechstack(group);
    if (error) throw new AppError(error);
    return techstackRepository.create(group);
  },

  async update(id, patch) {
    // A patch may omit `skills`; only normalise (and validate) what was sent.
    const next = { ...patch };
    if ('skills' in next) next.skills = normaliseSkills(next.skills);

    const existing = await techstackRepository.findById(id);
    if (!existing) throw notFound('Techstack group');

    const error = validateTechstack({ ...existing, ...next });
    if (error) throw new AppError(error);

    return techstackRepository.update(id, next);
  },

  async remove(id) {
    if (!(await techstackRepository.remove(id))) throw notFound('Techstack group');
    return { message: 'Techstack group deleted' };
  },
};
