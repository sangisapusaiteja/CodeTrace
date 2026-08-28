"use server";

import { redirect } from "next/navigation";
import {
  authServerEnabled,
  createUser,
  findUserByUsername,
  setSessionCookie,
  clearSessionCookie,
  verifyPassword,
} from "@/lib/auth-server";

export type AuthResult = { error: string } | undefined;

function normalizeUsername(username: string): string {
  return username
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_]/g, "")
    .toLowerCase();
}

export async function signUp(
  _prevState: AuthResult,
  formData: FormData
): Promise<AuthResult> {
  if (!authServerEnabled) {
    return { error: "Supabase is not configured. Add your Supabase keys." };
  }

  const username = normalizeUsername(String(formData.get("username") ?? ""));
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return { error: "Username and password are required." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  try {
    const existing = await findUserByUsername(username);
    if (existing) {
      return { error: "That username is already taken." };
    }

    const user = await createUser(username, password);
    await setSessionCookie({ userId: user.id, username: user.username });
  } catch {
    return { error: "Failed to create account. Please try again." };
  }

  redirect("/");
}

export async function login(
  _prevState: AuthResult,
  formData: FormData
): Promise<AuthResult> {
  if (!authServerEnabled) {
    return { error: "Supabase is not configured. Add your Supabase keys." };
  }

  const username = normalizeUsername(String(formData.get("username") ?? ""));
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return { error: "Username and password are required." };
  }

  try {
    const user = await findUserByUsername(username);
    if (!user || !user.password_hash) {
      if (user?.google_id && !user.password_hash) {
        return {
          error:
            "You signed up with Google. Continue with Google, or set a password from your profile.",
        };
      }
      return { error: "Invalid username or password." };
    }
    if (!verifyPassword(password, user.password_hash)) {
      return { error: "Invalid username or password." };
    }
    await setSessionCookie({ userId: user.id, username: user.username });
  } catch {
    return { error: "Could not sign you in. Please try again." };
  }

  redirect("/");
}

export async function logout() {
  await clearSessionCookie();
  redirect("/login");
}
