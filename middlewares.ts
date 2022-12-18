import { RateLimiter } from "https://deno.land/x/oak_rate_limit@0.1.0-rc2/mod.ts";

import { RATE_LIMIT_MAX_REQ, RATE_LIMIT_WINDOW } from "./constants.ts";

export const rateLimit = RateLimiter({
  windowMs: RATE_LIMIT_WINDOW,
  max: RATE_LIMIT_MAX_REQ,
  headers: true,
  message: "Too many requests, please try again later.",
  statusCode: 429,
});
