import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_API_BASE_URL, SETTINGS_STORAGE_KEY } from "../utils/constants.js";
import { getApiBaseUrl, setApiBaseUrl } from "../services/api.js";

const SettingsContext = createContext(null);

const defaultSettings = {
  apiBaseUrl: getApiBaseUrl() || DEFAULT_API_BASE_URL,
  theme: "light",
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      return { ...defaultSettings, ...JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY)) };
    } catch {
      return defaultSettings;
    }
  });

  useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    setApiBaseUrl(settings.apiBaseUrl);
    document.documentElement.dataset.theme = settings.theme;
  }, [settings]);

  const value = useMemo(
    () => ({
      settings,
      updateSettings: (patch) => setSettings((current) => ({ ...current, ...patch })),
      resetSettings: () => setSettings(defaultSettings),
    }),
    [settings]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used inside SettingsProvider");
  return context;
}
