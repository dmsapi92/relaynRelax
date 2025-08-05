import { writeAsyncIterableToWritable } from "@remix-run/node";
import { createWriteStream } from "fs";
import { mkdir } from "fs/promises";
import path from "path";
import { getUserPrismaClient } from "~/lib/get-user-db.server";

export async function uploadHandler({
  name,
  contentType,
  data,
  request,
  midpath,
}: {
  name: string;
  contentType: string;
  data: AsyncIterable<Uint8Array>;
  request: Request;
  midpath: string;
}) {
  if (!contentType.includes("image/")) {
    throw new Error("File must be an image");
  }

  const { instituteAdminRecord } = await getUserPrismaClient(request);
  if (!instituteAdminRecord) {
    throw new Error("Institution admin record not found");
  }

  const extension = path.extname(name);
  const basename = Math.random().toString(36).substring(2);
  const filename = `${Date.now()}-${basename}${extension}`;

  // Create upload directory path matching the existing structure

  const uploadDir = path.join(
    process.cwd(),
    "public",
    "uploads",
    instituteAdminRecord.institutionId,
    midpath
  );
  const filepath = path.join(uploadDir, filename);

  try {
    // Ensure upload directory exists
    await mkdir(uploadDir, { recursive: true });

    // Write file to disk
    const writeStream = createWriteStream(filepath);
    await writeAsyncIterableToWritable(data, writeStream);

    // Extract and return the URL path from filepath
    return filepath.split("public")[1].replace(/\\/g, "/");
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("Failed to upload file");
  }
}
