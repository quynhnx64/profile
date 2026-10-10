export type PracticeTopic = {
  id: string;
  path: "/pratice/ed" | "/pratice/s-es";
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
];
