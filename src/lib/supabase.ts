import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  throw new Error("Missing Supabase environment variables");
}

/**
 * Typed Supabase client, created once. Only `*.gateway.ts` / `services.ts` and
 * the composition root may import it (`02-architecture.md`, enforced by
 * `enforce-architecture.py`).
 *
 * `global.fetch` is resolved per call on purpose: it is what lets MSW intercept
 * gateway requests in tests (`patterns/msw-supabase.md`).
 */
export const supabase = createClient<Database>(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: { fetch: (...args) => fetch(...args) },
});
