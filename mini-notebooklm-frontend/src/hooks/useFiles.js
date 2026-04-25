import { useCallback, useEffect, useState } from "react";
import { api } from "../services/api.js";
import { ALLOWED_EXTENSIONS } from "../utils/constants.js";
import { getFileExtension, normalizeError } from "../utils/formatters.js";
import { useToast } from "../context/ToastContext.jsx";

export function useFiles() {
  const { pushToast } = useToast();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const refreshFiles = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.listFiles();
      setFiles(data.files || []);
    } catch (error) {
      pushToast({ variant: "error", title: "Files unavailable", message: normalizeError(error) });
    } finally {
      setLoading(false);
    }
  }, [pushToast]);

  const uploadFile = useCallback(
    async (file) => {
      if (!file) {
        pushToast({ variant: "error", title: "No file selected", message: "Choose a PDF, TXT, DOCX, or PPTX file." });
        return;
      }
      const extension = getFileExtension(file.name);
      if (!ALLOWED_EXTENSIONS.includes(extension)) {
        pushToast({ variant: "error", title: "Unsupported file", message: `${extension || "This file"} is not supported.` });
        return;
      }

      setUploading(true);
      setUploadProgress(0);
      try {
        const result = await api.uploadFile(file, (event) => {
          const percent = event.total ? Math.round((event.loaded * 100) / event.total) : 80;
          setUploadProgress(percent);
        });
        pushToast({
          variant: "success",
          title: "Document indexed",
          message: `${result.file_name} generated ${result.chunks_indexed} searchable chunks.`,
        });
        await refreshFiles();
      } catch (error) {
        pushToast({ variant: "error", title: "Upload failed", message: normalizeError(error) });
      } finally {
        setUploading(false);
        setUploadProgress(0);
      }
    },
    [pushToast, refreshFiles]
  );

  const deleteFile = useCallback(
    async (fileName) => {
      try {
        await api.deleteFile(fileName);
        setFiles((items) => items.filter((file) => file.file_name !== fileName));
        pushToast({ variant: "success", title: "File deleted", message: fileName });
      } catch (error) {
        pushToast({ variant: "error", title: "Delete failed", message: normalizeError(error) });
      }
    },
    [pushToast]
  );

  useEffect(() => {
    refreshFiles();
  }, [refreshFiles]);

  return { files, loading, uploading, uploadProgress, refreshFiles, uploadFile, deleteFile };
}
