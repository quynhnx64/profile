import { formRegularEd } from "./ed-rules";
import { shuffleList } from "./pool";

/**
 * Dataset luyện V2/V3 — không gọi API.
 * Irregular: dựa trên danh sách phổ biến (english-verbs-irregular / ngữ pháp chuẩn).
 * Regular: chọn để phủ 5 quy tắc chính tả -ed.
 */
export type PracticeVerb = {
  base: string;
  meaning: string;
  /** Bất quy tắc → V2/V3 cố định; quy tắc → suy ra từ formRegularEd */
  kind: "regular" | "irregular";
  /** Chỉ cần với irregular (và regular có thể bỏ trống) */
  v2?: string[];
  v3?: string[];
  note?: string;
};

const irregular: PracticeVerb[] = [
  { base: "be", meaning: "thì / là / ở", kind: "irregular", v2: ["was", "were"], v3: ["been"], note: "V2 phân biệt was (số ít) / were (số nhiều hoặc với you)." },
  { base: "become", meaning: "trở thành", kind: "irregular", v2: ["became"], v3: ["become"] },
  { base: "begin", meaning: "bắt đầu", kind: "irregular", v2: ["began"], v3: ["begun"] },
  { base: "break", meaning: "làm vỡ / phá vỡ", kind: "irregular", v2: ["broke"], v3: ["broken"] },
  { base: "bring", meaning: "mang đến", kind: "irregular", v2: ["brought"], v3: ["brought"] },
  { base: "build", meaning: "xây dựng", kind: "irregular", v2: ["built"], v3: ["built"] },
  { base: "buy", meaning: "mua", kind: "irregular", v2: ["bought"], v3: ["bought"] },
  { base: "catch", meaning: "bắt / nắm lấy", kind: "irregular", v2: ["caught"], v3: ["caught"] },
  { base: "choose", meaning: "chọn", kind: "irregular", v2: ["chose"], v3: ["chosen"] },
  { base: "come", meaning: "đến", kind: "irregular", v2: ["came"], v3: ["come"] },
  { base: "cost", meaning: "có giá", kind: "irregular", v2: ["cost"], v3: ["cost"] },
  { base: "cut", meaning: "cắt", kind: "irregular", v2: ["cut"], v3: ["cut"] },
  { base: "do", meaning: "làm", kind: "irregular", v2: ["did"], v3: ["done"] },
  { base: "draw", meaning: "vẽ / kéo", kind: "irregular", v2: ["drew"], v3: ["drawn"] },
  { base: "drink", meaning: "uống", kind: "irregular", v2: ["drank"], v3: ["drunk"] },
  { base: "drive", meaning: "lái xe", kind: "irregular", v2: ["drove"], v3: ["driven"] },
  { base: "eat", meaning: "ăn", kind: "irregular", v2: ["ate"], v3: ["eaten"] },
  { base: "fall", meaning: "ngã / rơi", kind: "irregular", v2: ["fell"], v3: ["fallen"] },
  { base: "feel", meaning: "cảm thấy", kind: "irregular", v2: ["felt"], v3: ["felt"] },
  { base: "fight", meaning: "chiến đấu / đánh nhau", kind: "irregular", v2: ["fought"], v3: ["fought"] },
  { base: "find", meaning: "tìm thấy", kind: "irregular", v2: ["found"], v3: ["found"] },
  { base: "fly", meaning: "bay", kind: "irregular", v2: ["flew"], v3: ["flown"] },
  { base: "forget", meaning: "quên", kind: "irregular", v2: ["forgot"], v3: ["forgotten", "forgot"] },
  { base: "forgive", meaning: "tha thứ", kind: "irregular", v2: ["forgave"], v3: ["forgiven"] },
  { base: "freeze", meaning: "đóng băng", kind: "irregular", v2: ["froze"], v3: ["frozen"] },
  { base: "get", meaning: "nhận / trở nên", kind: "irregular", v2: ["got"], v3: ["got", "gotten"], note: "V3: got (BrE) / gotten (AmE) đều chấp nhận." },
  { base: "give", meaning: "cho", kind: "irregular", v2: ["gave"], v3: ["given"] },
  { base: "go", meaning: "đi", kind: "irregular", v2: ["went"], v3: ["gone"] },
  { base: "grow", meaning: "lớn lên / trồng", kind: "irregular", v2: ["grew"], v3: ["grown"] },
  { base: "hang", meaning: "treo", kind: "irregular", v2: ["hung"], v3: ["hung"], note: "hung = treo; hanged thường dùng nghĩa xử treo (ít gặp hơn)." },
  { base: "have", meaning: "có", kind: "irregular", v2: ["had"], v3: ["had"] },
  { base: "hear", meaning: "nghe", kind: "irregular", v2: ["heard"], v3: ["heard"] },
  { base: "hide", meaning: "trốn / giấu", kind: "irregular", v2: ["hid"], v3: ["hidden"] },
  { base: "hit", meaning: "đánh / va", kind: "irregular", v2: ["hit"], v3: ["hit"] },
  { base: "hold", meaning: "giữ", kind: "irregular", v2: ["held"], v3: ["held"] },
  { base: "hurt", meaning: "làm đau / tổn thương", kind: "irregular", v2: ["hurt"], v3: ["hurt"] },
  { base: "keep", meaning: "giữ lại", kind: "irregular", v2: ["kept"], v3: ["kept"] },
  { base: "know", meaning: "biết", kind: "irregular", v2: ["knew"], v3: ["known"] },
  { base: "leave", meaning: "rời đi / để lại", kind: "irregular", v2: ["left"], v3: ["left"] },
  { base: "lend", meaning: "cho mượn", kind: "irregular", v2: ["lent"], v3: ["lent"] },
  { base: "let", meaning: "để cho / cho phép", kind: "irregular", v2: ["let"], v3: ["let"] },
  { base: "lie", meaning: "nằm", kind: "irregular", v2: ["lay"], v3: ["lain"], note: "lie (nằm) → lay / lain. Khác lay (đặt) → laid / laid và lie (nói dối, regular) → lied." },
  { base: "lose", meaning: "mất / thua", kind: "irregular", v2: ["lost"], v3: ["lost"] },
  { base: "make", meaning: "làm / tạo", kind: "irregular", v2: ["made"], v3: ["made"] },
  { base: "mean", meaning: "có nghĩa / muốn nói", kind: "irregular", v2: ["meant"], v3: ["meant"] },
  { base: "meet", meaning: "gặp", kind: "irregular", v2: ["met"], v3: ["met"] },
  { base: "pay", meaning: "trả tiền", kind: "irregular", v2: ["paid"], v3: ["paid"] },
  { base: "put", meaning: "đặt", kind: "irregular", v2: ["put"], v3: ["put"] },
  { base: "read", meaning: "đọc", kind: "irregular", v2: ["read"], v3: ["read"], note: "Viết giống V1 nhưng phát âm /red/ ở V2/V3." },
  { base: "ride", meaning: "cưỡi / đi (xe)", kind: "irregular", v2: ["rode"], v3: ["ridden"] },
  { base: "ring", meaning: "reo / gọi chuông", kind: "irregular", v2: ["rang"], v3: ["rung"] },
  { base: "rise", meaning: "dâng / đứng lên", kind: "irregular", v2: ["rose"], v3: ["risen"] },
  { base: "run", meaning: "chạy", kind: "irregular", v2: ["ran"], v3: ["run"] },
  { base: "say", meaning: "nói", kind: "irregular", v2: ["said"], v3: ["said"] },
  { base: "see", meaning: "nhìn thấy", kind: "irregular", v2: ["saw"], v3: ["seen"] },
  { base: "sell", meaning: "bán", kind: "irregular", v2: ["sold"], v3: ["sold"] },
  { base: "send", meaning: "gửi", kind: "irregular", v2: ["sent"], v3: ["sent"] },
  { base: "set", meaning: "đặt / thiết lập", kind: "irregular", v2: ["set"], v3: ["set"] },
  { base: "shake", meaning: "lắc", kind: "irregular", v2: ["shook"], v3: ["shaken"] },
  { base: "shine", meaning: "chiếu sáng", kind: "irregular", v2: ["shone", "shined"], v3: ["shone", "shined"] },
  { base: "shoot", meaning: "bắn", kind: "irregular", v2: ["shot"], v3: ["shot"] },
  { base: "show", meaning: "cho xem", kind: "irregular", v2: ["showed"], v3: ["shown", "showed"] },
  { base: "shut", meaning: "đóng", kind: "irregular", v2: ["shut"], v3: ["shut"] },
  { base: "sing", meaning: "hát", kind: "irregular", v2: ["sang"], v3: ["sung"] },
  { base: "sit", meaning: "ngồi", kind: "irregular", v2: ["sat"], v3: ["sat"] },
  { base: "sleep", meaning: "ngủ", kind: "irregular", v2: ["slept"], v3: ["slept"] },
  { base: "speak", meaning: "nói", kind: "irregular", v2: ["spoke"], v3: ["spoken"] },
  { base: "spend", meaning: "tiêu / dành (thời gian)", kind: "irregular", v2: ["spent"], v3: ["spent"] },
  { base: "stand", meaning: "đứng", kind: "irregular", v2: ["stood"], v3: ["stood"] },
  { base: "steal", meaning: "ăn cắp", kind: "irregular", v2: ["stole"], v3: ["stolen"] },
  { base: "swim", meaning: "bơi", kind: "irregular", v2: ["swam"], v3: ["swum"] },
  { base: "take", meaning: "lấy / mang", kind: "irregular", v2: ["took"], v3: ["taken"] },
  { base: "teach", meaning: "dạy", kind: "irregular", v2: ["taught"], v3: ["taught"] },
  { base: "tell", meaning: "kể / bảo", kind: "irregular", v2: ["told"], v3: ["told"] },
  { base: "think", meaning: "nghĩ", kind: "irregular", v2: ["thought"], v3: ["thought"] },
  { base: "throw", meaning: "ném", kind: "irregular", v2: ["threw"], v3: ["thrown"] },
  { base: "understand", meaning: "hiểu", kind: "irregular", v2: ["understood"], v3: ["understood"] },
  { base: "wake", meaning: "thức dậy", kind: "irregular", v2: ["woke", "waked"], v3: ["woken", "waked"] },
  { base: "wear", meaning: "mặc / đeo", kind: "irregular", v2: ["wore"], v3: ["worn"] },
  { base: "win", meaning: "thắng", kind: "irregular", v2: ["won"], v3: ["won"] },
  { base: "write", meaning: "viết", kind: "irregular", v2: ["wrote"], v3: ["written"] },
];

/** Regular — cố ý phủ 5 quy tắc -ed. */
const regular: PracticeVerb[] = [
  // Rule 1: -e → -d
  { base: "live", meaning: "sống", kind: "regular" },
  { base: "like", meaning: "thích", kind: "regular" },
  { base: "arrive", meaning: "đến nơi", kind: "regular" },
  { base: "love", meaning: "yêu", kind: "regular" },
  { base: "change", meaning: "thay đổi", kind: "regular" },
  { base: "decide", meaning: "quyết định", kind: "regular" },
  { base: "hope", meaning: "hy vọng", kind: "regular" },
  { base: "use", meaning: "sử dụng", kind: "regular" },
  // Rule 2: CVC double
  { base: "stop", meaning: "dừng lại", kind: "regular" },
  { base: "plan", meaning: "lên kế hoạch", kind: "regular" },
  { base: "drop", meaning: "làm rơi", kind: "regular" },
  { base: "shop", meaning: "mua sắm", kind: "regular" },
  { base: "fit", meaning: "vừa / phù hợp", kind: "regular" },
  { base: "rob", meaning: "cướp", kind: "regular" },
  { base: "beg", meaning: "van xin", kind: "regular" },
  { base: "prefer", meaning: "thích hơn", kind: "regular" },
  // Rule 2 ngoại lệ w/x/y (vẫn regular, không double)
  { base: "snow", meaning: "tuyết rơi", kind: "regular" },
  { base: "fix", meaning: "sửa / gắn", kind: "regular" },
  { base: "play", meaning: "chơi", kind: "regular" },
  // Rule 3: consonant + y → ied
  { base: "study", meaning: "học", kind: "regular" },
  { base: "carry", meaning: "mang / vác", kind: "regular" },
  { base: "try", meaning: "cố gắng", kind: "regular" },
  { base: "cry", meaning: "khóc", kind: "regular" },
  { base: "worry", meaning: "lo lắng", kind: "regular" },
  { base: "copy", meaning: "sao chép", kind: "regular" },
  // Rule 4: vowel + y → yed
  { base: "enjoy", meaning: "thích / tận hưởng", kind: "regular" },
  { base: "stay", meaning: "ở lại", kind: "regular" },
  { base: "delay", meaning: "hoãn lại", kind: "regular" },
  { base: "destroy", meaning: "phá hủy", kind: "regular" },
  // Rule 5: default +ed
  { base: "work", meaning: "làm việc", kind: "regular" },
  { base: "listen", meaning: "nghe", kind: "regular" },
  { base: "open", meaning: "mở", kind: "regular" },
  { base: "watch", meaning: "xem", kind: "regular" },
  { base: "want", meaning: "muốn", kind: "regular" },
  { base: "need", meaning: "cần", kind: "regular" },
  { base: "ask", meaning: "hỏi", kind: "regular" },
  { base: "help", meaning: "giúp", kind: "regular" },
  { base: "call", meaning: "gọi", kind: "regular" },
  { base: "start", meaning: "bắt đầu", kind: "regular" },
  { base: "finish", meaning: "kết thúc", kind: "regular" },
  { base: "clean", meaning: "dọn / lau", kind: "regular" },
  { base: "cook", meaning: "nấu", kind: "regular" },
  { base: "walk", meaning: "đi bộ", kind: "regular" },
  { base: "talk", meaning: "nói chuyện", kind: "regular" },
  { base: "learn", meaning: "học (AmE: learned)", kind: "regular", note: "Tiếng Anh Mỹ thường learned; Anh có thể learnt (cũng chấp nhận nếu bạn ghi learnt)." },
];

export const PRACTICE_VERBS: PracticeVerb[] = [...irregular, ...regular];

export type TargetForm = "v2" | "v3";

export type ResolvedVerb = {
  verb: PracticeVerb;
  v2: string[];
  v3: string[];
  ruleTitle?: string;
  ruleDetail?: string;
  ruleSteps?: string[];
  ruleId?: number;
};

export function resolveVerb(verb: PracticeVerb): ResolvedVerb {
  if (verb.kind === "irregular") {
    return {
      verb,
      v2: verb.v2 ?? [],
      v3: verb.v3 ?? [],
    };
  }
  const ed = formRegularEd(verb.base);
  // learn: chấp nhận learnt (BrE)
  const forms =
    verb.base.toLowerCase() === "learn"
      ? [ed.form, "learnt"]
      : verb.base.toLowerCase() === "prefer"
        ? // prefer: 2 âm tiết nhấn cuối → preferred (rule máy có thể miss syllable)
          ["preferred"]
        : [ed.form];

  // prefer: force correct pedagogical form
  if (verb.base.toLowerCase() === "prefer") {
    return {
      verb,
      v2: ["preferred"],
      v3: ["preferred"],
      ruleId: 2,
      ruleTitle: "Nhấn âm cuối + CVC → gấp đôi phụ âm + -ed",
      ruleDetail:
        "“prefer” có 2 âm tiết, nhấn ở cuối (pre-FER) và kết thúc CVC → gấp đôi r rồi thêm -ed: preferred. (Khác visit → visited vì nhấn âm đầu.)",
      ruleSteps: ["Gốc: prefer", "Nhấn âm cuối + CVC", "Gấp đôi r", "Thêm -ed → preferred"],
    };
  }

  return {
    verb,
    v2: forms,
    v3: forms,
    ruleId: ed.ruleId,
    ruleTitle: ed.title,
    ruleDetail: ed.detail,
    ruleSteps: ed.steps,
  };
}

export function verbByBase(base: string): PracticeVerb | undefined {
  return PRACTICE_VERBS.find((v) => v.base === base);
}

/** Xáo trộn pool tạm trong phiên. */
export function shuffleBases(bases: string[] = PRACTICE_VERBS.map((v) => v.base)): string[] {
  return shuffleList(bases);
}

export const VERB_POOL_SIZE = PRACTICE_VERBS.length;

export function targetLabel(form: TargetForm): string {
  return form === "v2" ? "V2 · Past Simple" : "V3 · Past Participle";
}
