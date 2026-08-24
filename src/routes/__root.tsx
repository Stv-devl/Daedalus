import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import type { supabase } from "@/lib/supabase";

/**
 * Composition root: the router context carries the instances created in
 * `src/main.tsx`. Everything below this file reaches data through a repository,
 * never through the client directly (`02-architecture.md`).
 */
export interface RouterContext {
  queryClient: QueryClient;
  supabase: typeof supabase;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <main>
        <Outlet />
      </main>
    </div>
  );
}
