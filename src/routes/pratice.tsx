import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/pratice")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Luyện động từ — Practice" },
      { name: "description", content: "Menu luyện ngữ pháp động từ tiếng Anh (nội bộ)." },
      { name: "robots", content: "noindex, nofollow" },
      { name: "googlebot", content: "noindex, nofollow" },
    ],
  }),
  component: () => <Outlet />,
});
