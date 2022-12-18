export const timeout = (ms: number) =>
  new Promise((_, reject) => {
    setTimeout(() => reject(`Timeout after ${ms} ms.`), ms);
  });
