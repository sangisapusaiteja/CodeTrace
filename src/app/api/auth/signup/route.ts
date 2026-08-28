import { NextResponse } from "next/server";
import {
  authServerEnabled,
  createUser,
  findUserByUsername,
  setSessionCookie,
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

  if (username.length < 3 || password.length < 6) {
    return NextResponse.json(
      { error: "Username must be at least 3 characters and password at least 6." },
      { status: 400 }
    );
  }

  try {
    const existing = await findUserByUsername(username);
    if (existing) {
      return NextResponse.json(
        { error: "That username is already taken." },
        { status: 409 }
      );
    }

    const user = await createUser(username, password);
    await setSessionCookie({ userId: user.id, username: user.username });

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json(
      { error: "We couldn't create your account. Please try again." },
      { status: 500 }
    );
  }
}
