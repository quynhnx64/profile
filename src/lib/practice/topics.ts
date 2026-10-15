export type PracticeTopic = {
  id: string;
  path:
    | "/pratice/ed"
    | "/pratice/s-es"
    | "/pratice/ly"
    | "/pratice/compare"
    | "/pratice/plurals"
    | "/pratice/ing"
    | "/pratice/adv-compare"
    | "/pratice/neg-prefix"
    | "/pratice/noun-suffix"
    | "/pratice/adj-suffix";
  title: string;
  subtitle: string;
  available: boolean;
};

/** Menu chính — có thể bổ sung topic sau. */
export const PRACTICE_TOPICS: PracticeTopic[] = [
  {
    id: "s-es",
    path: "/pratice/s-es",
    title: "Quy tắc -s / -es",
    subtitle: "Ngôi 3 số ít (he / she / it)",
    available: true,
  },
  {
    id: "ed",
    path: "/pratice/ed",
    title: "Quy tắc -ed",
    subtitle: "V2 / V3 — quá khứ & quá khứ phân từ",
    available: true,
  },
  {
    id: "ing",
    path: "/pratice/ing",
    title: "Động từ -ing",
    subtitle: "Bỏ -e · gấp đôi CVC · -ie → -ying",
    available: true,
  },
  {
    id: "plurals",
    path: "/pratice/plurals",
    title: "Danh từ số nhiều",
    subtitle: "-s / -es / -ies / -ves · bất quy tắc",
    available: true,
  },
  {
    id: "ly",
    path: "/pratice/ly",
    title: "Tính từ → trạng từ (-ly)",
    subtitle: "Thêm -ly, trường hợp đặc biệt & bất quy tắc",
    available: true,
  },
  {
    id: "compare",
    path: "/pratice/compare",
    title: "So sánh tính từ",
    subtitle: "-er / -est · more / most · bất quy tắc",
    available: true,
  },
  {
    id: "adv-compare",
    path: "/pratice/adv-compare",
    title: "So sánh trạng từ",
    subtitle: "faster · more carefully · well/better/best",
    available: true,
  },
  {
    id: "neg-prefix",
    path: "/pratice/neg-prefix",
    title: "Tiền tố phủ định",
    subtitle: "un- · in-/im-/il-/ir- · dis- · non-",
    available: true,
  },
  {
    id: "noun-suffix",
    path: "/pratice/noun-suffix",
    title: "Hậu tố → danh từ",
    subtitle: "-ness · -ment · -tion/-sion · -er/-or",
    available: true,
  },
  {
    id: "adj-suffix",
    path: "/pratice/adj-suffix",
    title: "Hậu tố → tính từ",
    subtitle: "-ful · -less · -able · -ous/-al/-ive",
    available: true,
  },
];
