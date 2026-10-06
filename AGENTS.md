<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the public site as a single scrolling portfolio route; project details open in an in-page review dialog because the requested experience is intentionally one-page.
- All page copy and lists live in one JSON document (`site_content` row id=1) typed by `SiteContent` in `src/lib/site-content.ts`, merged over `defaultContent`, so the owner can edit everything from `/edit` without code changes.
- Icons are stored as string names resolved through `iconMap`, because JSON content cannot hold components.
- `/edit` is client-only and writes directly via the browser client; RLS (`has_role(admin)`) is the write boundary, and the first registered user becomes admin via trigger.
