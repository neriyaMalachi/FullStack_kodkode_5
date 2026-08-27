// POST /api/admin-request-code — no body needed.
// Generates a 6-digit one-time code, stores it (valid 10 min, single use),
// and emails it to ADMIN_EMAIL via api/_mailer.js. Always responds the same
// way regardless of mail-sending success, to avoid leaking configuration
// details to whoever is hitting this endpoint.
//
// Rate-limited on purpose: this endpoint is reachable by anyone who finds
// /admin/ (that's fine — the code itself is the real gate), but without a
// limit it could be used to flood the admin's inbox. A short cooldown plus
// an hourly cap keep that from being spammable while still letting the
// admin request a fresh code within a few seconds if they mistype one.

const { createAdminCode, countRecentAdminCodes } = require('./_db');
const { newAdminCode } = require('./_auth');
const { sendAdminCode } = require('./_mailer');

const COOLDOWN_SECONDS = 30;
const HOURLY_CAP = 6;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  try {
    if ((await countRecentAdminCodes(COOLDOWN_SECONDS)) > 0) {
      res.status(429).json({ error: 'too_soon' });
      return;
    }
    if ((await countRecentAdminCodes(3600)) >= HOURLY_CAP) {
      res.status(429).json({ error: 'hourly_limit' });
      return;
    }

    const code = newAdminCode();
    await createAdminCode(code);
    await sendAdminCode(code);
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('admin-request-code error:', err);
    res.status(500).json({ error: 'server_error' });
  }
};
