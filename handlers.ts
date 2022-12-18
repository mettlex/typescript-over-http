import { RouterContext } from "https://deno.land/x/oak@v11.1.0/mod.ts";

import { timeoutMs } from "./constants.ts";
import { timeout } from "./utils.ts";

export const handleRun = async (context: RouterContext<"/run">) => {
  let code = context.request.url.searchParams.get("code");

  context.response.headers.set("content-type", "application/json");

  if (!code && context.request.body.length < 1024 * 1024) {
    try {
      const body = context.request.body();
      const value = await body.value;
      code = decodeURIComponent(value?.code || "");
    } catch (error) {
      console.error(error);
    }
  }

  if (!code) {
    context.response.status = 400;
    context.response.body = JSON.stringify({
      success: false,
      message: "missing property: code",
      data: null,
    });
    return;
  }

  if (typeof code === "string" && code.includes("console.log")) {
    let process: Deno.Process | undefined = undefined;

    try {
      const dirname = new URL(".", import.meta.url).pathname;

      const fileName = Math.floor(Math.random() * 1000000).toString();

      const filePath = `${dirname}files/${fileName}.ts`;

      const file = await Deno.create(filePath);

      const evalCode = `const keys = Object.keys(Deno); \
        keys.forEach((prop) => { \
          Object.defineProperty(Deno, prop, { value: undefined }); }); \
        ${code}`;

      await file.write(new TextEncoder().encode(evalCode));

      process = Deno.run({
        cmd: [
          "deno",
          "run",
          "--allow-net",
          "--v8-flags=--max-old-space-size=10",
          filePath,
        ],
        stdout: "piped",
        stderr: "piped",
      });

      const promise = new Promise((resolve, reject) => {
        const tid = setTimeout(async () => {
          clearTimeout(tid);

          if (!process) {
            reject(null);
            return;
          }

          try {
            const { code } = await process.status();

            await Deno.remove(filePath);

            const rawOutput = await process.output();

            if (code === 0) {
              resolve(
                new TextDecoder()
                  .decode(rawOutput)
                  .slice(0, -1)
                  .replace(/file:\/\/\/.+files/gi, ""),
              );
            } else {
              const rawError = await process.stderrOutput();
              reject(
                new TextDecoder()
                  .decode(rawError)
                  .slice(0, -1)
                  .replace(/file:\/\/\/.+files/gi, ""),
              );
            }
          } catch (error) {
            reject(error);
          }
        }, 0);
      });

      const result = await Promise.race([promise, timeout(timeoutMs)]);

      context.response.body = result as string;

      return;
    } catch (error) {
      if (typeof process !== "undefined") {
        try {
          process.kill("SIGTERM");
          process.kill("SIGINT");
        } catch (_error) {
          // not interested
        }
      }

      context.response.status = 500;
      // console.error(error);
      context.response.body = JSON.stringify({
        success: false,
        message: `${
          (error as Error)?.message ? (error as Error)?.message : error
        }`,
        data: null,
      });
      return;
    }
  }

  context.response.status = 400;
  context.response.body = JSON.stringify({
    success: false,
    message: "invalid code. code must have at least one console.log statement",
    data: null,
  });
};
