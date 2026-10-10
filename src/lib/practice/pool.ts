/** Xáo trộn mảng (Fisher–Yates). */
export function shuffleList<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

/** Lấy 1 phần tử từ pool; hết thì refill rồi lấy tiếp. */
export function takeNextFromPool(
  pool: string[],
  refill: () => string[],
  putBack?: string,
): { item: string; pool: string[]; recycled: boolean } {
  let next = [...pool];
  if (putBack) next.push(putBack);
  let recycled = false;
  if (next.length === 0) {
    next = refill();
    recycled = true;
  }
  const i = Math.floor(Math.random() * next.length);
  const item = next[i]!;
  next.splice(i, 1);
  return { item, pool: next, recycled };
}
