import dotenv from 'dotenv';
import path from 'path';

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function optionalEnv(key: string, defaultValue: string = ''): string {
  return process.env[key] ?? defaultValue;
}

export const env = {
  NODE_ENV: optionalEnv('NODE_ENV', 'development'),
  PORT: parseInt(optionalEnv('PORT', '5000'), 10),
  APP_NAME: optionalEnv('APP_NAME', 'Trishul'),

  // Database
  DATABASE_URL: requireEnv('DATABASE_URL'),

  // JWT
  JWT_SECRET: requireEnv('JWT_SECRET'),
  JWT_REFRESH_SECRET: requireEnv('JWT_REFRESH_SECRET'),
  JWT_EXPIRES_IN: optionalEnv('JWT_EXPIRES_IN', '15m'),
  JWT_REFRESH_EXPIRES_IN: optionalEnv('JWT_REFRESH_EXPIRES_IN', '7d'),

  // MFA
  MFA_APP_NAME: optionalEnv('MFA_APP_NAME', 'TrishulTravels'),

  // Email
  SMTP_HOST: optionalEnv('SMTP_HOST', 'smtp.gmail.com'),
  SMTP_PORT: parseInt(optionalEnv('SMTP_PORT', '587'), 10),
  SMTP_USER: optionalEnv('SMTP_USER'),
  SMTP_PASS: optionalEnv('SMTP_PASS'),
  SMTP_FROM: optionalEnv('SMTP_FROM', 'noreply@trishul.app'),

  // Twilio SMS
  TWILIO_ACCOUNT_SID: optionalEnv('TWILIO_ACCOUNT_SID'),
  TWILIO_AUTH_TOKEN: optionalEnv('TWILIO_AUTH_TOKEN'),
  TWILIO_PHONE_NUMBER: optionalEnv('TWILIO_PHONE_NUMBER'),

  // Redis
  REDIS_URL: optionalEnv('REDIS_URL', 'redis://localhost:6379'),

  // Seed
  SUPER_ADMIN_EMAIL: requireEnv('SUPER_ADMIN_EMAIL'),
  SUPER_ADMIN_PASSWORD: requireEnv('SUPER_ADMIN_PASSWORD'),
  SUPER_ADMIN_NAME: optionalEnv('SUPER_ADMIN_NAME', 'Super Admin'),
  SUPER_ADMIN_PHONE: optionalEnv('SUPER_ADMIN_PHONE', ''),

  // CORS
  CLIENT_URL: optionalEnv('CLIENT_URL', 'http://localhost:3000'),
  SOCKET_CORS_ORIGIN: optionalEnv('SOCKET_CORS_ORIGIN', '*'),

  // Rate limiting
  RATE_LIMIT_WINDOW_MS: parseInt(optionalEnv('RATE_LIMIT_WINDOW_MS', '900000'), 10),
  RATE_LIMIT_MAX_REQUESTS: parseInt(optionalEnv('RATE_LIMIT_MAX_REQUESTS', '100'), 10),

  // Maps
  GOOGLE_MAPS_API_KEY: optionalEnv('GOOGLE_MAPS_API_KEY'),
};

export type Env = typeof env;
