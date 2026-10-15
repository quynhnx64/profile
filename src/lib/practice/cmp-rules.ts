/** Quy tắc so sánh hơn (-er / more) và so sánh nhất (-est / most). */

export type CmpRuleId = 1 | 2 | 3 | 4 | 5 | 6;

export type CmpForms = {
  comparative: string;
  superlative: string;
  ruleId: CmpRuleId;
  title: string;
  detail: string;
  steps: string[];
};

const VOWELS = new Set(["a", "e", "i", "o", "u"]);
const isVowel = (ch: string) => VOWELS.has(ch.toLowerCase());
const isConsonant = (ch: string) => /^[a-z]$/i.test(ch) && !isVowel(ch);

export const CMP_RULE_SUMMARIES: Record<CmpRuleId, { title: string; examples: string }> = {
  1: {
    title: "Tính từ ngắn → thêm -er / -est",
    examples: "tall → taller / tallest · old → older / oldest",
  },
  2: {
    title: "Kết thúc -e → chỉ thêm -r / -st",
    examples: "nice → nicer / nicest · large → larger / largest",
  },
  3: {
    title: "CVC một âm tiết → gấp đôi phụ âm + -er / -est",
    examples: "big → bigger / biggest · hot → hotter / hottest",
  },
  4: {
    title: "Phụ âm + y → đổi y thành -ier / -iest",
    examples: "happy → happier / happiest · easy → easier / easiest",
  },
  5: {
    title: "Tính từ dài (≥ 2 âm tiết) → more / most",
    examples: "beautiful → more beautiful / most beautiful",
  },
  6: {
    title: "Bất quy tắc",
    examples: "good → better / best · bad → worse / worst · far → farther/further",
  },
};

function vowelGroups(word: string): number {
  const clusters = word
    .toLowerCase()
    .replace(/[^aeiouy]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  return clusters.length;
}

function isLikelyOneSyllable(word: string): boolean {
  const w = word.toLowerCase();
  if (w.length <= 3) return true;
  return vowelGroups(w) === 1;
}

function isCvcEnding(word: string): boolean {
  const w = word.toLowerCase();
  if (w.length < 3) return false;
  const c1 = w[w.length - 3]!;
  const v = w[w.length - 2]!;
  const c2 = w[w.length - 1]!;
  if (!isConsonant(c1) || !isVowel(v) || !isConsonant(c2)) return false;
  if (c2 === "w" || c2 === "x" || c2 === "y") return false;
  return true;
}

/** true nếu tính từ dài → dùng more/most (heuristic: ≥ 2 âm tiết và không kết thúc -y ngắn). */
function usesMoreMost(word: string): boolean {
  const w = word.toLowerCase();
  // 2 âm tiết kết thúc -y thường dùng -ier (happy, easy, funny)
  if (w.endsWith("y") && isConsonant(w[w.length - 2] ?? "") && vowelGroups(w) <= 2) {
    return false;
  }
  // quiet / simple / narrow… có thể -er; ở đây quiet → quieter (đặc biệt trong dataset)
  if (["quiet", "narrow", "clever", "simple", "gentle"].includes(w)) return false;
  return vowelGroups(w) >= 2 || w.length >= 8;
}

/** Dạng so sánh theo quy tắc (không gồm bất quy tắc good/bad…). */
export function formComparative(base: string): CmpForms {
  const raw = base.trim().toLowerCase();
  if (!raw) {
    return {
      comparative: "",
      superlative: "",
      ruleId: 1,
      title: CMP_RULE_SUMMARIES[1].title,
      detail: "Không có tính từ.",
      steps: [],
    };
  }

  // 4: phụ âm + y
  if (raw.endsWith("y") && raw.length >= 2 && isConsonant(raw[raw.length - 2]!)) {
    const stem = raw.slice(0, -1);
    const comparative = `${stem}ier`;
    const superlative = `${stem}iest`;
    return {
      comparative,
      superlative,
      ruleId: 4,
      title: CMP_RULE_SUMMARIES[4].title,
      detail: `Trước y là phụ âm → đổi y thành i rồi thêm -er / -est.`,
      steps: [`Gốc: ${raw}`, `Đổi y → i`, `→ ${comparative} / ${superlative}`],
    };
  }

  // 5: more / most
  if (usesMoreMost(raw)) {
    return {
      comparative: `more ${raw}`,
      superlative: `most ${raw}`,
      ruleId: 5,
      title: CMP_RULE_SUMMARIES[5].title,
      detail: `“${raw}” là tính từ dài → dùng more / most (không thêm -er/-est).`,
      steps: [`Gốc: ${raw}`, `→ more ${raw} / most ${raw}`],
    };
  }

  // 2: kết thúc -e
  if (raw.endsWith("e")) {
    const comparative = `${raw}r`;
    const superlative = `${raw}st`;
    return {
      comparative,
      superlative,
      ruleId: 2,
      title: CMP_RULE_SUMMARIES[2].title,
      detail: `“${raw}” kết thúc bằng -e → chỉ thêm -r / -st.`,
      steps: [`Gốc: ${raw}`, `→ ${comparative} / ${superlative}`],
    };
  }

  // 3: CVC gấp đôi
  if (isLikelyOneSyllable(raw) && isCvcEnding(raw)) {
    const last = raw[raw.length - 1]!;
    const comparative = `${raw}${last}er`;
    const superlative = `${raw}${last}est`;
    return {
      comparative,
      superlative,
      ruleId: 3,
      title: CMP_RULE_SUMMARIES[3].title,
      detail: `“${raw}” là CVC một âm tiết → gấp đôi “${last}” rồi thêm -er / -est.`,
      steps: [`Gốc: ${raw}`, `Gấp đôi ${last}`, `→ ${comparative} / ${superlative}`],
    };
  }

  // 1: mặc định +er/+est
  const comparative = `${raw}er`;
  const superlative = `${raw}est`;
  return {
    comparative,
    superlative,
    ruleId: 1,
    title: CMP_RULE_SUMMARIES[1].title,
    detail: `“${raw}” là tính từ ngắn → thêm -er / -est.`,
    steps: [`Gốc: ${raw}`, `→ ${comparative} / ${superlative}`],
  };
}
