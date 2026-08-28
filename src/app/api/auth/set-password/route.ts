import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getSession } from "@/lib/auth-server";
import { supabaseAdminRequest } from "@/lib/supabase-rest";

/**
 * Password management (same API as Interview Handbook / Code Battle).
 * GET  → identity + hasPassword (Google accounts may have none).
 * POST → { newPassword }                     creates a password (when none exists)
 *        { currentPassword, newPassword }    changes an existing password.
 */

interface UserRow {
  username: string;
  password_hash: string | null;
  google_id: string | null;
  avatar_url: string | null;
}

async function loadUser(userId: string): Promise<UserRow | null> {
  const rows = await supabaseAdminRequest<UserRow[]>("users", {
    query: {
      select: "username,password_hash,google_id,avatar_url",
      id: `eq.${userId}`,
      limit: "1",
    },
  });
  return rows[0] ?? null;
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }

  let user: UserRow | null;
  try {
    user = await loadUser(session.userId);
  } catch {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }
  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  return NextResponse.json({
    username: user.username,
    avatarUrl: user.avatar_url ?? null,
    isGoogleUser: Boolean(user.google_id),
    hasPassword: Boolean(user.password_hash),
  });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }

  let body: { currentPassword?: string; newPassword?: string };

  try {
    body = (await request.json()) as {
      currentPassword?: string;
      newPassword?: string;
    };
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const newPassword = String(body.newPassword ?? "");
  if (newPassword.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 }
    );
  }

  let user: UserRow | null;
  try {
    user = await loadUser(session.userId);
  } catch {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }
  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const storedHash = user.password_hash;

  if (!storedHash) {
    // CREATE — Google account without a password yet. No current needed.
    const passwordHash = bcrypt.hashSync(newPassword, 10);
    try {
      await supabaseAdminRequest("users", {
        method: "PATCH",
        prefer: "return=minimal",
        query: { id: `eq.${session.userId}` },
        body: {
          password_hash: passwordHash,
          auth_provider: "password",
          updated_at: new Date().toISOString(),
        },
      });
    } catch {
      return NextResponse.json(
        { error: "Failed to save your password. Please try again." },
        { status: 500 }
      );
    }
    return NextResponse.json({ ok: true, mode: "created" });
  }

  // CHANGE — verify the existing password first.
  const currentPassword = String(body.currentPassword ?? "");
  if (!currentPassword) {
    return NextResponse.json(
      { error: "Enter your current password." },
      { status: 400 }
    );
  }

  const valid = bcrypt.compareSync(currentPassword, storedHash);
  if (!valid) {
    return NextResponse.json(
      { error: "Your current password is incorrect." },
      { status: 401 }
    );
  }

  const passwordHash = bcrypt.hashSync(newPassword, 10);
  try {
    await supabaseAdminRequest("users", {
      method: "PATCH",
      prefer: "return=minimal",
      query: { id: `eq.${session.userId}` },
      body: {
        password_hash: passwordHash,
        auth_provider: "password",
        updated_at: new Date().toISOString(),
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to update your password. Please try again." },
      { status: 500 }
    );
  }
  return NextResponse.json({ ok: true, mode: "changed" });
}
