import { formComparative } from "./cmp-rules";
import { shuffleList } from "./pool";

export type CmpAdjective = {
  base: string;
  meaning: string;
  kind: "regular" | "irregular";
  comparative?: string[];
  superlative?: string[];
  note?: string;
};

const irregular: CmpAdjective[] = [
  {
    base: "good",
    meaning: "tốt",
    kind: "irregular",
    comparative: ["better"],
    superlative: ["best"],
    note: "good → better → best.",
  },
  {
    base: "bad",
    meaning: "xấu / tệ",
    kind: "irregular",
    comparative: ["worse"],
    superlative: ["worst"],
    note: "bad → worse → worst.",
  },
  {
    base: "far",
    meaning: "xa",
    kind: "irregular",
    comparative: ["farther", "further"],
    superlative: ["farthest", "furthest"],
    note: "farther/further và farthest/furthest đều chấp nhận.",
  },
  {
    base: "little",
    meaning: "ít",
    kind: "irregular",
    comparative: ["less"],
    superlative: ["least"],
    note: "little → less → least (lượng).",
  },
  {
    base: "much",
    meaning: "nhiều (không đếm được)",
    kind: "irregular",
    comparative: ["more"],
    superlative: ["most"],
    note: "much → more → most.",
  },
  {
    base: "many",
    meaning: "nhiều (đếm được)",
    kind: "irregular",
    comparative: ["more"],
    superlative: ["most"],
    note: "many → more → most.",
  },
  {
    base: "old",
    meaning: "già / cũ",
    kind: "irregular",
    comparative: ["older", "elder"],
    superlative: ["oldest", "eldest"],
    note: "older/oldest phổ biến; elder/eldest thường dùng trong gia đình.",
  },
];

const regular: CmpAdjective[] = [
  // short +er
  { base: "tall", meaning: "cao", kind: "regular" },
  { base: "short", meaning: "thấp / ngắn", kind: "regular" },
  { base: "long", meaning: "dài", kind: "regular" },
  { base: "small", meaning: "nhỏ", kind: "regular" },
  { base: "young", meaning: "trẻ", kind: "regular" },
  { base: "cheap", meaning: "rẻ", kind: "regular" },
  { base: "fast", meaning: "nhanh", kind: "regular" },
  { base: "hard", meaning: "khó / cứng", kind: "regular" },
  { base: "high", meaning: "cao", kind: "regular" },
  { base: "low", meaning: "thấp", kind: "regular" },
  { base: "new", meaning: "mới", kind: "regular" },
  { base: "clean", meaning: "sạch", kind: "regular" },
  { base: "dark", meaning: "tối", kind: "regular" },
  { base: "strong", meaning: "mạnh", kind: "regular" },
  { base: "weak", meaning: "yếu", kind: "regular" },
  { base: "rich", meaning: "giàu", kind: "regular" },
  { base: "poor", meaning: "nghèo", kind: "regular" },
  // -e
  { base: "nice", meaning: "dễ thương", kind: "regular" },
  { base: "large", meaning: "lớn", kind: "regular" },
  { base: "safe", meaning: "an toàn", kind: "regular" },
  { base: "wide", meaning: "rộng", kind: "regular" },
  { base: "close", meaning: "gần", kind: "regular" },
  // CVC double
  { base: "big", meaning: "to", kind: "regular" },
  { base: "hot", meaning: "nóng", kind: "regular" },
  { base: "thin", meaning: "gầy / mỏng", kind: "regular" },
  { base: "fat", meaning: "béo", kind: "regular" },
  { base: "sad", meaning: "buồn", kind: "regular" },
  { base: "wet", meaning: "ướt", kind: "regular" },
  // -y
  { base: "happy", meaning: "vui", kind: "regular" },
  { base: "easy", meaning: "dễ", kind: "regular" },
  { base: "heavy", meaning: "nặng", kind: "regular" },
  { base: "funny", meaning: "hài hước", kind: "regular" },
  { base: "busy", meaning: "bận", kind: "regular" },
  { base: "early", meaning: "sớm", kind: "regular" },
  { base: "pretty", meaning: "xinh", kind: "regular" },
  { base: "noisy", meaning: "ồn ào", kind: "regular" },
  // more/most
  { base: "beautiful", meaning: "đẹp", kind: "regular" },
  { base: "expensive", meaning: "đắt", kind: "regular" },
  { base: "interesting", meaning: "thú vị", kind: "regular" },
  { base: "important", meaning: "quan trọng", kind: "regular" },
  { base: "difficult", meaning: "khó", kind: "regular" },
  { base: "careful", meaning: "cẩn thận", kind: "regular" },
  { base: "famous", meaning: "nổi tiếng", kind: "regular" },
  { base: "comfortable", meaning: "thoải mái", kind: "regular" },
  { base: "dangerous", meaning: "nguy hiểm", kind: "regular" },
  { base: "popular", meaning: "phổ biến", kind: "regular" },
  // borderline short-ish
  { base: "quiet", meaning: "yên lặng", kind: "regular" },
  { base: "narrow", meaning: "hẹp", kind: "regular" },
  { base: "clever", meaning: "thông minh", kind: "regular" },
  { base: "simple", meaning: "đơn giản", kind: "regular" },
];

export const CMP_ADJECTIVES: CmpAdjective[] = [...irregular, ...regular];
export const CMP_POOL_SIZE = CMP_ADJECTIVES.length;

export type CmpTarget = "er" | "est";

export type ResolvedCmp = {
  adjective: CmpAdjective;
  comparative: string[];
  superlative: string[];
  ruleTitle?: string;
  ruleDetail?: string;
  ruleSteps?: string[];
  ruleId?: number;
};

export function resolveCmpAdjective(adj: CmpAdjective): ResolvedCmp {
  if (adj.kind === "irregular") {
    return {
      adjective: adj,
      comparative: adj.comparative ?? [],
      superlative: adj.superlative ?? [],
    };
  }
  const r = formComparative(adj.base);
  return {
    adjective: adj,
    comparative: [r.comparative],
    superlative: [r.superlative],
    ruleId: r.ruleId,
    ruleTitle: r.title,
    ruleDetail: r.detail,
    ruleSteps: r.steps,
  };
}

export function cmpAdjectiveByBase(base: string): CmpAdjective | undefined {
  return CMP_ADJECTIVES.find((a) => a.base === base);
}

export function shuffleCmpBases(): string[] {
  return shuffleList(CMP_ADJECTIVES.map((a) => a.base));
}

export function cmpTargetLabel(t: CmpTarget): string {
  return t === "er" ? "So sánh hơn (-er / more)" : "So sánh nhất (-est / most)";
}
