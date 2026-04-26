import { useCallback, useEffect, useMemo, useState } from "react";
import { useToast } from "../context/ToastContext.jsx";
import { api } from "../services/api.js";
import { normalizeError } from "../utils/formatters.js";

export function useNotebookTools(selectedFile) {
  const { pushToast } = useToast();
  const [health, setHealth] = useState({ status: "ok", provider: "loading...", uploaded_files: 0 });
  const [summary, setSummary] = useState(null);
  const [conceptMap, setConceptMap] = useState(null);
  const [voice, setVoice] = useState(null);
  const [videos, setVideos] = useState(null);
  const [loadingKey, setLoadingKey] = useState("");

  const fileName = selectedFile?.file_name || null;

  const loadHealth = useCallback(async () => {
    try {
      setHealth(await api.health());
    } catch (error) {
      // Ignored: keep showing as online per user request
    }
  }, []);

  useEffect(() => {
    loadHealth();
    const timer = window.setInterval(loadHealth, 30000);
    return () => window.clearInterval(timer);
  }, [loadHealth]);

  const runTool = useCallback(
    async (key, action, onSuccess) => {
      setLoadingKey(key);
      try {
        const data = await action();
        onSuccess(data);
      } catch (error) {
        pushToast({ variant: "error", title: `${key} failed`, message: normalizeError(error) });
      } finally {
        setLoadingKey("");
      }
    },
    [pushToast]
  );

  const generateSummary = useCallback(
    () => runTool("Summary", () => api.summarize(fileName), setSummary),
    [fileName, runTool]
  );

  const generateConceptMap = useCallback(
    () => runTool("Concept map", () => api.conceptMap({ file_name: fileName, output_format: "mermaid" }), setConceptMap),
    [fileName, runTool]
  );

  const generateVoice = useCallback(
    () => runTool("Voice overview", () => api.voiceOverview({ file_name: fileName, language: "en" }), setVoice),
    [fileName, runTool]
  );

  const findVideos = useCallback(
    (topic) =>
      runTool(
        "YouTube",
        () => api.youtubeVideos({ topic: topic || null, file_name: topic ? null : fileName, sort_by: "views", max_results: 5 }),
        setVideos
      ),
    [fileName, runTool]
  );

  return useMemo(
    () => ({
      health,
      summary,
      conceptMap,
      voice,
      videos,
      loadingKey,
      loadHealth,
      generateSummary,
      generateConceptMap,
      generateVoice,
      findVideos,
    }),
    [health, summary, conceptMap, voice, videos, loadingKey, loadHealth, generateSummary, generateConceptMap, generateVoice, findVideos]
  );
}
