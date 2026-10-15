import { formIng } from "./ing-rules";
import { shuffleList } from "./pool";
import type { DrillResolved } from "@/components/practice/word-drill";

type Item = {
  base: string;
  meaning: string;
  kind: "regular" | "irregular";
  ing?: string[];
  note?: string;
};

const special: Item[] = [
  { base: "age", meaning: "già đi / làm già", kind: "irregular", ing: ["ageing", "aging"], note: "BrE ageing / AmE aging." },
  { base: "be", meaning: "thì / là", kind: "regular" },
];

const regular: Item[] = [
  { base: "play", meaning: "chơi", kind: "regular" },
  { base: "read", meaning: "đọc", kind: "regular" },
  { base: "go", meaning: "đi", kind: "regular" },
  { base: "see", meaning: "nhìn", kind: "regular" },
  { base: "agree", meaning: "đồng ý", kind: "regular" },
  { base: "make", meaning: "làm", kind: "regular" },
  { base: "write", meaning: "viết", kind: "regular" },
  { base: "come", meaning: "đến", kind: "regular" },
  { base: "take", meaning: "lấy", kind: "regular" },
  { base: "have", meaning: "có", kind: "regular" },
  { base: "live", meaning: "sống", kind: "regular" },
  { base: "use", meaning: "dùng", kind: "regular" },
  { base: "run", meaning: "chạy", kind: "regular" },
  { base: "swim", meaning: "bơi", kind: "regular" },
  { base: "get", meaning: "nhận", kind: "regular" },
  { base: "sit", meaning: "ngồi", kind: "regular" },
  { base: "stop", meaning: "dừng", kind: "regular" },
  { base: "plan", meaning: "lên kế hoạch", kind: "regular" },
  { base: "put", meaning: "đặt", kind: "regular" },
  { base: "cut", meaning: "cắt", kind: "regular" },
  { base: "lie", meaning: "nằm", kind: "regular" },
  { base: "die", meaning: "chết", kind: "regular" },
  { base: "tie", meaning: "buộc", kind: "regular" },
  { base: "prefer", meaning: "thích hơn", kind: "regular" },
  { base: "begin", meaning: "bắt đầu", kind: "regular" },
  { base: "forget", meaning: "quên", kind: "regular" },
  { base: "work", meaning: "làm việc", kind: "regular" },
  { base: "study", meaning: "học", kind: "regular" },
  { base: "listen", meaning: "nghe", kind: "regular" },
  { base: "open", meaning: "mở", kind: "regular" },
];

const ALL = [...special, ...regular];
export const ING_POOL_SIZE = ALL.length;

export function shuffleIngBases() {
  return shuffleList(ALL.map((x) => x.base));
}

export function resolveIngByBase(base: string): DrillResolved | null {
  const item = ALL.find((x) => x.base === base);
  if (!item) return null;
  if (item.kind === "irregular") {
    return {
      base: item.base,
      meaning: item.meaning,
      kind: "irregular",
      forms: item.ing ?? [],
      note: item.note,
    };
  }
  const r = formIng(item.base);
  return {
    base: item.base,
    meaning: item.meaning,
    kind: "regular",
    forms: [r.form],
    ruleTitle: r.title,
    ruleDetail: r.detail,
    note: item.note,
  };
}
