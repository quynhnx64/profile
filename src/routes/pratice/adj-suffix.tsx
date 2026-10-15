import { createFileRoute } from "@tanstack/react-router";
import { WordDrill } from "@/components/practice/word-drill";
import {
  ADJ_SUFFIX_POOL_SIZE,
  ADJ_SUFFIX_RULE_SUMMARIES,
  resolveAdjSuffixByBase,
  shuffleAdjSuffixBases,
} from "@/lib/practice/adj-suffix";

export const Route = createFileRoute("/pratice/adj-suffix")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Luyện hậu tố tính từ — Practice" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => (
    <WordDrill
      title="Hậu tố → tính từ"
      taskHint="Viết dạng tính từ"
      placeholder="ví dụ: careful · hopeless · dangerous"
      poolSize={ADJ_SUFFIX_POOL_SIZE}
      shuffleBases={shuffleAdjSuffixBases}
      resolveByBase={resolveAdjSuffixByBase}
      rulesToggleLabel="Quy tắc hậu tố"
      rulesIntro="Một số hậu tố tạo tính từ phổ biến:"
      ruleSummaries={ADJ_SUFFIX_RULE_SUMMARIES}
    />
  ),
});
