"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { login, type AuthResult } from "@/app/auth/actions";
import PasswordInput from "@/components/PasswordInput";
import LogoMark from "@/components/LogoMark";

const googleErrors: Record<string, string> = {
  google_unavailable: "Google sign-in is not configured yet. Use username & password for now.",
  google_failed: "Google sign-in failed. Please try again.",
};

const features = [
  { icon: "🎯", title: "Line-by-line traces", desc: "Watch the algorithm execute step by step against the highlighted code." },
  { icon: "🧩", title: "Multiple approaches", desc: "Compare brute force against optimized single-pass solutions." },
  { icon: "🎨", title: "Live visualization", desc: "See pointers, counters, and state update as you play." },
];

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const [state, formAction, pending] = useActionState<AuthResult, FormData>(login, undefined);
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");
  const error = state?.error ?? ((urlError && googleErrors[urlError]) || null);

  return (
    <main className="flex min-h-screen items-center justify-center px-4 sm:px-6">
      <div className="pointer-events-none absolute -top-40 left-1/4 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 right-1/4 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[120px]" />

      <div className="relative z-10 flex w-full max-w-4xl overflow-hidden rounded-2xl border border-border bg-surface-raised/80 backdrop-blur-xl">
        {/* Left side — branding */}
        <div className="hidden w-1/2 flex-col justify-between p-10 lg:flex">
          <div>
            <LogoMark size="md" className="mb-6" />
            <h1 className="text-3xl font-extrabold text-text">
              Code<span className="text-accent">Trace</span>
            </h1>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-text-muted">
              See algorithms run line by line, with the code on one side and a live visualization on the other.
            </p>
          </div>
          <div className="mt-10 space-y-5">
            {features.map((f) => (
              <div key={f.title} className="flex items-start gap-3">
                <span className="mt-0.5 text-lg">{f.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-text">{f.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-text-muted">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side — form */}
        <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
          <div className="w-full max-w-sm">
            <h2 className="text-2xl font-extrabold text-text">
              Welcome <span className="text-accent">Back</span>
            </h2>
            <p className="mt-1 text-sm text-text-muted">Sign in to start visualizing.</p>

            {error && (
              <p className="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 text-sm text-rose-400">{error}</p>
            )}

            <form action={formAction} className="mt-6 space-y-5">
              <label className="block">
                <span className="text-sm font-medium text-text-muted">Username</span>
                <input name="username" autoComplete="username" required
                  className="mt-2 w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text outline-none transition-all duration-200 focus:border-accent/40 focus:shadow-[0_0_15px_rgba(52,211,153,0.1)]" />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-text-muted">Password</span>
                <div className="mt-2">
                  <PasswordInput name="password" autoComplete="current-password" required />
                </div>
              </label>
              <button type="submit" disabled={pending}
                className="w-full py-3.5 text-base font-bold rounded-xl bg-accent hover:bg-accent-strong text-surface transition-all duration-300 hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100">
                {pending ? "Signing in…" : "Sign In"}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 pt-1">
                <div className="h-px flex-1 border-border-base" />
                <span className="text-xs uppercase tracking-[0.2em] text-text-dim">or</span>
                <div className="h-px flex-1 border-border-base" />
              </div>

              {/* Google */}
              <a
                href="/api/auth/google"
                className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-border px-4 text-sm font-semibold text-text transition-colors duration-200 hover:border-accent/30 hover:text-accent"
              >
                <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4">
                  <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.3-1.5 3.9-5.4 3.9-3.2 0-5.9-2.7-5.9-6s2.7-6 5.9-6c1.8 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.6 14.6 2.7 12 2.7 6.9 2.7 2.8 6.8 2.8 12S6.9 21.3 12 21.3c6.1 0 9.1-4.3 9.1-6.5 0-.4 0-.8-.1-1.1H12Z" />
                  <path fill="#34A853" d="M2.8 7.3l3.2 2.3C6.8 7.9 9.1 6 12 6c1.8 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.6 14.6 2.7 12 2.7c-3.6 0-6.8 2.1-8.3 4.6Z" />
                  <path fill="#FBBC05" d="M12 21.3c2.5 0 4.7-.8 6.3-2.3l-2.9-2.4c-.8.6-1.9 1.1-3.4 1.1-3.9 0-5.1-2.6-5.4-3.8l-3.2 2.4c1.5 2.9 4.5 5 8.6 5Z" />
                  <path fill="#4285F4" d="M21.1 13.7c.1-.3.2-.8.2-1.3s-.1-1-.2-1.3H12v3.9h5.4c-.3 1.2-1.2 2.2-2 2.8l2.9 2.4c1.7-1.6 2.8-3.9 2.8-6.5Z" />
                </svg>
                Continue with Google
              </a>
            </form>

            <p className="mt-6 text-center text-sm text-text-muted">
              No account? <a className="font-semibold text-accent hover:underline transition-colors" href="/signup">Create one</a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
