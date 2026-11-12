const getFileExtension = (mimeType = "") => {
  const parts = mimeType.split("/");
  return parts[1] || "file";
};

const getFileName = (document) => {
  const fallbackName = document?.docName || "compliance-document";
  const extension = getFileExtension(document?.docContentType);

  if (fallbackName.includes(".")) {
    return fallbackName;
  }

  return `${fallbackName}.${extension}`;
};

export const viewComplianceDocument = (document) => {
  if (!document?.doc) {
    console.log("No document found");
    return;
  }

  try {
    
    if (document.doc.startsWith("data:")) {
      const byteString = atob(document.doc.split(",")[1]);

      const mimeString = document.doc
        .split(",")[0]
        .split(":")[1]
        .split(";")[0];

      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);

      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      const blob = new Blob([ab], { type: mimeString });
      const fileURL = URL.createObjectURL(blob);

      window.open(fileURL, "_blank");
      return;
    }

    /*
      Fallback:
      Direct URL case
    */
    window.open(document.doc, "_blank");
  } catch (error) {
    console.log(error);
    console.log("Unable to open document");
  }
};

export const downloadComplianceDocument = async (document) => {
  if (!document?.doc) {
    console.log("No document found");
    return;
  }

  try {
    const link = window.document.createElement("a");
    link.href = document.doc;
    link.download = getFileName(document);
    link.click();
  } catch (error) {
    console.log(error);
    console.log("Unable to download document");
  }
};