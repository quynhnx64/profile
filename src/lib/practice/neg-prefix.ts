import { shuffleList } from "./pool";
import type { DrillResolved } from "@/components/practice/word-drill";

/**
 * Tiền tố phủ định: user nhập dạng phủ định (impossible, unhappy…).
 * Dataset gắn sẵn tiền tố đúng — giải thích quy tắc theo chữ cái đầu.
 */
type Item = {
  base: string;
  meaning: string;
  negative: string;
  prefix: string;
  note?: string;
};

function explain(prefix: string): { title: string; detail: string } {
  const map: Record<string, string> = {
    un: "un- = không / ngược lại (phổ biến nhất).",
    dis: "dis- = không / ngược lại.",
    non: "non- = không (trung lập).",
    in: "in- = không.",
    im: "im- dùng trước từ bắt đầu bằng m hoặc p.",
    il: "il- dùng trước từ bắt đầu bằng l.",
    ir: "ir- dùng trước từ bắt đầu bằng r.",
  };
  return {
    title: `Tiền tố ${prefix}-`,
    detail: map[prefix] ?? `Thêm tiền tố ${prefix}-.`,
  };
}

const items: Item[] = [
  { base: "happy", meaning: "vui", negative: "unhappy", prefix: "un" },
  { base: "fair", meaning: "công bằng", negative: "unfair", prefix: "un" },
  { base: "usual", meaning: "thường lệ", negative: "unusual", prefix: "un" },
  { base: "able", meaning: "có thể", negative: "unable", prefix: "un" },
  { base: "known", meaning: "được biết", negative: "unknown", prefix: "un" },
  { base: "lucky", meaning: "may mắn", negative: "unlucky", prefix: "un" },
  { base: "kind", meaning: "tử tế", negative: "unkind", prefix: "un" },
  { base: "clear", meaning: "rõ", negative: "unclear", prefix: "un" },
  { base: "possible", meaning: "có thể", negative: "impossible", prefix: "im" },
  { base: "polite", meaning: "lịch sự", negative: "impolite", prefix: "im" },
  { base: "patient", meaning: "kiên nhẫn", negative: "impatient", prefix: "im" },
  { base: "perfect", meaning: "hoàn hảo", negative: "imperfect", prefix: "im" },
  { base: "mature", meaning: "trưởng thành", negative: "immature", prefix: "im" },
  { base: "legal", meaning: "hợp pháp", negative: "illegal", prefix: "il" },
  { base: "logical", meaning: "hợp lý", negative: "illogical", prefix: "il" },
  { base: "literate", meaning: "biết chữ", negative: "illiterate", prefix: "il" },
  { base: "regular", meaning: "đều đặn / quy tắc", negative: "irregular", prefix: "ir" },
  { base: "responsible", meaning: "có trách nhiệm", negative: "irresponsible", prefix: "ir" },
  { base: "relevant", meaning: "liên quan", negative: "irrelevant", prefix: "ir" },
  { base: "rational", meaning: "hợp lý", negative: "irrational", prefix: "ir" },
  { base: "correct", meaning: "đúng", negative: "incorrect", prefix: "in" },
  { base: "complete", meaning: "hoàn chỉnh", negative: "incomplete", prefix: "in" },
  { base: "visible", meaning: "nhìn thấy được", negative: "invisible", prefix: "in" },
  { base: "formal", meaning: "trang trọng", negative: "informal", prefix: "in" },
  { base: "agree", meaning: "đồng ý", negative: "disagree", prefix: "dis" },
  { base: "appear", meaning: "xuất hiện", negative: "disappear", prefix: "dis" },
  { base: "honest", meaning: "thành thật", negative: "dishonest", prefix: "dis" },
  { base: "like", meaning: "thích", negative: "dislike", prefix: "dis" },
  { base: "connect", meaning: "kết nối", negative: "disconnect", prefix: "dis" },
  { base: "sense", meaning: "nghĩa / giác quan", negative: "nonsense", prefix: "non", note: "non- + sense → nonsense (viết liền)." },
  { base: "fiction", meaning: "hư cấu", negative: "nonfiction", prefix: "non" },
  { base: "stop", meaning: "dừng", negative: "nonstop", prefix: "non" },
];

export const NEG_PREFIX_POOL_SIZE = items.length;
export const NEG_PREFIX_RULE_SUMMARIES = [
  { id: 1, title: "un-", examples: "happy → unhappy · fair → unfair" },
  { id: 2, title: "in-", examples: "correct → incorrect · visible → invisible" },
  { id: 3, title: "im- (trước m/p)", examples: "possible → impossible · polite → impolite" },
  { id: 4, title: "il- (trước l)", examples: "legal → illegal · logical → illogical" },
  { id: 5, title: "ir- (trước r)", examples: "regular → irregular · responsible → irresponsible" },
  { id: 6, title: "dis- / non-", examples: "agree → disagree · stop → nonstop" },
];

export function shuffleNegPrefixBases() {
  return shuffleList(items.map((x) => x.base));
}

export function resolveNegPrefixByBase(base: string): DrillResolved | null {
  const item = items.find((x) => x.base === base);
  if (!item) return null;
  const exp = explain(item.prefix);
  return {
    base: item.base,
    meaning: item.meaning,
    kind: "regular",
    forms: [item.negative],
    ruleTitle: exp.title,
    ruleDetail: `${exp.detail} ${item.base} → ${item.negative}.`,
    note: item.note,
    chain: `${item.base} → ${item.negative}`,
  };
}
