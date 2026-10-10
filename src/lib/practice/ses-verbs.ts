import { formThirdPersonS } from "./ses-rules";
import { shuffleList } from "./pool";

export type SesVerb = {
  base: string;
  meaning: string;
  kind: "regular" | "irregular";
  /** Chỉ cần với irregular */
  third?: string[];
  note?: string;
};

/** Bất quy tắc ngôi 3 số ít thường gặp. */
const irregular: SesVerb[] = [
  { base: "be", meaning: "thì / là / ở", kind: "irregular", third: ["is"], note: "be → is (he/she/it). I am · you/we/they are." },
  { base: "have", meaning: "có", kind: "irregular", third: ["has"], note: "have → has (không viết haves)." },
  { base: "do", meaning: "làm", kind: "irregular", third: ["does"], note: "do → does (phát âm /dʌz/)." },
  { base: "say", meaning: "nói", kind: "irregular", third: ["says"], note: "Viết says; phát âm thường /sez/." },
];

/** Có quy tắc — phủ 4 nhóm chính tả s/es. */
const regular: SesVerb[] = [
  // Rule 1: +s
  { base: "work", meaning: "làm việc", kind: "regular" },
  { base: "read", meaning: "đọc", kind: "regular" },
  { base: "like", meaning: "thích", kind: "regular" },
  { base: "live", meaning: "sống", kind: "regular" },
  { base: "need", meaning: "cần", kind: "regular" },
  { base: "want", meaning: "muốn", kind: "regular" },
  { base: "help", meaning: "giúp", kind: "regular" },
  { base: "call", meaning: "gọi", kind: "regular" },
  { base: "open", meaning: "mở", kind: "regular" },
  { base: "listen", meaning: "nghe", kind: "regular" },
  { base: "start", meaning: "bắt đầu", kind: "regular" },
  { base: "cook", meaning: "nấu", kind: "regular" },
  { base: "walk", meaning: "đi bộ", kind: "regular" },
  { base: "talk", meaning: "nói chuyện", kind: "regular" },
  { base: "run", meaning: "chạy", kind: "regular" },
  { base: "sing", meaning: "hát", kind: "regular" },
  // Rule 2: +es
  { base: "go", meaning: "đi", kind: "regular" },
  { base: "watch", meaning: "xem", kind: "regular" },
  { base: "catch", meaning: "bắt", kind: "regular" },
  { base: "teach", meaning: "dạy", kind: "regular" },
  { base: "reach", meaning: "chạm tới", kind: "regular" },
  { base: "miss", meaning: "bỏ lỡ / nhớ", kind: "regular" },
  { base: "pass", meaning: "đi qua / vượt", kind: "regular" },
  { base: "kiss", meaning: "hôn", kind: "regular" },
  { base: "fix", meaning: "sửa", kind: "regular" },
  { base: "mix", meaning: "trộn", kind: "regular" },
  { base: "box", meaning: "đóng hộp / quyền anh", kind: "regular" },
  { base: "wash", meaning: "rửa", kind: "regular" },
  { base: "push", meaning: "đẩy", kind: "regular" },
  { base: "finish", meaning: "kết thúc", kind: "regular" },
  { base: "buzz", meaning: "kêu vo vo", kind: "regular" },
  // Rule 3: consonant + y → ies
  { base: "study", meaning: "học", kind: "regular" },
  { base: "fly", meaning: "bay", kind: "regular" },
  { base: "cry", meaning: "khóc", kind: "regular" },
  { base: "try", meaning: "cố gắng", kind: "regular" },
  { base: "carry", meaning: "mang", kind: "regular" },
  { base: "worry", meaning: "lo lắng", kind: "regular" },
  { base: "copy", meaning: "sao chép", kind: "regular" },
  { base: "deny", meaning: "phủ nhận", kind: "regular" },
  // Rule 4: vowel + y → ys
  { base: "play", meaning: "chơi", kind: "regular" },
  { base: "enjoy", meaning: "thích / tận hưởng", kind: "regular" },
  { base: "buy", meaning: "mua", kind: "regular" },
  { base: "stay", meaning: "ở lại", kind: "regular" },
  { base: "pay", meaning: "trả tiền", kind: "regular" },
  { base: "delay", meaning: "hoãn", kind: "regular" },
  { base: "destroy", meaning: "phá hủy", kind: "regular" },
];

/** Gộp và bỏ trùng base (ưu tiên bản đầu). */
function dedupe(list: SesVerb[]): SesVerb[] {
  const seen = new Set<string>();
  const out: SesVerb[] = [];
  for (const v of list) {
    const k = v.base.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(v);
  }
  return out;
}

export const SES_VERBS: SesVerb[] = dedupe([...irregular, ...regular]);
export const SES_POOL_SIZE = SES_VERBS.length;

export type ResolvedSes = {
  verb: SesVerb;
  forms: string[];
  ruleTitle?: string;
  ruleDetail?: string;
  ruleSteps?: string[];
  ruleId?: number;
};

export function resolveSesVerb(verb: SesVerb): ResolvedSes {
  if (verb.kind === "irregular") {
    return { verb, forms: verb.third ?? [] };
  }
  const r = formThirdPersonS(verb.base);
  return {
    verb,
    forms: [r.form],
    ruleId: r.ruleId,
    ruleTitle: r.title,
    ruleDetail: r.detail,
    ruleSteps: r.steps,
  };
}

export function sesVerbByBase(base: string): SesVerb | undefined {
  return SES_VERBS.find((v) => v.base === base);
}

export function shuffleSesBases(): string[] {
  return shuffleList(SES_VERBS.map((v) => v.base));
}
