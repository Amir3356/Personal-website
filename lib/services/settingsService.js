import { settingsRepository } from '../repositories/settingsRepository.js';
import { withDefaults } from '../models/settingsModel.js';

export const settingsService = {
  get: async () => withDefaults(await settingsRepository.get()),

  updateHero: (patch) => settingsRepository.updateSection('hero', patch),

  updateExperience: (patch) => settingsRepository.updateSection('experience', patch),

  updateContact: (patch) => settingsRepository.updateSection('contact', patch),
};
