import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAuth } from "@/store";
import { AppShell } from "@/components/layout/AppShell";
import { useApplyTheme } from "@/hooks/use-theme";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    if (!useAuth.getState().currentUserId) {
      throw redirect({ to: "/auth" });
    }
  },
  component: Layout,
});

function Layout() {
  useApplyTheme();
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
