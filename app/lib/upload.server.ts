import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

interface UploadOptions {
  directory: string;
  allowedTypes?: string[];
  maxSize?: number;
}

export async function uploadFiles(
  files: File[],
  options: UploadOptions
): Promise<string[]> {
  const { directory, allowedTypes = [], maxSize = Infinity } = options;
  const uploadPromises = files.map(async (file) => {
    // Validate file type if allowedTypes is provided
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} is not allowed`);
    }

    // Validate file size
    if (file.size > maxSize) {
      throw new Error(
        `File size exceeds the maximum limit of ${maxSize} bytes`
      );
    }

    // Generate unique filename
    const ext = file.name.split(".").pop();
    const filename = `${uuidv4()}.${ext}`;

    // Create upload directory path
    const uploadDir = join("public", "uploads", directory);
    const filepath = join(uploadDir, filename);

    // Ensure directory exists
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      console.error("Error creating directory:", err);
    }

    // Write file
    await writeFile(filepath, Buffer.from(await file.arrayBuffer()));

    // Return the public URL
    return `/uploads/${directory}/${filename}`;
  });

  return Promise.all(uploadPromises);
}
