import { useTranslation } from "react-i18next";
import Button from "../ui/AppButton";

/** Header button that switches the app between English and Arabic. */
export default function LngToggle() {
  const { t, i18n } = useTranslation();

  // `resolvedLanguage` is the language actually in use ("en" or "ar").
  // `language` can be a detected value such as "en-US", which would break
  // this comparison.
  const isEnglish = i18n.resolvedLanguage === "en";

  // Switching the language is all this component does. The page direction
  // (dir="rtl") and the lang attribute are updated in i18n.ts, in a
  // "languageChanged" listener, so every language change goes through one place.
  const toggleLanguage = () => {
    i18n.changeLanguage(isEnglish ? "ar" : "en");
  };

  return (
    // The label shows the language you will switch TO, not the current one.
    <Button
      variant="ghost"
      onClick={toggleLanguage}
      aria-label={t("switchLanguage")}
    >
      {isEnglish ? "Ar" : "En"}
    </Button>
  );
}
