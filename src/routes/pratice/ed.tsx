import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, Check, RotateCcw, X } from "lucide-react";

import { PracticeShell } from "@/components/practice/practice-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { answersMatch, ED_RULE_SUMMARIES } from "@/lib/practice/ed-rules";
import { takeNextFromPool } from "@/lib/practice/pool";
import {
  resolveVerb,
  shuffleBases,
  targetLabel,
  verbByBase,
  VERB_POOL_SIZE,
  type ResolvedVerb,
  type TargetForm,
} from "@/lib/practice/verbs";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pratice/ed")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Luyện -ed — Practice" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: EdPracticePage,
});

type Round = { resolved: ResolvedVerb };
type Result = { ok: boolean; user: string; accepted: string[] };

function EdPracticePage() {
  const [mode, setMode] = useState<TargetForm>("v2");
  const [pool, setPool] = useState<string[]>(() => shuffleBases());
  const [doneCount, setDoneCount] = useState(0);
  const [round, setRound] = useState<Round | null>(null);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [score, setScore] = useState({ ok: 0, total: 0 });
  const [showRules, setShowRules] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const started = useRef(false);

  const startWith = (base: string, nextPool: string[]) => {
    const verb = verbByBase(base);
    if (!verb) return;
    setPool(nextPool);
    setRound({ resolved: resolveVerb(verb) });
    setAnswer("");
    setResult(null);
  };

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const { item, pool: next } = takeNextFromPool([], shuffleBases);
    startWith(item, next);
  }, []);

  useEffect(() => {
    if (!result) inputRef.current?.focus();
  }, [round, result, mode]);

  const accepted =
    round == null ? [] : mode === "v2" ? round.resolved.v2 : round.resolved.v3;

  const goNext = (opts?: { skip?: boolean }) => {
    if (!round) return;
    const current = round.resolved.verb.base;
    if (opts?.skip) {
      const { item, pool: next } = takeNextFromPool(pool, shuffleBases, current);
      startWith(item, next);
      return;
    }
    const { item, pool: next, recycled } = takeNextFromPool(pool, shuffleBases);
    setDoneCount((n) => (recycled ? 0 : n + 1));
    startWith(item, next);
  };

  const resetPool = () => {
    const { item, pool: next } = takeNextFromPool([], shuffleBases);
    setDoneCount(0);
    setScore({ ok: 0, total: 0 });
    startWith(item, next);
  };

  const onFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!round) return;
    if (result) {
      goNext();
      return;
    }
    if (!answer.trim()) return;
    const ok = answersMatch(answer, accepted);
    setResult({ ok, user: answer, accepted });
    setScore((s) => ({ ok: s.ok + (ok ? 1 : 0), total: s.total + 1 }));
  };

  if (!round) {
    return (
      <PracticeShell title="Quy tắc -ed">
        <p className="text-muted-foreground">Đang tải…</p>
      </PracticeShell>
    );
  }

  const resolved = round.resolved;
  const { verb } = resolved;
  const isIrregular = verb.kind === "irregular";

  return (
    <PracticeShell title="Quy tắc -ed" score={`${score.ok}/${score.total}`}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex border border-border p-0.5" role="group" aria-label="Chọn dạng luyện">
          {(["v2", "v3"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                if (m === mode) return;
                setMode(m);
                setAnswer("");
                setResult(null);
              }}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors",
                mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {m}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-mono tabular-nums">
            {doneCount}/{VERB_POOL_SIZE} · còn {pool.length}
          </span>
          <button
            type="button"
            onClick={resetPool}
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="size-3.5" /> Reset
          </button>
        </div>
      </div>

      <section className="border border-border bg-card/80 p-5 sm:p-6">
        <p className="text-xs text-muted-foreground">
          {targetLabel(mode)}
          <span className="mx-2 text-border">·</span>
          {isIrregular ? "bất quy tắc" : "có quy tắc"}
        </p>

        <p className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">{verb.base}</p>
        <p className="mt-1 text-sm text-muted-foreground">{verb.meaning}</p>

        <form onSubmit={onFormSubmit} className="mt-6 space-y-3">
          <Input
            ref={inputRef}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            readOnly={Boolean(result)}
            placeholder={`Viết ${mode.toUpperCase()}…`}
            className={cn("h-12 text-base", result && "opacity-80")}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            aria-label={`Viết dạng ${mode}`}
          />

          <div className="flex flex-wrap items-center gap-2">
            <Button type="submit" disabled={!result && !answer.trim()}>
              {result ? (
                <>
                  Tiếp <ArrowRight />
                </>
              ) : (
                <>
                  Kiểm tra <Check />
                </>
              )}
            </Button>
            {!result && (
              <Button type="button" variant="ghost" size="sm" onClick={() => goNext({ skip: true })}>
                Bỏ qua
              </Button>
            )}
            <button
              type="button"
              className="ml-auto text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setShowRules((v) => !v)}
            >
              {showRules ? "Ẩn quy tắc" : "Quy tắc -ed"}
            </button>
          </div>
        </form>

        {result && (
          <div
            className={cn(
              "mt-6 border-t pt-5",
              result.ok ? "border-primary/30" : "border-destructive/30",
            )}
          >
            <p
              className={cn(
                "flex items-center gap-2 text-sm font-semibold",
                result.ok ? "text-primary" : "text-destructive",
              )}
            >
              {result.ok ? <Check className="size-4" /> : <X className="size-4" />}
              {result.ok ? "Đúng" : "Sai"}
              <span className="font-mono font-normal text-foreground">→ {accepted.join(" / ")}</span>
            </p>

            <p className="mt-3 font-mono text-xs text-muted-foreground">
              {verb.base} → {resolved.v2.join("/")} → {resolved.v3.join("/")}
            </p>

            <div className="mt-3 space-y-1.5 text-sm leading-relaxed">
              {isIrregular ? (
                <>
                  <p>
                    <strong>Bất quy tắc</strong> — nhớ dạng cố định, không thêm -ed theo quy tắc.
                  </p>
                  {verb.note && <p className="text-muted-foreground">{verb.note}</p>}
                </>
              ) : (
                <>
                  <p>
                    <strong>Có quy tắc</strong>
                    {resolved.ruleTitle ? ` · ${resolved.ruleTitle}` : ""}
                  </p>
                  {resolved.ruleDetail && <p className="text-muted-foreground">{resolved.ruleDetail}</p>}
                  {verb.note && <p className="text-muted-foreground">{verb.note}</p>}
                </>
              )}
            </div>
          </div>
        )}
      </section>

      {showRules && (
        <ul className="mt-4 space-y-3 border border-border/60 p-4 text-sm">
          {([1, 2, 3, 4, 5] as const).map((id) => (
            <li key={id}>
              <span className="font-medium">
                {id}. {ED_RULE_SUMMARIES[id].title}
              </span>
              <p className="font-mono text-xs text-muted-foreground">{ED_RULE_SUMMARIES[id].examples}</p>
            </li>
          ))}
        </ul>
      )}
    </PracticeShell>
  );
}
