const { config } = require('../config');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(config.SENDGRID_API_KEY);

const BRAND = {
  name: 'IRCTC',
  color: '#1B3C87',
  loginUrl: 'http://localhost:3000/login',
  supportEmail: 'support@irctc.com',
};

const OTP_MINUTES = Math.ceil((config.OTP_TTL || 300) / 60);
const FONT = "-apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

const escape = (value = '') =>
  String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const layout = ({ preheader, content, recipient }) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <title>${BRAND.name}</title>
</head>
<body style="margin:0; padding:0; background:#EDF0F5; font-family:${FONT};">
  <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:#EDF0F5;">${escape(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center" style="padding:32px 12px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"
               style="width:100%; max-width:600px; background:#FFFFFF; border-radius:8px; overflow:hidden;">
          <tr>
            <td align="center" style="background:${BRAND.color}; padding:28px 40px; font-size:24px; font-weight:700; letter-spacing:4px; color:#FFFFFF;">
              ${BRAND.name}
            </td>
          </tr>
          <tr>
            <td style="padding:40px 40px 32px; font-size:15px; line-height:24px; color:#374151;">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px;"><div style="border-top:1px solid #E5E7EB;"></div></td>
          </tr>
          <tr>
            <td style="padding:24px 40px 32px; font-size:12px; line-height:19px; color:#6B7280;">
              This email was sent to <strong style="color:#374151;">${escape(recipient)}</strong>.
              This is an automated message, so please do not reply.
              For help, contact <a href="mailto:${BRAND.supportEmail}" style="color:${BRAND.color};">${BRAND.supportEmail}</a>.
            </td>
          </tr>
        </table>
        <p style="margin:20px 0 0; font-size:12px; color:#9CA3AF;">&copy; ${new Date().getFullYear()} ${BRAND.name}. All rights reserved.</p>
      </td>
    </tr>
  </table>
</body>
</html>`;

const heading = (text) =>
  `<h1 style="margin:0 0 20px; font-size:22px; line-height:30px; color:#111827;">${text}</h1>`;

const signature = `<p style="margin:28px 0 0;">Regards,<br><strong>Team ${BRAND.name}</strong></p>`;

async function sendOtpEmail(email, otp) {
  const subject = `${otp} is your ${BRAND.name} verification code`;

  const content = `
    ${heading('Verify your email address')}
    <p style="margin:0 0 12px;">Hello,</p>
    <p style="margin:0 0 28px;">
      Use the one-time password (OTP) below to complete your ${BRAND.name} registration.
      This OTP is valid for <strong>${OTP_MINUTES} minutes</strong>.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px;">
      <tr>
        <td align="center" style="background:#F3F6FC; border:1px solid #D6E0F5; border-radius:8px; padding:24px 16px;">
          <div style="font-size:12px; font-weight:600; letter-spacing:2px; color:#6B7280; text-transform:uppercase;">Your OTP</div>
          <div style="margin-top:10px; font-family:'Courier New', monospace; font-size:40px; line-height:48px; font-weight:700; letter-spacing:14px; padding-left:14px; color:${BRAND.color};">${escape(otp)}</div>
        </td>
      </tr>
    </table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="background:#FFF8E6; border-left:4px solid #F5B301; border-radius:4px; padding:14px 16px; font-size:13px; line-height:20px; color:#6B5300;">
          <strong>Keep this code private.</strong> ${BRAND.name} will never call, email or message you
          asking for your OTP. If you didn't request this code, you can safely ignore this email.
        </td>
      </tr>
    </table>
    ${signature}`;

  const html = layout({
    preheader: `Your OTP is ${otp}. It is valid for ${OTP_MINUTES} minutes.`,
    content,
    recipient: email,
  });

  const text = [
    'Verify your email address',
    '',
    `Your ${BRAND.name} OTP is: ${otp}`,
    `It is valid for ${OTP_MINUTES} minutes.`,
    '',
    `Keep this code private. ${BRAND.name} will never ask you for your OTP.`,
    "If you didn't request this code, you can safely ignore this email.",
    '',
    `Regards,`,
    `Team ${BRAND.name}`,
  ].join('\n');

  await sgMail.send({ to: email, from: config.MAIL_SEND, subject, html, text });
}

async function verifyOtpEmail(meta) {
  const subject = `Welcome to ${BRAND.name}`;

  const content = `
    ${heading(`Welcome, ${escape(meta.firstName)}`)}
    <p style="margin:0 0 12px;">Your email address has been verified.</p>
    <p style="margin:0 0 28px;">Your ${BRAND.name} account is now active and ready to use. Sign in to get started.</p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px;">
      <tr>
        <td align="center" bgcolor="${BRAND.color}" style="border-radius:6px;">
          <a href="${BRAND.loginUrl}" style="display:inline-block; padding:14px 32px; font-size:15px; font-weight:600; color:#FFFFFF; text-decoration:none;">Sign in to your account</a>
        </td>
      </tr>
    </table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="background:#FFF8E6; border-left:4px solid #F5B301; border-radius:4px; padding:14px 16px; font-size:13px; line-height:20px; color:#6B5300;">
          <strong>Didn't create this account?</strong> Contact us right away at
          <a href="mailto:${BRAND.supportEmail}" style="color:#6B5300;">${BRAND.supportEmail}</a>.
        </td>
      </tr>
    </table>
    ${signature}`;

  const html = layout({
    preheader: 'Your email is verified and your account is ready.',
    content,
    recipient: meta.email,
  });

  const text = [
    `Welcome, ${meta.firstName}`,
    '',
    'Your email address has been verified and your account is ready to use.',
    `Sign in: ${BRAND.loginUrl}`,
    '',
    `Didn't create this account? Contact ${BRAND.supportEmail} right away.`,
    '',
    'Regards,',
    `Team ${BRAND.name}`,
  ].join('\n');

  await sgMail.send({ to: meta.email, from: config.MAIL_SEND, subject, html, text });
}

module.exports = { sendOtpEmail, verifyOtpEmail };