import nodemailer from 'nodemailer';
import { SMTP, smtpConfigured } from './config';

/**
 * Contact-form email delivery over SMTP.
 *
 * The transport is created lazily and reused, so we don't open a connection
 * pool at import time on a site that may never send anything.
 */

let transporter = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP.host,
      port: SMTP.port,
      secure: SMTP.secure,
      auth: { user: SMTP.user, pass: SMTP.pass },
    });
  }
  return transporter;
}

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/**
 * Forwards a stored contact message to the configured inbox.
 *
 * Never throws: a mail failure must not fail the visitor's submission, since
 * the message is already persisted and readable in the admin inbox.
 */
export async function sendContactEmail(message) {
  if (!smtpConfigured) return { sent: false, reason: 'SMTP not configured' };

  const subject = message.subject
    ? `Portfolio: ${message.subject}`
    : `Portfolio: new message from ${message.name}`;

  try {
    await getTransporter().sendMail({
      // Gmail rewrites From to the authenticated account, so send as ourselves
      // and put the visitor on Reply-To to keep one-click replies working.
      from: `"Portfolio Contact" <${SMTP.user}>`,
      to: SMTP.to,
      replyTo: `"${message.name}" <${message.email}>`,
      subject,
      text: [
        `Name:    ${message.name}`,
        `Email:   ${message.email}`,
        `Phone:   ${message.phone || '—'}`,
        `Subject: ${message.subject || '—'}`,
        `Sent:    ${message.createdAt}`,
        '',
        message.message,
      ].join('\n'),
      html: `
        <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;line-height:1.6">
          <h2 style="margin:0 0 16px">New portfolio message</h2>
          <p style="margin:0 0 4px"><strong>Name:</strong> ${escapeHtml(message.name)}</p>
          <p style="margin:0 0 4px"><strong>Email:</strong> ${escapeHtml(message.email)}</p>
          <p style="margin:0 0 4px"><strong>Phone:</strong> ${escapeHtml(message.phone) || '—'}</p>
          <p style="margin:0 0 4px"><strong>Subject:</strong> ${escapeHtml(message.subject) || '—'}</p>
          <p style="margin:0 0 16px"><strong>Sent:</strong> ${escapeHtml(message.createdAt)}</p>
          <div style="white-space:pre-wrap;border-left:3px solid #22d3ee;padding-left:12px">${escapeHtml(
            message.message
          )}</div>
        </div>
      `,
    });
    return { sent: true };
  } catch (error) {
    console.error('[mailer] Failed to send contact email:', error.message);
    return { sent: false, reason: error.message };
  }
}
