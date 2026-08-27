// Sends verification/login codes by email via SMTP (nodemailer). Configure
// with SMTP_USER / SMTP_PASS (e.g. a Gmail address + App Password —
// myaccount.google.com/apppasswords, requires 2-Step Verification on).
// ADMIN_EMAIL is only needed for sendAdminCode (where the admin login code
// goes); sendVerificationCode takes its recipient as an argument since it
// sends to whatever email a student is trying to register.
//
// If SMTP isn't configured yet (e.g. first local test before setting up a
// real mailbox), nothing crashes — the code is logged to the server console
// instead, clearly labeled, so the flow can still be tested end to end.

const nodemailer = require('nodemailer');

function getTransport() {
  const { SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_USER || !SMTP_PASS) return null;
  return nodemailer.createTransport({ service: 'gmail', auth: { user: SMTP_USER, pass: SMTP_PASS } });
}

async function sendAdminCode(code) {
  const { SMTP_USER, ADMIN_EMAIL } = process.env;
  const transport = getTransport();

  if (!transport || !ADMIN_EMAIL) {
    console.log(`[DEV — no SMTP configured] Admin login code: ${code}`);
    return;
  }

  await transport.sendMail({
    from: SMTP_USER,
    to: ADMIN_EMAIL,
    subject: 'קוד כניסה לפאנל האדמין',
    text: `קוד הכניסה שלך: ${code}\n\nהקוד בתוקף ל-10 דקות ותקף לשימוש חד פעמי בלבד.\nאם לא ביקשת קוד זה, אפשר להתעלם מהמייל.`,
  });
}

async function sendVerificationCode(toEmail, code) {
  const { SMTP_USER } = process.env;
  const transport = getTransport();

  if (!transport) {
    console.log(`[DEV — no SMTP configured] Verification code for ${toEmail}: ${code}`);
    return;
  }

  await transport.sendMail({
    from: SMTP_USER,
    to: toEmail,
    subject: 'קוד אימות — הרשמה לאתר הקורס',
    text: `קוד האימות שלך: ${code}\n\nהזינו אותו באתר כדי להשלים את ההרשמה. הקוד בתוקף ל-10 דקות.\nאם לא ביקשת קוד זה, אפשר להתעלם מהמייל.`,
  });
}

module.exports = { sendAdminCode, sendVerificationCode };
