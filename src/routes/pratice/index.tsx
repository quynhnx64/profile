import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { PracticeShell } from "@/components/practice/practice-shell";
import { PRACTICE_TOPICS } from "@/lib/practice/topics";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pratice/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Luyện động từ — Practice" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PracticeMenu,
});

function PracticeMenu() {
  return (
    <PracticeShell title="Luyện động từ" backTo="/">
      <p className="text-sm text-muted-foreground">Chọn chủ đề luyện tập</p>
      <ul className="mt-6 space-y-3">
        {PRACTICE_TOPICS.map((t, i) => (
          <li key={t.id}>
            {t.available ? (
              <Link
                to={t.path}
                className={cn(
                  "group flex items-center justify-between gap-4 border border-border bg-card/80 px-4 py-4 transition-colors",
                  "hover:border-primary/50 hover:bg-card",
                )}
              >
                <div>
                  <p className="font-mono text-[0.65rem] text-primary">{String(i + 1).padStart(2, "0")}</p>
                  <p className="mt-1 text-base font-semibold">{t.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{t.subtitle}</p>
                </div>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
              </Link>
            ) : (
              <div className="flex items-center justify-between gap-4 border border-border/50 px-4 py-4 opacity-50">
                <div>
                  <p className="font-mono text-[0.65rem] text-muted-foreground">{String(i + 1).padStart(2, "0")}</p>
                  <p className="mt-1 text-base font-semibold">{t.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{t.subtitle} · sắp có</p>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </PracticeShell>
  );
}
