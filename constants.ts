export const HOSTNAME = Deno.env.get("HOSTNAME") || "localhost";
export const PORT = parseInt(Deno.env.get("PORT") || "8585");
export const RATE_LIMIT_WINDOW = Deno.env.get("RATE_LIMIT_WINDOW")
  ? parseInt(Deno.env.get("RATE_LIMIT_WINDOW") || "0")
  : 60 * 1000;
export const RATE_LIMIT_MAX_REQ = Deno.env.get("RATE_LIMIT_MAX_REQ")
  ? parseInt(Deno.env.get("RATE_LIMIT_MAX_REQ") || "0")
  : 10;
export const timeoutMs = Deno.env.get("TIMEOUT")
  ? parseInt(Deno.env.get("TIMEOUT") || "")
  : 10 * 1000;
