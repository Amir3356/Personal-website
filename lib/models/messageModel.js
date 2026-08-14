const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Digits with the usual separators, optional leading `+`. Deliberately loose:
// phone formats vary by country and the field is optional.
const PHONE_PATTERN = /^\+?[\d\s().-]{6,}$/;

const clean = (value, max) => (typeof value === 'string' ? value.trim().slice(0, max) : '');

/** Normalises a contact-form submission into the stored message shape. */
export function buildMessage(input = {}) {
  return {
    id: 'msg-' + Date.now(),
    name: clean(input.name, 120),
    email: clean(input.email, 200),
    phone: clean(input.phone, 40),
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
  // Phone is optional; only validate a value that was actually supplied.
  if (message.phone && !PHONE_PATTERN.test(message.phone)) {
    return 'That phone number looks invalid';
  }
  return null;
}
