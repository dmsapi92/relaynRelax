import { google } from "googleapis";
import path from "path";

// Helper function to extract Google Doc ID from URL
export function extractGoogleDocId(url: string) {
  const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
}

// Helper function to load Google Doc content
export async function loadGoogleDocContent(docId: string) {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: path.resolve("dmsApi.json"),
      scopes: [
        "https://www.googleapis.com/auth/documents.readonly",
        "https://www.googleapis.com/auth/drive.readonly",
      ],
    });

    const drive = google.drive({ version: "v3", auth });

    // Export the document as HTML
    const response = await drive.files.export(
      {
        fileId: docId,
        mimeType: "text/html",
      },
      {
        responseType: "stream",
      }
    );

    // Convert the stream to string
    const chunks: Uint8Array[] = [];
    // @ts-ignore
    for await (const chunk of response.data) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    let html = buffer.toString("utf-8");

    // Clean up the HTML
    // Remove Google Docs specific styles and scripts
    html = html.replace(/<head>[\s\S]*?<\/head>/, "");
    html = html.replace(/<style>[\s\S]*?<\/style>/g, "");

    // Extract the body content
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    if (bodyMatch && bodyMatch[1]) {
      html = bodyMatch[1];
    }

    // Clean up any Google Docs specific classes and attributes
    html = html.replace(/class="[^"]*"/g, "");
    html = html.replace(/style="[^"]*"/g, "");
    html = html.replace(/id="[^"]*"/g, "");

    // Add our own styling classes using NextUI theme system
    html = html.replace(/<p/g, '<p class="mb-4"');
    html = html.replace(/<h1/g, '<h1 class="text-4xl font-bold mb-6"');
    html = html.replace(/<h2/g, '<h2 class="text-3xl font-bold mb-4"');
    html = html.replace(/<h3/g, '<h3 class="text-2xl font-bold mb-3"');
    html = html.replace(/<ul/g, '<ul class="list-disc list-inside mb-4 pl-4"');
    html = html.replace(
      /<ol/g,
      '<ol class="list-decimal list-inside mb-4 pl-4"'
    );
    html = html.replace(/<li/g, '<li class="mb-2"');
    html = html.replace(
      /<table/g,
      '<table class="min-w-full border-collapse border-divider mb-6"'
    );
    html = html.replace(/<td/g, '<td class="border-divider p-2"');
    html = html.replace(
      /<th/g,
      '<th class="border-divider p-2 font-bold bg-default-100"'
    );
    html = html.replace(
      /<img/g,
      '<img class="max-w-full h-auto my-4 rounded-lg shadow"'
    );
    html = html.replace(
      /<a/g,
      '<a class="text-primary hover:text-primary-600 underline"'
    );

    // Handle text alignment
    html = html.replace(
      /style="text-align:\s*center;?"/g,
      'class="text-center"'
    );
    html = html.replace(/style="text-align:\s*right;?"/g, 'class="text-right"');
    html = html.replace(
      /style="text-align:\s*justify;?"/g,
      'class="text-justify"'
    );

    // Add responsive wrapper for tables
    html = html.replace(/<table/g, '<div class="overflow-x-auto"><table');
    html = html.replace(/<\/table>/g, "</table></div>");

    // Handle images
    html = html.replace(/<img[^>]+src="([^"]+)"[^>]*>/g, (match, src) => {
      // If it's a Google Drive image, ensure it's accessible
      if (src.includes("googleusercontent.com")) {
        return `<img src="${src}" class="max-w-full h-auto my-4 rounded-lg shadow mx-auto" alt="Document image" />`;
      }
      return match;
    });

    return html;
  } catch (error) {
    console.error("Error loading Google Doc:", error);
    return null;
  }
}
