import { Application } from "https://deno.land/x/oak@v11.1.0/mod.ts";

import { HOSTNAME, PORT } from "./constants.ts";
import { rateLimit } from "./middlewares.ts";
import { router } from "./routes.ts";

const app = new Application();

app.use(rateLimit);
app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener("listen", (event) => {
  console.log(
    `Listening at ${event.secure ? "https://" : "http://"}${event.hostname}:${
      event.port
    }`,
  );
});

await app.listen({
  hostname: HOSTNAME,
  port: PORT,
});
