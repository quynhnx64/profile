/** Quy tắc thêm -ing cho động từ. */

export type IngRuleId = 1 | 2 | 3 | 4;

export type IngRuleResult = {
  form: string;
  ruleId: IngRuleId;
  title: string;
  detail: string;
};

const VOWELS = new Set(["a", "e", "i", "o", "u"]);
const isVowel = (ch: string) => VOWELS.has(ch.toLowerCase());
const isConsonant = (ch: string) => /^[a-z]$/i.test(ch) && !isVowel(ch);

export const ING_RULE_SUMMARIES: Record<IngRuleId, { title: string; examples: string }> = {
  1: { title: "Hầu hết động từ → thêm -ing", examples: "play → playing · read → reading · go → going" },
  2: {
    title: "Kết thúc -e (không phải -ee/-ye/-oe) → bỏ e + -ing",
    examples: "make → making · write → writing · come → coming",
  },
  3: {
    title: "CVC một âm tiết → gấp đôi phụ âm + -ing",
    examples: "run → running · swim → swimming · get → getting",
  },
  4: {
    title: "Kết thúc -ie → đổi thành -ying",
    examples: "lie → lying · die → dying · tie → tying",
  },
};

function isLikelyOneSyllable(word: string): boolean {
  if (word.length <= 3) return true;
  const clusters = word.replace(/[^aeiouy]+/g, " ").trim().split(/\s+/).filter(Boolean);
  return clusters.length === 1;
}

function isCvcEnding(word: string): boolean {
  if (word.length < 3) return false;
  const c1 = word[word.length - 3]!;
  const v = word[word.length - 2]!;
  const c2 = word[word.length - 1]!;
  if (!isConsonant(c1) || !isVowel(v) || !isConsonant(c2)) return false;
  if (c2 === "w" || c2 === "x" || c2 === "y") return false;
  return true;
}

export function formIng(base: string): IngRuleResult {
  const raw = base.trim().toLowerCase();
  if (!raw) {
    return { form: "", ruleId: 1, title: ING_RULE_SUMMARIES[1].title, detail: "Không có động từ." };
  }

  if (raw.endsWith("ie") && raw.length > 2) {
    return {
      form: `${raw.slice(0, -2)}ying`,
      ruleId: 4,
      title: ING_RULE_SUMMARIES[4].title,
      detail: `Kết thúc -ie → đổi thành -ying.`,
    };
  }

  if (
    raw.endsWith("e") &&
    !raw.endsWith("ee") &&
    !raw.endsWith("ye") &&
    !raw.endsWith("oe") &&
    raw !== "be"
  ) {
    return {
      form: `${raw.slice(0, -1)}ing`,
      ruleId: 2,
      title: ING_RULE_SUMMARIES[2].title,
      detail: `Bỏ -e rồi thêm -ing.`,
    };
  }

  if (isLikelyOneSyllable(raw) && isCvcEnding(raw)) {
    const last = raw[raw.length - 1]!;
    return {
      form: `${raw}${last}ing`,
      ruleId: 3,
      title: ING_RULE_SUMMARIES[3].title,
      detail: `CVC một âm tiết → gấp đôi “${last}” + -ing.`,
    };
  }

  // prefer: 2 syllables stress cuối
  if (raw === "prefer" || raw === "begin" || raw === "forget") {
    const last = raw[raw.length - 1]!;
    return {
      form: `${raw}${last}ing`,
      ruleId: 3,
      title: ING_RULE_SUMMARIES[3].title,
      detail: `Nhấn âm cuối + CVC → gấp đôi phụ âm + -ing.`,
    };
  }

  return {
    form: `${raw}ing`,
    ruleId: 1,
    title: ING_RULE_SUMMARIES[1].title,
    detail: `Thêm -ing bình thường.`,
  };
}
