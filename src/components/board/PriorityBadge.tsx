import { useTranslation } from "react-i18next";
import type { Priority } from "../../types";

type PriorityBadgeProps = {
  priority: Priority;
};

// styles added based on priority
const priorities: Record<Priority, string> = {
  low: "bg-priority-low-bg text-priority-low-text",
  medium: "bg-priority-medium-bg text-priority-medium-text",
  high: "bg-priority-high-bg text-priority-high-text",
};

// the base style for all badges
const base =
  "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium";

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  // join all strings into one
  const classes = [base, priorities[priority]].join(" ");
  const { t } = useTranslation();
  return <span className={classes}>{t(`priority.${priority}`)}</span>;
}
