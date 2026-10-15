import { shuffleList } from "./pool";
import type { DrillResolved } from "@/components/practice/word-drill";

/** Gốc → tính từ (hậu tố thường gặp). */
type Item = {
  base: string;
  meaning: string;
  adjective: string;
  suffix: string;
  note?: string;
};

const items: Item[] = [
  // -ful
  { base: "care", meaning: "chăm sóc → cẩn thận", adjective: "careful", suffix: "-ful" },
  { base: "help", meaning: "giúp → hữu ích", adjective: "helpful", suffix: "-ful" },
  { base: "use", meaning: "dùng → hữu dụng", adjective: "useful", suffix: "-ful" },
  { base: "beauty", meaning: "vẻ đẹp → đẹp", adjective: "beautiful", suffix: "-ful", note: "beauty → beautiful (y → i)." },
  { base: "success", meaning: "thành công", adjective: "successful", suffix: "-ful" },
  { base: "peace", meaning: "hòa bình", adjective: "peaceful", suffix: "-ful" },
  // -less
  { base: "hope", meaning: "hy vọng → vô vọng", adjective: "hopeless", suffix: "-less" },
  { base: "care", meaning: "chăm sóc → bất cẩn", adjective: "careless", suffix: "-less" },
  { base: "use", meaning: "dùng → vô dụng", adjective: "useless", suffix: "-less" },
  { base: "home", meaning: "nhà → vô gia cư", adjective: "homeless", suffix: "-less" },
  { base: "end", meaning: "kết thúc → vô tận", adjective: "endless", suffix: "-less" },
  // -able / -ible
  { base: "read", meaning: "đọc → có thể đọc được", adjective: "readable", suffix: "-able" },
  { base: "enjoy", meaning: "thích → thú vị", adjective: "enjoyable", suffix: "-able" },
  { base: "comfort", meaning: "thoải mái", adjective: "comfortable", suffix: "-able" },
  { base: "rely", meaning: "tin cậy", adjective: "reliable", suffix: "-able", note: "rely → reliable (y → i)." },
  { base: "access", meaning: "truy cập", adjective: "accessible", suffix: "-ible" },
  { base: "sense", meaning: "giác quan → hợp lý", adjective: "sensible", suffix: "-ible" },
  // -ous
  { base: "danger", meaning: "nguy hiểm", adjective: "dangerous", suffix: "-ous" },
  { base: "fame", meaning: "danh tiếng", adjective: "famous", suffix: "-ous" },
  { base: "nerve", meaning: "thần kinh → lo lắng", adjective: "nervous", suffix: "-ous" },
  { base: "adventure", meaning: "phiêu lưu", adjective: "adventurous", suffix: "-ous" },
  // -al
  { base: "nation", meaning: "quốc gia", adjective: "national", suffix: "-al" },
  { base: "nature", meaning: "thiên nhiên", adjective: "natural", suffix: "-al" },
  { base: "culture", meaning: "văn hóa", adjective: "cultural", suffix: "-al" },
  { base: "person", meaning: "người → cá nhân", adjective: "personal", suffix: "-al" },
  // -ive
  { base: "act", meaning: "hành động → chủ động", adjective: "active", suffix: "-ive" },
  { base: "create", meaning: "tạo → sáng tạo", adjective: "creative", suffix: "-ive" },
  { base: "attract", meaning: "thu hút", adjective: "attractive", suffix: "-ive" },
  { base: "effect", meaning: "hiệu quả", adjective: "effective", suffix: "-ive" },
];

export const ADJ_SUFFIX_POOL_SIZE = items.length;
export const ADJ_SUFFIX_RULE_SUMMARIES = [
  { id: 1, title: "-ful (đầy / có…)", examples: "care → careful · help → helpful" },
  { id: 2, title: "-less (không có…)", examples: "hope → hopeless · home → homeless" },
  { id: 3, title: "-able / -ible (có thể…)", examples: "read → readable · access → accessible" },
  { id: 4, title: "-ous / -al / -ive", examples: "danger → dangerous · nation → national · act → active" },
];

export function shuffleAdjSuffixBases() {
  // care xuất hiện 2 lần (careful/careless) — dùng key phân biệt
  return shuffleList(items.map((x, i) => `${x.base}#${i}`));
}

export function resolveAdjSuffixByBase(key: string): DrillResolved | null {
  const idx = Number(key.split("#")[1]);
  const item = Number.isFinite(idx) ? items[idx] : items.find((x) => x.base === key);
  if (!item) return null;
  return {
    base: item.base,
    meaning: item.meaning,
    kind: item.note ? "irregular" : "regular",
    forms: [item.adjective],
    ruleTitle: `Hậu tố ${item.suffix}`,
    ruleDetail: `${item.base} → ${item.adjective} (${item.suffix}).`,
    note: item.note,
    chain: `${item.base} → ${item.adjective}`,
  };
}
