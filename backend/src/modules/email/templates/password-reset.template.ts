import { EmailContent, PasswordResetTemplateContext } from '../email.types';

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function buildPasswordResetEmail({
  resetLink,
  expiresIn,
  firstName,
  appName = 'Cookbook',
}: PasswordResetTemplateContext): EmailContent {
  const safeAppName = escapeHtml(appName);
  const safeFirstName = firstName?.trim() ? escapeHtml(firstName.trim()) : '';
  const safeExpiresIn = escapeHtml(expiresIn);
  const greeting = safeFirstName ? `Hi ${safeFirstName},` : 'Hi,';
  const subject = `Reset your ${appName} password`;
  const safeResetLink = escapeHtml(resetLink);

  const text = [
    firstName?.trim() ? `Hi ${firstName.trim()},` : 'Hi,',
    '',
    `We received a request to reset your ${appName} password.`,
    `Open this link to choose a new password (valid for ${expiresIn}):`,
    resetLink,
    '',
    'If you did not ask for this, you can ignore this email.',
  ].join('\n');

  const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;padding:0;background:#fbf4ea;font-family:Georgia,serif;color:#2b2620;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#fbf4ea;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background:#fffdf8;border:1px solid #e6d9c4;border-radius:12px;padding:32px;">
            <tr>
              <td>
                <p style="margin:0 0 8px;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;color:#8e836d;">${safeAppName}</p>
                <h1 style="margin:0 0 16px;font-size:28px;line-height:1.2;font-weight:600;">Reset your password</h1>
                <p style="margin:0 0 16px;font-size:16px;line-height:1.5;">${greeting}</p>
                <p style="margin:0 0 24px;font-size:16px;line-height:1.5;">
                  We received a request to reset your password. Click the button below to choose a new one. This link expires in ${safeExpiresIn}.
                </p>
                <p style="margin:0 0 24px;">
                  <a href="${safeResetLink}" style="display:inline-block;background:#4a5a44;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:8px;font-size:15px;font-weight:600;">
                    Reset password
                  </a>
                </p>
                <p style="margin:0 0 8px;font-size:13px;line-height:1.5;color:#6b6050;">
                  If the button does not work, copy and paste this link into your browser:
                </p>
                <p style="margin:0 0 24px;font-size:13px;line-height:1.5;word-break:break-all;color:#2d5a7a;">
                  ${safeResetLink}
                </p>
                <p style="margin:0;font-size:13px;line-height:1.5;color:#8e836d;">
                  If you did not request a password reset, you can safely ignore this email.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`.trim();

  return { subject, html, text };
}
