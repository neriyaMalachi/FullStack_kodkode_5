// POST /api/progress — Body: { lessonId, completed } or { reset: true }
// Requires a valid student session. Mirrors the localStorage-based progress
// tracking (assets/js/progress.js) to the server so the instructor can see
// each student's progress in /admin — localStorage stays the source of
// truth for the student's own UI; this is a fire-and-forget sync on top.

const { findSession, markProgress, unmarkProgress, resetProgress } = require('./_db');
const { getSessionToken } = require('./_auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  try {
    const token = getSessionToken(req);
    const session = token ? await findSession(token) : null;
    if (!session) {
      res.status(401).json({ error: 'no_session' });
      return;
    }

    const { lessonId, completed, reset } = req.body || {};

    if (reset === true) {
      await resetProgress(session.user_id);
    } else if (typeof lessonId === 'string' && lessonId) {
      if (completed) {
        await markProgress(session.user_id, lessonId.slice(0, 300));
      } else {
        await unmarkProgress(session.user_id, lessonId.slice(0, 300));
      }
    } else {
      res.status(400).json({ error: 'invalid_request' });
      return;
    }

    res.status(204).end();
  } catch (err) {
    console.error('progress error:', err);
    res.status(500).end();
  }
};
