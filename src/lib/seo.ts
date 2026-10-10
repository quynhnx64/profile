/**
 * SEO / GEO — nguồn sự thật cho metadata, Open Graph, JSON-LD.
 * Đặt VITE_SITE_URL (vd. https://your-domain.com) khi deploy để canonical & OG tuyệt đối.
 */

const envUrl =
  (typeof import.meta !== "undefined" && import.meta.env?.["VITE_SITE_URL"]) ||
  process.env["VITE_SITE_URL"] ||
  process.env["SITE_URL"] ||
  "";

export const siteSeo = {
  /** Origin không có trailing slash. Trống = relative (canonical bỏ qua nếu thiếu). */
  siteUrl: String(envUrl).replace(/\/$/, ""),
  name: "Nguyễn Xuân Quỳnh",
  givenName: "Xuân Quỳnh",
  familyName: "Nguyễn",
  jobTitle: "Web & Backend Developer",
  title: "Nguyễn Xuân Quỳnh — Web & Backend Developer",
  titleTemplate: "%s | Nguyễn Xuân Quỳnh",
  description:
    "Portfolio Nguyễn Xuân Quỳnh — Web & Backend Developer tại Dĩ An, TP.HCM. Chuyên Next.js, React, Directus API, WebSocket realtime, multi-tenant SaaS. Dự án: SOC API Platform, uGOLD, Webtudong, Chat E2EE.",
  shortDescription:
    "Web apps và API backend cho sản phẩm thực tế — Directus, Next.js, game realtime, white-label SaaS.",
  keywords: [
    "Nguyễn Xuân Quỳnh",
    "Nguyen Xuan Quynh",
    "Web Developer",
    "Backend Developer",
    "Full-stack Developer",
    "Next.js",
    "React",
    "TypeScript",
    "Directus",
    "Directus Extensions",
    "REST API",
    "WebSocket",
    "Realtime",
    "Multi-tenant",
    "White-label",
    "SaaS",
    "Phaser 3",
    "uGOLD",
    "Webtudong",
    "SOC API",
    "Portfolio developer Việt Nam",
    "Lập trình viên Dĩ An",
    "Lập trình viên TP.HCM",
    "FPT Polytechnic",
  ],
  email: "quynhnx64@gmail.com",
  phone: "+84349056653",
  locale: "vi_VN",
  language: "vi",
  themeColor: "#07110f",
  /** Dĩ An, Bình Dương / khu vực TP.HCM */
  geo: {
    region: "VN-SG",
    placename: "Dĩ An, TP. Hồ Chí Minh",
    position: "10.906;106.809",
    icbm: "10.906, 106.809",
  },
  images: {
    faviconSvg: "/favicon.svg",
    faviconIco: "/favicon.ico",
    appleTouch: "/apple-touch-icon.png",
    icon192: "/icon-192.png",
    icon512: "/icon-512.png",
    og: "/og-image.png",
    avatar: "/avatar.jpg",
  },
  sameAs: ["https://github.com/quynhnx64"] as string[],
  twitterHandle: "",
} as const;

export function absoluteUrl(path = "/"): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (!siteSeo.siteUrl) return p;
  return `${siteSeo.siteUrl}${p}`;
}

export type PageSeoInput = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  /** Open Graph type — portfolio dùng website; JSON-LD vẫn là ProfilePage. */
  type?: "website" | "profile";
  noIndex?: boolean;
  keywords?: string[];
  /** Gắn JSON-LD Person (mặc định true trừ khi noIndex). */
  jsonLd?: boolean;
};

/** Meta + link cho một trang công khai (hoặc noindex). */
export function buildPageHead(input: PageSeoInput = {}) {
  const title = input.title ?? siteSeo.title;
  const description = input.description ?? siteSeo.description;
  const path = input.path ?? "/";
  const imagePath = input.image ?? siteSeo.images.og;
  const imageUrl = absoluteUrl(imagePath);
  const pageUrl = absoluteUrl(path);
  const keywords = (input.keywords ?? [...siteSeo.keywords]).join(", ");
  const robots = input.noIndex
    ? "noindex, nofollow"
    : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

  const meta: Record<string, unknown>[] = [
    { title },
    { name: "description", content: description },
    { name: "keywords", content: keywords },
    { name: "author", content: siteSeo.name },
    { name: "creator", content: siteSeo.name },
    { name: "publisher", content: siteSeo.name },
    { name: "robots", content: robots },
    { name: "googlebot", content: robots },
    { name: "theme-color", content: siteSeo.themeColor },
    { name: "color-scheme", content: "dark" },
    { name: "application-name", content: siteSeo.name },
    { name: "apple-mobile-web-app-title", content: siteSeo.name },
    { name: "format-detection", content: "telephone=no" },
    // GEO / local
    { name: "geo.region", content: siteSeo.geo.region },
    { name: "geo.placename", content: siteSeo.geo.placename },
    { name: "geo.position", content: siteSeo.geo.position },
    { name: "ICBM", content: siteSeo.geo.icbm },
    // Open Graph
    { property: "og:locale", content: siteSeo.locale },
    { property: "og:type", content: input.type ?? "website" },
    { property: "og:site_name", content: siteSeo.name },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: imageUrl },
    { property: "og:image:alt", content: `${siteSeo.name} — ${siteSeo.jobTitle}` },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    // Twitter / X
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: imageUrl },
    { name: "twitter:image:alt", content: `${siteSeo.name} — ${siteSeo.jobTitle}` },
  ];

  if (pageUrl.startsWith("http")) {
    meta.push({ property: "og:url", content: pageUrl });
  }

  if (input.jsonLd !== false && !input.noIndex) {
    meta.push({ "script:ld+json": buildPersonJsonLd() as Record<string, unknown> });
  }

  const links: Record<string, string>[] = [
    { rel: "icon", href: siteSeo.images.faviconSvg, type: "image/svg+xml" },
    { rel: "icon", href: siteSeo.images.faviconIco, type: "image/x-icon", sizes: "any" },
    { rel: "apple-touch-icon", href: siteSeo.images.appleTouch, sizes: "180x180" },
    { rel: "manifest", href: "/site.webmanifest" },
  ];

  if (pageUrl.startsWith("http")) {
    links.push({ rel: "canonical", href: pageUrl });
  }

  return {
    meta: meta as Array<{ title?: string; name?: string; property?: string; content?: string; "script:ld+json"?: Record<string, unknown> }>,
    links: links as Array<{ rel: string; href: string; type?: string; sizes?: string }>,
    title,
    description,
    pageUrl,
    imageUrl,
  };
}

/** JSON-LD Person + ProfilePage — hỗ trợ SEO và GEO (AI citing). */
export function buildPersonJsonLd() {
  const url = absoluteUrl("/");
  const personId = url.startsWith("http") ? `${url}#person` : "#person";
  const pageId = url.startsWith("http") ? `${url}#webpage` : "#webpage";

  const person = {
    "@type": "Person",
    "@id": personId,
    name: siteSeo.name,
    givenName: siteSeo.givenName,
    familyName: siteSeo.familyName,
    alternateName: ["Nguyen Xuan Quynh", "quynhnx64"],
    jobTitle: siteSeo.jobTitle,
    description: siteSeo.description,
    url: url.startsWith("http") ? url : undefined,
    email: `mailto:${siteSeo.email}`,
    telephone: siteSeo.phone,
    image: absoluteUrl(siteSeo.images.avatar),
    sameAs: [...siteSeo.sameAs],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dĩ An",
      addressRegion: "TP. Hồ Chí Minh",
      addressCountry: "VN",
    },
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "FPT Polytechnic",
    },
    knowsAbout: [
      "Next.js",
      "React",
      "TypeScript",
      "Directus",
      "REST API",
      "WebSocket",
      "Multi-tenant SaaS",
      "Phaser 3",
      "PostgreSQL",
    ],
    knowsLanguage: ["vi", "en"],
  };

  const profilePage = {
    "@type": "ProfilePage",
    "@id": pageId,
    url: url.startsWith("http") ? url : undefined,
    name: siteSeo.title,
    description: siteSeo.description,
    inLanguage: siteSeo.language,
    isPartOf: {
      "@type": "WebSite",
      "@id": url.startsWith("http") ? `${url}#website` : "#website",
      name: siteSeo.name,
      url: url.startsWith("http") ? url : undefined,
      inLanguage: siteSeo.language,
      publisher: { "@id": personId },
    },
    about: { "@id": personId },
    mainEntity: { "@id": personId },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: absoluteUrl(siteSeo.images.og),
    },
  };

  return {
    "@context": "https://schema.org",
    "@graph": [person, profilePage],
  };
}
