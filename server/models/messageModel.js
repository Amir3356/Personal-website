const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const clean = (value, max) => (typeof value === 'string' ? value.trim().slice(0, max) : '');

/** Normalises a contact-form submission into the stored message shape. */
export function buildMessage(input = {}) {
  return {
    id: 'msg-' + Date.now(),
    name: clean(input.name, 120),
    email: clean(input.email, 200),
    subject: clean(input.subject, 200),
    message: clean(input.message, 5000),
    read: false,
    createdAt: new Date().toISOString(),
  };
}

/** Returns an error string, or null when the message is valid. */
export function validateMessage(message) {
  if (!message.name || !message.email || !message.message) {
    return 'Name, email and message are required';
  }
  if (!EMAIL_PATTERN.test(message.email)) {
    return 'That email address looks invalid';
  }
  return null;
}
