export function createLimiter(max = 6) {
  let running = 0;
  const q: Array<() => Promise<void>> = [];

  const runNext = () => {
    if (running >= max || q.length === 0) return;
    running++;
    const job = q.shift()!;
    job().finally(() => {
      running--;
      runNext();
    });
  };

  return function enqueue<T>(fn: () => Promise<T>) {
    return new Promise<T>((resolve, reject) => {
      q.push(async () => {
        try {
          resolve(await fn());
        } catch (e) {
          reject(e);
        }
      });
      runNext();
    });
  };
}
