"use client";

import { useActionState } from "react";
import { signUp, type AuthResult } from "@/app/auth/actions";
import PasswordInput from "@/components/PasswordInput";
import LogoMark from "@/components/LogoMark";

const features = [
  { icon: "🎯", title: "Line-by-line traces", desc: "Watch the algorithm execute step by step against the highlighted code." },
  { icon: "🧩", title: "Multiple approaches", desc: "Compare brute force against optimized single-pass solutions." },
  { icon: "🎨", title: "Live visualization", desc: "See pointers, counters, and state update as you play." },
];

export default function SignupPage() {
  const [state, formAction, pending] = useActionState<AuthResult, FormData>(signUp, undefined);

  return (
    <main className="flex min-h-screen items-center justify-center px-4 sm:px-6">
      <div className="pointer-events-none absolute -top-40 right-1/4 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 left-1/4 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[120px]" />

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
              Join <span className="text-accent">CodeTrace</span>
            </h2>
            <p className="mt-1 text-sm text-text-muted">Create an account and start exploring.</p>

            {state?.error && (
              <p className="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 text-sm text-rose-400">{state.error}</p>
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
                  <PasswordInput name="password" autoComplete="new-password" required minLength={8} />
                </div>
              </label>
              <button type="submit" disabled={pending}
                className="w-full py-3.5 text-base font-bold rounded-xl bg-accent hover:bg-accent-strong text-surface transition-all duration-300 hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100">
                {pending ? "Creating account…" : "Create Account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-text-muted">
              Already a user? <a className="font-semibold text-accent hover:underline transition-colors" href="/login">Sign in</a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
