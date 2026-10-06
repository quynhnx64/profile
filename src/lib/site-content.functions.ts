import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
import { normalizeContent, defaultContent } from "./site-content";

export const getSiteContent = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
    const sb = createClient(process.env["SUPABASE_URL"]!, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });
    const { data, error } = await sb.from("site_content").select("data").eq("id", 1).maybeSingle();
    if (error) throw error;
    return normalizeContent(data?.data);
  } catch (e) {
    console.error("getSiteContent failed", e);
    return defaultContent;
  }
});

export const siteContentQuery = queryOptions({
  queryKey: ["site-content"],
  queryFn: () => getSiteContent(),
});
