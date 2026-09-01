import "dotenv/config";

type AuthEmail = { to: string; subject: string; text: string };

export async function sendAuthEmail(message: AuthEmail) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.AUTH_EMAIL_FROM;
  if (!apiKey || !from) {
    if (process.env.NODE_ENV !== "test") console.warn("Authentication email delivery is not configured; set RESEND_API_KEY and AUTH_EMAIL_FROM.");
    return false;
  }
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [message.to], subject: message.subject, text: message.text }),
  });
  if (!response.ok) throw new Error(`Email provider returned ${response.status}`);
  return true;
}
