import { messageRepository } from '../repositories/messageRepository.js';
import { buildMessage, validateMessage } from '../models/messageModel.js';
import { AppError, notFound } from '../handlers/AppError.js';
import { sendContactEmail } from '../mailer.js';

export const messageService = {
  list: () => messageRepository.findAll(),

  async create(input) {
    const message = buildMessage(input);
    const error = validateMessage(message);
    if (error) throw new AppError(error);
    // Newest first, so the inbox reads top-down.
    messageRepository.create(message, { prepend: true });
    // Stored first: the inbox is the source of truth, email is a notification.
    // sendContactEmail swallows its own errors, so a bad SMTP setup never
    // turns a successful submission into an error for the visitor.
    await sendContactEmail(message);
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
