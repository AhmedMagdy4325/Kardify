import { useTranslation } from "react-i18next";
import Button from "../ui/AppButton";

export default function LngToggle() {
  const { i18n } = useTranslation();
  const isEnglish = i18n.resolvedLanguage === "en";
  const toggleLanguage = () => {
    i18n.changeLanguage(isEnglish ? "ar" : "en");
  };

  return (
    <>
      <Button variant="ghost" onClick={toggleLanguage} aria-label="">
        {isEnglish ? "Ar" : "En"}
      </Button>
    </>
  );
}
