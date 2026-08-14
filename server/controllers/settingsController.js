import { settingsService } from '../services/settingsService.js';
import { ok } from '../handlers/responseHandler.js';

export const settingsController = {
  get: (req, res) => ok(res, settingsService.get()),

  updateHero: (req, res) => ok(res, settingsService.updateHero(req.body)),

  updateExperience: (req, res) => ok(res, settingsService.updateExperience(req.body)),

  updateContact: (req, res) => ok(res, settingsService.updateContact(req.body)),
};
