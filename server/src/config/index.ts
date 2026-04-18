import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "3000", 10),
  mongodbUri: process.env.MONGODB_URI || "mongodb://localhost:27017/doctorsoffice",
  redisHost: process.env.REDIS_HOST || "localhost",
  redisPort: parseInt(process.env.REDIS_PORT || "6379", 10),
  redisUsername: process.env.REDIS_USERNAME || "",
  redisPassword: process.env.REDIS_PASSWORD || "",
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
