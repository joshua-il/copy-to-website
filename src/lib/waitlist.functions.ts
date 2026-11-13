import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { joinWaitlistSchema } from "@/lib/waitlist-schema";

function createPublicClient(url: string, key: string) {
  return createClient<Database>(url, key, {
    global: {
      fetch: (input, init) => {
        const headers = new Headers(
          typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
        );
        if (init?.headers)
          new Headers(init.headers).forEach((value, name) => headers.set(name, value));
        if (key.startsWith("sb_")) {
          if (headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
          headers.set("apikey", key);
        }
        return fetch(input, { ...init, headers });
      },
    },
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

export const joinWaitlist = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => joinWaitlistSchema.parse(data))
  .handler(async ({ data }) => {
    const url = process.env["SUPABASE_URL"];
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
    if (!url || !key) {
      return { ok: false as const, message: "We couldn't add you right now. Please try again." };
    }

    const client = createPublicClient(url, key);
    const { error } = await client.from("visual_bible_waitlist").insert({ email: data.email });
    if (error?.code === "23505") return { ok: true as const, alreadyJoined: true };
    if (error) {
      console.error("Waitlist submission failed", error.code ?? "unknown error");
      return { ok: false as const, message: "We couldn't add you right now. Please try again." };
    }
    return { ok: true as const, alreadyJoined: false };
  });
