import { Resend } from "resend";

type SendAuditEmailArgs = {
  email: string;
  companyName?: string;
  monthlySavings: number;
  shareUrl: string;
};

export async function sendAuditConfirmation({
  email,
  companyName,
  monthlySavings,
  shareUrl,
}: SendAuditEmailArgs) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    return { simulated: true };
  }

  const resend = new Resend(apiKey);

  await resend.emails.send({
    from,
    to: email,
    subject: "Your AI spend audit is ready",
    text: `Your audit is ready${companyName ? ` for ${companyName}` : ""}. Estimated savings: $${monthlySavings.toFixed(
      0,
    )}/month. View the report: ${shareUrl}. Credex may reach out if there is a high-savings opportunity.`,
  });

  return { simulated: false };
}
