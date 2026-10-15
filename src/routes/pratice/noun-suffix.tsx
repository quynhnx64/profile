import { createFileRoute } from "@tanstack/react-router";
import { WordDrill } from "@/components/practice/word-drill";
import {
  NOUN_SUFFIX_POOL_SIZE,
  NOUN_SUFFIX_RULE_SUMMARIES,
  resolveNounSuffixByBase,
  shuffleNounSuffixBases,
} from "@/lib/practice/noun-suffix";

export const Route = createFileRoute("/pratice/noun-suffix")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Luyện hậu tố danh từ — Practice" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => (
    <WordDrill
      title="Hậu tố → danh từ"
      taskHint="Viết dạng danh từ"
      placeholder="ví dụ: happiness · teacher · creation"
      poolSize={NOUN_SUFFIX_POOL_SIZE}
      shuffleBases={shuffleNounSuffixBases}
      resolveByBase={resolveNounSuffixByBase}
      rulesToggleLabel="Quy tắc hậu tố"
      rulesIntro="Một số hậu tố tạo danh từ phổ biến:"
      ruleSummaries={NOUN_SUFFIX_RULE_SUMMARIES}
    />
  ),
});
