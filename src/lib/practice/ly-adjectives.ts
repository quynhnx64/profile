import { formAdverbLy } from "./ly-rules";
import { shuffleList } from "./pool";

export type LyAdjective = {
  base: string;
  meaning: string;
  kind: "regular" | "irregular";
  adverb?: string[];
  note?: string;
};

const irregular: LyAdjective[] = [
  {
    base: "good",
    meaning: "tốt",
    kind: "irregular",
    adverb: ["well"],
    note: "good → well. Không viết goodly.",
  },
  {
    base: "fast",
    meaning: "nhanh",
    kind: "irregular",
    adverb: ["fast"],
    note: "Tính từ và trạng từ cùng dạng. Không viết fastly.",
  },
  {
    base: "hard",
    meaning: "chăm chỉ / mạnh",
    kind: "irregular",
    adverb: ["hard"],
    note: "hard (trạng từ) = chăm chỉ/mạnh. hardly = hầu như không (nghĩa khác).",
  },
  {
    base: "early",
    meaning: "sớm",
    kind: "irregular",
    adverb: ["early"],
    note: "Không đổi dạng.",
  },
  {
    base: "late",
    meaning: "muộn",
    kind: "irregular",
    adverb: ["late"],
    note: "late = muộn. lately = gần đây (nghĩa khác).",
  },
  {
    base: "daily",
    meaning: "hàng ngày",
    kind: "irregular",
    adverb: ["daily"],
    note: "Không đổi dạng.",
  },
  {
    base: "straight",
    meaning: "thẳng",
    kind: "irregular",
    adverb: ["straight"],
    note: "Không đổi dạng (go straight).",
  },
];

const regular: LyAdjective[] = [
  // Rule 1
  { base: "quick", meaning: "nhanh", kind: "regular" },
  { base: "slow", meaning: "chậm", kind: "regular" },
  { base: "careful", meaning: "cẩn thận", kind: "regular" },
  { base: "quiet", meaning: "yên lặng", kind: "regular" },
  { base: "loud", meaning: "to", kind: "regular" },
  { base: "clear", meaning: "rõ ràng", kind: "regular" },
  { base: "sad", meaning: "buồn", kind: "regular" },
  { base: "bad", meaning: "xấu / tệ", kind: "regular" },
  { base: "nice", meaning: "dễ thương / tốt", kind: "regular" },
  { base: "polite", meaning: "lịch sự", kind: "regular" },
  { base: "safe", meaning: "an toàn", kind: "regular" },
  { base: "complete", meaning: "hoàn toàn", kind: "regular" },
  { base: "beautiful", meaning: "đẹp", kind: "regular" },
  { base: "wonderful", meaning: "tuyệt vời", kind: "regular" },
  { base: "usual", meaning: "thường lệ", kind: "regular" },
  { base: "final", meaning: "cuối cùng", kind: "regular" },
  // Rule 2: consonant + y
  { base: "happy", meaning: "vui vẻ", kind: "regular" },
  { base: "easy", meaning: "dễ", kind: "regular" },
  { base: "angry", meaning: "tức giận", kind: "regular" },
  { base: "heavy", meaning: "nặng", kind: "regular" },
  { base: "noisy", meaning: "ồn ào", kind: "regular" },
  { base: "busy", meaning: "bận rộn", kind: "regular" },
  { base: "hungry", meaning: "đói", kind: "regular" },
  { base: "lucky", meaning: "may mắn", kind: "regular" },
  // Rule 3: -le
  { base: "gentle", meaning: "nhẹ nhàng", kind: "regular" },
  { base: "simple", meaning: "đơn giản", kind: "regular" },
  { base: "possible", meaning: "có thể", kind: "regular" },
  { base: "comfortable", meaning: "thoải mái", kind: "regular" },
  { base: "terrible", meaning: "khủng khiếp", kind: "regular" },
  { base: "probable", meaning: "có lẽ", kind: "regular" },
  // Rule 4: -ic
  { base: "basic", meaning: "cơ bản", kind: "regular" },
  { base: "tragic", meaning: "bi thảm", kind: "regular" },
  { base: "automatic", meaning: "tự động", kind: "regular" },
  { base: "dramatic", meaning: "kịch tính", kind: "regular" },
  { base: "public", meaning: "công khai", kind: "regular" },
];

export const LY_ADJECTIVES: LyAdjective[] = [...irregular, ...regular];
export const LY_POOL_SIZE = LY_ADJECTIVES.length;

export type ResolvedLy = {
  adjective: LyAdjective;
  forms: string[];
  ruleTitle?: string;
  ruleDetail?: string;
  ruleSteps?: string[];
  ruleId?: number;
};

export function resolveLyAdjective(adj: LyAdjective): ResolvedLy {
  if (adj.kind === "irregular") {
    return { adjective: adj, forms: adj.adverb ?? [] };
  }
  const r = formAdverbLy(adj.base);
  return {
    adjective: adj,
    forms: [r.form],
    ruleId: r.ruleId,
    ruleTitle: r.title,
    ruleDetail: r.detail,
    ruleSteps: r.steps,
  };
}

export function lyAdjectiveByBase(base: string): LyAdjective | undefined {
  return LY_ADJECTIVES.find((a) => a.base === base);
}

export function shuffleLyBases(): string[] {
  return shuffleList(LY_ADJECTIVES.map((a) => a.base));
}
