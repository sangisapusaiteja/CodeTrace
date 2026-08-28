import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { supabaseAdminRequest, supabaseServerEnabled } from "@/lib/supabase-rest";

const SESSION_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET ?? "dev-secret-change-me-in-production"
);

export const SESSION_COOKIE_NAME = "cb_session";

export type AuthUser = {
  id: string;
  username: string;
  createdAt: string;
};

export type SessionPayload = {
  userId: string;
  username: string;
};

type UserRow = {
  id: string;
  username: string;
  password_hash: string | null;
  google_id?: string | null;
  created_at: string;
};

export const authServerEnabled = supabaseServerEnabled;

export function createPasswordHash(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function verifyPassword(password: string, stored: string): boolean {
  return bcrypt.compareSync(password, stored);
}

export async function createSessionToken(
  payload: SessionPayload
): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SESSION_SECRET);
}

export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SESSION_SECRET);
    return {
      userId: payload.userId as string,
      username: payload.username as string,
    };
  } catch {
    return null;
  }
}

export async function setSessionCookie(payload: SessionPayload) {
  const token = await createSessionToken(payload);
  const store = await cookies();
  store.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  if (!authServerEnabled) return null;

  const session = await getSession();
  if (!session) return null;

  try {
    const users = await supabaseAdminRequest<UserRow[]>("users", {
      query: {
        select: "id,username,password_hash,created_at",
        id: `eq.${session.userId}`,
        limit: "1",
      },
    });

    const user = users[0];
    if (!user) return null;

    return { id: user.id, username: user.username, createdAt: user.created_at };
  } catch {
    return null;
  }
}

export async function findUserByUsername(username: string) {
  const users = await supabaseAdminRequest<UserRow[]>("users", {
    query: {
      select: "id,username,password_hash,google_id,created_at",
      username: `eq.${username}`,
      limit: "1",
    },
  });

  return users[0] ?? null;
}

export async function createUser(username: string, password: string) {
  const passwordHash = createPasswordHash(password);

  const rows = await supabaseAdminRequest<UserRow[]>("users", {
    method: "POST",
    prefer: "return=representation",
    body: [
      {
        username,
        password_hash: passwordHash,
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

  const user = rows[0];

  if (!user) {
    throw new Error("Failed to create user.");
  }

  return { id: user.id, username: user.username, createdAt: user.created_at };
}

/** Returns the current user's role ('admin' | 'user' | null). */
export async function getCurrentUserRole(): Promise<"admin" | "user" | null> {
  if (!authServerEnabled) return null;
  const session = await getSession();
  if (!session) return null;
  try {
    const rows = await supabaseAdminRequest<{ role: string }[]>("users", {
      query: { select: "role", id: `eq.${session.userId}`, limit: "1" },
    });
    return rows[0]?.role === "admin" ? "admin" : "user";
  } catch {
    return null;
  }
}
