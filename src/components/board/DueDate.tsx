import { useTranslation } from "react-i18next";
import { CircleAlert, Clock } from "lucide-react";
import { formatDueDate } from "@/utils/formatDate";
import { getDueState, type DueState } from "@/utils/date";

// Class strings are written out in full so Tailwind can find them
const styles: Record<DueState, string> = {
  overdue: "text-danger font-medium",
  soon: "text-warning font-medium",
  normal: "text-foreground-muted",
};

type Props = { dueDate: string; completed: boolean };

/** A card's due date: red when overdue, yellow when due today or tomorrow. */
export default function DueDate({ dueDate, completed }: Props) {
  const { t, i18n } = useTranslation("board");
  // A completed card is never late, so it stays neutral
  const state: DueState = completed ? "normal" : getDueState(dueDate);

  return (
    <span className={`inline-flex items-center gap-1 text-xs ${styles[state]}`}>
      {state === "overdue" && <CircleAlert size={12} aria-hidden />}
      {state === "soon" && <Clock size={12} aria-hidden />}
      {formatDueDate(dueDate, i18n.resolvedLanguage ?? "en")}
      {/* Text for screen readers, so the state isn't shown by color alone */}
      {state !== "normal" && (
        <span className="sr-only">
          {t(state === "overdue" ? "overdue" : "dueSoon")}
        </span>
      )}
    </span>
  );
}
