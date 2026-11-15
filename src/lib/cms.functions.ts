import { createServerFn } from "@tanstack/react-start";

interface SaveCmsInput {
  cmsData: unknown;
}

interface UploadMediaInput {
  filename: string;
  base64Data: string;
  mimeType: string;
}

/**
 * Cloud-safe server function to persist CMS content.
 * When SUPABASE_SERVICE_ROLE_KEY is present in Secrets / Environment,
 * it saves directly to Supabase Cloud Storage (cms-media bucket) for global multi-device sync.
 */
export const saveCmsContent = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data as SaveCmsInput)
  .handler(async ({ data }) => {
    try {
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      const supabaseUrl = process.env.SUPABASE_URL;

      if (serviceKey && supabaseUrl) {
        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

          // Ensure cms-media bucket exists
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
              message: "CMS synchronized to Cloud Storage globally.",
            };
          } else {
            console.warn("Supabase storage upload error:", uploadError.message);
          }
        } catch (adminErr) {
          console.warn("Supabase admin storage sync error:", adminErr);
        }
      }

      return {
        ok: true as const,
        cloudSynced: false as const,
        message:
          "Saved locally. To enable automatic multi-device cloud sync, add SUPABASE_SERVICE_ROLE_KEY to Lovable Secrets.",
      };
    } catch (err) {
      console.warn("CMS cloud sync notice:", err);
      return { ok: true as const, cloudSynced: false as const, message: "Saved locally" };
    }
  });

/**
 * Cloud-safe server function to fetch CMS content.
 * 1. Checks Supabase cloud storage (if connected)
 * 2. Falls back to bundled public/cms-content.json
 */
export const fetchCmsContent = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseUrl = process.env.SUPABASE_URL;

    // 1. Try Supabase cloud bucket
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

    // 2. Fallback to bundled static public/cms-content.json
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
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      const supabaseUrl = process.env.SUPABASE_URL;

      if (serviceKey && supabaseUrl) {
        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

          // Ensure cms-media bucket exists
          const { data: buckets } = await supabaseAdmin.storage.listBuckets();
          if (!buckets?.some((b) => b.name === "cms-media")) {
            await supabaseAdmin.storage.createBucket("cms-media", { public: true }).catch(() => {});
          }

          const cleanBase = data.filename.replace(/[^a-zA-Z0-9.-]/g, "_").toLowerCase();
          const uniqueName = `${Date.now()}-${cleanBase}`;
          const cleanBase64 = data.base64Data.replace(/^data:[^;]+;base64,/, "");
          const buffer = Buffer.from(cleanBase64, "base64");

          const { error: uploadError } = await supabaseAdmin.storage
            .from("cms-media")
            .upload(uniqueName, buffer, {
              contentType: data.mimeType || "image/jpeg",
              upsert: true,
            });

          if (!uploadError) {
            const { data: pubData } = supabaseAdmin.storage
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
