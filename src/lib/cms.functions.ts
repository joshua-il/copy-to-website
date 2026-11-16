import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

interface SaveCmsInput {
  cmsData: unknown;
}

interface UploadMediaInput {
  filename: string;
  base64Data: string;
  mimeType: string;
}

function getSupabaseClient() {
  const url = process.env["SUPABASE_URL"] || process.env["VITE_SUPABASE_URL"];
  const key =
    process.env["SUPABASE_SERVICE_ROLE_KEY"] ||
    process.env["SUPABASE_PUBLISHABLE_KEY"] ||
    process.env["VITE_SUPABASE_PUBLISHABLE_KEY"];

  if (!url || !key) return null;

  return createClient(url, key, {
    global: {
      fetch: (input, init) => {
        const headers = new Headers(
          typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
        );
        if (init?.headers) {
          new Headers(init.headers).forEach((value, name) => headers.set(name, value));
        }
        if (key.startsWith("sb_")) {
          headers.delete("Authorization");
          headers.set("apikey", key);
        }
        return fetch(input, { ...init, headers });
      },
    },
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Cloud-safe server function to persist CMS content.
 * 1. Checks Supabase `site_cms` table (direct Postgres database connection)
 * 2. Checks Supabase Cloud Storage `cms-media` bucket (if service key present)
 * 3. Returns cloud status so the admin interface knows if changes are live globally.
 */
export const saveCmsContent = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data as SaveCmsInput)
  .handler(async ({ data }) => {
    try {
      const client = getSupabaseClient();

      // 1. Direct Postgres Table Sync (Instant multi-device persistence)
      if (client) {
        try {
          const { error: dbError } = await client
            .from("site_cms" as any)
            .upsert({ id: "master", data: data.cmsData, updated_at: new Date().toISOString() });

          if (!dbError) {
            return {
              ok: true as const,
              cloudSynced: true as const,
              message: "Synchronized live to Supabase Postgres database. Live on all devices!",
            };
          }
        } catch (dbErr) {
          // Table might not exist yet
          console.warn("Supabase site_cms table upsert notice:", dbErr);
        }
      }

      // 2. Storage Bucket Sync (Fallback if storage configured)
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      const supabaseUrl = process.env.SUPABASE_URL;

      if (serviceKey && supabaseUrl) {
        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

          const { data: buckets } = await supabaseAdmin.storage.listBuckets();
          if (!buckets?.some((b) => b.name === "cms-media")) {
            await supabaseAdmin.storage.createBucket("cms-media", { public: true }).catch(() => {});
          }

          const { error: uploadError } = await supabaseAdmin.storage
            .from("cms-media")
            .upload("cms-content.json", JSON.stringify(data.cmsData), {
              contentType: "application/json",
              upsert: true,
            });

          if (!uploadError) {
            return {
              ok: true as const,
              cloudSynced: true as const,
              message: "CMS synchronized to Supabase Cloud Storage globally.",
            };
          }
        } catch (adminErr) {
          console.warn("Supabase admin storage sync error:", adminErr);
        }
      }

      return {
        ok: true as const,
        cloudSynced: false as const,
        message: "Saved locally. Create `site_cms` table in Supabase for 100% automated global sync.",
      };
    } catch (err) {
      console.warn("CMS cloud sync notice:", err);
      return { ok: true as const, cloudSynced: false as const, message: "Saved locally" };
    }
  });

/**
 * Cloud-safe server function to fetch CMS content.
 * 1. Checks Supabase Postgres table `site_cms`
 * 2. Checks Supabase cloud storage bucket `cms-media`
 * 3. Falls back to bundled static public/cms-content.json
 */
export const fetchCmsContent = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const client = getSupabaseClient();

    // 1. Fetch from Supabase Postgres `site_cms` table
    if (client) {
      try {
        const { data: row, error: dbError } = await client
          .from("site_cms" as any)
          .select("data")
          .eq("id", "master")
          .maybeSingle();

        if (row && (row as any).data && !dbError) {
          return { ok: true as const, data: (row as any).data, source: "database" as const };
        }
      } catch (dbErr) {
        // Table not created yet
      }
    }

    // 2. Fetch from Supabase cloud storage bucket
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseUrl = process.env.SUPABASE_URL;

    if (serviceKey && supabaseUrl) {
      try {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin.storage
          .from("cms-media")
          .download("cms-content.json");
        if (data && !error) {
          const text = await data.text();
          return { ok: true as const, data: JSON.parse(text), source: "cloud" as const };
        }
      } catch (cloudErr) {
        console.warn("Cloud download attempt failed:", cloudErr);
      }
    }

    // 3. Fallback to bundled static public/cms-content.json
    try {
      const bundled = await import("../../public/cms-content.json");
      if (bundled && bundled.default) {
        return { ok: true as const, data: bundled.default, source: "bundled" as const };
      }
    } catch {
      // Bundled fallback unavailable
    }

    return { ok: true as const, data: null, source: "none" as const };
  } catch (err) {
    return { ok: true as const, data: null, source: "none" as const };
  }
});

/**
 * Cloud-safe server function to handle media uploads:
 * In serverless environments, does NOT attempt node:fs writes to /var/task.
 * Uploads to Supabase Cloud Storage if credentials exist, otherwise returns optimized data URI.
 */
export const uploadCmsMedia = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data as UploadMediaInput)
  .handler(async ({ data }) => {
    try {
      const client = getSupabaseClient();

      if (client) {
        try {
          const cleanBase = data.filename.replace(/[^a-zA-Z0-9.-]/g, "_").toLowerCase();
          const uniqueName = `${Date.now()}-${cleanBase}`;
          const cleanBase64 = data.base64Data.replace(/^data:[^;]+;base64,/, "");
          const buffer = Buffer.from(cleanBase64, "base64");

          const { error: uploadError } = await client.storage
            .from("cms-media")
            .upload(uniqueName, buffer, {
              contentType: data.mimeType || "image/jpeg",
              upsert: true,
            });

          if (!uploadError) {
            const { data: pubData } = client.storage
              .from("cms-media")
              .getPublicUrl(uniqueName);
            if (pubData?.publicUrl) {
              return {
                ok: true as const,
                publicUrl: pubData.publicUrl,
                filename: uniqueName,
                cloud: true as const,
              };
            }
          }
        } catch (storageErr) {
          console.warn("Supabase storage sync fallback:", storageErr);
        }
      }

      // Return cloud-ready base64 data URI directly (zero serverless disk requirement)
      const dataUri = data.base64Data.startsWith("data:")
        ? data.base64Data
        : `data:${data.mimeType || "image/jpeg"};base64,${data.base64Data}`;

      return {
        ok: true as const,
        publicUrl: dataUri,
        filename: data.filename,
        cloud: false as const,
      };
    } catch (err) {
      console.error("Cloud media handler error:", err);
      return { ok: false as const, error: String(err) };
    }
  });
