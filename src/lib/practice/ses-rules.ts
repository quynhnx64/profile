/** Quy tắc chia động từ ngôi 3 số ít (he/she/it) — thêm -s / -es. */

export type SesRuleId = 1 | 2 | 3 | 4;

export type SesRuleResult = {
  form: string;
  ruleId: SesRuleId;
  title: string;
  detail: string;
  steps: string[];
};

const VOWELS = new Set(["a", "e", "i", "o", "u"]);
const isVowel = (ch: string) => VOWELS.has(ch.toLowerCase());
const isConsonant = (ch: string) => /^[a-z]$/i.test(ch) && !isVowel(ch);

export const SES_RULE_SUMMARIES: Record<SesRuleId, { title: string; examples: string }> = {
  1: {
    title: "Hầu hết động từ → thêm -s",
    examples: "work → works · play → plays · read → reads",
  },
  2: {
    title: "Kết thúc -o, -s, -x, -ch, -sh, -z → thêm -es",
    examples: "go → goes · watch → watches · miss → misses · fix → fixes",
  },
  3: {
    title: "Phụ âm + y → đổi y thành -ies",
    examples: "study → studies · fly → flies · cry → cries",
  },
  4: {
    title: "Nguyên âm + y → giữ y + -s",
    examples: "play → plays · enjoy → enjoys · buy → buys",
  },
};

function endsWithEsTrigger(w: string): boolean {
  return (
    w.endsWith("o") ||
    w.endsWith("s") ||
    w.endsWith("x") ||
    w.endsWith("z") ||
    w.endsWith("ch") ||
    w.endsWith("sh")
  );
}

/** Dạng ngôi 3 số ít theo quy tắc chính tả (không gồm bất quy tắc have/be/do…). */
export function formThirdPersonS(base: string): SesRuleResult {
  const raw = base.trim().toLowerCase();
  if (!raw) {
    return {
      form: "",
      ruleId: 1,
      title: SES_RULE_SUMMARIES[1].title,
      detail: "Không có động từ.",
      steps: [],
    };
  }

  // 3 & 4: kết thúc -y
  if (raw.endsWith("y") && raw.length >= 2) {
    const beforeY = raw[raw.length - 2]!;
    if (isConsonant(beforeY)) {
      const form = `${raw.slice(0, -1)}ies`;
      return {
        form,
        ruleId: 3,
        title: SES_RULE_SUMMARIES[3].title,
        detail: `Trước y là phụ âm “${beforeY}” → đổi y thành i rồi thêm -es.`,
        steps: [`Gốc: ${raw}`, `Đổi y → i`, `Thêm -es → ${form}`],
      };
    }
    const form = `${raw}s`;
    return {
      form,
      ruleId: 4,
      title: SES_RULE_SUMMARIES[4].title,
      detail: `Trước y là nguyên âm “${beforeY}” → giữ nguyên y và thêm -s.`,
      steps: [`Gốc: ${raw}`, `Giữ y`, `Thêm -s → ${form}`],
    };
  }

  // 2: -o / -s / -x / -ch / -sh / -z
  if (endsWithEsTrigger(raw)) {
    const form = `${raw}es`;
    return {
      form,
      ruleId: 2,
      title: SES_RULE_SUMMARIES[2].title,
      detail: `“${raw}” kết thúc bằng -o/-s/-x/-ch/-sh/-z → thêm -es.`,
      steps: [`Gốc: ${raw}`, `Thêm -es → ${form}`],
    };
  }

  // 1: mặc định +s
  const form = `${raw}s`;
  return {
    form,
    ruleId: 1,
    title: SES_RULE_SUMMARIES[1].title,
    detail: `“${raw}” thuộc trường hợp thông thường → thêm -s.`,
    steps: [`Gốc: ${raw}`, `Thêm -s → ${form}`],
  };
}
