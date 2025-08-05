import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { google } from "googleapis";
import path from "path";
import { getUserId } from "~/utils/session.server";

export const action: ActionFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (!userId) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  // Handle DELETE request
  if (request.method === "DELETE") {
    const formData = await request.formData();
    const noticeLink = formData.get("noticeLink") as string;
    const documentId = noticeLink.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];

    if (!documentId) {
      return json({ error: "Invalid document link" }, { status: 400 });
    }

    try {
      const auth = new google.auth.GoogleAuth({
        keyFile: path.resolve("dmsApi.json"),
        scopes: ["https://www.googleapis.com/auth/drive"],
      });

      const drive = google.drive({ version: "v3", auth });

      // Delete the Google Doc
      await drive.files.delete({
        fileId: documentId,
      });

      return json({ success: true });
    } catch (error) {
      console.error("Error deleting Google Doc:", error);
      return json({ error: "Failed to delete Google Doc" }, { status: 500 });
    }
  }

  // Handle POST request (create document)
  try {
    // Initialize the Google Drive API client
    const auth = new google.auth.GoogleAuth({
      keyFile: path.resolve("dmsApi.json"),
      scopes: [
        "https://www.googleapis.com/auth/documents",
        "https://www.googleapis.com/auth/drive",
      ],
    });

    const docs = google.docs({ version: "v1", auth });
    const drive = google.drive({ version: "v3", auth });

    // Create a new Google Doc
    const doc = await docs.documents.create({
      requestBody: {
        title: "New Blog Post",
      },
    });

    const documentId = doc.data.documentId;

    if (!documentId) {
      throw new Error("Failed to create document");
    }

    // Set the document's sharing permissions to anyone with the link can edit
    await drive.permissions.create({
      fileId: documentId,
      requestBody: {
        role: "writer",
        type: "anyone",
      },
    });

    // Get the document link
    const docLink = `https://docs.google.com/document/d/${documentId}/edit`;

    return json({ docLink });
  } catch (error) {
    console.error("Error creating Google Doc:", error);
    return json({ error: "Failed to create Google Doc" }, { status: 500 });
  }
};
