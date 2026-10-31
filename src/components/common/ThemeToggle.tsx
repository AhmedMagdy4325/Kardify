import { Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../hooks/useTheme";
import Button from "../ui/AppButton";

/** Header button that switches the app between Dark and Light. */

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  // on click shange icon and call toggle theme
  return (
    <Button
      onClick={toggleTheme}
      aria-label={t("toggleTheme")}
      className="rounded-lg p-2 text-foreground-muted hover:bg-surface-hover"
      variant="ghost"
    >
      {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
    </Button>
  );
}
