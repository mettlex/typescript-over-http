import { RateLimiter } from "https://deno.land/x/oak_rate_limit@v0.1.1/mod.ts";

import { RATE_LIMIT_MAX_REQ, RATE_LIMIT_WINDOW } from "./constants.ts";

export const rateLimit = RateLimiter({
  windowMs: RATE_LIMIT_WINDOW,
  max: RATE_LIMIT_MAX_REQ,
  headers: true,
  message: "Too many requests, please try again later.",
  statusCode: 429,
});
