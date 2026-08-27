// Shared auth helpers: password hashing (scrypt, Node built-in — no native
// deps to fight on Windows), session cookie read/write, session token
// generation. Cookie is HttpOnly so client JS can't read it directly —
// pages check login state via GET /api/me instead.

const crypto = require('crypto');

const SESSION_COOKIE = 'session_token';
const ADMIN_COOKIE = 'admin_token';

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  const candidate = crypto.scryptSync(password, salt, 64).toString('hex');
  const a = Buffer.from(hash, 'hex');
  const b = Buffer.from(candidate, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function newSessionToken() {
  return crypto.randomBytes(32).toString('hex');
}

function newAdminCode() {
  return String(crypto.randomInt(100000, 1000000));
}

function parseCookies(req) {
  const header = req.headers?.cookie || '';
  const cookies = {};
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (key) cookies[key] = decodeURIComponent(value);
  }
  return cookies;
}

function getSessionToken(req) {
  return parseCookies(req)[SESSION_COOKIE] || null;
}

const SESSION_MAX_AGE_SECONDS = 24 * 60 * 60;

function setSessionCookie(res, token) {
  res.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE}=${encodeURIComponent(token)}; Max-Age=${SESSION_MAX_AGE_SECONDS}; Path=/; HttpOnly; SameSite=Lax`,
  );
}

function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax`);
}

const ADMIN_SESSION_MAX_AGE_SECONDS = 12 * 60 * 60;

function getAdminToken(req) {
  return parseCookies(req)[ADMIN_COOKIE] || null;
}

function setAdminSessionCookie(res, token) {
  res.setHeader(
    'Set-Cookie',
    `${ADMIN_COOKIE}=${encodeURIComponent(token)}; Max-Age=${ADMIN_SESSION_MAX_AGE_SECONDS}; Path=/; HttpOnly; SameSite=Lax`,
  );
}

function clearAdminSessionCookie(res) {
  res.setHeader('Set-Cookie', `${ADMIN_COOKIE}=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax`);
}

module.exports = {
  hashPassword,
  verifyPassword,
  newSessionToken,
  getSessionToken,
  setSessionCookie,
  clearSessionCookie,
  SESSION_MAX_AGE_SECONDS,
  newAdminCode,
  getAdminToken,
  setAdminSessionCookie,
  clearAdminSessionCookie,
};
