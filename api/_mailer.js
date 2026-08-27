// Sends the admin login code by email via SMTP (nodemailer). Configure with
// SMTP_USER / SMTP_PASS (e.g. a Gmail address + App Password —
// myaccount.google.com/apppasswords, requires 2-Step Verification on) and
// ADMIN_EMAIL (where codes get sent — can be the same address as SMTP_USER).
//
// If those aren't set yet (e.g. first local test before setting up a real
// mailbox), nothing crashes — the code is logged to the server console
// instead, clearly labeled, so the login flow can still be tested end to end.

const nodemailer = require('nodemailer');

async function sendAdminCode(code) {
  const { SMTP_USER, SMTP_PASS, ADMIN_EMAIL } = process.env;

  if (!SMTP_USER || !SMTP_PASS || !ADMIN_EMAIL) {
    console.log(`[DEV — no SMTP configured] Admin login code: ${code}`);
    return;
  }

  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  await transport.sendMail({
    from: SMTP_USER,
    to: ADMIN_EMAIL,
    subject: 'קוד כניסה לפאנל האדמין',
    text: `קוד הכניסה שלך: ${code}\n\nהקוד בתוקף ל-10 דקות ותקף לשימוש חד פעמי בלבד.\nאם לא ביקשת קוד זה, אפשר להתעלם מהמייל.`,
  });
}

module.exports = { sendAdminCode };
