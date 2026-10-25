/**
 * GRAVEN — Newsletter subscription endpoint (Vercel Serverless Function).
 *
 * Demo mode (no env vars): validates the address and acknowledges it.
 * Live mode: set RESEND_API_KEY + NEWSLETTER_AUDIENCE_ID to add the contact
 * to a Resend audience (double opt-in email is then handled by Resend).
 */

function validate(body) {
  if (!body || typeof body.email !== 'string') return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) return 'Valid email is required';
  return null;
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

  const error = validate(body);
  if (error) {
    return response.status(422).json({ error });
  }

  try {
    const { RESEND_API_KEY, NEWSLETTER_AUDIENCE_ID } = process.env;
    if (RESEND_API_KEY && NEWSLETTER_AUDIENCE_ID) {
      const res = await fetch('https://api.resend.com/contacts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: body.email,
          audience_id: NEWSLETTER_AUDIENCE_ID,
          unsubscribed: false,
        }),
      });
      if (!res.ok) return response.status(502).json({ error: 'Subscription service is unavailable, try again later' });
    }

    return response.status(200).json({
      ok: true,
      mode: RESEND_API_KEY && NEWSLETTER_AUDIENCE_ID ? 'live' : 'demo',
      message: 'You are on the list. Watch your inbox for the confirmation.',
    });
  } catch (err) {
    console.error('newsletter handler error', err);
    return response.status(500).json({ error: 'Internal server error' });
  }
};
