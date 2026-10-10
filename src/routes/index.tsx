import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState, type MouseEvent, type ReactNode, type RefObject } from "react";
import {
  ArrowDown, ArrowRight, Braces, Check, ChevronRight, Download, ExternalLink,
  Github, GraduationCap, Globe2, Linkedin, Mail, Menu, Phone, ShieldCheck, TerminalSquare, X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeTerminalCard, DevAtmosphere } from "@/components/dev-atmosphere";
import { siteContentQuery } from "@/lib/site-content.functions";
import { getIcon, type Project } from "@/lib/site-content";
import { buildPageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

const CV_URL = "/Nguyen-Xuan-Quynh-CV.pdf";
const CV_FILENAME = "Nguyen-Xuan-Quynh-CV.pdf";
const AVATAR_URL = "/avatar.jpg";

export const Route = createFileRoute("/")({
  head: () => {
    const { meta, links } = buildPageHead({
      path: "/",
      type: "website",
    });
    return { meta, links };
  },
  loader: ({ context }) => context.queryClient.ensureQueryData(siteContentQuery),
  component: PortfolioPage,
});

const navItems = [
  { id: "top", label: "Trang chủ" },
  { id: "nang-luc", label: "Năng lực" },
  { id: "du-an", label: "Dự án" },
  { id: "cong-nghe", label: "Công nghệ" },
  { id: "kinh-nghiem", label: "Kinh nghiệm & Liên hệ" },
];

const pad = (n: number) => String(n + 1).padStart(2, "0");

function getSectionClosestToCenter(scroller: HTMLDivElement) {
  const mid = scroller.scrollTop + scroller.clientHeight / 2;
  let bestId = "top";
  let bestDist = Number.POSITIVE_INFINITY;
  scroller.querySelectorAll<HTMLElement>("section[data-section]").forEach((sec) => {
    const center = sec.offsetTop + sec.offsetHeight / 2;
    const dist = Math.abs(center - mid);
    if (dist < bestDist) {
      bestDist = dist;
      bestId = sec.id;
    }
    // đánh dấu visible khi gần giữa màn hình
    if (dist < scroller.clientHeight * 0.55) sec.classList.add("is-visible");
  });
  return bestId;
}

function useActiveSection(scrollerRef: RefObject<HTMLDivElement | null>) {
  const [active, setActive] = useState("top");
  const lockRef = useRef<string | null>(null);
  const lockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;

    const sync = () => {
      if (lockRef.current) {
        setActive(lockRef.current);
        return;
      }
      setActive(getSectionClosestToCenter(root));
    };

    const onScrollEnd = () => {
      lockRef.current = null;
      sync();
    };

    root.addEventListener("scroll", sync, { passive: true });
    root.addEventListener("scrollend", onScrollEnd);
    sync();
    return () => {
      root.removeEventListener("scroll", sync);
      root.removeEventListener("scrollend", onScrollEnd);
      if (lockTimer.current) clearTimeout(lockTimer.current);
    };
  }, [scrollerRef]);

  const lockActive = (id: string) => {
    lockRef.current = id;
    setActive(id);
    if (lockTimer.current) clearTimeout(lockTimer.current);
    // fallback khi trình duyệt không hỗ trợ scrollend
    lockTimer.current = setTimeout(() => {
      lockRef.current = null;
      const root = scrollerRef.current;
      if (root) setActive(getSectionClosestToCenter(root));
    }, 700);
  };

  return { active, lockActive };
}

function scrollToSection(id: string, scroller: HTMLDivElement | null) {
  const el = document.getElementById(id);
  if (!el || !scroller) return;
  // căn section vào giữa viewport của scroller
  const top = el.offsetTop - (scroller.clientHeight - el.offsetHeight) / 2;
  scroller.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}

function Section({ id, className, children }: { id: string; className?: string; children: ReactNode }) {
  return (
    <section id={id} data-section className={cn("snap-section border-b border-border/60", className)}>
      <div className="snap-section-inner">
        <div className="mx-auto my-auto w-full max-w-7xl px-5 lg:px-8">
          {children}
        </div>
      </div>
    </section>
  );
}

function PortfolioPage() {
  const { data: c } = useSuspenseQuery(siteContentQuery);
  const [selected, setSelected] = useState<{ p: Project; i: number } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const { active, lockActive } = useActiveSection(scrollerRef);
  const tel = `tel:${c.profile.phone.replace(/[^\d+]/g, "")}`;

  useEffect(() => {
    document.documentElement.classList.add("portfolio-lock");
    return () => document.documentElement.classList.remove("portfolio-lock");
  }, []);

  // Chuyển wheel từ section-inner (khi hết chỗ cuộn / không cần cuộn) sang page-scroller
  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;
    const onWheel = (e: WheelEvent) => {
      const inner = (e.target as HTMLElement | null)?.closest?.(".snap-section-inner") as HTMLElement | null;
      if (!inner || !root.contains(inner)) return;
      const canScroll = inner.scrollHeight > inner.clientHeight + 2;
      if (!canScroll) {
        e.preventDefault();
        root.scrollBy({ top: e.deltaY });
        return;
      }
      const atTop = inner.scrollTop <= 0 && e.deltaY < 0;
      const atBottom = inner.scrollTop + inner.clientHeight >= inner.scrollHeight - 2 && e.deltaY > 0;
      if (atTop || atBottom) {
        e.preventDefault();
        root.scrollBy({ top: e.deltaY });
      }
    };
    root.addEventListener("wheel", onWheel, { passive: false });
    return () => root.removeEventListener("wheel", onWheel);
  }, []);

  const go = (id: string) => (e: MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    lockActive(id);
    scrollToSection(id, scrollerRef.current);
  };

  return (
    <main className="relative h-dvh overflow-hidden text-foreground selection:bg-primary selection:text-primary-foreground">
      <div className="fixed inset-0 z-0">
        <DevAtmosphere />
      </div>

      <header className="fixed inset-x-0 top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 lg:px-8">
          <a href="#top" onClick={go("top")} className="flex items-center gap-3" aria-label="Về trang chủ">
            <img src={AVATAR_URL} alt="Nguyễn Xuân Quỳnh" width={36} height={36} className="size-9 border border-primary/40 object-cover" />
            <span className="hidden text-sm font-semibold uppercase sm:block">{c.profile.nameLine1} {c.profile.nameLine2.replace(/\.$/, "")}</span>
          </a>
          <nav className="hidden items-center gap-6 text-xs font-semibold uppercase text-muted-foreground lg:flex" aria-label="Điều hướng chính">
            {navItems.map((n) => (
              <a key={n.id} href={`#${n.id}`} onClick={go(n.id)} className={cn("relative py-2 transition-colors hover:text-primary", active === n.id && "text-primary")}>
                {n.label}
                {active === n.id && <span className="absolute inset-x-0 -bottom-0.5 h-px bg-primary" />}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <a href={`mailto:${c.profile.email}`}><Mail /> Liên hệ</a>
            </Button>
            <Button variant="outline" size="icon" className="lg:hidden" onClick={() => setMenuOpen((o) => !o)} aria-label="Mở menu">
              {menuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
        {menuOpen && (
          <nav className="border-t border-border bg-background/90 px-5 py-2 backdrop-blur-xl lg:hidden" aria-label="Điều hướng di động">
            {navItems.map((n) => (
              <a key={n.id} href={`#${n.id}`} onClick={go(n.id)} className={cn("flex items-center justify-between border-b border-border py-3.5 text-sm font-semibold uppercase last:border-0", active === n.id && "text-primary")}>
                {n.label}<ChevronRight className="size-4 text-primary" />
              </a>
            ))}
          </nav>
        )}
      </header>

      <div ref={scrollerRef} className="page-scroller app-scroller">
      {/* Trang chủ */}
      <section id="top" data-section className="snap-section is-visible border-b border-border/60">
        <div className="snap-section-inner">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-8 px-5 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 lg:px-8">
          <div>
            <div className="mb-7 flex items-center gap-4">
              <img src={AVATAR_URL} alt="Nguyễn Xuân Quỳnh" width={80} height={80} className="size-16 shrink-0 border border-primary/50 object-cover shadow-[0_0_28px_-6px] shadow-primary/40 sm:size-20" />
              <div className="flex items-center gap-3 font-mono text-xs uppercase text-primary">
                <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" /><span className="relative inline-flex size-2 rounded-full bg-primary" /></span>
                {c.profile.status}
              </div>
            </div>
            <p className="mb-4 text-sm font-semibold uppercase text-muted-foreground">{c.profile.role}</p>
            <h1 className="font-display text-[clamp(3rem,8vw,7.5rem)] font-bold uppercase leading-[0.88]">
              {c.profile.nameLine1}<br /><span className="text-outline">{c.profile.nameLine2}</span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">{c.profile.intro}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg"><a href="#du-an" onClick={go("du-an")}>Xem dự án <ArrowDown /></a></Button>
              <Button asChild variant="outline" size="lg"><a href={CV_URL} download={CV_FILENAME}>Tải CV <Download /></a></Button>
              {c.profile.github?.trim() && (
                <Button asChild variant="outline" size="lg"><a href={c.profile.github} target="_blank" rel="noreferrer"><Github /> GitHub</a></Button>
              )}
            </div>
            <div className="mt-8 grid grid-cols-3 border-l border-t border-border bg-background/80 backdrop-blur-md">
              {c.stats.map((s) => (
                <div key={s.label} className="border-b border-r border-border p-3 transition-colors hover:bg-card/90 md:p-5">
                  <p className="font-mono text-xl font-semibold text-primary md:text-3xl">{s.value}</p>
                  <p className="mt-1.5 text-[0.62rem] uppercase leading-4 text-muted-foreground md:text-xs">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative space-y-3">
            <CodeTerminalCard />
            <div className="grid grid-cols-2 gap-3">
              {[
                { k: "01", t: "Web apps", d: "Next.js · React · UX" },
                { k: "02", t: "API platform", d: "Directus · REST · WS" },
                { k: "03", t: "Realtime", d: "Game · Chat · Sync" },
                { k: "04", t: "SaaS", d: "Multi-tenant · SSO" },
              ].map((x) => (
                <div key={x.k} className="border border-border/80 bg-background/80 p-3.5 backdrop-blur-md transition-colors hover:border-primary/40 hover:bg-card/90 md:p-4">
                  <p className="font-mono text-[0.65rem] text-primary">{x.k}</p>
                  <p className="mt-1.5 text-sm font-semibold">{x.t}</p>
                  <p className="mt-1 font-mono text-[0.62rem] text-muted-foreground">{x.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>
      </section>

      <Section id="nang-luc">
        <SectionHeading kicker="01 / Năng lực" title="Năng lực cốt lõi." />
        <div className="mt-10 grid border-l border-t border-border md:grid-cols-2 lg:grid-cols-4">
          {c.capabilities.map((cap, i) => {
            const Icon = getIcon(cap.icon);
            return (
              <article key={i} data-reveal className="group border-b border-r border-border bg-background/75 p-6 backdrop-blur-sm transition-[background-color,transform] duration-300 hover:-translate-y-1 hover:bg-card/90 md:p-8">
                <div className="flex items-start justify-between"><Icon className="size-7 text-primary" /><span className="font-mono text-xs text-muted-foreground">{pad(i)}</span></div>
                <h3 className="mt-10 text-lg font-semibold">{cap.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{cap.text}</p>
              </article>
            );
          })}
        </div>
        <div className="mt-12">
          <p className="font-mono text-xs uppercase text-primary">Quy trình</p>
          <div className="relative mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-4 md:gap-0">
            <div className="absolute left-0 right-0 top-5 hidden border-t border-dashed border-primary/35 md:block" />
            {c.process.map((s, i) => (
              <article key={i} data-reveal className="relative md:pr-8">
                <span className="relative z-10 grid size-10 place-items-center border border-primary bg-background font-mono text-xs text-primary">{pad(i)}</span>
                <h3 className="mt-4 font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{s.text}</p>
              </article>
            ))}
          </div>
        </div>
      </Section>

      <Section id="du-an">
        <SectionHeading kicker="02 / Dự án" title="Sản phẩm đã triển khai." />
        <FeaturedProjects
          projects={c.projects}
          onOpen={(p, i) => setSelected({ p, i })}
        />
      </Section>

      <Section id="cong-nghe">
        <SectionHeading kicker="03 / Công nghệ" title="Công nghệ trong thực chiến." />
        <div className="tech-marquee mt-10 overflow-hidden border-y border-border" aria-label="Danh sách công nghệ và công cụ">
          <div className="tech-marquee-track flex w-max py-5">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex" aria-hidden={copy === 1}>
                {c.techGroups.map((g, i) => {
                  const Icon = getIcon(g.icon);
                  return (
                    <article key={`${copy}-${i}`} data-reveal className="group mx-2 w-[18rem] shrink-0 border border-border bg-background/80 p-5 backdrop-blur-sm transition-colors duration-300 hover:border-primary/60 hover:bg-card/90 md:w-[21rem]">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3"><Icon className="size-5 text-primary" /><h3 className="font-semibold">{g.name}</h3></div>
                        <span className="font-mono text-[0.65rem] text-muted-foreground">{pad(i)}</span>
                      </div>
                      <ul className="mt-5 grid gap-3">
                        {g.items.map((it) => (
                          <li key={it.name} className="border-l border-border pl-3 transition-colors group-hover:border-primary/50">
                            <p className="text-sm font-medium">{it.name}</p>
                            {it.note && <p className="mt-0.5 text-xs text-muted-foreground">{it.note}</p>}
                          </li>
                        ))}
                      </ul>
                    </article>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section id="kinh-nghiem">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr]">
          <div>
            <SectionHeading kicker="04 / Kinh nghiệm & Liên hệ" title="Web, API và vận hành sản phẩm." />
            {c.experience.map((e, i) => (
              <article key={i} data-reveal className="mt-8 border-t border-border pt-6">
                <div className="grid gap-4 md:grid-cols-[9rem_1fr]">
                  <p className="font-mono text-xs text-primary">{e.period}</p>
                  <div>
                    <p className="text-xs font-semibold uppercase text-muted-foreground">{e.company}</p>
                    <h3 className="mt-2 text-xl font-bold md:text-2xl">{e.role}</h3>
                    <ul className="mt-5 space-y-3 text-sm leading-6 text-muted-foreground">
                      {e.bullets.map((b) => <li key={b} className="flex gap-3"><Check className="mt-1 size-4 shrink-0 text-primary" />{b}</li>)}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
           <aside data-reveal className="space-y-4">
            <div className="border border-border bg-card p-6">
              <div className="flex items-center gap-3"><GraduationCap className="text-primary" /><p className="font-mono text-xs uppercase text-muted-foreground">Học vấn</p></div>
              <h3 className="mt-4 text-xl font-bold">{c.education.school}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.education.major} · {c.education.period}</p>
              <p className="mt-3 font-mono text-sm text-primary">{c.education.note}</p>
            </div>
            <div className="border border-border p-6">
              <div className="flex items-center gap-3"><Braces className="text-primary" /><p className="font-mono text-xs uppercase text-muted-foreground">Chứng chỉ</p></div>
              <ul className="mt-4 space-y-2">{c.certificates.map((x) => <li key={x} className="text-sm font-semibold">{x}</li>)}</ul>
            </div>
          </aside>
        </div>
        <div data-reveal className="mt-9 border-t border-primary/40 bg-primary px-6 py-7 text-primary-foreground md:px-8">
          <p className="font-mono text-xs font-semibold uppercase">Sẵn sàng kết nối</p>
          <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h2 className="max-w-4xl font-display text-2xl font-bold uppercase leading-tight md:text-4xl">{c.contact.title}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 opacity-75">{c.contact.text}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="secondary"><a href={`mailto:${c.profile.email}`}>Gửi email <Mail /></a></Button>
              <Button asChild variant="outline" className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary"><a href={CV_URL} download={CV_FILENAME}>Tải CV <Download /></a></Button>
              {c.profile.github?.trim() && (
                <Button asChild variant="outline" className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  <a href={c.profile.github} target="_blank" rel="noreferrer"><Github /> GitHub</a>
                </Button>
              )}
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-3 border-t border-primary-foreground/30 pt-5 text-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <a className="inline-flex items-center gap-2 font-semibold hover:underline" href={`mailto:${c.profile.email}`}><Mail className="size-4" />{c.profile.email}</a>
              <a className="inline-flex items-center gap-2 hover:underline" href={tel}><Phone className="size-4" />{c.profile.phone}</a>
              {c.profile.github?.trim() && (
                <a className="inline-flex items-center gap-2 hover:underline" href={c.profile.github} target="_blank" rel="noreferrer">
                  <Github className="size-4" />GitHub
                </a>
              )}
              {c.profile.linkedin?.trim() && (
                <a className="inline-flex items-center gap-2 hover:underline" href={c.profile.linkedin} target="_blank" rel="noreferrer">
                  <Linkedin className="size-4" />LinkedIn
                </a>
              )}
            </div>
            <p className="opacity-70">{c.profile.location} · © {new Date().getFullYear()} · <Link to="/edit" className="hover:underline">Quản trị</Link></p>
          </div>
        </div>
      </Section>
      </div>

      <ProjectReview selected={selected} onClose={() => setSelected(null)} />
    </main>
  );
}

function SectionHeading({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="grid gap-4 md:grid-cols-[12rem_1fr]">
      <p className="font-mono text-xs uppercase text-primary">{kicker}</p>
      <h2 className="max-w-3xl text-3xl font-bold leading-tight md:text-5xl">{title}</h2>
    </div>
  );
}

const PROJECT_AUTO_MS = 5000;

function FeaturedProjects({
  projects,
  onOpen,
}: {
  projects: Project[];
  onOpen: (p: Project, i: number) => void;
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = projects.length;
  const i = n === 0 ? 0 : ((active % n) + n) % n;
  const p = projects[i];

  useEffect(() => {
    if (n <= 1 || paused) return;
    const t = setInterval(() => setActive((x) => (x + 1) % n), PROJECT_AUTO_MS);
    return () => clearInterval(t);
  }, [n, paused]);

  if (!p || n === 0) return null;

  const Icon = getIcon(p.icon);
  const listCopies = [0, 1] as const;

  const renderItem = (proj: Project, idx: number, copy: number) => {
    const on = idx === i;
    return (
      <button
        key={`${copy}-${proj.id}`}
        type="button"
        role="option"
        aria-selected={on}
        tabIndex={copy === 0 ? 0 : -1}
        onClick={() => setActive(idx)}
        className={cn(
          "shrink-0 border px-3 py-2.5 text-left transition-colors lg:w-full lg:rounded-none lg:border-0 lg:border-l-2 lg:px-4 lg:py-3",
          on
            ? "border-primary bg-primary/10 text-foreground lg:border-l-primary lg:bg-primary/10"
            : "border-border bg-background/60 text-muted-foreground hover:border-primary/40 hover:text-foreground lg:border-l-transparent lg:bg-transparent lg:hover:bg-card/50",
        )}
      >
        <span className="font-mono text-[0.65rem] text-primary">{pad(idx)}</span>
        <span className="mt-0.5 block text-sm font-semibold leading-snug">{proj.title}</span>
        <span className="mt-0.5 hidden font-mono text-[0.62rem] uppercase text-muted-foreground lg:block">
          {proj.category}
        </span>
      </button>
    );
  };

  return (
    <div
      className="mt-8 grid min-h-0 gap-5 lg:grid-cols-[minmax(14rem,0.38fr)_1fr] lg:items-stretch lg:gap-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
      }}
    >
      {/* List chạy liên tục — không scrollbar */}
      <div
        className={cn(
          "project-marquee lg:h-[min(52vh,28rem)] lg:border-l lg:border-border",
          paused && "is-paused",
        )}
        role="listbox"
        aria-label="Danh sách dự án"
      >
        <div className="project-marquee-track flex w-max gap-2 lg:w-full lg:flex-col lg:gap-0">
          {listCopies.map((copy) => (
            <div
              key={copy}
              className="flex gap-2 lg:w-full lg:flex-col lg:gap-0"
              aria-hidden={copy === 1}
            >
              {projects.map((proj, idx) => renderItem(proj, idx, copy))}
            </div>
          ))}
        </div>
      </div>

      <article
        key={p.id}
        className="flex min-h-0 flex-col border border-border bg-background/80 p-5 backdrop-blur-sm md:p-7"
        aria-live="polite"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-xs text-primary">
              {pad(i)} · {p.category}
            </p>
            <h3 className="mt-3 text-2xl font-bold md:text-3xl">{p.title}</h3>
            <p className="mt-2 font-mono text-[0.7rem] uppercase tracking-wide text-primary">{p.role}</p>
          </div>
          <Icon className="size-7 shrink-0 text-muted-foreground" />
        </div>

        <p className="mt-4 text-sm leading-6 text-muted-foreground md:text-[0.95rem]">{p.description}</p>
        <p className="mt-4 border-l-2 border-primary pl-3 text-sm font-medium">{p.result}</p>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {p.tags.map((t) => (
            <span key={t} className="border border-border px-2 py-0.5 font-mono text-[0.62rem] uppercase text-muted-foreground">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-6">
          <Button className="justify-between gap-3 sm:min-w-[12rem]" variant="outline" onClick={() => onOpen(p, i)}>
            {p.url ? "Xem trực tiếp" : "Xem chi tiết"} <ArrowRight />
          </Button>
        </div>
      </article>
    </div>
  );
}

function ProjectReview({ selected, onClose }: { selected: { p: Project; i: number } | null; onClose: () => void }) {
  if (!selected) return null;
  const { p: project, i } = selected;
  const Icon = getIcon(project.icon);
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="flex h-[88vh] w-[94vw] max-w-6xl flex-col gap-0 overflow-hidden border-border bg-background p-0 sm:rounded-md [&>button]:right-3 [&>button]:top-3 [&>button]:z-20">
        <DialogTitle className="sr-only">Xem dự án {project.title}</DialogTitle>
        <DialogDescription className="sr-only">Bản chạy trực tiếp và thông tin kỹ thuật của dự án.</DialogDescription>
        <div className="flex h-12 shrink-0 items-center gap-3 border-b border-border bg-card px-4 pr-14">
          <div className="hidden items-center gap-1.5 sm:flex" aria-hidden="true"><span className="size-2.5 rounded-full bg-destructive" /><span className="size-2.5 rounded-full bg-warning" /><span className="size-2.5 rounded-full bg-primary" /></div>
          <div className="flex min-w-0 flex-1 items-center gap-2 border border-border bg-background px-3 py-1.5 font-mono text-[0.68rem] text-muted-foreground"><ShieldCheck className="size-3.5 shrink-0 text-primary" /><span className="truncate">{project.url ? `https://${project.displayUrl}` : project.displayUrl}</span></div>
          {project.url && <Button asChild size="icon" variant="ghost"><a href={project.url} target="_blank" rel="noreferrer" aria-label="Mở trong tab mới"><ExternalLink /></a></Button>}
        </div>
        <Tabs defaultValue={project.url ? "live" : "specs"} className="flex min-h-0 flex-1 flex-col">
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3">
            <div className="flex min-w-0 items-center gap-3"><Icon className="size-5 shrink-0 text-primary" /><span className="truncate text-sm font-semibold">{project.title}</span></div>
            <TabsList className="h-8 rounded-none bg-muted p-0.5">
              <TabsTrigger value="live" disabled={!project.url} className="rounded-none px-3 text-xs"><Globe2 /> Live Demo</TabsTrigger>
              <TabsTrigger value="specs" className="rounded-none px-3 text-xs"><TerminalSquare /> Tech Specs</TabsTrigger>
            </TabsList>
          </div>
          {project.url && (
            <TabsContent value="live" className="relative mt-0 min-h-0 flex-1 bg-muted/30">
              <iframe src={project.url} title={`Xem trực tiếp ${project.title}`} className="absolute inset-0 h-full w-full border-0" sandbox="allow-forms allow-modals allow-popups allow-same-origin allow-scripts" />
            </TabsContent>
          )}
          <TabsContent value="specs" className="mt-0 min-h-0 flex-1 overflow-y-auto p-6 md:p-10">
            <div className="mx-auto max-w-4xl">
              <p className="font-mono text-xs uppercase text-primary">Thông tin kỹ thuật / {pad(i)}</p>
              <h3 className="mt-4 text-3xl font-bold md:text-5xl">{project.title}</h3>
              <p className="mt-5 max-w-2xl leading-7 text-muted-foreground">{project.description}</p>
              <div className="mt-10 grid border-l border-t border-border sm:grid-cols-2">
                {project.specs.map((s) => (
                  <div key={s.label} className="border-b border-r border-border p-5 md:p-6">
                    <p className="font-mono text-[0.65rem] uppercase text-primary">{s.label}</p>
                    <p className="mt-3 text-sm leading-6">{s.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-2">{project.tags.map((t) => <span key={t} className="border border-border bg-card px-3 py-2 font-mono text-xs">{t}</span>)}</div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
