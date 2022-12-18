import { Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";

import { handleRun } from "./handlers.ts";

const router = new Router();

router.get("/", (context) => {
  context.response.headers.set("content-type", "application/json");
  context.response.body = JSON.stringify({
    success: true,
    message: "successfully reached / route",
    data: null,
  });
});

router.get("/run", async (context) => {
  await handleRun(context);
});

router.post("/run", async (context) => {
  await handleRun(context);
});

export { router };
