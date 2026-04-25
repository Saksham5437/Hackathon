import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { api } from "../services/api.js";
import { CHAT_DRAFT_KEY, SESSION_STORAGE_KEY } from "../utils/constants.js";
import { makeSessionId, normalizeError } from "../utils/formatters.js";

function toUiMessages(messages = []) {
  return messages.map((message) => ({
    id: crypto.randomUUID(),
    role: message.role,
    content: message.content,
    sources: [],
    createdAt: new Date().toISOString(),
  }));
}

export function useChat() {
  const { user } = useAuth();
  const { pushToast } = useToast();
  const [sessionId, setSessionId] = useState(() => localStorage.getItem(SESSION_STORAGE_KEY) || makeSessionId(user?.username));
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState(() => localStorage.getItem(CHAT_DRAFT_KEY) || "");
  const [asking, setAsking] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  }, [sessionId]);

  useEffect(() => {
    localStorage.setItem(CHAT_DRAFT_KEY, draft);
  }, [draft]);

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const data = await api.getSession(sessionId);
      setMessages(toUiMessages(data.messages || []));
    } catch (error) {
      pushToast({ variant: "error", title: "Session history unavailable", message: normalizeError(error) });
    } finally {
      setHistoryLoading(false);
    }
  }, [pushToast, sessionId]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const askQuestion = useCallback(
    async (question, fileName = null) => {
      const cleanQuestion = question.trim();
      if (!cleanQuestion) return;

      const userMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: cleanQuestion,
        sources: [],
        createdAt: new Date().toISOString(),
      };

      setMessages((current) => [...current, userMessage]);
      setDraft("");
      setAsking(true);

      try {
        const data = await api.ask({
          question: cleanQuestion,
          session_id: sessionId,
          include_sources: true,
          file_name: fileName,
        });
        setMessages((current) => [
          ...current,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: data.answer,
            sources: data.sources || [],
            createdAt: new Date().toISOString(),
          },
        ]);
      } catch (error) {
        setMessages((current) => [
          ...current,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: normalizeError(error),
            sources: [],
            createdAt: new Date().toISOString(),
            isError: true,
          },
        ]);
      } finally {
        setAsking(false);
      }
    },
    [sessionId]
  );

  const clearSession = useCallback(async () => {
    try {
      await api.clearSession(sessionId);
      setMessages([]);
      pushToast({ variant: "success", title: "Session cleared", message: "Conversation memory is empty." });
    } catch (error) {
      pushToast({ variant: "error", title: "Clear failed", message: normalizeError(error) });
    }
  }, [pushToast, sessionId]);

  const startNewSession = useCallback(() => {
    const nextId = makeSessionId(user?.username);
    setSessionId(nextId);
    setMessages([]);
    setDraft("");
  }, [user?.username]);

  return useMemo(
    () => ({
      sessionId,
      messages,
      draft,
      asking,
      historyLoading,
      setDraft,
      askQuestion,
      clearSession,
      startNewSession,
      loadHistory,
    }),
    [sessionId, messages, draft, asking, historyLoading, askQuestion, clearSession, startNewSession, loadHistory]
  );
}
