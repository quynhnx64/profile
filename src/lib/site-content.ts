import {
  Blocks, Bot, Braces, Cloud, Code2, Database, Globe2, Layers3, LockKeyhole, Network,
  Rocket, ServerCog, ShieldCheck, Smartphone, Sparkles, TerminalSquare, Wrench, Workflow,
  type LucideIcon,
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  Blocks, Bot, Braces, Cloud, Code2, Database, Globe2, Layers3, LockKeyhole, Network,
  Rocket, ServerCog, ShieldCheck, Smartphone, Sparkles, TerminalSquare, Wrench, Workflow,
};
export const iconNames = Object.keys(iconMap);
export const getIcon = (name?: string): LucideIcon => (name && iconMap[name]) || Sparkles;

export type Spec = { label: string; value: string };
export type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  result: string;
  /** Vai trò ngắn hiển thị trên card */
  role: string;
  tags: string[];
  url?: string | undefined;
  displayUrl: string;
  icon: string;
  specs: Spec[];
};
export type SiteContent = {
  profile: {
    nameLine1: string;
    nameLine2: string;
    role: string;
    status: string;
    intro: string;
    email: string;
    phone: string;
    location: string;
    /** Để trống nếu chưa có — UI sẽ ẩn link */
    github: string;
    linkedin: string;
  };
  stats: { value: string; label: string }[];
  capabilities: { icon: string; title: string; text: string }[];
  projects: Project[];
  process: { title: string; text: string }[];
  techGroups: { name: string; icon: string; items: { name: string; note: string }[] }[];
  experience: { period: string; company: string; role: string; bullets: string[] }[];
  education: { school: string; major: string; period: string; note: string };
  certificates: string[];
  contact: { title: string; text: string };
};

export const defaultContent: SiteContent = {
  profile: {
    nameLine1: "Nguyễn Xuân",
    nameLine2: "Quỳnh.",
    role: "Web & Backend Developer",
    status: "Sẵn sàng cho cơ hội mới",
    intro:
      "Tôi xây giao diện web và API backend cho sản phẩm thực tế — từ nền tảng Directus, game realtime đến hệ thống white-label multi-tenant.",
    email: "quynhnx64@gmail.com",
    phone: "0349 056 653",
    location: "Dĩ An, TP. Hồ Chí Minh",
    github: "https://github.com/quynhnx64",
    linkedin: "",
  },
  stats: [
    { value: "20+", label: "Dự án đã tham gia" },
    { value: "3", label: "Dòng sản phẩm nổi bật · API · Game · SaaS" },
    { value: "Full-cycle", label: "Từ yêu cầu đến go-live & vận hành" },
  ],
  capabilities: [
    {
      icon: "Code2",
      title: "Web applications",
      text: "Phát triển ứng dụng Next.js / React: UI rõ ràng, tích hợp API, tối ưu trải nghiệm trên nhiều thiết bị.",
    },
    {
      icon: "ServerCog",
      title: "Directus API platform",
      text: "Xây endpoint, hook và operation trên Directus — banking ledger, auth, wallet, domain, OCR và automation Flows.",
    },
    {
      icon: "Network",
      title: "Realtime systems",
      text: "Hệ thống thời gian thực với WebSocket: chat E2EE, đồng bộ game, server time và session ổn định.",
    },
    {
      icon: "Layers3",
      title: "Multi-tenant / white-label",
      text: "Nền tảng Webtudong: Hub, SSO, theme WYSIWYG và routing theo hostname cho website cá nhân / doanh nghiệp.",
    },
  ],
  projects: [
    {
      id: "soc-api",
      title: "SOC API Platform",
      category: "Backend · Directus",
      description:
        "Nền tảng API nội bộ trên Directus Extensions: ingest giao dịch ngân hàng, sổ cái, hoa hồng, subscription, ví crypto, domain WHOIS/RDAP, OCR CCCD và social auth.",
      result: "Một hệ API event-driven phục vụ nhiều sản phẩm SOC từ thanh toán đến Web3.",
      role: "Owned · Backend / Directus Extensions",
      tags: ["Directus", "REST", "Redis", "WebSocket", "OpenAPI"],
      url: "https://api-hub.socjsc.com",
      displayUrl: "api-hub.socjsc.com",
      icon: "ServerCog",
      specs: [
        { label: "Kiến trúc", value: "Endpoint · Hook · Operation · OpenAPI / Bruno" },
        { label: "Nghiệp vụ", value: "Bank ingest · Journal · Commission · Wallet · Domain · OCR" },
        { label: "Bảo mật", value: "Bearer · HMAC webhook · INTERNAL_SECRET · OAuth / OIDC · Rate limit" },
        { label: "Vai trò", value: "Owned · Thiết kế, triển khai và bảo trì extensions" },
      ],
    },
    {
      id: "ugold",
      title: "uGOLD",
      category: "Web game · Realtime",
      description:
        "Client web game đào vàng (Gold Miner): nhiều chế độ mỏ, shop, quest, economy — bridge React ↔ Phaser 3, tích hợp Directus và WebSocket.",
      result: "Chơi ngay trên trình duyệt, đồng bộ inventory / giao dịch realtime.",
      role: "Built · Game Client (Next.js + Phaser)",
      tags: ["Next.js", "Phaser 3", "Directus", "WebSocket"],
      url: "https://play.ugold.io",
      displayUrl: "play.ugold.io",
      icon: "Sparkles",
      specs: [
        { label: "Nền tảng", value: "Next.js · React · Phaser 3 · Arcade physics" },
        { label: "Gameplay", value: "Mỏ cá nhân / công cộng / thuê · Shop · Quest · Items" },
        { label: "Tích hợp", value: "Directus SDK · API proxy · WebSocket server time" },
        { label: "Vai trò", value: "Built · Game client & economy loops" },
      ],
    },
    {
      id: "webtudong",
      title: "Webtudong",
      category: "SaaS · White-label",
      description:
        "UI nền tảng no-code / white-label: tạo website theo hostname, Hub quản lý, Admin Office, hệ theme độc lập với editor WYSIWYG và affiliate VIP.",
      result: "Multi-tenant: một platform, nhiều theme, deploy theo domain / subdomain.",
      role: "Built · Platform UI & theme system",
      tags: ["Next.js", "Directus", "SSO", "Multi-tenant"],
      url: "https://webtudong.com",
      displayUrl: "webtudong.com",
      icon: "Layers3",
      specs: [
        { label: "Kiến trúc", value: "Platform · Theme apps · Gateway (Host → card)" },
        { label: "Sản phẩm", value: "Hub · Office · Auth SSO · Editor /view · Affiliate" },
        { label: "Công nghệ", value: "Next.js App Router · Tailwind · Directus · Cloudflare" },
        { label: "Vai trò", value: "Built · UI client platform & theme shells" },
      ],
    },
    {
      id: "e2ee-chat",
      title: "Web Chat E2EE",
      category: "Realtime · Bảo mật",
      description:
        "Client chat doanh nghiệp dựa trên Matrix / Element: nhắn tin thời gian thực, mã hóa đầu cuối, ưu tiên quyền riêng tư và ổn định vận hành.",
      result: "Tin nhắn chỉ người gửi và người nhận đọc được.",
      role: "Integrated · Triển khai & tùy biến client",
      tags: ["E2EE", "Matrix", "Realtime", "WebSocket"],
      url: "https://chat.socjsc.com",
      displayUrl: "chat.socjsc.com",
      icon: "LockKeyhole",
      specs: [
        { label: "Kiến trúc", value: "Element Web · Matrix JS SDK · Realtime sync" },
        { label: "Bảo mật", value: "End-to-end encryption · Session isolation" },
        { label: "Vận hành", value: "Custom branding · Deploy & hỗ trợ go-live" },
        { label: "Vai trò", value: "Integrated · Triển khai kỹ thuật · Phối hợp phát triển" },
      ],
    },
    {
      id: "tv-phap-luat",
      title: "TV Pháp Luật",
      category: "Dự án bảo mật · Nội bộ",
      description:
        "Nền tảng tin tức, livestream và tư vấn pháp luật tích hợp AI — backend REST và phối hợp triển khai.",
      result: "Gom nội dung pháp luật và tư vấn AI trên một nền tảng hợp nhất.",
      role: "Backend · Triển khai",
      tags: ["AI", "REST API", "Backend", "Nội bộ"],
      displayUrl: "Dự án bảo mật · không công khai link",
      icon: "Bot",
      specs: [
        { label: "Sản phẩm", value: "Tin tức · Livestream · Tư vấn pháp luật AI" },
        { label: "Công nghệ", value: "Backend · REST API · Tích hợp AI" },
        { label: "Truy cập", value: "Nội bộ / bảo mật — chưa gắn link công khai" },
        { label: "Vai trò", value: "Backend · Phân tích nghiệp vụ · Triển khai" },
      ],
    },
    {
      id: "lifewave",
      title: "LifeWave",
      category: "Dự án bảo mật · Nội bộ",
      description:
        "Hệ thống quản lý và bán sản phẩm trong hệ sinh thái Nụ Cười Việt — tối ưu giao diện và tích hợp API.",
      result: "Giảm khoảng 10% thời gian thao tác sau khi tối ưu UX.",
      role: "Frontend · Triển khai",
      tags: ["Frontend", "Commerce", "API", "Nội bộ"],
      displayUrl: "Dự án bảo mật · không công khai link",
      icon: "Blocks",
      specs: [
        { label: "Sản phẩm", value: "Quản lý sản phẩm · Đơn hàng · Vận hành" },
        { label: "Công nghệ", value: "Frontend · Web · Tích hợp API" },
        { label: "Truy cập", value: "Nội bộ / bảo mật — chưa gắn link công khai" },
        { label: "Vai trò", value: "Frontend · Tối ưu UX · Triển khai" },
      ],
    },
  ],
  process: [
    { title: "Khám phá", text: "Làm rõ mục tiêu sản phẩm, người dùng và ràng buộc kỹ thuật Web / API." },
    { title: "Thiết kế", text: "Đề xuất kiến trúc, hợp đồng API, luồng dữ liệu và kế hoạch triển khai." },
    { title: "Triển khai", text: "Phát triển frontend & backend, kiểm thử, bàn giao từng hạng mục." },
    { title: "Vận hành", text: "Go-live, giám sát, xử lý sự cố và cải tiến liên tục." },
  ],
  techGroups: [
    {
      name: "Frontend",
      icon: "Globe2",
      items: [
        { name: "React / Next.js", note: "App Router & Pages Router" },
        { name: "TypeScript", note: "Type-safe UI & domain logic" },
        { name: "Tailwind · Radix / shadcn", note: "Design system nhanh, nhất quán" },
        { name: "Phaser 3", note: "Web game 2D · React bridge" },
      ],
    },
    {
      name: "Backend & API",
      icon: "ServerCog",
      items: [
        { name: "Directus Extensions", note: "Endpoint · Hook · Operation" },
        { name: "REST · OpenAPI · Bruno", note: "Contract & kiểm thử API" },
        { name: "WebSocket · Webhook", note: "Realtime & event ingest" },
        { name: "OAuth / OIDC / SSO", note: "Social login · JWT Directus" },
        { name: "Redis", note: "Cache · rate limit hỗ trợ" },
      ],
    },
    {
      name: "Dữ liệu",
      icon: "Database",
      items: [
        { name: "Directus CMS", note: "Collections · Flows · multi-tenant cards" },
        { name: "PostgreSQL / MySQL", note: "Dữ liệu nghiệp vụ" },
        { name: "SQLite", note: "App nhẹ · local tooling" },
      ],
    },
    {
      name: "Tích hợp",
      icon: "Cloud",
      items: [
        { name: "Firebase FCM", note: "Push notification" },
        { name: "Cloudflare", note: "Domain · edge routing" },
        { name: "Email · Telegram", note: "Automation & ops alerts" },
        { name: "Payment / bank", note: "Đối soát CK · journal" },
      ],
    },
    {
      name: "Web3",
      icon: "ShieldCheck",
      items: [
        { name: "ethers.js", note: "EVM wallets & transactions" },
        { name: "Solana web3.js", note: "On-chain ops" },
        { name: "On-chain wallets", note: "Transfer · deploy · swap verify" },
      ],
    },
    {
      name: "Công cụ",
      icon: "Wrench",
      items: [
        { name: "Git · Git Flow", note: "Version control & review" },
        { name: "Figma", note: "UI collaboration" },
        { name: "Docker · Vercel · Coolify", note: "Build & deploy" },
      ],
    },
  ],
  experience: [
    {
      period: "10/2024 – 05/2026",
      company: "Công ty Cổ phần SOC",
      role: "Web & Backend Developer · Triển khai kỹ thuật",
      bullets: [
        "Xây và vận hành nền tảng Directus Extensions (banking ledger, commission, wallet/crypto, domain, OCR, auth) phục vụ nhiều sản phẩm nội bộ.",
        "Phát triển client game uGOLD (Next.js + Phaser 3 + Directus + WebSocket) và UI nền tảng white-label Webtudong (Hub, SSO, theme WYSIWYG).",
        "Tham gia triển khai chat E2EE, TV Pháp Luật (backend/API) và tối ưu UX LifeWave (~10% thời gian thao tác); phối hợp hơn 20 dự án từ yêu cầu đến go-live.",
      ],
    },
  ],
  education: {
    school: "FPT Polytechnic",
    major: "Lập trình Mobile",
    period: "2022 – 2024",
    note: "Tốt nghiệp loại Xuất sắc · GPA 3.7",
  },
  certificates: ["JavaScript — Udemy", "Academic Preparatory English"],
  contact: {
    title: "Cùng xây dựng sản phẩm tiếp theo.",
    text: "Sẵn sàng trao đổi về Web, API backend, realtime và triển khai sản phẩm end-to-end.",
  },
};

/** Merge stored JSON over defaults so missing keys never break the page. */
export function normalizeContent(raw: unknown): SiteContent {
  if (!raw || typeof raw !== "object") return defaultContent;
  const r = raw as Partial<SiteContent>;
  const projects = Array.isArray(r.projects)
    ? r.projects.map((p) => {
        const roleFromSpec = p.specs?.find((s) => s.label === "Vai trò")?.value;
        return {
          ...p,
          role: p.role?.trim() || roleFromSpec || "Contributor",
          tags: Array.isArray(p.tags) ? p.tags : [],
          specs: Array.isArray(p.specs) ? p.specs : [],
        };
      })
    : defaultContent.projects;
  return {
    ...defaultContent,
    ...r,
    profile: { ...defaultContent.profile, ...(r.profile ?? {}) },
    stats: Array.isArray(r.stats) ? r.stats : defaultContent.stats,
    capabilities: Array.isArray(r.capabilities) ? r.capabilities : defaultContent.capabilities,
    projects,
    process: Array.isArray(r.process) ? r.process : defaultContent.process,
    techGroups: Array.isArray(r.techGroups) ? r.techGroups : defaultContent.techGroups,
    experience: Array.isArray(r.experience) ? r.experience : defaultContent.experience,
    certificates: Array.isArray(r.certificates) ? r.certificates : defaultContent.certificates,
    education: { ...defaultContent.education, ...(r.education ?? {}) },
    contact: { ...defaultContent.contact, ...(r.contact ?? {}) },
  };
}
