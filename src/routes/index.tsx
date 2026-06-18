import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuth } from "@/store";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    const id = useAuth.getState().currentUserId;
    throw redirect({ to: id ? "/dashboard" : "/auth" });
  },
  component: () => null,
});
