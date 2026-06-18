import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { RoleProvider } from "@/lib/mock";

export const Route = createFileRoute("/app")({
  component: () => (
    <RoleProvider>
      <AppShell />
    </RoleProvider>
  ),
});