import { NovelPage } from "@/components/novel/NovelPage";

/**
 * Root page — "My Life as a Novel".
 * The previous toggle-based SiteShell views remain in components/professional
 * and components/artistic; the novel layer supersedes them.
 */
export default function Page() {
  return <NovelPage />;
}
