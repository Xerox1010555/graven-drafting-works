/**
 * GRAVEN — Contact form endpoint (Vercel Serverless Function).
 *
 * Demo mode (no env vars): validates the payload and acknowledges it, so the
 * deployed site works out of the box.
 * Live mode: set RESEND_API_KEY + CONTACT_EMAIL and submissions are delivered
 * by email through the Resend REST API. Set TURNSTILE_SECRET_KEY to also
 * enforce Cloudflare Turnstile verification.
 */

const ALLOWED_PROJECT_TYPES = ['industrial', 'product', 'architectural', 'other'];
const ALLOWED_BUDGETS = ['under-10k', '10k-50k', '50k-100k', '100k+'];
const ALLOWED_TIMELINES = ['asap', '1-month', '3-months', 'flexible'];

function validate(body) {
  const errors = [];
  if (!body || typeof body !== 'object') return ['Invalid payload'];
  if (typeof body.name !== 'string' || body.name.trim().length < 2) errors.push('Name is required');
  if (typeof body.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) errors.push('Valid email is required');
  if (!ALLOWED_PROJECT_TYPES.includes(body.projectType)) errors.push('Invalid project type');
  if (!ALLOWED_BUDGETS.includes(body.budgetRange)) errors.push('Invalid budget range');
  if (!ALLOWED_TIMELINES.includes(body.timeline)) errors.push('Invalid timeline');
  if (typeof body.message !== 'string' || body.message.trim().length < 50 || body.message.length > 2000) {
    errors.push('Message must be between 50 and 2000 characters');
  }
  return errors;
}

async function verifyTurnstile(token, secret, ip) {
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret, response: token, remoteip: ip || '' }),
  });
  const result = await response.json();
  return !!result.success;
}

async function sendEmail(payload) {
  const { RESEND_API_KEY, CONTACT_EMAIL } = process.env;
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'GRAVEN <onboarding@resend.dev>',
      to: CONTACT_EMAIL,
      reply_to: payload.email,
      subject: `New project inquiry — ${payload.name}`,
      text: [
        `Name: ${payload.name}`,
        `Email: ${payload.email}`,
        `Company: ${payload.company || '—'}`,
        `Project type: ${payload.projectType}`,
        `Budget: ${payload.budgetRange}`,
        `Timeline: ${payload.timeline}`,
        '',
        payload.message,
      ].join('\n'),
    }),
  });
  return response.ok;
}

module.exports = async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  let body;
  try {
    body = typeof request.body === 'object' ? request.body : JSON.parse(request.body || '{}');
  } catch {
    return response.status(400).json({ error: 'Invalid JSON' });
  }

  const errors = validate(body);
  if (errors.length > 0) {
    return response.status(422).json({ error: errors[0], errors });
  }

  try {
    const { TURNSTILE_SECRET_KEY } = process.env;
    if (TURNSTILE_SECRET_KEY) {
      const ok = await verifyTurnstile(body['cf-turnstile-response'], TURNSTILE_SECRET_KEY, request.headers['x-real-ip']);
      if (!ok) return response.status(403).json({ error: 'Captcha verification failed' });
    }

    let delivered = false;
    if (process.env.RESEND_API_KEY && process.env.CONTACT_EMAIL) {
      delivered = await sendEmail(body);
      if (!delivered) return response.status(502).json({ error: 'Could not deliver your message, please email us directly' });
    }

    return response.status(200).json({
      ok: true,
      mode: delivered ? 'live' : 'demo',
      message: delivered
        ? 'Your message has been sent.'
        : 'Received. This deployment runs in demo mode — configure RESEND_API_KEY to deliver inquiries by email.',
    });
  } catch (err) {
    console.error('contact handler error', err);
    return response.status(500).json({ error: 'Internal server error' });
  }
};
