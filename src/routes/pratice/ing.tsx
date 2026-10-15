import { createFileRoute } from "@tanstack/react-router";
import { WordDrill } from "@/components/practice/word-drill";
import { ING_RULE_SUMMARIES } from "@/lib/practice/ing-rules";
import { ING_POOL_SIZE, resolveIngByBase, shuffleIngBases } from "@/lib/practice/ing-verbs";

export const Route = createFileRoute("/pratice/ing")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Luyện -ing — Practice" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => (
    <WordDrill
      title="Động từ -ing"
      taskHint="Viết dạng V-ing"
      placeholder="ví dụ: making · running · lying"
      poolSize={ING_POOL_SIZE}
      shuffleBases={shuffleIngBases}
      resolveByBase={resolveIngByBase}
      rulesToggleLabel="Quy tắc -ing"
      rulesIntro="Cách thêm -ing:"
      ruleSummaries={([1, 2, 3, 4] as const).map((id) => ({
        id,
        title: ING_RULE_SUMMARIES[id].title,
        examples: ING_RULE_SUMMARIES[id].examples,
      }))}
    />
  ),
});
