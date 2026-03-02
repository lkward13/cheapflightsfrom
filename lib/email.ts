/**
 * Email sending via Amazon SES SMTP.
 * Used for welcome emails on signup.
 *
 * Required env vars: SES_SMTP_USER, SES_SMTP_PASS, SES_FROM_EMAIL
 */

import nodemailer from "nodemailer";

const SITE_URL = "https://cheapflightsfrom.us";
const LOGO_URL = "https://cheapflightsfrom.us/logo.png";

function addUtm(url: string, campaign = "welcome"): string {
  const params = "utm_source=email&utm_medium=newsletter&utm_campaign=" + campaign;
  const sep = url.includes("?") ? "&" : "?";
  return url + sep + params;
}

function getTransporter() {
  const user = process.env.SES_SMTP_USER;
  const pass = process.env.SES_SMTP_PASS;
  if (!user || !pass) {
    throw new Error("SES_SMTP_USER and SES_SMTP_PASS must be set");
  }
  return nodemailer.createTransport({
    host: "email-smtp.us-east-1.amazonaws.com",
    port: 587,
    secure: false,
    auth: { user, pass },
  });
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions): Promise<boolean> {
  const from = process.env.SES_FROM_EMAIL || "deals@cheapflightsfrom.us";
  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from,
      to,
      subject,
      html,
      text,
    });
    return true;
  } catch (err) {
    console.error("[email.send]", { to: to.slice(0, 20) + "...", error: err });
    return false;
  }
}

export function buildWelcomeEmail(metroDisplayName: string, metroSlug: string, firstName?: string | null) {
  const greeting = firstName ? `Hey ${firstName},` : "Hey there,";
  const unsub = addUtm(`${SITE_URL}/unsubscribe`);
  const howTo = addUtm(`${SITE_URL}/how-to-use`);
  const hub = addUtm(`${SITE_URL}/cheap-flights-from-${metroSlug}`);

  const subject = `You're in! Flight deals from ${metroDisplayName} are on the way`;

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
             line-height: 1.6; color: #1f2937; margin: 0; padding: 0; background: #f0f2f5;">
<div style="max-width: 620px; margin: 0 auto; background: white;">
    <div style="background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%);
                color: white; padding: 28px 24px; text-align: center;">
        <img src="${LOGO_URL}" alt="CheapFlightsFrom.us"
             style="width: 44px; height: 44px; margin-bottom: 12px; border-radius: 8px;">
        <h1 style="margin: 0; font-size: 22px; font-weight: 700;">
            Welcome to CheapFlightsFrom.us
        </h1>
        <p style="margin: 6px 0 0 0; opacity: 0.9; font-size: 15px;">
            You're signed up for ${metroDisplayName} flight deals
        </p>
    </div>
    <div style="padding: 24px;">
        <p style="font-size: 15px; color: #374151; margin: 0 0 16px 0;">
            ${greeting}
        </p>
        <p style="font-size: 15px; color: #374151; margin: 0 0 16px 0;">
            Thanks for signing up! We'll email you when we find great flight deals from ${metroDisplayName}.
        </p>
        <p style="font-size: 15px; color: #374151; margin: 0 0 20px 0;">
            <strong>To make sure our emails reach your inbox:</strong>
        </p>
        <ul style="font-size: 15px; color: #374151; margin: 0 0 20px 0; padding-left: 20px;">
            <li>Add <strong>deals@cheapflightsfrom.us</strong> to your contacts</li>
            <li>Move this email to your Primary/Inbox (not Spam)</li>
        </ul>
        <p style="font-size: 15px; color: #374151; margin: 0 0 20px 0;">
            <a href="${howTo}" style="color: #1e40af; text-decoration: underline; font-weight: 600;">Learn how to get the most from our site →</a>
        </p>
        <p style="font-size: 15px; color: #374151; margin: 0 0 0 0;">
            <a href="${hub}" style="display: inline-block; background: #1e3a5f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">Browse ${metroDisplayName} Deals</a>
        </p>
    </div>
    <div style="text-align: center; padding: 20px 24px; color: #9ca3af; font-size: 12px;
                background: #f9fafb; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0 0 10px 0;">
            <a href="${unsub}" style="color: #6b7280; text-decoration: underline;">Unsubscribe</a>
        </p>
        <p style="margin: 0; font-size: 11px; color: #b0b0b0;">
            CheapFlightsFrom.us &middot; Pay Less. Travel More.
        </p>
    </div>
</div>
</body>
</html>`;

  const text = [
    `Welcome to CheapFlightsFrom.us`,
    "",
    `${greeting}`,
    "",
    `Thanks for signing up! We'll email you when we find great flight deals from ${metroDisplayName}.`,
    "",
    "To make sure our emails reach your inbox:",
    "- Add deals@cheapflightsfrom.us to your contacts",
    "- Move this email to your Primary/Inbox (not Spam)",
    "",
    `Learn how to get the most from our site: ${howTo}`,
    "",
    `Browse ${metroDisplayName} deals: ${hub}`,
    "",
    `Unsubscribe: ${unsub}`,
  ].join("\n");

  return { subject, html, text };
}
