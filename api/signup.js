// /api/signup — email-verified account creation, consolidated to stay under
// Vercel Hobby's 12-function cap (was signup-request-code.js + signup-verify-code.js).
// POST { action: 'request-code', email, password } — sends a 6-digit code to
//   that email instead of creating the account (pending_signups); rate-limited
//   per email so the form can't be used to spam an arbitrary address.
// POST { action: 'verify-code', email, code } — the only place a real
//   account actually gets created; starts a session on success.

const { findUserByEmail, createPendingSignup, recentPendingSignup, consumePendingSignup, createUser, createSession } = require('./_db');
const { hashPassword, newAdminCode, newSessionToken, setSessionCookie } = require('./_auth');
const { sendVerificationCode } = require('./_mailer');

const COOLDOWN_SECONDS = 30;

function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  try {
    const { action, email, password, code } = req.body || {};

    if (action === 'request-code') {
      if (!isValidEmail(email)) {
        res.status(400).json({ error: 'invalid_email' });
        return;
      }
      if (typeof password !== 'string' || password.length < 6) {
        res.status(400).json({ error: 'weak_password' });
        return;
      }
      const normalizedEmail = email.trim().toLowerCase();
      if (await findUserByEmail(normalizedEmail)) {
        res.status(409).json({ error: 'email_taken' });
        return;
      }
      if (await recentPendingSignup(normalizedEmail, COOLDOWN_SECONDS)) {
        res.status(429).json({ error: 'too_soon' });
        return;
      }

      const genCode = newAdminCode(); // 6-digit numeric — same generator, generic enough
      await createPendingSignup(normalizedEmail, hashPassword(password), genCode);
      await sendVerificationCode(normalizedEmail, genCode);
      res.status(200).json({ ok: true });
      return;
    }

    if (action === 'verify-code') {
      if (typeof email !== 'string' || typeof code !== 'string' || !code) {
        res.status(400).json({ error: 'invalid_request' });
        return;
      }
      const normalizedEmail = email.trim().toLowerCase();

      const passwordHash = await consumePendingSignup(normalizedEmail, code);
      if (!passwordHash) {
        res.status(401).json({ error: 'invalid_code' });
        return;
      }
      if (await findUserByEmail(normalizedEmail)) {
        res.status(409).json({ error: 'email_taken' });
        return;
      }

      const userId = await createUser(normalizedEmail, passwordHash);
      const token = newSessionToken();
      await createSession(token, userId);
      setSessionCookie(res, token);
      res.status(200).json({ email: normalizedEmail });
      return;
    }

    res.status(400).json({ error: 'unknown_action' });
  } catch (err) {
    console.error('signup error:', err);
    res.status(500).json({ error: 'server_error' });
  }
};
