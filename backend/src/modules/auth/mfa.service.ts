import { authenticator } from 'otplib';
import * as qrcode from 'qrcode';
import nodemailer from 'nodemailer';
import { env } from '../../config/env';
import { redis } from '../../config/redis';
import { logger } from '../../utils/logger';
import { AppError } from '../../middleware/errorHandler';

const OTP_EXPIRY_SECONDS = 300; // 5 minutes

class MfaService {
  // ── TOTP (Google Authenticator) ─────────────────────────────────────────

  generateTotpSecret(): string {
    return authenticator.generateSecret();
  }

  async generateTotpQrCode(email: string, secret: string): Promise<string> {
    const otpauth = authenticator.keyuri(email, env.MFA_APP_NAME, secret);
    return qrcode.toDataURL(otpauth);
  }

  verifyTotp(token: string, secret: string): boolean {
    return authenticator.verify({ token, secret });
  }

  // ── Email OTP ────────────────────────────────────────────────────────────

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private getOtpKey(userId: string, type: 'email' | 'sms'): string {
    return `otp:${type}:${userId}`;
  }

  async sendEmailOtp(userId: string, email: string, name: string): Promise<void> {
    const otp = this.generateOtp();
    await redis.set(this.getOtpKey(userId, 'email'), otp, 'EX', OTP_EXPIRY_SECONDS);

    // Development bypass
    if (env.NODE_ENV === 'development' && (!env.SMTP_USER || !env.SMTP_PASS)) {
      logger.warn(`🔱 [DEV] Email OTP for ${email}: ${otp}`);
      console.log(`\n🔱 [DEV] EMAIL OTP FOR ${email}: ${otp}\n`);
      return;
    }

    const transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    });

    try {
      await transporter.sendMail({
        from: `"${env.APP_NAME}" <${env.SMTP_FROM}>`,
        to: email,
        subject: `${env.APP_NAME} - Your OTP Code`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #FF6B35;">🔱 ${env.APP_NAME}</h2>
            <p>Hello <strong>${name}</strong>,</p>
            <p>Your One-Time Password (OTP) for login verification:</p>
            <div style="background: #f4f4f4; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
              <h1 style="color: #FF6B35; letter-spacing: 8px; margin: 0;">${otp}</h1>
            </div>
            <p>This OTP is valid for <strong>5 minutes</strong>.</p>
            <p>If you didn't request this, please contact support immediately.</p>
            <p>🙏 Jai Mahakal | Trishul Travels</p>
          </div>
        `,
      });
      logger.info(`Email OTP sent to ${email}`);
    } catch (err) {
      logger.error('Failed to send email OTP:', err);
      if (env.NODE_ENV === 'development') {
        logger.warn(`🔱 [DEV FALLBACK] Email OTP for ${email}: ${otp}`);
      } else {
        throw new AppError('Failed to send verification email', 500);
      }
    }
  }

  async verifyEmailOtp(userId: string, submittedOtp: string): Promise<boolean> {
    const key = this.getOtpKey(userId, 'email');
    const storedOtp = await redis.get(key);
    if (!storedOtp) throw new AppError('OTP expired or not found', 400);
    if (storedOtp !== submittedOtp) return false;
    await redis.del(key); // One-time use
    return true;
  }

  // ── SMS OTP (Twilio) ─────────────────────────────────────────────────────

  async sendSmsOtp(userId: string, phone: string): Promise<void> {
    if (!env.TWILIO_ACCOUNT_SID || !env.TWILIO_AUTH_TOKEN) {
      throw new AppError('SMS service not configured', 503);
    }

    const { default: twilio } = await import('twilio');
    const client = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
    const otp = this.generateOtp();
    await redis.set(this.getOtpKey(userId, 'sms'), otp, 'EX', OTP_EXPIRY_SECONDS);

    await client.messages.create({
      body: `${env.APP_NAME} OTP: ${otp}. Valid for 5 minutes. Do not share.`,
      from: env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    logger.info(`SMS OTP sent to ${phone}`);
  }

  async verifySmsOtp(userId: string, submittedOtp: string): Promise<boolean> {
    const key = this.getOtpKey(userId, 'sms');
    const storedOtp = await redis.get(key);
    if (!storedOtp) throw new AppError('OTP expired or not found', 400);
    if (storedOtp !== submittedOtp) return false;
    await redis.del(key);
    return true;
  }
}

export const mfaService = new MfaService();
