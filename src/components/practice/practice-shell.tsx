import { Link } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

type Props = {
  title: string;
  backTo?: "/" | "/pratice";
  score?: string;
  children: ReactNode;
};

export function PracticeShell({ title, backTo = "/pratice", score, children }: Props) {
  useEffect(() => {
    document.documentElement.classList.add("portfolio-lock");
    return () => document.documentElement.classList.remove("portfolio-lock");
  }, []);

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-background text-foreground">
      <header className="z-20 shrink-0 border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-xl items-center justify-between gap-3 px-4">
          <h1 className="text-sm font-semibold">{title}</h1>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {score != null && <span className="font-mono tabular-nums">{score}</span>}
            <Link to={backTo} className="hover:text-primary">
              ←
            </Link>
          </div>
        </div>
      </header>
      <div className="app-scroller min-h-0 flex-1">
        <div className="mx-auto max-w-xl px-4 py-8 pb-12">{children}</div>
      </div>
    </div>
  );
}
