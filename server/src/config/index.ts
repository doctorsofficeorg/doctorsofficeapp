import dotenv from "dotenv";

dotenv.config();

// Prefer REDIS_URL (redis://[user:pass@]host:port) when set; fall back to
// individual REDIS_HOST / REDIS_PORT / REDIS_USERNAME / REDIS_PASSWORD vars.
const redisUrl = process.env.REDIS_URL || "";
let parsedRedisHost = process.env.REDIS_HOST || "localhost";
let parsedRedisPort = parseInt(process.env.REDIS_PORT || "6379", 10);
let parsedRedisUsername = process.env.REDIS_USERNAME || "";
let parsedRedisPassword = process.env.REDIS_PASSWORD || "";
if (redisUrl) {
  try {
    const u = new URL(redisUrl);
    if (u.hostname) parsedRedisHost = u.hostname;
    if (u.port) parsedRedisPort = parseInt(u.port, 10);
    if (u.username) parsedRedisUsername = decodeURIComponent(u.username);
    if (u.password) parsedRedisPassword = decodeURIComponent(u.password);
  } catch {
    console.warn("[Config] REDIS_URL is set but could not be parsed; falling back to REDIS_HOST/PORT");
  }
}

export const config = {
  port: parseInt(process.env.PORT || "3000", 10),
  mongodbUri: process.env.MONGODB_URI || "mongodb://localhost:27017/doctorsoffice",
  redisUrl,
  redisHost: parsedRedisHost,
  redisPort: parsedRedisPort,
  redisUsername: parsedRedisUsername,
  redisPassword: parsedRedisPassword,
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-me",
  otpExpiry: parseInt(process.env.OTP_EXPIRY || "300", 10),
  msg91AuthKey: process.env.MSG91_AUTH_KEY || "",
  msg91TemplateId: process.env.MSG91_TEMPLATE_ID || "",
  nodeEnv: process.env.NODE_ENV || "development",

  get isDev(): boolean {
    return this.nodeEnv === "development";
  },

  get isProd(): boolean {
    return this.nodeEnv === "production";
  },
} as const;
