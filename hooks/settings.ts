import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const themes = ["light", "dark"] as const;
type Theme = typeof themes[number];

interface Settings {
  theme: Theme;
}

const settingsAtom = atomWithStorage<Settings>("settings", {
  theme: "dark",
});

export const useSettings = () => {
  const [settings, setSettings] = useAtom(settingsAtom);

  const mergeSettings = (newSettings: Partial<Settings>) => {
    setSettings({ ...settings, ...newSettings });
  };

  return { settings, setSettings, mergeSettings };
};

export const useTheme = () => {
  const { settings, mergeSettings } = useSettings();

  const setTheme = (theme: Theme) => {
    mergeSettings({ theme });
    document.documentElement.className = theme;
  };

  const theme = settings.theme;

  return {
    theme,
    setTheme,
  };
};
