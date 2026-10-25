import { Menu } from "lucide-react";
import AppButton from "../ui/AppButton";
import ThemeToggle from "../common/ThemeToggle";
import LngToggle from "../common/LngToggle";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

type HeaderProps = { onMenuClick?: () => void };

export default function Header({ onMenuClick }: HeaderProps) {
  const { t } = useTranslation();
  return (
    <header
      className="flex items-center justify-between border-b border-border bg-surface px-4 py-2 sticky top-0 z-50 h-14"
      dir="auto"
    >
      <div className="flex items-center gap-2">
        <Link to="/" className="font-semibold">
          Kardify
        </Link>
      </div>

      <div className="flex items-center gap-1">
        <ThemeToggle />
        <LngToggle />
        <AppButton
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
          aria-label={t("openMenu")}
        >
          <Menu size={20} />
        </AppButton>
      </div>
    </header>
  );
}
