// /api/admin-auth — admin login via emailed one-time code, consolidated to
// stay under Vercel Hobby's 12-function cap (was admin-request-code.js +
// admin-verify-code.js + admin-logout.js).
// POST { action: 'request-code' } — rate-limited (30s cooldown, 6/hour cap)
// POST { action: 'verify-code', code } — starts a 12h admin session on success
// POST { action: 'logout' }

const { createAdminCode, countRecentAdminCodes, consumeAdminCode, createAdminSession, deleteAdminSession } = require('./_db');
const { newAdminCode, newSessionToken, setAdminSessionCookie, getAdminToken, clearAdminSessionCookie } = require('./_auth');
const { sendAdminCode } = require('./_mailer');

const COOLDOWN_SECONDS = 30;
const HOURLY_CAP = 6;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  try {
    const { action, code } = req.body || {};

    if (action === 'request-code') {
      if ((await countRecentAdminCodes(COOLDOWN_SECONDS)) > 0) {
        res.status(429).json({ error: 'too_soon' });
        return;
      }
      if ((await countRecentAdminCodes(3600)) >= HOURLY_CAP) {
        res.status(429).json({ error: 'hourly_limit' });
        return;
      }
      const genCode = newAdminCode();
      await createAdminCode(genCode);
      await sendAdminCode(genCode);
      res.status(200).json({ ok: true });
      return;
    }

    if (action === 'verify-code') {
      const valid = await consumeAdminCode(code);
      if (!valid) {
        res.status(401).json({ error: 'invalid_code' });
        return;
      }
      const token = newSessionToken();
      await createAdminSession(token);
      setAdminSessionCookie(res, token);
      res.status(200).json({ ok: true });
      return;
    }

    if (action === 'logout') {
      const token = getAdminToken(req);
      if (token) await deleteAdminSession(token);
      clearAdminSessionCookie(res);
      res.status(200).json({ ok: true });
      return;
    }

    res.status(400).json({ error: 'unknown_action' });
  } catch (err) {
    console.error('admin-auth error:', err);
    res.status(500).json({ error: 'server_error' });
  }
};
