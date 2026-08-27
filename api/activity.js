// /api/activity — everything a logged-in student's browser pings while
// using the site, consolidated to stay under Vercel Hobby's 12-function cap
// (was track.js + heartbeat.js + progress.js). Requires a valid session.
// POST { action: 'track', path }                          -> was /api/track
// POST { action: 'heartbeat' }                             -> was /api/heartbeat
// POST { action: 'progress', lessonId, completed }         -> was /api/progress
// POST { action: 'progress', reset: true }                 -> was /api/progress

const { findSession, recordVisit, touchPresence, markProgress, unmarkProgress, resetProgress } = require('./_db');
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

    const { action, path, lessonId, completed, reset } = req.body || {};

    if (action === 'track') {
      await recordVisit(session.user_id, typeof path === 'string' ? path.slice(0, 300) : '/');
      res.status(204).end();
      return;
    }

    if (action === 'heartbeat') {
      await touchPresence(session.user_id);
      res.status(204).end();
      return;
    }

    if (action === 'progress') {
      if (reset === true) {
        await resetProgress(session.user_id);
      } else if (typeof lessonId === 'string' && lessonId) {
        if (completed) await markProgress(session.user_id, lessonId.slice(0, 300));
        else await unmarkProgress(session.user_id, lessonId.slice(0, 300));
      } else {
        res.status(400).json({ error: 'invalid_request' });
        return;
      }
      res.status(204).end();
      return;
    }

    res.status(400).json({ error: 'unknown_action' });
  } catch (err) {
    console.error('activity error:', err);
    res.status(500).end();
  }
};
