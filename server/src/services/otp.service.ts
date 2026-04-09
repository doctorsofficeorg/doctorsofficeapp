import { config } from "../config/index.js";
import { cacheGet, cacheSet, cacheDel, getRedisClient } from "./cache.service.js";

/** In-memory OTP store — used as fallback when Redis is unavailable */
const memoryStore = new Map<string, { otp: string; expiresAt: number }>();

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function otpKey(phone: string): string {
  return `otp:${phone}`;
}

async function storeOtp(key: string, otp: string, ttl: number): Promise<void> {
  if (getRedisClient()) {
    await cacheSet(key, otp, ttl);
  } else {
    // Fallback to in-memory
    memoryStore.set(key, { otp, expiresAt: Date.now() + ttl * 1000 });
  }
}

async function retrieveOtp(key: string): Promise<string | null> {
  if (getRedisClient()) {
    return cacheGet(key);
  }
  // Fallback to in-memory
  const entry = memoryStore.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    memoryStore.delete(key);
    return null;
  }
  return entry.otp;
}

async function deleteOtp(key: string): Promise<void> {
  if (getRedisClient()) {
    await cacheDel(key);
  } else {
    memoryStore.delete(key);
  }
}

export async function sendOtp(phone: string): Promise<{ message: string; expiresIn: number; otp?: string }> {
  const otp = generateOtp();
  const key = otpKey(phone);

  await storeOtp(key, otp, config.otpExpiry);

  // In production, integrate with an SMS provider (e.g., MSG91, Twilio)
  if (config.isDev) {
    console.log(`[OTP] ${phone}: ${otp}`);
    return { message: "OTP sent", expiresIn: config.otpExpiry, otp };
  }

  return { message: "OTP sent", expiresIn: config.otpExpiry };
}

export async function verifyOtp(phone: string, otp: string): Promise<boolean> {
  const key = otpKey(phone);
  const storedOtp = await retrieveOtp(key);

  if (!storedOtp || storedOtp !== otp) {
    return false;
  }

  // OTP valid — delete so it can't be reused
  await deleteOtp(key);
  return true;
}
