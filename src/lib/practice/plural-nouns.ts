import { formPlural } from "./plural-rules";
import { shuffleList } from "./pool";
import type { DrillResolved } from "@/components/practice/word-drill";

type Item = {
  base: string;
  meaning: string;
  kind: "regular" | "irregular";
  plural?: string[];
  note?: string;
};

const irregular: Item[] = [
  { base: "child", meaning: "đứa trẻ", kind: "irregular", plural: ["children"] },
  { base: "man", meaning: "đàn ông", kind: "irregular", plural: ["men"] },
  { base: "woman", meaning: "phụ nữ", kind: "irregular", plural: ["women"] },
  { base: "person", meaning: "người", kind: "irregular", plural: ["people"], note: "persons ít dùng (pháp lý)." },
  { base: "mouse", meaning: "chuột", kind: "irregular", plural: ["mice"] },
  { base: "tooth", meaning: "răng", kind: "irregular", plural: ["teeth"] },
  { base: "foot", meaning: "bàn chân", kind: "irregular", plural: ["feet"] },
  { base: "goose", meaning: "ngỗng", kind: "irregular", plural: ["geese"] },
  { base: "sheep", meaning: "cừu", kind: "irregular", plural: ["sheep"], note: "Số ít = số nhiều." },
  { base: "deer", meaning: "hươu", kind: "irregular", plural: ["deer"] },
  { base: "fish", meaning: "cá", kind: "irregular", plural: ["fish", "fishes"], note: "fish (chung); fishes (nhiều loài)." },
  { base: "ox", meaning: "bò đực", kind: "irregular", plural: ["oxen"] },
];

const regular: Item[] = [
  { base: "cat", meaning: "mèo", kind: "regular" },
  { base: "book", meaning: "sách", kind: "regular" },
  { base: "day", meaning: "ngày", kind: "regular" },
  { base: "boy", meaning: "cậu bé", kind: "regular" },
  { base: "car", meaning: "xe hơi", kind: "regular" },
  { base: "house", meaning: "nhà", kind: "regular" },
  { base: "bus", meaning: "xe buýt", kind: "regular" },
  { base: "box", meaning: "hộp", kind: "regular" },
  { base: "watch", meaning: "đồng hồ", kind: "regular" },
  { base: "dish", meaning: "đĩa", kind: "regular" },
  { base: "class", meaning: "lớp", kind: "regular" },
  { base: "quiz", meaning: "bài kiểm tra ngắn", kind: "regular" },
  { base: "baby", meaning: "em bé", kind: "regular" },
  { base: "city", meaning: "thành phố", kind: "regular" },
  { base: "party", meaning: "bữa tiệc", kind: "regular" },
  { base: "story", meaning: "câu chuyện", kind: "regular" },
  { base: "family", meaning: "gia đình", kind: "regular" },
  { base: "leaf", meaning: "lá", kind: "regular" },
  { base: "wolf", meaning: "sói", kind: "regular" },
  { base: "shelf", meaning: "kệ", kind: "regular" },
  { base: "knife", meaning: "dao", kind: "regular" },
  { base: "wife", meaning: "vợ", kind: "regular" },
  { base: "life", meaning: "cuộc sống", kind: "regular" },
  { base: "photo", meaning: "ảnh", kind: "regular" },
  { base: "piano", meaning: "đàn piano", kind: "regular" },
  { base: "radio", meaning: "đài", kind: "regular" },
  { base: "tomato", meaning: "cà chua", kind: "regular" },
  { base: "potato", meaning: "khoai tây", kind: "regular" },
  { base: "hero", meaning: "anh hùng", kind: "regular" },
];

const ALL = [...irregular, ...regular];
export const PLURAL_POOL_SIZE = ALL.length;

export function shufflePluralBases() {
  return shuffleList(ALL.map((x) => x.base));
}

export function resolvePluralByBase(base: string): DrillResolved | null {
  const item = ALL.find((x) => x.base === base);
  if (!item) return null;
  if (item.kind === "irregular") {
    return {
      base: item.base,
      meaning: item.meaning,
      kind: "irregular",
      forms: item.plural ?? [],
      note: item.note,
    };
  }
  const r = formPlural(item.base);
  return {
    base: item.base,
    meaning: item.meaning,
    kind: "regular",
    forms: [r.form],
    ruleTitle: r.title,
    ruleDetail: r.detail,
  };
}
