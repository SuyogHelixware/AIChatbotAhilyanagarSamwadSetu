 

// ✅ Utility to trigger a file download
// const downloadFile = (fileUrl, fileName) => {
//    const link = document.createElement("a");
//   link.href = fileUrl;
//   link.setAttribute("download", fileName || "file");
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// };

// // ✅ MIME type mapping
// const EXT_MIME = {
//   pdf: "application/pdf",
//   txt: "text/plain",
//   jpg: "image/jpeg",
//   jpeg: "image/jpeg",
//   png: "image/png",
//   gif: "image/gif",
//   webp: "image/webp",
//   bmp: "image/bmp",
//   svg: "image/svg+xml",
//   doc: "application/msword",
//   docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//   xls: "application/vnd.ms-excel",
//   xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//   csv: "text/csv",
//   zip: "application/zip",
// };

// //  Safely detect MIME type
// const getMime = (data) => {
//   // Highest priority: actual File object MIME
//   if (data.File && data.File.type) return data.File.type.toLowerCase();

//   // If FileExt already has MIME format
//   if (data.FileExt && data.FileExt.includes("/")) return data.FileExt.toLowerCase();

//   // Otherwise, fallback based on extension
//   const name = (data.FileName || (data.File && data.File.name) || "").toLowerCase();
//   const ext = name.includes(".") ? name.split(".").pop() : (data.FileExt || "").toLowerCase();
//   if (ext && EXT_MIME[ext]) return EXT_MIME[ext];

//   return "application/octet-stream"; // Unknown
// };

// //  Open file in new tab OR download based on type
// export const openFileinNewTab = (data) => {
//   if (!data) {
//     console.error("❌ File data is undefined:", data);
//     return;
//   }

//   let fileUrl = null;
//   let mime = getMime(data);

//   // Case 1: If we have Base64 from API
//   if (data.FileBase64 || (data.File && typeof data.File === "string" && data.File.length > 50)) {
//     const base64String = data.FileBase64 || data.File;
//     fileUrl = `data:${mime};base64,${base64String}`;
//   }
//   // Case 2: If server gave us a URL path
//   else if (data.SrcPath || data.srcpath) {
//     fileUrl = data.SrcPath || data.srcpath;
//   }
//   // Case 3: Newly uploaded File object
//   else if (data.File instanceof File || data.file instanceof File) {
//     fileUrl = URL.createObjectURL(data.File || data.file);
//   }
//   // Case 4: Fallback fileUrl
//   else if (data.fileUrl) {
//     fileUrl = data.fileUrl;
//   }

//   // If no valid file URL found, stop
//   if (!fileUrl) {
//     console.warn("⚠️ No valid file URL found for:", data);
//     return;
//   }

//   //  Allow preview only for certain types
//   const previewable =
//     mime.startsWith("image/") ||
//     mime === "application/pdf" ||
//     mime === "text/plain";

//   if (previewable) {
//     // Open in new tab
//     const win = window.open("about:blank", "_blank");
//     if (!win) {
//       alert("⚠️ Please allow pop-ups to preview the file.");
//       return;
//     }
//     win.location.href = fileUrl;
//   } else {
//     // Download other file types
//     const fileName = data.FileName || (data.File && data.File.name) || "file";
//     downloadFile(fileUrl, fileName);
//   }
// };


// ✅ Trigger a file download
const downloadFile = (fileUrl, fileName) => {
  const link = document.createElement("a");
  link.href = fileUrl;
  link.setAttribute("download", fileName || "file");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// ✅ MIME type mapping
const EXT_MIME = {
  pdf: "application/pdf",
  txt: "text/plain",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  bmp: "image/bmp",
  svg: "image/svg+xml",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  csv: "text/csv",
  zip: "application/zip",
};

// ✅ Detect MIME type
const getMime = (data) => {
  if (data.File && data.File.type) return data.File.type.toLowerCase();
  if (data.FileExt && data.FileExt.includes("/")) return data.FileExt.toLowerCase();

  const name = (data.FileName || (data.File && data.File.name) || "").toLowerCase();
  const ext = name.includes(".") ? name.split(".").pop() : (data.FileExt || "").toLowerCase();
  if (ext && EXT_MIME[ext]) return EXT_MIME[ext];

  return "application/octet-stream";
};

// ✅ Open file in new tab OR download
export const openFileinNewTab = (data) => {
  if (!data) {
    console.error("❌ File data is undefined:", data);
    return;
  }

  let fileUrl = null;
  let mime = getMime(data);

  // Case 1: Base64 from API
  if (data.FileBase64) {
    fileUrl = `data:${mime};base64,${data.FileBase64}`;
  }
  // Case 2: File path from server
  else if (data.SrcPath || data.srcpath) {
    fileUrl = data.SrcPath || data.srcpath;
  }
  // Case 3: Uploaded File object
  else if (data.File instanceof File || data.file instanceof File) {
    fileUrl = URL.createObjectURL(data.File || data.file);
  }
  // Case 4: Fallback direct URL
  else if (data.fileUrl) {
    fileUrl = data.fileUrl;
  }

  if (!fileUrl) {
    console.warn("⚠️ No valid file URL found for:", data);
    return;
  }

  const previewable =
    mime.startsWith("image/") ||
    mime === "application/pdf" ||
    mime === "text/plain";

  if (previewable) {
    // ✅ Instead of assigning .href (which breaks for large Base64),
    // write into a new window
    const win = window.open("", "_blank");
    if (!win) {
      alert("⚠️ Please allow pop-ups to preview the file.");
      return;
    }

    if (mime === "application/pdf") {
      win.document.write(
        `<iframe src="${fileUrl}" style="width:100%;height:100%;" frameborder="0"></iframe>`
      );
    } else if (mime.startsWith("image/")) {
      win.document.write(
        `<img src="${fileUrl}" style="max-width:100%;height:auto;display:block;margin:auto;" />`
      );
    } else if (mime === "text/plain") {
      fetch(fileUrl)
        .then((res) => res.text())
        .then((text) => {
          win.document.write(`<pre>${text}</pre>`);
        });
    }
  } else {
    const fileName = data.FileName || (data.File && data.File.name) || "file";
    downloadFile(fileUrl, fileName);
  }
};
