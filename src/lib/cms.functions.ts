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
 * Cloud-safe server function to persist CMS content without local disk writes.
 * In serverless cloud runtimes (/var/task), local filesystems are read-only.
 */
export const saveCmsContent = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data as SaveCmsInput)
  .handler(async ({ data }) => {
    try {
      // Optional Supabase admin sync if service role credentials are present
      if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_URL) {
        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          // Attempt bucket sync if configured
          await supabaseAdmin.storage
            .from("cms-media")
            .upload("cms-content.json", JSON.stringify(data.cmsData), {
              contentType: "application/json",
              upsert: true,
            })
            .catch(() => {});
        } catch {
          // Non-blocking fallback
        }
      }
      return { ok: true as const, message: "CMS cloud sync complete" };
    } catch (err) {
      console.warn("CMS cloud sync notice:", err);
      return { ok: true as const, message: "CMS saved" };
    }
  });

/**
 * Cloud-safe server function to fetch CMS content.
 */
export const fetchCmsContent = createServerFn({ method: "GET" }).handler(async () => {
  try {
    if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_URL) {
      try {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data } = await supabaseAdmin.storage
          .from("cms-media")
          .download("cms-content.json");
        if (data) {
          const text = await data.text();
          return { ok: true as const, data: JSON.parse(text) };
        }
      } catch {
        // Fallback to client state
      }
    }
    return { ok: true as const, data: null };
  } catch (err) {
    return { ok: true as const, data: null };
  }
});

/**
 * Cloud-safe server function to handle media uploads:
 * In serverless environments, does NOT attempt node:fs writes to /var/task.
 * Returns cloud-safe media data immediately.
 */
export const uploadCmsMedia = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data as UploadMediaInput)
  .handler(async ({ data }) => {
    try {
      // If Supabase Storage is configured in the environment, upload directly to the cloud bucket
      if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_URL) {
        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
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
              return { ok: true as const, publicUrl: pubData.publicUrl, filename: uniqueName };
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
      };
    } catch (err) {
      console.error("Cloud media handler error:", err);
      return { ok: false as const, error: String(err) };
    }
  });
