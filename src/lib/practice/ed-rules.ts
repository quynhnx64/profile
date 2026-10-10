/** Quy tắc chính tả khi thêm -ed cho động từ có quy tắc (regular). */

export type EdRuleId = 1 | 2 | 3 | 4 | 5;

export type EdRuleResult = {
  form: string;
  ruleId: EdRuleId;
  title: string;
  detail: string;
  steps: string[];
};

const VOWELS = new Set(["a", "e", "i", "o", "u"]);
const isVowel = (ch: string) => VOWELS.has(ch.toLowerCase());
const isConsonant = (ch: string) => /^[a-z]$/i.test(ch) && !isVowel(ch);

/** Đếm âm tiết đơn giản (heuristic đủ cho luật CVC một âm tiết). */
function isLikelyOneSyllable(word: string): boolean {
  const w = word.toLowerCase();
  if (w.length <= 3) return true;
  const clusters = w.replace(/[^aeiouy]+/g, " ").trim().split(/\s+/).filter(Boolean);
  // một cụm nguyên âm → thường 1 âm tiết (stop, plan, prefer có 2)
  if (clusters.length === 1) return true;
  // 2 cụm nhưng kết thúc -e câm (come, live đã xử lý ở rule 1)
  if (clusters.length === 2 && w.endsWith("e")) return true;
  return clusters.length === 1;
}

/** CVC: phụ âm + nguyên âm + phụ âm (không tính w/x/y ở cuối). */
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

export const ED_RULE_SUMMARIES: Record<EdRuleId, { title: string; examples: string }> = {
  1: {
    title: "Kết thúc bằng -e → chỉ thêm -d",
    examples: "live → lived · like → liked · arrive → arrived",
  },
  2: {
    title: "Một âm tiết, CVC → gấp đôi phụ âm cuối + -ed",
    examples: "stop → stopped · plan → planned (không gấp đôi w/x/y)",
  },
  3: {
    title: "Phụ âm + y → đổi y thành ied",
    examples: "study → studied · carry → carried · try → tried",
  },
  4: {
    title: "Nguyên âm + y → giữ y + -ed",
    examples: "play → played · enjoy → enjoyed · stay → stayed",
  },
  5: {
    title: "Các trường hợp còn lại → thêm -ed",
    examples: "work → worked · listen → listened · open → opened",
  },
};

export function formRegularEd(base: string): EdRuleResult {
  const raw = base.trim().toLowerCase();
  if (!raw) {
    return {
      form: "",
      ruleId: 5,
      title: ED_RULE_SUMMARIES[5].title,
      detail: "Không có động từ.",
      steps: [],
    };
  }

  // 1. Kết thúc -e
  if (raw.endsWith("e")) {
    const form = `${raw}d`;
    return {
      form,
      ruleId: 1,
      title: ED_RULE_SUMMARIES[1].title,
      detail: `“${raw}” kết thúc bằng -e nên chỉ thêm -d (không viết thành -eed).`,
      steps: [`Gốc: ${raw}`, `Bỏ không cần thêm e nữa → thêm d`, `Kết quả: ${form}`],
    };
  }

  // 3 & 4. Kết thúc -y
  if (raw.endsWith("y") && raw.length >= 2) {
    const beforeY = raw[raw.length - 2]!;
    if (isConsonant(beforeY)) {
      const stem = raw.slice(0, -1);
      const form = `${stem}ied`;
      return {
        form,
        ruleId: 3,
        title: ED_RULE_SUMMARIES[3].title,
        detail: `Trước y là phụ âm “${beforeY}” → đổi y thành i rồi thêm -ed.`,
        steps: [`Gốc: ${raw}`, `Đổi y → i`, `Thêm -ed → ${form}`],
      };
    }
    const form = `${raw}ed`;
    return {
      form,
      ruleId: 4,
      title: ED_RULE_SUMMARIES[4].title,
      detail: `Trước y là nguyên âm “${beforeY}” → giữ nguyên y và thêm -ed.`,
      steps: [`Gốc: ${raw}`, `Giữ y`, `Thêm -ed → ${form}`],
    };
  }

  // 2. Gấp đôi phụ âm (CVC một âm tiết)
  if (isLikelyOneSyllable(raw) && isCvcEnding(raw)) {
    const last = raw[raw.length - 1]!;
    const form = `${raw}${last}ed`;
    return {
      form,
      ruleId: 2,
      title: ED_RULE_SUMMARIES[2].title,
      detail: `“${raw}” là động từ ngắn, kết thúc theo mẫu phụ âm–nguyên âm–phụ âm (CVC). Gấp đôi “${last}” rồi thêm -ed. Ngoại lệ: không gấp đôi w, x, y (snowed, fixed, played).`,
      steps: [
        `Gốc: ${raw}`,
        `Nhận diện CVC một âm tiết`,
        `Gấp đôi phụ âm cuối “${last}”`,
        `Thêm -ed → ${form}`,
      ],
    };
  }

  // 5. Mặc định
  const form = `${raw}ed`;
  return {
    form,
    ruleId: 5,
    title: ED_RULE_SUMMARIES[5].title,
    detail: `“${raw}” không thuộc các trường hợp đặc biệt ở trên → thêm -ed bình thường.`,
    steps: [`Gốc: ${raw}`, `Thêm -ed → ${form}`],
  };
}

export { answersMatch, normalizeAnswer } from "./normalize";
