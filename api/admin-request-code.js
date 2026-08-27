// POST /api/admin-request-code — no body needed.
// Generates a 6-digit one-time code, stores it (valid 10 min, single use),
// and emails it to ADMIN_EMAIL via api/_mailer.js. Always responds the same
// way regardless of mail-sending success, to avoid leaking configuration
// details to whoever is hitting this endpoint.

const { createAdminCode } = require('./_db');
const { newAdminCode } = require('./_auth');
const { sendAdminCode } = require('./_mailer');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  try {
    const code = newAdminCode();
    await createAdminCode(code);
    await sendAdminCode(code);
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('admin-request-code error:', err);
    res.status(500).json({ error: 'server_error' });
  }
};
