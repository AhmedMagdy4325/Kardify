import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, Circle, Pencil, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import AppButton from "../ui/AppButton";
import PriorityBadge from "./PriorityBadge";
import CardForm, { type CardFormValues } from "./CardForm";
import DeleteCardDialog from "./DeleteCardDialog";
import { useAppDispatch } from "@/store/hooks";
import { editCard, toggleComplete } from "@/store/cardsSlice";
import type { Card as CardType } from "@/types";
import DueDate from "./DueDate";

// `card` is undefined when no card is open (the drawer is then closed)
type DrawerProps = { card: CardType | undefined; onClose: () => void };

/** Side drawer for one card. Open whenever `card` is set (Board reads ?card= from the URL). */
export default function CardDrawer({ card, onClose }: DrawerProps) {
  const { i18n } = useTranslation();
  return (
    <Sheet
      open={!!card}
      onOpenChange={(open) => {
        if (!open) onClose(); // Escape, outside click or the X button
      }}
    >
      {/* Slides in from the end side: right in English, left in Arabic */}
      <SheetContent
        side={i18n.dir() === "rtl" ? "left" : "right"}
        className="w-full overflow-y-auto sm:max-w-md"
      >
        {card && <DrawerContent card={card} onClose={onClose} />}
      </SheetContent>
    </Sheet>
  );
}

// Rendered only while the drawer is open, so its state (edit mode, delete
// dialog) resets every time a card is opened.
function DrawerContent({
  card,
  onClose,
}: {
  card: CardType;
  onClose: () => void;
}) {
  const { t } = useTranslation(["board", "common"]);
  const dispatch = useAppDispatch();
  const [editing, setEditing] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  function handleSave(values: CardFormValues) {
    dispatch(editCard({ id: card.id, changes: values }));
    setEditing(false); // go back to the details, which now show the new values
  }

  // Edit mode: the card form, prefilled
  if (editing) {
    return (
      <>
        <SheetHeader>
          <SheetTitle>{t("editCard")}</SheetTitle>
          <SheetDescription>{t("editCardDescription")}</SheetDescription>
        </SheetHeader>
        <div className="px-4 pb-4">
          <CardForm
            initialValues={{
              title: card.title,
              description: card.description,
              priority: card.priority,
              dueDate: card.dueDate,
            }}
            submitLabel={t("common:save")}
            onSubmit={handleSave}
            onCancel={() => setEditing(false)}
          />
        </div>
      </>
    );
  }

  // Details mode (the default)
  return (
    <>
      <SheetHeader>
        <SheetTitle
          dir="auto"
          className={[
            "break-words text-xl",
            card.completed ? "line-through text-foreground-muted" : "",
          ].join(" ")}
        >
          {card.title}
        </SheetTitle>
        <SheetDescription>{t("cardDetails")}</SheetDescription>
      </SheetHeader>

      <div className="flex flex-col gap-6 px-4">
        {/* Label/value pairs: status, priority, due date */}
        <dl className="grid grid-cols-[auto_1fr] items-center gap-x-6 gap-y-3 text-sm">
          <dt className="text-foreground-muted">{t("status")}</dt>
          <dd
            className={[
              "flex items-center gap-1.5 font-medium",
              card.completed ? "text-accent" : "text-foreground",
            ].join(" ")}
          >
            {card.completed ? (
              <Check size={16} aria-hidden />
            ) : (
              <Circle size={16} aria-hidden />
            )}
            {t(card.completed ? "statusCompleted" : "statusOpen")}
          </dd>

          <dt className="text-foreground-muted">{t("priority")}</dt>
          <dd>
            <PriorityBadge priority={card.priority} />
          </dd>

          <dt className="text-foreground-muted">{t("dueDate")}</dt>
          <dd className="font-medium">
            {card.dueDate ? (
              <DueDate dueDate={card.dueDate} completed={card.completed} />
            ) : (
              t("noDueDate")
            )}
          </dd>
        </dl>

        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase text-foreground-muted">
            {t("cardDescription")}
          </h3>
          {/* pre-wrap keeps the user's line breaks */}
          {card.description ? (
            <p dir="auto" className="whitespace-pre-wrap break-words text-sm">
              {card.description}
            </p>
          ) : (
            <p className="text-sm text-foreground-muted">
              {t("noDescription")}
            </p>
          )}
        </div>
      </div>

      <SheetFooter className="flex-row flex-wrap gap-2">
        <AppButton variant="secondary" onClick={() => setEditing(true)}>
          <Pencil size={16} aria-hidden />
          {t("edit")}
        </AppButton>
        <AppButton
          variant="ghost"
          onClick={() => dispatch(toggleComplete(card.id))}
        >
          {t(card.completed ? "markIncomplete" : "markComplete")}
        </AppButton>
        {/* ms-auto pushes Delete to the far end, away from the safe actions */}
        <AppButton
          variant="danger"
          className="ms-auto"
          onClick={() => setDeleteOpen(true)}
        >
          <Trash2 size={16} aria-hidden />
          {t("delete")}
        </AppButton>
      </SheetFooter>

      {/* After a confirmed delete, close the whole drawer */}
      <DeleteCardDialog
        card={card}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onDeleted={onClose}
      />
    </>
  );
}
