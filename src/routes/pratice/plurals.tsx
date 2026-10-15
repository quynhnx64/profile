import { createFileRoute } from "@tanstack/react-router";
import { WordDrill } from "@/components/practice/word-drill";
import { PLURAL_RULE_SUMMARIES } from "@/lib/practice/plural-rules";
import {
  PLURAL_POOL_SIZE,
  resolvePluralByBase,
  shufflePluralBases,
} from "@/lib/practice/plural-nouns";

export const Route = createFileRoute("/pratice/plurals")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Luyện danh từ số nhiều — Practice" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => (
    <WordDrill
      title="Danh từ số nhiều"
      taskHint="Viết dạng số nhiều"
      placeholder="ví dụ: cats · babies · children"
      poolSize={PLURAL_POOL_SIZE}
      shuffleBases={shufflePluralBases}
      resolveByBase={resolvePluralByBase}
      rulesToggleLabel="Quy tắc số nhiều"
      rulesIntro="Cách tạo danh từ số nhiều:"
      ruleSummaries={([1, 2, 3, 4, 5, 6] as const).map((id) => ({
        id,
        title: PLURAL_RULE_SUMMARIES[id].title,
        examples: PLURAL_RULE_SUMMARIES[id].examples,
      }))}
    />
  ),
});
