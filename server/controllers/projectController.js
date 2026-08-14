import { projectService } from '../services/projectService.js';
import { ok, created } from '../handlers/responseHandler.js';

export const projectController = {
  list: (req, res) => ok(res, projectService.list()),

  create: (req, res) => created(res, projectService.create(req.body)),

  update: (req, res) => ok(res, projectService.update(req.params.id, req.body)),

  remove: (req, res) => ok(res, projectService.remove(req.params.id)),
};
