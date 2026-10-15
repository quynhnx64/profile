import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowRight, Check, RotateCcw, X } from "lucide-react";

import { PracticeShell } from "@/components/practice/practice-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { answersMatch } from "@/lib/practice/normalize";
import { takeNextFromPool } from "@/lib/practice/pool";
import { cn } from "@/lib/utils";

export type DrillResolved = {
  base: string;
  meaning: string;
  kind: "regular" | "irregular";
  /** Dạng đích mặc định (khi không dùng modes) */
  forms: string[];
  note?: string | undefined;
  ruleTitle?: string | undefined;
  ruleDetail?: string | undefined;
  /** Bảng phụ: base → … */
  chain?: string | undefined;
};

export type DrillMode = { id: string; label: string };

type Props = {
  title: string;
  taskHint: string;
  placeholder?: string;
  poolSize: number;
  shuffleBases: () => string[];
  resolveByBase: (base: string) => DrillResolved | null;
  ruleSummaries?: { id: number | string; title: string; examples: string }[];
  rulesIntro?: ReactNode;
  rulesToggleLabel?: string;
  modes?: DrillMode[];
  /** Khi có modes: lấy forms theo mode */
  formsForMode?: (resolved: DrillResolved, modeId: string) => string[];
  taskHintForMode?: (modeId: string) => string;
  placeholderForMode?: (modeId: string) => string;
};

export function WordDrill({
  title,
  taskHint,
  placeholder = "Nhập đáp án…",
  poolSize,
  shuffleBases,
  resolveByBase,
  ruleSummaries,
  rulesIntro,
  rulesToggleLabel = "Quy tắc",
  modes,
  formsForMode,
  taskHintForMode,
  placeholderForMode,
}: Props) {
  const [mode, setMode] = useState(modes?.[0]?.id ?? "");
  const [pool, setPool] = useState<string[]>(() => shuffleBases());
  const [doneCount, setDoneCount] = useState(0);
  const [resolved, setResolved] = useState<DrillResolved | null>(null);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<{ ok: boolean; user: string; accepted: string[] } | null>(null);
  const [score, setScore] = useState({ ok: 0, total: 0 });
  const [showRules, setShowRules] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const started = useRef(false);

  const startWith = (base: string, nextPool: string[]) => {
    const item = resolveByBase(base);
    if (!item) return;
    setPool(nextPool);
    setResolved(item);
    setAnswer("");
    setResult(null);
  };

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const { item, pool: next } = takeNextFromPool([], shuffleBases);
    startWith(item, next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!result) inputRef.current?.focus();
  }, [resolved, result, mode]);

  const accepted =
    resolved == null
      ? []
      : modes && formsForMode
        ? formsForMode(resolved, mode)
        : resolved.forms;

  const goNext = (opts?: { skip?: boolean }) => {
    if (!resolved) return;
    const current = resolved.base;
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
    if (!resolved) return;
    if (result) {
      goNext();
      return;
    }
    if (!answer.trim()) return;
    const ok = answersMatch(answer, accepted);
    setResult({ ok, user: answer, accepted });
    setScore((s) => ({ ok: s.ok + (ok ? 1 : 0), total: s.total + 1 }));
  };

  if (!resolved) {
    return (
      <PracticeShell title={title}>
        <p className="text-muted-foreground">Đang tải…</p>
      </PracticeShell>
    );
  }

  const hint = modes && taskHintForMode ? taskHintForMode(mode) : taskHint;
  const ph = modes && placeholderForMode ? placeholderForMode(mode) : placeholder;

  return (
    <PracticeShell title={title} score={`${score.ok}/${score.total}`}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        {modes && modes.length > 0 ? (
          <div className="inline-flex border border-border p-0.5" role="group">
            {modes.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  if (m.id === mode) return;
                  setMode(m.id);
                  setAnswer("");
                  setResult(null);
                }}
                className={cn(
                  "px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors",
                  mode === m.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {m.label}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">{hint}</p>
        )}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-mono tabular-nums">
            {doneCount}/{poolSize} · còn {pool.length}
          </span>
          <button
            type="button"
            onClick={resetPool}
            className="inline-flex items-center gap-1 hover:text-foreground"
          >
            <RotateCcw className="size-3.5" /> Reset
          </button>
        </div>
      </div>

      <section className="border border-border bg-card/80 p-5 sm:p-6">
        <p className="text-xs text-muted-foreground">
          {modes ? hint : "Dạng gốc"}
          <span className="mx-2 text-border">·</span>
          {resolved.kind === "irregular" ? "bất quy tắc" : "có quy tắc"}
        </p>
        <p className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">{resolved.base}</p>
        <p className="mt-1 text-sm text-muted-foreground">{resolved.meaning}</p>

        <form onSubmit={onFormSubmit} className="mt-6 space-y-3">
          <Input
            ref={inputRef}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            readOnly={Boolean(result)}
            placeholder={ph}
            className={cn("h-12 text-base", result && "opacity-80")}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
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
            {ruleSummaries && ruleSummaries.length > 0 && (
              <button
                type="button"
                className="ml-auto text-xs text-muted-foreground hover:text-foreground"
                onClick={() => setShowRules((v) => !v)}
              >
                {showRules ? "Ẩn quy tắc" : rulesToggleLabel}
              </button>
            )}
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
              {resolved.chain ?? `${resolved.base} → ${accepted.join("/")}`}
            </p>
            <div className="mt-3 space-y-1.5 text-sm leading-relaxed">
              {resolved.kind === "irregular" ? (
                <>
                  <p>
                    <strong>Bất quy tắc / đặc biệt</strong> — nhớ dạng cố định.
                  </p>
                  {resolved.note && <p className="text-muted-foreground">{resolved.note}</p>}
                </>
              ) : (
                <>
                  <p>
                    <strong>Có quy tắc</strong>
                    {resolved.ruleTitle ? ` · ${resolved.ruleTitle}` : ""}
                  </p>
                  {resolved.ruleDetail && <p className="text-muted-foreground">{resolved.ruleDetail}</p>}
                  {resolved.note && <p className="text-muted-foreground">{resolved.note}</p>}
                </>
              )}
            </div>
          </div>
        )}
      </section>

      {showRules && ruleSummaries && (
        <ul className="mt-4 space-y-3 border border-border/60 p-4 text-sm">
          {rulesIntro && <li className="text-muted-foreground">{rulesIntro}</li>}
          {ruleSummaries.map((r) => (
            <li key={r.id}>
              <span className="font-medium">
                {r.id}. {r.title}
              </span>
              <p className="font-mono text-xs text-muted-foreground">{r.examples}</p>
            </li>
          ))}
        </ul>
      )}
    </PracticeShell>
  );
}
