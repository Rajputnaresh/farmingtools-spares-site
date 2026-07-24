// TRACKED + shipped to the browser (the app loads this client-side). ONLY put browser-safe
// values here: the SUPABASE_URL and the anon/publishable key (safe by design — RLS protects data).
// NEVER put the service_role key or any secret in this file. Secrets belong in seed.sql/env (git-ignored).
window.LEDGER_CONFIG = {
  SUPABASE_URL: "https://hzpvdeepyejhkshzrfsm.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_3QmN1RvmsU5O3qfGobX1lw_O1HwrRD8",
  IMPORTER_ID: "00000000-0000-0000-0000-000000000001",
};
