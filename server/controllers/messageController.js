import { messageService } from '../services/messageService.js';
import { ok, created } from '../handlers/responseHandler.js';

export const messageController = {
  list: (req, res) => ok(res, messageService.list()),

  create: (req, res) => created(res, messageService.create(req.body)),

  setRead: (req, res) => ok(res, messageService.setRead(req.params.id, req.body?.read)),

  remove: (req, res) => ok(res, messageService.remove(req.params.id)),
};
