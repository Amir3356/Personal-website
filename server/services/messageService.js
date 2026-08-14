import { messageRepository } from '../repositories/messageRepository.js';
import { buildMessage, validateMessage } from '../models/messageModel.js';
import { AppError, notFound } from '../handlers/AppError.js';

export const messageService = {
  list: () => messageRepository.findAll(),

  create(input) {
    const message = buildMessage(input);
    const error = validateMessage(message);
    if (error) throw new AppError(error);
    // Newest first, so the inbox reads top-down.
    messageRepository.create(message, { prepend: true });
    return { message: 'Message received' };
  },

  setRead(id, read) {
    const updated = messageRepository.update(id, { read: Boolean(read) });
    if (!updated) throw notFound('Message');
    return updated;
  },

  remove(id) {
    if (!messageRepository.remove(id)) throw notFound('Message');
    return { message: 'Message deleted' };
  },
};
