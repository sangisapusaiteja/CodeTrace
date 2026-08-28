import { NextResponse } from "next/server";
import { supabaseAdminRequest } from "@/lib/supabase-rest";
import { setSessionCookie } from "@/lib/auth-server";
import {
  exchangeCodeForProfile,
  getGoogleRedirectUri,
  isGoogleOAuthConfigured,
} from "@/lib/auth/google";

const STATE_COOKIE = "google_oauth_state";

interface UserRow {
  id: string;
  username: string;
}

function normalizeUsername(raw: string): string {
  return raw
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_]/g, "")
    .toLowerCase();
}

/** Derive a unique username from the Google profile's email/name. */
async function deriveUsername(
  profileEmail: string,
  profileName: string
): Promise<string> {
  const base =
    normalizeUsername((profileEmail || "").split("@")[0] || "") ||
    normalizeUsername(profileName) ||
    "tracer";

  let candidate = base;
  let suffix = 1;
  for (let i = 0; i < 20; i++) {
    const rows = await supabaseAdminRequest<UserRow[]>("users", {
      query: { select: "id", username: `eq.${candidate}`, limit: "1" },
    });
    if (!rows[0]) return candidate;
    candidate = `${base}${suffix++}`;
  }
  return `${base}${Date.now()}`;
}

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;

  if (!isGoogleOAuthConfigured()) {
    return NextResponse.redirect(`${origin}/login?error=google_unavailable`);
  }

  const params = new URL(request.url).searchParams;
  const code = params.get("code");
  const state = params.get("state");
  const expectedState = request.headers
    .get("cookie")
    ?.split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${STATE_COOKIE}=`))
    ?.split("=")[1];

  if (!code || !state || !expectedState || state !== expectedState) {
    return NextResponse.redirect(`${origin}/login?error=google_failed`);
  }

  try {
    const profile = await exchangeCodeForProfile(
      code,
      getGoogleRedirectUri(origin)
    );
    if (!profile.sub) {
      return NextResponse.redirect(`${origin}/login?error=google_failed`);
    }

    // Existing user? Just sign them in.
    const existing = await supabaseAdminRequest<
      { id: string; username: string }[]
    >("users", {
      query: {
        select: "id,username",
        google_id: `eq.${profile.sub}`,
        limit: "1",
      },
    });

    if (existing[0]) {
      await setSessionCookie({
        userId: existing[0].id,
        username: existing[0].username,
      });
      return NextResponse.redirect(origin + "/");
    }

    // First Google sign-in — create the shared user row.
    const username = await deriveUsername(
      profile.email ?? "",
      profile.name ?? ""
    );

    const created = await supabaseAdminRequest<UserRow[]>("users", {
      method: "POST",
      prefer: "return=representation",
      body: [
        {
          username,
          google_id: profile.sub,
          avatar_url: profile.picture ?? null,
          auth_provider: "google",
          elo: 1200,
          xp: 0,
          level: 1,
          wins: 0,
          losses: 0,
          current_streak: 0,
          best_streak: 0,
          problems_solved: 0,
          avg_solve_seconds: 0,
        },
      ],
    });

    if (!created[0]) {
      return NextResponse.redirect(`${origin}/login?error=google_failed`);
    }

    await setSessionCookie({
      userId: created[0].id,
      username: created[0].username,
    });
    return NextResponse.redirect(origin + "/");
  } catch {
    return NextResponse.redirect(`${origin}/login?error=google_failed`);
  }
}
