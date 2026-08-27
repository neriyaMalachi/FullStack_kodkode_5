// POST /api/signup-request-code — Body: { email, password }
// Step 1 of signup: validates the email/password, checks the email isn't
// already a registered account, then generates a 6-digit verification code,
// stores it with the (hashed) password against that email (pending_signups —
// not a real account yet), and emails the code to that address. The account
// is only actually created once the correct code comes back to
// api/signup-verify-code.js. Rate-limited per email so the form can't be
// used to spam an arbitrary address with repeated codes.

const { findUserByEmail, createPendingSignup, recentPendingSignup } = require('./_db');
const { hashPassword, newAdminCode } = require('./_auth');
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
    const { email, password } = req.body || {};

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

    const code = newAdminCode(); // 6-digit numeric — same generator, generic enough
    await createPendingSignup(normalizedEmail, hashPassword(password), code);
    await sendVerificationCode(normalizedEmail, code);

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('signup-request-code error:', err);
    res.status(500).json({ error: 'server_error' });
  }
};
