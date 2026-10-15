import { createFileRoute } from "@tanstack/react-router";
import { WordDrill } from "@/components/practice/word-drill";
import {
  NEG_PREFIX_POOL_SIZE,
  NEG_PREFIX_RULE_SUMMARIES,
  resolveNegPrefixByBase,
  shuffleNegPrefixBases,
} from "@/lib/practice/neg-prefix";

export const Route = createFileRoute("/pratice/neg-prefix")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Luyện tiền tố phủ định — Practice" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => (
    <WordDrill
      title="Tiền tố phủ định"
      taskHint="Viết dạng phủ định"
      placeholder="ví dụ: unhappy · impossible · illegal"
      poolSize={NEG_PREFIX_POOL_SIZE}
      shuffleBases={shuffleNegPrefixBases}
      resolveByBase={resolveNegPrefixByBase}
      rulesToggleLabel="Quy tắc tiền tố"
      rulesIntro="Thêm tiền tố để tạo nghĩa phủ định / ngược lại:"
      ruleSummaries={NEG_PREFIX_RULE_SUMMARIES}
    />
  ),
});
