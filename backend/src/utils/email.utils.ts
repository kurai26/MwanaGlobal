import { config } from '../config';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

const sendWithResend = async (options: EmailOptions): Promise<void> => {
  const { Resend } = await import('resend');
  const resend = new Resend(config.email.resendApiKey);
  await resend.emails.send({
    from: `${config.email.fromName} <${config.email.from}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });
};

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  if (config.app.isDev && !config.email.resendApiKey) {
    console.log('\n📧 [DEV EMAIL] ─────────────────────────────');
    console.log(`To: ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log('─────────────────────────────────────────\n');
    return;
  }
  await sendWithResend(options);
};

export const emailTemplates = {
  verifyEmail: (name: string, verifyUrl: string): string => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Verify Your Email - Mwana Global</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #0A2A66; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: #D4AF37; margin: 0; font-size: 28px;">Mwana Global</h1>
        <p style="color: #fff; margin: 5px 0 0;">Discover Where Your Talent Can Take You</p>
      </div>
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0; border-top: none;">
        <h2 style="color: #0A2A66;">Welcome, ${name}! 🌍</h2>
        <p style="color: #555; line-height: 1.6;">Thank you for joining Mwana Global. Please verify your email address to activate your account and start discovering global opportunities.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyUrl}" style="background: #D4AF37; color: #0A2A66; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">Verify Email Address</a>
        </div>
        <p style="color: #888; font-size: 14px;">This link expires in 24 hours. If you didn't create an account, please ignore this email.</p>
      </div>
    </body>
    </html>
  `,

  resetPassword: (name: string, resetUrl: string): string => `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #0A2A66; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: #D4AF37; margin: 0;">Mwana Global</h1>
      </div>
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0; border-top: none;">
        <h2 style="color: #0A2A66;">Password Reset Request</h2>
        <p>Hi ${name}, you requested a password reset. Click below to set a new password.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background: #D4AF37; color: #0A2A66; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
        </div>
        <p style="color: #888; font-size: 14px;">This link expires in 1 hour. If you didn't request this, please ignore this email.</p>
      </div>
    </body>
    </html>
  `,
};
