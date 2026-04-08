import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // Return a minimal stub so client components don't crash in demo mode
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        signOut: async () => ({ error: null }),
        signInWithPassword: async () => ({ data: { user: null, session: null }, error: { message: "Demo mode — no auth configured" } }),
        signUp: async () => ({ data: { user: null, session: null }, error: { message: "Demo mode — no auth configured" } }),
        signInWithOAuth: async () => ({ data: { url: null, provider: null }, error: { message: "Demo mode — no auth configured" } }),
      },
    } as ReturnType<typeof createBrowserClient>;
  }

  return createBrowserClient(url, key);
}
