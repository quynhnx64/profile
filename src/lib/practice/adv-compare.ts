import { shuffleList } from "./pool";
import type { DrillResolved } from "@/components/practice/word-drill";

/**
 * So sánh trạng từ:
 * - ngắn (cùng dạng adj): faster / fastest
 * - -ly: more carefully / most carefully
 * - bất quy tắc: well → better / best
 */
type Item = {
  base: string;
  meaning: string;
  kind: "regular" | "irregular";
  /** short = -er/-est; long = more/most */
  pattern: "short" | "long";
  comparative?: string[];
  superlative?: string[];
  note?: string;
  ruleTitle?: string;
  ruleDetail?: string;
};

const items: Item[] = [
  {
    base: "well",
    meaning: "tốt (trạng từ của good)",
    kind: "irregular",
    pattern: "short",
    comparative: ["better"],
    superlative: ["best"],
    note: "well → better → best.",
  },
  {
    base: "badly",
    meaning: "tệ",
    kind: "irregular",
    pattern: "long",
    comparative: ["worse"],
    superlative: ["worst"],
    note: "badly → worse → worst.",
  },
  {
    base: "far",
    meaning: "xa",
    kind: "irregular",
    pattern: "short",
    comparative: ["farther", "further"],
    superlative: ["farthest", "furthest"],
  },
  {
    base: "little",
    meaning: "ít",
    kind: "irregular",
    pattern: "short",
    comparative: ["less"],
    superlative: ["least"],
  },
  {
    base: "much",
    meaning: "nhiều",
    kind: "irregular",
    pattern: "short",
    comparative: ["more"],
    superlative: ["most"],
  },
  // short adverbs
  {
    base: "fast",
    meaning: "nhanh",
    kind: "regular",
    pattern: "short",
    ruleTitle: "Trạng từ ngắn → -er / -est",
    ruleDetail: "Trạng từ ngắn (thường giống tính từ) thêm -er / -est.",
  },
  {
    base: "hard",
    meaning: "chăm chỉ / mạnh",
    kind: "regular",
    pattern: "short",
    ruleTitle: "Trạng từ ngắn → -er / -est",
    ruleDetail: "hard → harder / hardest (không dùng more hard).",
  },
  {
    base: "early",
    meaning: "sớm",
    kind: "regular",
    pattern: "short",
    comparative: ["earlier"],
    superlative: ["earliest"],
    ruleTitle: "Trạng từ ngắn kết thúc -y → -ier / -iest",
    ruleDetail: "early → earlier / earliest.",
  },
  {
    base: "late",
    meaning: "muộn",
    kind: "regular",
    pattern: "short",
    ruleTitle: "Trạng từ ngắn → -er / -est",
    ruleDetail: "late → later / latest.",
  },
  {
    base: "soon",
    meaning: "sớm (soon)",
    kind: "regular",
    pattern: "short",
    ruleTitle: "Trạng từ ngắn → -er / -est",
    ruleDetail: "soon → sooner / soonest.",
  },
  {
    base: "near",
    meaning: "gần",
    kind: "regular",
    pattern: "short",
    ruleTitle: "Trạng từ ngắn → -er / -est",
    ruleDetail: "near → nearer / nearest.",
  },
  // long -ly
  {
    base: "carefully",
    meaning: "cẩn thận",
    kind: "regular",
    pattern: "long",
    ruleTitle: "Trạng từ -ly → more / most",
    ruleDetail: "Trạng từ dài (thường kết thúc -ly) dùng more / most.",
  },
  {
    base: "quickly",
    meaning: "nhanh chóng",
    kind: "regular",
    pattern: "long",
    ruleTitle: "Trạng từ -ly → more / most",
    ruleDetail: "quickly → more quickly / most quickly.",
  },
  {
    base: "slowly",
    meaning: "chậm rãi",
    kind: "regular",
    pattern: "long",
    ruleTitle: "Trạng từ -ly → more / most",
    ruleDetail: "slowly → more slowly / most slowly.",
  },
  {
    base: "quietly",
    meaning: "yên lặng",
    kind: "regular",
    pattern: "long",
    ruleTitle: "Trạng từ -ly → more / most",
    ruleDetail: "quietly → more quietly / most quietly.",
  },
  {
    base: "happily",
    meaning: "vui vẻ",
    kind: "regular",
    pattern: "long",
    ruleTitle: "Trạng từ -ly → more / most",
    ruleDetail: "happily → more happily / most happily.",
  },
  {
    base: "easily",
    meaning: "một cách dễ dàng",
    kind: "regular",
    pattern: "long",
    ruleTitle: "Trạng từ -ly → more / most",
    ruleDetail: "easily → more easily / most easily.",
  },
  {
    base: "beautifully",
    meaning: "một cách đẹp",
    kind: "regular",
    pattern: "long",
    ruleTitle: "Trạng từ -ly → more / most",
    ruleDetail: "beautifully → more beautifully / most beautifully.",
  },
  {
    base: "clearly",
    meaning: "rõ ràng",
    kind: "regular",
    pattern: "long",
    ruleTitle: "Trạng từ -ly → more / most",
    ruleDetail: "clearly → more clearly / most clearly.",
  },
  {
    base: "politely",
    meaning: "lịch sự",
    kind: "regular",
    pattern: "long",
    ruleTitle: "Trạng từ -ly → more / most",
    ruleDetail: "politely → more politely / most politely.",
  },
];

function shortErEst(base: string): { c: string; s: string } {
  if (base.endsWith("y") && base.length > 1) {
    const stem = base.slice(0, -1);
    return { c: `${stem}ier`, s: `${stem}iest` };
  }
  if (base.endsWith("e")) return { c: `${base}r`, s: `${base}st` };
  return { c: `${base}er`, s: `${base}est` };
}

export const ADV_COMPARE_POOL_SIZE = items.length;
export const ADV_COMPARE_RULE_SUMMARIES = [
  { id: 1, title: "Trạng từ ngắn → -er / -est", examples: "fast → faster / fastest · hard → harder / hardest" },
  { id: 2, title: "Trạng từ -ly → more / most", examples: "carefully → more carefully / most carefully" },
  {
    id: 3,
    title: "Bất quy tắc",
    examples: "well → better / best · badly → worse / worst · far → farther/further",
  },
];

export function shuffleAdvCompareBases() {
  return shuffleList(items.map((x) => x.base));
}

export function resolveAdvCompareByBase(base: string): DrillResolved | null {
  const item = items.find((x) => x.base === base);
  if (!item) return null;

  let comparative = item.comparative;
  let superlative = item.superlative;
  if (!comparative || !superlative) {
    if (item.pattern === "long") {
      comparative = [`more ${item.base}`];
      superlative = [`most ${item.base}`];
    } else {
      const { c, s } = shortErEst(item.base);
      comparative = [c];
      superlative = [s];
    }
  }

  return {
    base: item.base,
    meaning: item.meaning,
    kind: item.kind,
    forms: comparative,
    note: item.note,
    ruleTitle: item.ruleTitle,
    ruleDetail: item.ruleDetail,
    chain: `${item.base} → ${comparative.join("/")} → ${superlative.join("/")}`,
    // stash both on note via custom fields - WordDrill formsForMode needs access
    // We'll encode in forms as JSON? Better extend DrillResolved.
  };
}

/** Lưu comparative/superlative cạnh resolved qua Map. */
const cache = new Map<string, { comparative: string[]; superlative: string[] }>();

export function resolveAdvCompareFull(base: string): DrillResolved | null {
  const item = items.find((x) => x.base === base);
  if (!item) return null;

  let comparative = item.comparative;
  let superlative = item.superlative;
  if (!comparative || !superlative) {
    if (item.pattern === "long") {
      comparative = [`more ${item.base}`];
      superlative = [`most ${item.base}`];
    } else {
      const { c, s } = shortErEst(item.base);
      comparative = [c];
      superlative = [s];
    }
  }
  cache.set(item.base, { comparative, superlative });

  return {
    base: item.base,
    meaning: item.meaning,
    kind: item.kind,
    forms: comparative,
    note: item.note,
    ruleTitle: item.ruleTitle,
    ruleDetail: item.ruleDetail,
    chain: `${item.base} → ${comparative.join("/")} → ${superlative.join("/")}`,
  };
}

export function advCompareForms(base: string, mode: string): string[] {
  const cached = cache.get(base);
  if (!cached) {
    resolveAdvCompareFull(base);
  }
  const c = cache.get(base);
  if (!c) return [];
  return mode === "est" ? c.superlative : c.comparative;
}
