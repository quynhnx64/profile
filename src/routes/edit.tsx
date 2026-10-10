import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import { ArrowDown, ArrowLeft, ArrowUp, LogOut, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/sonner";
import { defaultContent, iconNames, normalizeContent, type SiteContent } from "@/lib/site-content";

export const Route = createFileRoute("/edit")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Quản trị nội dung — Portfolio Nguyễn Xuân Quỳnh" },
      { name: "description", content: "Trang chỉnh sửa nội dung portfolio (nội bộ)." },
      { name: "robots", content: "noindex, nofollow" },
      { name: "googlebot", content: "noindex, nofollow" },
    ],
  }),
  component: EditPage,
});

function EditPage() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) { setIsAdmin(null); return; }
    supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle()
      .then(({ data }) => setIsAdmin(Boolean(data)));
  }, [user]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster />
      {user === undefined ? <p className="p-10 text-muted-foreground">Đang tải…</p>
        : !user ? <LoginForm />
        : isAdmin === null ? <p className="p-10 text-muted-foreground">Đang kiểm tra quyền…</p>
        : !isAdmin ? (
          <Centered>
            <h1 className="text-xl font-bold">Tài khoản không có quyền chỉnh sửa</h1>
            <p className="mt-2 text-sm text-muted-foreground">{user.email}</p>
            <Button className="mt-6" variant="outline" onClick={() => supabase.auth.signOut()}>Đăng xuất</Button>
          </Centered>
        ) : <Editor email={user.email ?? ""} />}
    </div>
  );
}

function Centered({ children }: { children: ReactNode }) {
  return <div className="grid min-h-screen place-items-center px-5"><div className="w-full max-w-sm border border-border bg-card p-7">{children}</div></div>;
}

function LoginForm() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setMsg("");
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMsg("Sai email hoặc mật khẩu.");
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/edit` } });
      setMsg(error ? error.message : "Đã gửi email xác nhận. Hãy mở email, bấm liên kết rồi quay lại đăng nhập.");
    }
    setBusy(false);
  };

  return (
    <Centered>
      <Link to="/" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"><ArrowLeft className="size-3" /> Về trang chủ</Link>
      <h1 className="mt-4 text-2xl font-bold">{mode === "in" ? "Đăng nhập quản trị" : "Tạo tài khoản quản trị"}</h1>
      <p className="mt-1 text-xs text-muted-foreground">Tài khoản đầu tiên được tạo sẽ là quản trị viên.</p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <div><Label htmlFor="em">Email</Label><Input id="em" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div><Label htmlFor="pw">Mật khẩu</Label><Input id="pw" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        {msg && <p className="text-sm text-primary">{msg}</p>}
        <Button className="w-full" disabled={busy}>{mode === "in" ? "Đăng nhập" : "Đăng ký"}</Button>
      </form>
      <button className="mt-4 text-xs text-muted-foreground hover:text-primary" onClick={() => setMode(mode === "in" ? "up" : "in")}>
        {mode === "in" ? "Chưa có tài khoản? Đăng ký" : "Đã có tài khoản? Đăng nhập"}
      </button>
    </Centered>
  );
}

/* ---------- Editor ---------- */

type Upd = (fn: (d: SiteContent) => void) => void;

function Editor({ email }: { email: string }) {
  const qc = useQueryClient();
  const [data, setData] = useState<SiteContent | null>(null);
  const [json, setJson] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("site_content").select("data").eq("id", 1).maybeSingle().then(({ data: row }) => {
      const c = normalizeContent(row?.data);
      setData(c); setJson(JSON.stringify(c, null, 2));
    });
  }, []);

  if (!data) return <p className="p-10 text-muted-foreground">Đang tải nội dung…</p>;

  const update: Upd = (fn) => setData((prev) => {
    const next = structuredClone(prev!); fn(next); setJson(JSON.stringify(next, null, 2)); return next;
  });

  const save = async (content: SiteContent) => {
    setSaving(true);
    const { error } = await supabase.from("site_content").upsert({ id: 1, data: content as never, updated_at: new Date().toISOString() });
    setSaving(false);
    if (error) { toast.error("Lưu thất bại: " + error.message); return; }
    qc.invalidateQueries({ queryKey: ["site-content"] });
    toast.success("Đã lưu — trang công khai đã cập nhật.");
  };

  const saveJson = () => {
    try { const c = normalizeContent(JSON.parse(json)); setData(c); save(c); }
    catch { toast.error("JSON không hợp lệ."); }
  };

  return (
    <div>
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-5">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-muted-foreground hover:text-primary"><ArrowLeft className="size-4" /></Link>
            <div><p className="text-sm font-semibold">Quản trị nội dung</p><p className="text-xs text-muted-foreground">{email}</p></div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => save(data)} disabled={saving}><Save /> {saving ? "Đang lưu…" : "Lưu thay đổi"}</Button>
            <Button size="icon" variant="outline" aria-label="Đăng xuất" onClick={() => supabase.auth.signOut()}><LogOut /></Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8">
        <Tabs defaultValue="profile">
          <TabsList className="h-auto flex-wrap justify-start rounded-none">
            {[["profile", "Giới thiệu"], ["stats", "Chỉ số"], ["capabilities", "Năng lực"], ["process", "Quy trình"], ["projects", "Dự án"], ["tech", "Công nghệ"], ["experience", "Kinh nghiệm"], ["contact", "Liên hệ"], ["json", "JSON"]].map(([v, l]) => (
              <TabsTrigger key={v} value={v ?? ""} className="rounded-none">{l}</TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="profile" className="mt-6 grid gap-4 md:grid-cols-2">
            {(Object.keys(defaultContent.profile) as (keyof SiteContent["profile"])[]).map((k) => (
              <Field key={k} label={profileLabels[k]} value={data.profile[k] ?? ""} multiline={k === "intro"} onChange={(v) => update((d) => { d.profile[k] = v; })} />
            ))}
          </TabsContent>

          <TabsContent value="stats" className="mt-6">
            <ListEditor items={data.stats} update={update} path={(d) => d.stats} empty={{ value: "", label: "" }}
              render={(it, set) => (<div className="grid gap-3 md:grid-cols-[10rem_1fr]"><Field label="Giá trị" value={it.value} onChange={(v) => set({ ...it, value: v })} /><Field label="Mô tả" value={it.label} onChange={(v) => set({ ...it, label: v })} /></div>)} />
          </TabsContent>

          <TabsContent value="capabilities" className="mt-6">
            <ListEditor items={data.capabilities} update={update} path={(d) => d.capabilities} empty={{ icon: "Sparkles", title: "", text: "" }}
              render={(it, set) => (<div className="grid gap-3 md:grid-cols-[10rem_1fr]"><IconSelect value={it.icon} onChange={(v) => set({ ...it, icon: v })} /><Field label="Tiêu đề" value={it.title} onChange={(v) => set({ ...it, title: v })} /><div className="md:col-span-2"><Field label="Mô tả" multiline value={it.text} onChange={(v) => set({ ...it, text: v })} /></div></div>)} />
          </TabsContent>

          <TabsContent value="process" className="mt-6">
            <ListEditor items={data.process} update={update} path={(d) => d.process} empty={{ title: "", text: "" }}
              render={(it, set) => (<div className="grid gap-3 md:grid-cols-[14rem_1fr]"><Field label="Bước" value={it.title} onChange={(v) => set({ ...it, title: v })} /><Field label="Mô tả" value={it.text} onChange={(v) => set({ ...it, text: v })} /></div>)} />
          </TabsContent>

          <TabsContent value="projects" className="mt-6">
            <ListEditor items={data.projects} update={update} path={(d) => d.projects}
              empty={{ id: `p-${Date.now()}`, title: "Dự án mới", category: "", description: "", result: "", role: "", tags: [], displayUrl: "", icon: "Sparkles", specs: [] }}
              title={(p) => p.title}
              render={(p, set) => (
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="Tên dự án" value={p.title} onChange={(v) => set({ ...p, title: v })} />
                  <Field label="Danh mục" value={p.category} onChange={(v) => set({ ...p, category: v })} />
                  <Field label="Link website (để trống nếu nội bộ)" value={p.url ?? ""} onChange={(v) => set({ ...p, url: v || undefined })} />
                  <Field label="Chữ hiển thị trên thanh địa chỉ" value={p.displayUrl} onChange={(v) => set({ ...p, displayUrl: v })} />
                  <div className="md:col-span-2"><Field label="Mô tả" multiline value={p.description} onChange={(v) => set({ ...p, description: v })} /></div>
                  <Field label="Kết quả nổi bật" value={p.result} onChange={(v) => set({ ...p, result: v })} />
                  <Field label="Vai trò (hiển thị trên card)" value={p.role ?? ""} onChange={(v) => set({ ...p, role: v })} />
                  <Field label="Thẻ (cách nhau bằng dấu phẩy)" value={p.tags.join(", ")} onChange={(v) => set({ ...p, tags: v.split(",").map((s) => s.trim()).filter(Boolean) })} />
                  <IconSelect value={p.icon} onChange={(v) => set({ ...p, icon: v })} />
                  <div className="md:col-span-2">
                    <Field label="Thông tin kỹ thuật (mỗi dòng: Nhãn | Nội dung)" multiline rows={5}
                      value={p.specs.map((s) => `${s.label} | ${s.value}`).join("\n")}
                      onChange={(v) => set({ ...p, specs: v.split("\n").filter((l) => l.trim()).map((l) => { const [label, ...rest] = l.split("|"); return { label: (label ?? "").trim(), value: rest.join("|").trim() }; }) })} />
                  </div>
                </div>
              )} />
          </TabsContent>

          <TabsContent value="tech" className="mt-6">
            <ListEditor items={data.techGroups} update={update} path={(d) => d.techGroups} empty={{ name: "Nhóm mới", icon: "Wrench", items: [] }} title={(g) => g.name}
              render={(g, set) => (
                <div className="grid gap-3 md:grid-cols-[1fr_10rem]">
                  <Field label="Tên nhóm" value={g.name} onChange={(v) => set({ ...g, name: v })} />
                  <IconSelect value={g.icon} onChange={(v) => set({ ...g, icon: v })} />
                  <div className="md:col-span-2">
                    <Field label="Công nghệ (mỗi dòng: Tên | Ghi chú)" multiline rows={5}
                      value={g.items.map((i) => (i.note ? `${i.name} | ${i.note}` : i.name)).join("\n")}
                      onChange={(v) => set({ ...g, items: v.split("\n").filter((l) => l.trim()).map((l) => { const [name, ...rest] = l.split("|"); return { name: (name ?? "").trim(), note: rest.join("|").trim() }; }) })} />
                  </div>
                </div>
              )} />
          </TabsContent>

          <TabsContent value="experience" className="mt-6 space-y-8">
            <ListEditor items={data.experience} update={update} path={(d) => d.experience} empty={{ period: "", company: "", role: "", bullets: [] }} title={(e) => e.role || e.company}
              render={(e, set) => (
                <div className="grid gap-3 md:grid-cols-3">
                  <Field label="Thời gian" value={e.period} onChange={(v) => set({ ...e, period: v })} />
                  <Field label="Công ty" value={e.company} onChange={(v) => set({ ...e, company: v })} />
                  <Field label="Vị trí" value={e.role} onChange={(v) => set({ ...e, role: v })} />
                  <div className="md:col-span-3"><Field label="Công việc (mỗi dòng một ý)" multiline rows={4} value={e.bullets.join("\n")} onChange={(v) => set({ ...e, bullets: v.split("\n").filter((l) => l.trim()) })} /></div>
                </div>
              )} />
            <div className="grid gap-3 border border-border p-5 md:grid-cols-2">
              <p className="font-semibold md:col-span-2">Học vấn</p>
              <Field label="Trường" value={data.education.school} onChange={(v) => update((d) => { d.education.school = v; })} />
              <Field label="Chuyên ngành" value={data.education.major} onChange={(v) => update((d) => { d.education.major = v; })} />
              <Field label="Thời gian" value={data.education.period} onChange={(v) => update((d) => { d.education.period = v; })} />
              <Field label="Ghi chú" value={data.education.note} onChange={(v) => update((d) => { d.education.note = v; })} />
            </div>
            <Field label="Chứng chỉ (mỗi dòng một chứng chỉ)" multiline value={data.certificates.join("\n")} onChange={(v) => update((d) => { d.certificates = v.split("\n").filter((l) => l.trim()); })} />
          </TabsContent>

          <TabsContent value="contact" className="mt-6 grid gap-4">
            <Field label="Tiêu đề" value={data.contact.title} onChange={(v) => update((d) => { d.contact.title = v; })} />
            <Field label="Lời nhắn" multiline value={data.contact.text} onChange={(v) => update((d) => { d.contact.text = v; })} />
            <p className="text-xs text-muted-foreground">Email, số điện thoại và địa chỉ chỉnh ở tab “Giới thiệu”.</p>
          </TabsContent>

          <TabsContent value="json" className="mt-6 space-y-3">
            <p className="text-sm text-muted-foreground">
              Toàn bộ nội dung trang ở dạng JSON. Nếu trang chủ vẫn hiện bản cũ từ Supabase, bấm <strong>Khôi phục mặc định</strong> rồi <strong>Lưu JSON</strong> để đồng bộ bản Web &amp; Backend mới.
            </p>
            <Textarea value={json} onChange={(e) => setJson(e.target.value)} rows={28} className="font-mono text-xs" />
            <div className="flex gap-2">
              <Button onClick={saveJson} disabled={saving}><Save /> Lưu JSON</Button>
              <Button variant="outline" onClick={() => { setData(structuredClone(defaultContent)); setJson(JSON.stringify(defaultContent, null, 2)); toast("Đã nạp nội dung mặc định (Web & Backend) — bấm Lưu JSON để áp dụng lên trang chủ."); }}>Khôi phục mặc định</Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

const profileLabels: Record<keyof SiteContent["profile"], string> = {
  nameLine1: "Tên (dòng 1)", nameLine2: "Tên (dòng 2)", role: "Vai trò", status: "Trạng thái",
  intro: "Lời giới thiệu", email: "Email", phone: "Số điện thoại", location: "Địa chỉ",
  github: "GitHub (URL — để trống để ẩn)", linkedin: "LinkedIn (URL — để trống để ẩn)",
};

function Field({ label, value, onChange, multiline, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean; rows?: number }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {multiline ? <Textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} /> : <Input value={value} onChange={(e) => onChange(e.target.value)} />}
    </label>
  );
}

function IconSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-muted-foreground">Biểu tượng</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="h-9 w-full border border-input bg-background px-2 text-sm">
        {iconNames.map((n) => <option key={n} value={n}>{n}</option>)}
      </select>
    </label>
  );
}

function ListEditor<T>({ items, update, path, empty, render, title }: {
  items: T[]; update: Upd; path: (d: SiteContent) => T[]; empty: T;
  render: (item: T, set: (v: T) => void) => ReactNode; title?: (item: T) => string;
}) {
  const mutate = (fn: (arr: T[]) => void) => update((d) => fn(path(d)));
  return (
    <div className="space-y-4">
      {items.map((it, i) => (
        <div key={i} className="border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-mono text-xs text-primary">#{i + 1} {title?.(it)}</p>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" disabled={i === 0} aria-label="Lên" onClick={() => mutate((a) => { const [x] = a.splice(i, 1); a.splice(i - 1, 0, x as T); })}><ArrowUp /></Button>
              <Button size="icon" variant="ghost" disabled={i === items.length - 1} aria-label="Xuống" onClick={() => mutate((a) => { const [x] = a.splice(i, 1); a.splice(i + 1, 0, x as T); })}><ArrowDown /></Button>
              <Button size="icon" variant="ghost" aria-label="Xóa" onClick={() => confirm("Xóa mục này?") && mutate((a) => { a.splice(i, 1); })}><Trash2 className="text-destructive" /></Button>
            </div>
          </div>
          {render(it, (v) => mutate((a) => { a[i] = v; }))}
        </div>
      ))}
      <Button variant="outline" onClick={() => mutate((a) => { a.push(structuredClone(empty)); })}><Plus /> Thêm mục</Button>
    </div>
  );
}
