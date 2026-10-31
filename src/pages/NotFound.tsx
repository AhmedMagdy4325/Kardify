import { useTranslation } from "react-i18next";
import NotFoundState from "@/components/common/NotFoundState";

export default function NotFound() {
  const { t } = useTranslation("notFound");

  {
    /* Passing the translated title, message and button text to the Not found component */
  }
  return (
    <NotFoundState
      code="404"
      title={t("title")}
      message={t("message")}
      linkTo="/"
      linkLabel={t("backHome")}
    />
  );
}
