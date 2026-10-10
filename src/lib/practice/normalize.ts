/** Chuẩn hóa để so sánh: bỏ khoảng trắng, không phân biệt hoa/thường. */
export function normalizeAnswer(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, "");
}

/** `Lived` / `LIVED` / ` lived ` đều khớp `lived`. */
export function answersMatch(user: string, accepted: string[]): boolean {
  const n = normalizeAnswer(user);
  if (!n) return false;
  return accepted.some((a) => normalizeAnswer(a) === n);
}
