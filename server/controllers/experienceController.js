import { experienceService } from '../services/experienceService.js';
import { ok, created } from '../handlers/responseHandler.js';

export const experienceController = {
  list: (req, res) => ok(res, experienceService.list()),

  create: (req, res) => created(res, experienceService.create(req.body)),

  update: (req, res) => ok(res, experienceService.update(req.params.id, req.body)),

  remove: (req, res) => ok(res, experienceService.remove(req.params.id)),
};
