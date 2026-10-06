import { Braces, Code2, Globe2, ServerCog, TerminalSquare, Workflow } from "lucide-react";

const floatIcons = [
  { Icon: Code2, className: "left-[6%] top-[18%] animate-float-a" },
  { Icon: TerminalSquare, className: "right-[7%] top-[14%] animate-float-b" },
  { Icon: Globe2, className: "left-[12%] bottom-[20%] animate-float-c" },
  { Icon: ServerCog, className: "right-[12%] bottom-[24%] animate-float-a" },
  { Icon: Braces, className: "left-[40%] top-[10%] animate-float-b" },
  { Icon: Workflow, className: "right-[36%] bottom-[12%] animate-float-c" },
];

const codeLines = [
  "const stack = ['Next.js', 'Directus', 'TypeScript']",
  "await api.deploy({ env: 'production' })",
  "socket.on('sync', updateState)",
  "export function buildExperience() {",
  "  return <Portfolio role=\"Web & Backend\" />",
  "}",
  "// realtime · multi-tenant · secure",
  "git commit -m 'ship feature'",
];

/** Nền WEB/dev cố định trên viewport — không cuộn theo nội dung. */
export function DevAtmosphere() {
  return (
    <div className="dev-backdrop pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="dev-backdrop-base absolute inset-0" />
      <div className="ambient-orb ambient-orb-a" />
      <div className="ambient-orb ambient-orb-b" />
      <div className="ambient-orb ambient-orb-c" />
      <div className="code-rain" />
      <div className="tech-grid absolute inset-0 opacity-30" />
      <div className="scanlines absolute inset-0 opacity-[0.03]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-secondary/25 to-transparent" />

      {floatIcons.map(({ Icon, className }, i) => (
        <span key={i} className={`absolute text-primary/15 md:text-primary/18 ${className}`}>
          <Icon className="size-7 sm:size-9 lg:size-11" strokeWidth={1.2} />
        </span>
      ))}

      <div className="code-float absolute inset-0">
        {codeLines.map((line, i) => (
          <span key={line} className={`code-float-line code-float-line-${i + 1}`}>
            {line}
          </span>
        ))}
      </div>
    </div>
  );
}

export function CodeTerminalCard() {
  return (
    <aside
      className="relative overflow-hidden border border-border bg-card/90 shadow-[0_0_36px_-14px] shadow-primary/25 backdrop-blur-md"
      aria-hidden="true"
    >
      <div className="flex h-9 items-center gap-2 border-b border-border bg-muted/55 px-3">
        <span className="size-2.5 rounded-full bg-destructive/80" />
        <span className="size-2.5 rounded-full bg-warning/80" />
        <span className="size-2.5 rounded-full bg-primary/80" />
        <span className="ml-2 font-mono text-[0.65rem] text-muted-foreground">~/dev/portfolio.ts</span>
      </div>
      <pre className="space-y-1.5 p-4 font-mono text-[0.7rem] leading-5 text-muted-foreground">
        <div><span className="text-primary">import</span> {"{ build }"} <span className="text-primary">from</span> <span className="text-secondary">"@soc/core"</span></div>
        <div />
        <div><span className="text-primary">export const</span> profile = {"{"}</div>
        <div>  role: <span className="text-secondary">"Web & Backend"</span>,</div>
        <div>  stack: [<span className="text-secondary">"Next"</span>, <span className="text-secondary">"Directus"</span>],</div>
        <div>  ship: <span className="text-primary">async</span> () =&gt; goLive(),</div>
        <div>{"}"}</div>
        <div />
        <div className="text-primary/90">
          <span className="opacity-60">// </span>ready for next product
          <span className="ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 animate-caret bg-primary" />
        </div>
      </pre>
      <div className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-primary/15 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-6 size-24 rounded-full bg-secondary/15 blur-2xl" />
    </aside>
  );
}
