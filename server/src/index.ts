import dns from "node:dns";
// Use Google DNS for SRV record resolution (needed for MongoDB Atlas on some networks)
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import { config } from "./config/index.js";
import { initRedis } from "./services/cache.service.js";

// Route imports
import authRoutes from "./routes/auth.routes.js";
import clinicRoutes from "./routes/clinic.routes.js";
import memberRoutes from "./routes/member.routes.js";
import patientRoutes from "./routes/patient.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import prescriptionRoutes from "./routes/prescription.routes.js";
import invoiceRoutes from "./routes/invoice.routes.js";

const app = express();

// ---------------------------------------------------------------------------
// Global middleware
// ---------------------------------------------------------------------------
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

// ---------------------------------------------------------------------------
// Health check (unauthenticated)
// ---------------------------------------------------------------------------
app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// ---------------------------------------------------------------------------
// Mount API routes
// ---------------------------------------------------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/clinics", clinicRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/invoices", invoiceRoutes);

// ---------------------------------------------------------------------------
// 404 handler
// ---------------------------------------------------------------------------
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ---------------------------------------------------------------------------
// Global error handler
// ---------------------------------------------------------------------------
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("[Server] Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// ---------------------------------------------------------------------------
// Startup
// ---------------------------------------------------------------------------
async function start(): Promise<void> {
  try {
    // Connect to MongoDB
    console.log("[MongoDB] Connecting...");
    await mongoose.connect(config.mongodbUri);
    console.log("[MongoDB] Connected successfully");

    // One-shot cleanup: drop any legacy global unique indexes on Patient
    // collection that are no longer in the schema. These indexes pre-dated
    // multi-tenancy and caused cross-clinic collisions.
    try {
      const coll = mongoose.connection.collection("patients");
      const indexes = await coll.indexes();
      const keep = new Set(["_id_", "clinicId_1", "clinicId_1_phone_1", "clinicId_1_fullName_text", "patientUid_1"]);
      for (const idx of indexes) {
        if (!idx.name || keep.has(idx.name)) continue;
        if (idx.unique) {
          await coll.dropIndex(idx.name);
          console.log(`[MongoDB] Dropped stale unique index: patients.${idx.name}`);
        }
      }
    } catch (e) {
      console.warn("[MongoDB] Index cleanup skipped:", (e as Error).message);
    }

    // Connect to Redis (graceful fallback)
    console.log("[Redis] Connecting...");
    await initRedis();

    // Start HTTP server
    app.listen(config.port, () => {
      console.log("─────────────────────────────────────────");
      console.log(`  Doctors Office API Server`);
      console.log(`  Environment : ${config.nodeEnv}`);
      console.log(`  Port        : ${config.port}`);
      console.log(`  MongoDB     : ${config.mongodbUri}`);
      console.log(`  Redis       : ${config.redisHost}:${config.redisPort}`);
      console.log("─────────────────────────────────────────");
    });
  } catch (error) {
    console.error("[Server] Failed to start:", error);
    process.exit(1);
  }
}

// Graceful shutdown
function shutdown(signal: string): void {
  console.log(`\n[Server] ${signal} received. Shutting down gracefully...`);
  mongoose.connection.close().then(() => {
    console.log("[MongoDB] Connection closed");
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

start();

export default app;
