#!/bin/bash

PORT=8586 ACCESS_TOKEN=123456 deno run --watch --allow-env=PORT,HOSTNAME,ACCESS_TOKEN,RATE_LIMIT_WINDOW,RATE_LIMIT_MAX_REQ,TIMEOUT --allow-net --allow-run --allow-read=./files --allow-write=./files main.ts
