import { config } from "../config/index.js";
import { cacheGet, cacheSet, cacheDel } from "./cache.service.js";

const MSG91_BASE = "https://control.msg91.com/api/v5/otp";

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function otpKey(phone: string): string {
  return `otp:${phone}`;
}

/** Strip the + prefix — MSG91 expects "919876543210" not "+919876543210" */
function toMsg91Mobile(phone: string): string {
  return phone.replace(/^\+/, "");
}

function useMsg91(): boolean {
  return !!(config.msg91AuthKey && config.msg91TemplateId && config.isProd);
}

// ─── Send OTP ────────────────────────────────────────────────────────────────

export async function sendOtp(phone: string): Promise<{ message: string; expiresIn: number; otp?: string }> {
  // Production with MSG91 configured
  if (useMsg91()) {
    const res = await fetch(MSG91_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authkey: config.msg91AuthKey,
      },
      body: JSON.stringify({
        template_id: config.msg91TemplateId,
        mobile: toMsg91Mobile(phone),
        otp_length: 6,
      }),
    });

    const data = await res.json() as { type: string; request_id?: string; message?: string };

    if (data.type === "success") {
      console.log(`[OTP] MSG91 sent to ${phone}`);
      return { message: "OTP sent", expiresIn: config.otpExpiry };
    }

    console.error("[OTP] MSG91 send error:", data);
    throw new Error(data.message || "Failed to send OTP via MSG91");
  }

  // Dev mode — generate locally, store in Redis, return OTP in response
  const otp = generateOtp();
  await cacheSet(otpKey(phone), otp, config.otpExpiry);

  console.log(`[OTP] ${phone}: ${otp}`);
  return { message: "OTP sent", expiresIn: config.otpExpiry, otp };
}

// ─── Verify OTP ──────────────────────────────────────────────────────────────

export async function verifyOtp(phone: string, otp: string): Promise<boolean> {
  // Production with MSG91 configured
  if (useMsg91()) {
    const mobile = toMsg91Mobile(phone);
    const url = `${MSG91_BASE}/verify?otp=${encodeURIComponent(otp)}&mobile=${encodeURIComponent(mobile)}`;

    const res = await fetch(url, {
      method: "GET",
      headers: { authkey: config.msg91AuthKey },
    });

    const data = await res.json() as { type: string; message: string };
    console.log(`[OTP] MSG91 verify ${phone}: ${data.type} — ${data.message}`);
    return data.type === "success";
  }

  // Dev mode — verify from Redis
  const key = otpKey(phone);
  const storedOtp = await cacheGet(key);
  if (!storedOtp) {
    return false;
  }

  if (storedOtp !== otp) {
    return false;
  }

  // OTP is valid — delete it so it can't be reused
  await cacheDel(key);
  return true;
}

// ─── Resend OTP ──────────────────────────────────────────────────────────────

export async function resendOtp(phone: string, retryType: "text" | "voice" = "text"): Promise<{ message: string }> {
  if (useMsg91()) {
    const mobile = toMsg91Mobile(phone);
    const url = `${MSG91_BASE}/retry?mobile=${encodeURIComponent(mobile)}&retrytype=${retryType}`;

    const res = await fetch(url, {
      method: "GET",
      headers: { authkey: config.msg91AuthKey },
    });

    const data = await res.json() as { type: string; message: string };

    if (data.type === "success") {
      return { message: "OTP resent" };
    }

    throw new Error(data.message || "Failed to resend OTP");
  }

  // Dev mode — just send a fresh OTP
  await sendOtp(phone);
  return { message: "OTP resent" };
}
