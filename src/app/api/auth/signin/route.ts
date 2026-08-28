import { NextResponse } from "next/server";
import {
  authServerEnabled,
  findUserByUsername,
  setSessionCookie,
  verifyPassword,
} from "@/lib/auth-server";

export async function POST(request: Request) {
  if (!authServerEnabled) {
    return NextResponse.json(
      { error: "Supabase is not configured. Add your Supabase keys to enable accounts." },
      { status: 503 }
    );
  }

  let body: { username?: string; password?: string };

  try {
    body = (await request.json()) as { username?: string; password?: string };
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const username = body.username?.trim() ?? "";
  const password = body.password ?? "";

  if (!username || !password) {
    return NextResponse.json(
      { error: "Enter your username and password." },
      { status: 400 }
    );
  }

  try {
    const user = await findUserByUsername(username);

    if (!user?.password_hash || !verifyPassword(password, user.password_hash)) {
      return NextResponse.json(
        { error: "Incorrect username or password." },
        { status: 401 }
      );
    }

    await setSessionCookie({ userId: user.id, username: user.username });

    return NextResponse.json({
      user: { id: user.id, username: user.username, createdAt: user.created_at },
    });
  } catch {
    return NextResponse.json(
      { error: "We couldn't sign you in. Please try again." },
      { status: 500 }
    );
  }
}
