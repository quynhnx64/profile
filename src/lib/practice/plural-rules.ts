/** Quy tắc danh từ số nhiều. */

export type PluralRuleId = 1 | 2 | 3 | 4 | 5 | 6;

export type PluralRuleResult = {
  form: string;
  ruleId: PluralRuleId;
  title: string;
  detail: string;
};

const VOWELS = new Set(["a", "e", "i", "o", "u"]);
const isVowel = (ch: string) => VOWELS.has(ch.toLowerCase());
const isConsonant = (ch: string) => /^[a-z]$/i.test(ch) && !isVowel(ch);

/** -o thường thêm -es */
const O_ES = new Set(["tomato", "potato", "hero", "echo", "torpedo", "veto"]);
/** -o thường thêm -s */
const O_S = new Set(["photo", "piano", "radio", "video", "studio", "kilo", "memo"]);
/** -f/-fe → -ves */
const F_VES = new Set([
  "leaf", "wolf", "shelf", "knife", "wife", "life", "thief", "half", "loaf", "calf", "self",
]);

export const PLURAL_RULE_SUMMARIES: Record<PluralRuleId, { title: string; examples: string }> = {
  1: { title: "Hầu hết danh từ → thêm -s", examples: "cat → cats · book → books · day → days" },
  2: {
    title: "Kết thúc -s/-x/-z/-ch/-sh → thêm -es",
    examples: "bus → buses · box → boxes · watch → watches · dish → dishes",
  },
  3: {
    title: "Phụ âm + y → đổi y thành -ies",
    examples: "baby → babies · city → cities · party → parties",
  },
  4: {
    title: "Một số -f / -fe → -ves",
    examples: "leaf → leaves · knife → knives · wolf → wolves",
  },
  5: {
    title: "Kết thúc -o → -s hoặc -es",
    examples: "photo → photos · tomato → tomatoes",
  },
  6: {
    title: "Bất quy tắc / không đổi",
    examples: "child → children · man → men · sheep → sheep",
  },
};

export function formPlural(base: string): PluralRuleResult {
  const raw = base.trim().toLowerCase();
  if (!raw) {
    return { form: "", ruleId: 1, title: PLURAL_RULE_SUMMARIES[1].title, detail: "Không có danh từ." };
  }

  if (raw.endsWith("y") && raw.length >= 2 && isConsonant(raw[raw.length - 2]!)) {
    const form = `${raw.slice(0, -1)}ies`;
    return {
      form,
      ruleId: 3,
      title: PLURAL_RULE_SUMMARIES[3].title,
      detail: `Phụ âm + y → đổi y thành i rồi thêm -es.`,
    };
  }

  if (F_VES.has(raw) || (raw.endsWith("fe") && F_VES.has(raw))) {
    const stem = raw.endsWith("fe") ? raw.slice(0, -2) : raw.endsWith("f") ? raw.slice(0, -1) : raw;
    const form = `${stem}ves`;
    return {
      form,
      ruleId: 4,
      title: PLURAL_RULE_SUMMARIES[4].title,
      detail: `“${raw}” đổi -f/-fe thành -ves.`,
    };
  }

  if (raw.endsWith("o")) {
    if (O_ES.has(raw)) {
      return {
        form: `${raw}es`,
        ruleId: 5,
        title: PLURAL_RULE_SUMMARIES[5].title,
        detail: `“${raw}” kết thúc -o → thêm -es.`,
      };
    }
    if (O_S.has(raw) || raw.length > 4) {
      return {
        form: `${raw}s`,
        ruleId: 5,
        title: PLURAL_RULE_SUMMARIES[5].title,
        detail: `“${raw}” kết thúc -o → thêm -s.`,
      };
    }
  }

  if (
    raw.endsWith("s") ||
    raw.endsWith("ss") ||
    raw.endsWith("x") ||
    raw.endsWith("z") ||
    raw.endsWith("ch") ||
    raw.endsWith("sh")
  ) {
    return {
      form: `${raw}es`,
      ruleId: 2,
      title: PLURAL_RULE_SUMMARIES[2].title,
      detail: `Kết thúc -s/-x/-z/-ch/-sh → thêm -es.`,
    };
  }

  return {
    form: `${raw}s`,
    ruleId: 1,
    title: PLURAL_RULE_SUMMARIES[1].title,
    detail: `Thêm -s bình thường.`,
  };
}
