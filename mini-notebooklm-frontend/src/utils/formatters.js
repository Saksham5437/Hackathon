export function formatBytes(bytes = 0) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

export function formatDate(value) {
  if (!value) return "Unknown";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function getFileExtension(fileName = "") {
  const match = fileName.match(/\.[^.]+$/);
  return match ? match[0].toLowerCase() : "";
}

export function normalizeError(error) {
  const detail = error?.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((item) => item.msg).join(", ");
  if (error?.code === "ECONNABORTED") return "The request timed out. The backend may still be working.";
  if (error?.message === "Network Error") {
    return "Cannot reach the backend. Check the API URL, server status, and CORS.";
  }
  return error?.message || "Something went wrong.";
}

export function makeSessionId(username = "guest") {
  const safeUser = username.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${safeUser || "guest"}-${crypto.randomUUID()}`;
}

export function isMermaid(value = "") {
  return /^\s*(mindmap|graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|journey|timeline)/i.test(value);
}
