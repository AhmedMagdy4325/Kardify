import type { Card as CardType } from "../../types";
import { useTranslation } from "react-i18next";

import PriorityBadge from "./PriorityBadge";
import AppButton from "../ui/AppButton";
import { Circle, CircleCheck } from "lucide-react";
import { toggleComplete } from "../../store/cardsSlice";
import { useAppDispatch } from "../../store/hooks";
import { useSearchParams } from "react-router-dom";
import DueDate from "./DueDate";
type CardItemProps = {
  card: CardType;
};

/** A card on the board: complete checker, title (opens the drawer), due date and priority. */
export default function CardItem({ card }: CardItemProps) {
  const { t } = useTranslation("board");
  const dispatch = useAppDispatch();
  const [, setSearchParams] = useSearchParams();

  // The open card lives in the URL (?card=id). Copy the current params and set `card`.
  function openCard() {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("card", card.id);
      return next;
    });
  }
  return (
    <div className=" relative bg-surface border border-border rounded-xl p-3 flex flex-col gap-2">
      <div className="flex gap-2 items-center">
        {/* Checker: toggles complete (announced as a checkbox to screen readers) */}
        <AppButton
          variant="ghost"
          size="xs"
          onClick={() => dispatch(toggleComplete(card.id))}
          role="checkbox"
          aria-checked={card.completed}
          aria-label={t(card.completed ? "markIncomplete" : "markComplete")}
          className={[
            "relative z-10",
            card.completed ? "text-accent" : "text-foreground-muted",
          ].join(" ")}
        >
          {card.completed ? (
            <CircleCheck size={20} aria-hidden />
          ) : (
            <Circle size={20} aria-hidden />
          )}
        </AppButton>
        <h3 className="min-w-0 text-sm font-medium">
          {/* Title opens the drawer; completed cards are muted and struck through */}
          <button
            type="button"
            dir="auto"
            onClick={openCard}
            className={[
              "text-start wrap-break-word focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-accent  cursor-pointer",
              card.completed ? "line-through text-foreground-muted" : "",
            ].join(" ")}
          >
            {card.title}
          </button>
        </h3>
      </div>

      <div className="flex items-center gap-2">
        {card.dueDate && (
          <DueDate dueDate={card.dueDate} completed={card.completed} />
        )}

        <PriorityBadge priority={card.priority} />
      </div>
    </div>
  );
}
