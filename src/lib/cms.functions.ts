import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import postgres from "postgres";

interface SaveCmsInput {
  cmsData: unknown;
}

interface UploadMediaInput {
  filename: string;
  base64Data: string;
  mimeType: string;
}

let sqlInstance: any = null;
function getPostgresClient() {
  const dbUrl =
    process.env["POSTGRES_URL"] ||
    process.env["DATABASE_URL"] ||
    process.env["POSTGRES_PRISMA_URL"] ||
    process.env["POSTGRES_URL_NON_POOLING"];

  if (!dbUrl) return null;
  if (!sqlInstance) {
    try {
      sqlInstance = postgres(dbUrl, {
        ssl: "require",
        max: 2,
        idle_timeout: 10,
        connect_timeout: 5,
      });
    } catch (err) {
      console.warn("Postgres init error:", err);
      return null;
    }
  }
  return sqlInstance;
}

async function ensurePostgresTable(sql: any) {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS public.site_cms (
        id TEXT PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;
  } catch (e) {
    console.warn("ensurePostgresTable warning:", e);
  }
}

function getSupabaseClient() {
  const url =
    process.env["SUPABASE_URL"] ||
    process.env["NEXT_PUBLIC_SUPABASE_URL"] ||
    process.env["VITE_SUPABASE_URL"];
  const key =
    process.env["SUPABASE_SERVICE_ROLE_KEY"] ||
    process.env["SUPABASE_ANON_KEY"] ||
    process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"] ||
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
        } else {
          headers.set("apikey", key);
          if (!headers.has("Authorization")) {
            headers.set("Authorization", `Bearer ${key}`);
          }
        }
        return fetch(input, { ...init, headers });
      },
    },
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Cloud-safe server function to persist CMS content.
 * 1. Checks Direct Postgres (Vercel / Supabase connection pooling)
 * 2. Checks Supabase `site_cms` table (direct PostgREST)
 * 3. Checks Supabase Cloud Storage `cms-media` bucket (if service key present)
 * 4. Returns cloud status so the admin interface knows if changes are live globally.
 */
export const saveCmsContent = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data as SaveCmsInput)
  .handler(async ({ data }) => {
    try {
      // 1. Direct Postgres Connection (Instant schema creation & upsert)
      const sql = getPostgresClient();
      if (sql) {
        try {
          await ensurePostgresTable(sql);
          await sql`
            INSERT INTO public.site_cms (id, data, updated_at)
            VALUES ('master', ${JSON.stringify(data.cmsData)}::jsonb, NOW())
            ON CONFLICT (id) DO UPDATE
            SET data = EXCLUDED.data, updated_at = NOW()
          `;
          return {
            ok: true as const,
            cloudSynced: true as const,
            message: "Synchronized live via direct Postgres database. Live on all devices globally!",
          };
        } catch (pgErr) {
          console.warn("Direct Postgres save notice:", pgErr);
        }
      }

      // 2. Supabase REST Table Sync (Instant multi-device persistence)
      const client = getSupabaseClient();
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
          console.warn("Supabase site_cms table upsert notice:", dbErr);
        }
      }

      // 3. Storage Bucket Sync (Fallback if storage configured)
      const serviceKey =
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
      const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;

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
        message: "Saved locally. Run the SQL script in Supabase to enable automated global sync.",
      };
    } catch (err) {
      console.warn("CMS cloud sync notice:", err);
      return { ok: true as const, cloudSynced: false as const, message: "Saved locally" };
    }
  });

/**
 * Cloud-safe server function to fetch CMS content.
 * 1. Checks Direct Postgres connection
 * 2. Checks Supabase Postgres table `site_cms`
 * 3. Checks Supabase cloud storage bucket `cms-media`
 * 4. Falls back to bundled static public/cms-content.json
 */
export const fetchCmsContent = createServerFn({ method: "GET" }).handler(async () => {
  try {
    // 1. Direct Postgres Connection
    const sql = getPostgresClient();
    if (sql) {
      try {
        await ensurePostgresTable(sql);
        const rows = await sql`SELECT data FROM public.site_cms WHERE id = 'master' LIMIT 1`;
        if (rows && rows.length > 0 && rows[0].data) {
          return { ok: true as const, data: rows[0].data, source: "database" as const };
        }
      } catch (pgErr) {
        console.warn("Direct Postgres fetch notice:", pgErr);
      }
    }

    // 2. Fetch from Supabase Postgres `site_cms` table
    const client = getSupabaseClient();
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

    // 3. Fetch from Supabase cloud storage bucket
    const serviceKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;

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

    // 4. Fallback to bundled static public/cms-content.json
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

          try {
            await client.storage.createBucket("cms-media", { public: true });
          } catch {
            // Bucket may already exist
          }

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
