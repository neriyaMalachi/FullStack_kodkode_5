// Vercel serverless function — POST /api/admin-stats
// Requires a valid admin session cookie (set by admin-verify-code.js after
// the emailed one-time code is confirmed). Returns every registered student
// with visit stats, plus who's online now.

const { getStats, findAdminSession } = require('./_db');
const { getAdminToken } = require('./_auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  try {
    const token = getAdminToken(req);
    if (!token || !(await findAdminSession(token))) {
      res.status(401).json({ error: 'unauthorized' });
      return;
    }

    const { students, online } = await getStats();
    res.status(200).json({ students, online });
  } catch (err) {
    console.error('admin-stats error:', err);
    res.status(500).json({ error: 'server error' });
  }
};
