/** Chuẩn hóa để so sánh: không phân biệt hoa/thường; gộp khoảng trắng (giữ space cho more/most …). */
export function normalizeAnswer(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

/** `Lived` / `LIVED` / ` lived ` đều khớp `lived`. */
export function answersMatch(user: string, accepted: string[]): boolean {
  const n = normalizeAnswer(user);
  if (!n) return false;
  return accepted.some((a) => normalizeAnswer(a) === n);
}
