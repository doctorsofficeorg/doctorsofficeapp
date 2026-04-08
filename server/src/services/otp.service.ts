import { config } from "../config/index.js";
import { cacheGet, cacheSet, cacheDel } from "./cache.service.js";

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function otpKey(phone: string): string {
  return `otp:${phone}`;
}

export async function sendOtp(phone: string): Promise<{ message: string; expiresIn: number; otp?: string }> {
  const otp = generateOtp();
  const key = otpKey(phone);

  await cacheSet(key, otp, config.otpExpiry);

  // In production, integrate with an SMS provider (e.g., Twilio, MSG91)
  // For now, we log it in dev mode
  if (config.isDev) {
    console.log(`[OTP] ${phone}: ${otp}`);
    return { message: "OTP sent", expiresIn: config.otpExpiry, otp };
  }

  return { message: "OTP sent", expiresIn: config.otpExpiry };
}

export async function verifyOtp(phone: string, otp: string): Promise<boolean> {
  const key = otpKey(phone);
  const storedOtp = await cacheGet(key);

  if (!storedOtp) {
    return false;
  }

  if (storedOtp !== otp) {
    return false;
  }

  // OTP is valid - delete it so it can't be reused
  await cacheDel(key);
  return true;
}
