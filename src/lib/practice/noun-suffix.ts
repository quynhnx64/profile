import { shuffleList } from "./pool";
import type { DrillResolved } from "@/components/practice/word-drill";

/** Gốc → danh từ (hậu tố thường gặp). User viết dạng danh từ. */
type Item = {
  base: string;
  meaning: string;
  noun: string;
  suffix: string;
  note?: string;
};

const items: Item[] = [
  // -ness
  { base: "happy", meaning: "vui → sự vui vẻ", noun: "happiness", suffix: "-ness" },
  { base: "sad", meaning: "buồn → nỗi buồn", noun: "sadness", suffix: "-ness" },
  { base: "weak", meaning: "yếu → sự yếu đuối", noun: "weakness", suffix: "-ness" },
  { base: "dark", meaning: "tối → bóng tối", noun: "darkness", suffix: "-ness" },
  { base: "kind", meaning: "tử tế → lòng tốt", noun: "kindness", suffix: "-ness" },
  { base: "ill", meaning: "ốm → bệnh tật", noun: "illness", suffix: "-ness" },
  // -ment
  { base: "develop", meaning: "phát triển", noun: "development", suffix: "-ment" },
  { base: "govern", meaning: "cai trị", noun: "government", suffix: "-ment" },
  { base: "agree", meaning: "đồng ý", noun: "agreement", suffix: "-ment" },
  { base: "move", meaning: "di chuyển", noun: "movement", suffix: "-ment" },
  { base: "pay", meaning: "trả", noun: "payment", suffix: "-ment" },
  { base: "improve", meaning: "cải thiện", noun: "improvement", suffix: "-ment" },
  // -tion / -sion
  { base: "create", meaning: "tạo", noun: "creation", suffix: "-tion" },
  { base: "educate", meaning: "giáo dục", noun: "education", suffix: "-tion" },
  { base: "inform", meaning: "thông tin", noun: "information", suffix: "-tion" },
  { base: "decide", meaning: "quyết định", noun: "decision", suffix: "-sion" },
  { base: "discuss", meaning: "thảo luận", noun: "discussion", suffix: "-sion" },
  { base: "permit", meaning: "cho phép", noun: "permission", suffix: "-sion" },
  // -er / -or
  { base: "teach", meaning: "dạy", noun: "teacher", suffix: "-er" },
  { base: "work", meaning: "làm việc", noun: "worker", suffix: "-er" },
  { base: "drive", meaning: "lái", noun: "driver", suffix: "-er" },
  { base: "write", meaning: "viết", noun: "writer", suffix: "-er" },
  { base: "act", meaning: "diễn", noun: "actor", suffix: "-or" },
  { base: "visit", meaning: "thăm", noun: "visitor", suffix: "-or" },
  { base: "invent", meaning: "phát minh", noun: "inventor", suffix: "-or" },
  // -ity
  { base: "able", meaning: "có thể", noun: "ability", suffix: "-ity", note: "able → ability (đổi dạng)." },
  { base: "active", meaning: "năng động", noun: "activity", suffix: "-ity" },
  { base: "real", meaning: "thật", noun: "reality", suffix: "-ity" },
  { base: "possible", meaning: "có thể", noun: "possibility", suffix: "-ity" },
];

export const NOUN_SUFFIX_POOL_SIZE = items.length;
export const NOUN_SUFFIX_RULE_SUMMARIES = [
  { id: 1, title: "-ness (tính từ → danh từ trừu tượng)", examples: "happy → happiness · kind → kindness" },
  { id: 2, title: "-ment (động từ → danh từ)", examples: "develop → development · agree → agreement" },
  { id: 3, title: "-tion / -sion", examples: "create → creation · decide → decision" },
  { id: 4, title: "-er / -or (người làm việc gì)", examples: "teach → teacher · act → actor" },
  { id: 5, title: "-ity", examples: "able → ability · real → reality" },
];

export function shuffleNounSuffixBases() {
  return shuffleList(items.map((x) => x.base));
}

export function resolveNounSuffixByBase(base: string): DrillResolved | null {
  const item = items.find((x) => x.base === base);
  if (!item) return null;
  return {
    base: item.base,
    meaning: item.meaning,
    kind: item.note ? "irregular" : "regular",
    forms: [item.noun],
    ruleTitle: `Hậu tố ${item.suffix}`,
    ruleDetail: `Thêm / biến đổi với hậu tố ${item.suffix}: ${item.base} → ${item.noun}.`,
    note: item.note,
    chain: `${item.base} → ${item.noun}`,
  };
}
