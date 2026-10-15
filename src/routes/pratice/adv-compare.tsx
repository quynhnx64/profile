import { createFileRoute } from "@tanstack/react-router";
import { WordDrill } from "@/components/practice/word-drill";
import {
  ADV_COMPARE_POOL_SIZE,
  ADV_COMPARE_RULE_SUMMARIES,
  advCompareForms,
  resolveAdvCompareFull,
  shuffleAdvCompareBases,
} from "@/lib/practice/adv-compare";

export const Route = createFileRoute("/pratice/adv-compare")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Luyện so sánh trạng từ — Practice" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => (
    <WordDrill
      title="So sánh trạng từ"
      taskHint="So sánh trạng từ"
      poolSize={ADV_COMPARE_POOL_SIZE}
      shuffleBases={shuffleAdvCompareBases}
      resolveByBase={resolveAdvCompareFull}
      modes={[
        { id: "er", label: "-er / more" },
        { id: "est", label: "-est / most" },
      ]}
      formsForMode={(r, modeId) => advCompareForms(r.base, modeId)}
      taskHintForMode={(modeId) =>
        modeId === "est" ? "So sánh nhất (trạng từ)" : "So sánh hơn (trạng từ)"
      }
      placeholderForMode={(modeId) =>
        modeId === "est" ? "ví dụ: fastest · most carefully" : "ví dụ: faster · more carefully"
      }
      rulesToggleLabel="Quy tắc"
      rulesIntro="So sánh trạng từ:"
      ruleSummaries={ADV_COMPARE_RULE_SUMMARIES}
    />
  ),
});
