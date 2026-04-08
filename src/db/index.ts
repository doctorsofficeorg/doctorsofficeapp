import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

function createDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    // Return a proxy that throws on actual use — demo mode never reaches DB calls
    return new Proxy({} as ReturnType<typeof drizzle>, {
      get(_, prop) {
        if (prop === "then") return undefined; // avoid treating as thenable
        return () => {
          throw new Error(
            "DATABASE_URL is not set. Running in demo mode — DB calls should be bypassed."
          );
        };
      },
    });
  }
  const client = postgres(connectionString, { prepare: false });
  return drizzle(client, { schema });
}

export const db = createDb();

export * from "./schema";
