"use client";

import { useActionState } from "react";
import { logout } from "@/app/auth/actions";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const [, action, pending] = useActionState(logout, undefined);

  return (
    <form action={action}>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-lg border border-border px-3.5 py-2 text-sm font-semibold text-text-muted transition-all duration-200 hover:border-accent/30 hover:text-accent disabled:opacity-40"
      >
        <LogOut className="h-4 w-4" />
        {pending ? "Signing out…" : "Logout"}
      </button>
    </form>
  );
}
