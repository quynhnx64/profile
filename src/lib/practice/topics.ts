export type PracticeTopic = {
  id: string;
  path: "/pratice/ed" | "/pratice/s-es" | "/pratice/ly" | "/pratice/compare";
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
    id: "ly",
    path: "/pratice/ly",
    title: "Tính từ → trạng từ (-ly)",
    subtitle: "Thêm -ly, trường hợp đặc biệt & bất quy tắc",
    available: true,
  },
  {
    id: "compare",
    path: "/pratice/compare",
    title: "So sánh hơn / nhất",
    subtitle: "-er / -est · more / most · bất quy tắc",
    available: true,
  },
];
