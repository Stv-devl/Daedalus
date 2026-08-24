/**
 * Placeholder until the first migration exists. Regenerate with
 * `pnpm db:types` (`supabase gen types typescript --linked`) in the SAME change
 * as every migration — `06-database.md`. Never hand-edit this file.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
