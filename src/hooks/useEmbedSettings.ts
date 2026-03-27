import { useState, useEffect, useCallback, useRef } from "react";
import { companyApi } from "@/utils/company/api";
import type { EmbedSettings } from "@/types/settings";
import { DEFAULT_EMBED_SETTINGS } from "@/types/settings";

interface UseEmbedSettingsReturn {
  settings: EmbedSettings;
  loading: boolean;
  saving: boolean;
  error: string | null;
  updateSetting: <K extends keyof EmbedSettings>(
    key: K,
    value: EmbedSettings[K]
  ) => void;
}

export function useEmbedSettings(): UseEmbedSettingsReturn {
  const [settings, setSettings] = useState<EmbedSettings>(DEFAULT_EMBED_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load settings from API
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await companyApi.get("/auth/company/embed-settings");
        const data = response.data.settings;
        if (data) {
          setSettings({
            theme: data.theme || DEFAULT_EMBED_SETTINGS.theme,
            position: data.position || DEFAULT_EMBED_SETTINGS.position,
            primaryColor: data.primaryColor || DEFAULT_EMBED_SETTINGS.primaryColor,
            welcomeText: data.welcomeText || DEFAULT_EMBED_SETTINGS.welcomeText,
            subtitleText: data.subtitleText || DEFAULT_EMBED_SETTINGS.subtitleText,
            placeholderText: data.placeholderText ?? DEFAULT_EMBED_SETTINGS.placeholderText,
            showHeaderSubtitle: data.showHeaderSubtitle ?? DEFAULT_EMBED_SETTINGS.showHeaderSubtitle,
            hideBranding: data.hideBranding ?? DEFAULT_EMBED_SETTINGS.hideBranding,
            autoOpenDelay: data.autoOpenDelay ?? DEFAULT_EMBED_SETTINGS.autoOpenDelay,
            headerColor: data.headerColor ?? DEFAULT_EMBED_SETTINGS.headerColor,
            buttonIcon: data.buttonIcon || DEFAULT_EMBED_SETTINGS.buttonIcon,
            chatTemplate: data.chatTemplate || DEFAULT_EMBED_SETTINGS.chatTemplate,
            suggestedMessages: data.suggestedMessages ?? DEFAULT_EMBED_SETTINGS.suggestedMessages,
          });
        }
      } catch (err) {
        console.error("Failed to load embed settings:", err);
        setError("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Save settings with debounce
  const saveSettings = useCallback(async (newSettings: EmbedSettings) => {
    setSaving(true);
    setError(null);
    try {
      await companyApi.put("/auth/company/embed-settings", {
        theme: newSettings.theme,
        position: newSettings.position,
        primaryColor: newSettings.primaryColor,
        headerColor: newSettings.headerColor,
        welcomeText: newSettings.welcomeText,
        subtitleText: newSettings.subtitleText,
        placeholderText: newSettings.placeholderText,
        showHeaderSubtitle: newSettings.showHeaderSubtitle,
        hideBranding: newSettings.hideBranding,
        autoOpenDelay: newSettings.autoOpenDelay,
        buttonIcon: newSettings.buttonIcon,
        chatTemplate: newSettings.chatTemplate,
        suggestedMessages: newSettings.suggestedMessages,
      });
    } catch (err) {
      console.error("Failed to save embed settings:", err);
      setError("Failed to save settings");
    } finally {
      setSaving(false);
    }
  }, []);

  // Update a single setting — updates React state immediately (instant preview),
  // then debounces the API save to persist to backend
  const updateSetting = useCallback(
    <K extends keyof EmbedSettings>(key: K, value: EmbedSettings[K]) => {
      setSettings((prev) => {
        const newSettings = { ...prev, [key]: value };

        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }

        saveTimeoutRef.current = setTimeout(() => {
          saveSettings(newSettings);
        }, 500);

        return newSettings;
      });
    },
    [saveSettings]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    settings,
    loading,
    saving,
    error,
    updateSetting,
  };
}
