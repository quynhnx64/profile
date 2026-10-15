/** Quy tắc biến tính từ → trạng từ (thêm -ly) và các trường hợp đặc biệt. */

export type LyRuleId = 1 | 2 | 3 | 4 | 5;

export type LyRuleResult = {
  form: string;
  ruleId: LyRuleId;
  title: string;
  detail: string;
  steps: string[];
};

const VOWELS = new Set(["a", "e", "i", "o", "u"]);
const isVowel = (ch: string) => VOWELS.has(ch.toLowerCase());
const isConsonant = (ch: string) => /^[a-z]$/i.test(ch) && !isVowel(ch);

export const LY_RULE_SUMMARIES: Record<LyRuleId, { title: string; examples: string }> = {
  1: {
    title: "Hầu hết tính từ → thêm -ly",
    examples: "quick → quickly · slow → slowly · careful → carefully",
  },
  2: {
    title: "Phụ âm + y → đổi y thành -ily",
    examples: "happy → happily · easy → easily · angry → angrily",
  },
  3: {
    title: "Kết thúc -le → đổi thành -ly",
    examples: "gentle → gently · simple → simply · possible → possibly",
  },
  4: {
    title: "Kết thúc -ic → thêm -ally",
    examples: "basic → basically · tragic → tragically (ngoại lệ: public → publicly)",
  },
  5: {
    title: "Bất quy tắc / không đổi dạng",
    examples: "good → well · fast → fast · hard → hard · early → early",
  },
};

/** Dạng trạng từ theo quy tắc chính tả (không gồm bất quy tắc good/fast…). */
export function formAdverbLy(base: string): LyRuleResult {
  const raw = base.trim().toLowerCase();
  if (!raw) {
    return {
      form: "",
      ruleId: 1,
      title: LY_RULE_SUMMARIES[1].title,
      detail: "Không có tính từ.",
      steps: [],
    };
  }

  // Ngoại lệ phổ biến của -ic
  if (raw === "public") {
    return {
      form: "publicly",
      ruleId: 4,
      title: LY_RULE_SUMMARIES[4].title,
      detail: "“public” kết thúc -ic nhưng ngoại lệ → publicly (không phải publically).",
      steps: [`Gốc: ${raw}`, `Ngoại lệ -ic → publicly`],
    };
  }

  // 2: phụ âm + y → ily
  if (raw.endsWith("y") && raw.length >= 2) {
    const beforeY = raw[raw.length - 2]!;
    if (isConsonant(beforeY)) {
      const form = `${raw.slice(0, -1)}ily`;
      return {
        form,
        ruleId: 2,
        title: LY_RULE_SUMMARIES[2].title,
        detail: `Trước y là phụ âm “${beforeY}” → đổi y thành i rồi thêm -ly.`,
        steps: [`Gốc: ${raw}`, `Đổi y → i`, `Thêm -ly → ${form}`],
      };
    }
  }

  // 3: -le → -ly (gentle → gently)
  if (raw.endsWith("le") && raw.length > 2) {
    const form = `${raw.slice(0, -2)}ly`;
    return {
      form,
      ruleId: 3,
      title: LY_RULE_SUMMARIES[3].title,
      detail: `“${raw}” kết thúc bằng -le → bỏ -le và thêm -ly.`,
      steps: [`Gốc: ${raw}`, `Bỏ -le`, `Thêm -ly → ${form}`],
    };
  }

  // 4: -ic → -ally
  if (raw.endsWith("ic")) {
    const form = `${raw}ally`;
    return {
      form,
      ruleId: 4,
      title: LY_RULE_SUMMARIES[4].title,
      detail: `“${raw}” kết thúc bằng -ic → thêm -ally.`,
      steps: [`Gốc: ${raw}`, `Thêm -ally → ${form}`],
    };
  }

  // 1: mặc định +ly
  const form = `${raw}ly`;
  return {
    form,
    ruleId: 1,
    title: LY_RULE_SUMMARIES[1].title,
    detail: `“${raw}” thuộc trường hợp thông thường → thêm -ly.`,
    steps: [`Gốc: ${raw}`, `Thêm -ly → ${form}`],
  };
}
