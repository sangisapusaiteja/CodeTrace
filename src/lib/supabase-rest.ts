const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseServerEnabled = Boolean(
  supabaseUrl && supabaseServiceRoleKey
);

type SupabaseRequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  query?: Record<string, string | undefined>;
  body?: unknown;
  prefer?: string;
};

export async function supabaseAdminRequest<T>(
  path: string,
  options: SupabaseRequestOptions = {}
) {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  const url = new URL(`/rest/v1/${path}`, supabaseUrl);

  for (const [key, value] of Object.entries(options.query ?? {})) {
    if (value) {
      url.searchParams.set(key, value);
    }
  }

  const response = await fetch(url.toString(), {
    method: options.method ?? "GET",
    headers: {
      apikey: supabaseServiceRoleKey,
      Authorization: `Bearer ${supabaseServiceRoleKey}`,
      "Content-Type": "application/json",
      ...(options.prefer ? { Prefer: options.prefer } : {}),
    },
    cache: "no-store",
    body:
      options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(responseText || "Supabase request failed.");
  }

  if (!responseText) {
    return null as T;
  }

  return JSON.parse(responseText) as T;
}
