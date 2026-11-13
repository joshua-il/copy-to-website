import { createServerFn } from "@tanstack/react-start";
import * as fs from "node:fs";
import * as path from "node:path";

interface SaveCmsInput {
  cmsData: unknown;
}

interface UploadMediaInput {
  filename: string;
  base64Data: string;
  mimeType: string;
}

/**
 * Server function to persist CMS content into public/cms-content.json
 * so all visitors and admin sessions across the internet share the latest updates.
 */
export const saveCmsContent = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data as SaveCmsInput)
  .handler(async ({ data }) => {
    try {
      const publicDir = path.join(process.cwd(), "public");
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }
      const filePath = path.join(publicDir, "cms-content.json");
      fs.writeFileSync(filePath, JSON.stringify(data.cmsData, null, 2), "utf-8");
      return { ok: true as const, message: "CMS data saved successfully" };
    } catch (err) {
      console.error("Failed to save CMS content on server:", err);
      return { ok: false as const, error: String(err) };
    }
  });

/**
 * Server function to fetch shared CMS content from public/cms-content.json
 */
export const fetchCmsContent = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const filePath = path.join(process.cwd(), "public", "cms-content.json");
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      return { ok: true as const, data: JSON.parse(content) };
    }
    return { ok: true as const, data: null };
  } catch (err) {
    console.error("Failed to fetch CMS content from server:", err);
    return { ok: false as const, error: String(err) };
  }
});

/**
 * Server function to handle image uploads from admins:
 * Saves the file into public/uploads/<filename> so it is instantly served as a public URL
 * without relying on local machine paths.
 */
export const uploadCmsMedia = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data as UploadMediaInput)
  .handler(async ({ data }) => {
    try {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      // Generate a clean safe filename with timestamp
      const cleanBase = data.filename.replace(/[^a-zA-Z0-9.-]/g, "_").toLowerCase();
      const ext = path.extname(cleanBase) || ".jpg";
      const nameWithoutExt = path.basename(cleanBase, ext);
      const uniqueName = `${nameWithoutExt}-${Date.now()}${ext}`;
      const filePath = path.join(uploadsDir, uniqueName);

      // Strip potential base64 data URL prefix (e.g. data:image/png;base64,)
      const cleanBase64 = data.base64Data.replace(/^data:[^;]+;base64,/, "");
      const buffer = Buffer.from(cleanBase64, "base64");

      fs.writeFileSync(filePath, buffer);

      const publicUrl = `/uploads/${uniqueName}`;
      return { ok: true as const, publicUrl, filename: uniqueName };
    } catch (err) {
      console.error("Failed to write uploaded media:", err);
      return { ok: false as const, error: String(err) };
    }
  });

