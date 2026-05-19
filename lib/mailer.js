import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send an OTP verification email.
 * @param {string} to - Recipient email address
 * @param {string} otp - 6-digit OTP code
 */
export async function sendOtpEmail(to, otp) {
  const mailOptions = {
    from: `"ResumeSort AI" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your Verification Code — ResumeSort AI",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; background-color: #0a0a0a; color: #e4e4e7;">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="display: inline-block; width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, #8b5cf6, #6366f1); line-height: 48px; text-align: center; color: white; font-size: 20px; font-weight: bold;">
            R
          </div>
          <h2 style="margin: 16px 0 4px; font-size: 22px; font-weight: 700; color: white;">
            Verify your email
          </h2>
          <p style="margin: 0; font-size: 14px; color: #71717a;">
            Enter this code to create your account
          </p>
        </div>
        <div style="background: #18181b; border: 1px solid #27272a; border-radius: 16px; padding: 32px; text-align: center; margin-bottom: 24px;">
          <div style="font-size: 36px; font-weight: 800; letter-spacing: 12px; color: white; font-family: monospace;">
            ${otp}
          </div>
          <p style="margin: 16px 0 0; font-size: 13px; color: #71717a;">
            This code expires in <strong style="color: #a78bfa;">5 minutes</strong>
          </p>
        </div>
        <p style="font-size: 12px; color: #52525b; text-align: center; line-height: 1.6;">
          If you didn't request this code, you can safely ignore this email.
          <br />Someone may have entered your email by mistake.
        </p>
        <hr style="border: none; border-top: 1px solid #27272a; margin: 24px 0;" />
        <p style="font-size: 11px; color: #3f3f46; text-align: center;">
          © ${new Date().getFullYear()} ResumeSort AI
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
