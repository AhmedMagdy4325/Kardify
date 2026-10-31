import { useTranslation } from "react-i18next";
import type { Card as CardType, List as ListType } from "../../types";
import AppButton from "../ui/AppButton";
import CardItem from "./CardItem";
import { MoreHorizontal, Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import RenameListDialog from "./RenameListDialog";
import DeleteListDialog from "./DeleteListDialog";
import AddCardDialog from "./AddCardDialog";
import { useDroppable } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import { CollisionPriority } from "@dnd-kit/abstract";

type ListColumnProps = {
  cards: CardType[];
  list: ListType;
};

// One draggable card. `group` is the list it is currently shown in (not
// card.listId), so dnd-kit and the drag draft agree while dragging.
function SortableCard({
  card,
  index,
  listId,
}: {
  card: CardType;
  index: number;
  listId: string;
}) {
  const { ref, isDragging } = useSortable({
    id: card.id,
    index,
    group: listId,
    type: "item",
    accept: "item",
  });

  return (
    <li ref={ref} className={isDragging ? "opacity-50" : undefined}>
      <CardItem card={card} />
    </li>
  );
}

/** One list: header with menu, droppable card area, and an add-card button. */
export default function ListColumn({ cards, list }: ListColumnProps) {
  // Open state of the three dialogs
  const [renameOpen, setRenameOpen] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [addCardOpen, setAddCardOpen] = useState(false);
  const { i18n, t } = useTranslation(["board", "common"]);
  const dir = i18n.dir();

  // Makes the list a drop target, so an empty list can receive cards.
  // Low priority: hovering over a card wins over hovering over the list.
  const { ref: dropRef } = useDroppable({
    id: list.id,
    type: "column",
    accept: "item",
    collisionPriority: CollisionPriority.Low,
  });

  return (
    <div className="w-72 shrink-0 flex flex-col gap-3">
      {/* Header: title, card count, menu */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <h2
            dir="auto"
            className="truncate text-sm font-semibold text-foreground"
          >
            {list.title}
          </h2>
          <span className="shrink-0 rounded-full bg-surface-hover px-2 py-0.5 text-xs text-foreground-muted">
            {cards.length}
          </span>
        </div>
        <div>
          <DropdownMenu dir={dir}>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                aria-label={t("board:moreOptions")}
              >
                <MoreHorizontal aria-hidden />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setRenameOpen(true)}>
                {t("board:rename")}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-danger focus:text-danger"
                onSelect={() => setDeleteOpen(true)}
              >
                {t("board:delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Cards. min-h keeps an empty list tall enough to drop into. */}
      <ul
        className="flex flex-col gap-2 overflow-y-auto overflow-x-hidden min-h-16 max-h-[70vh]"
        ref={dropRef}
      >
        {cards.length === 0 && (
          <li className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-foreground-muted">
            {t("board:noCards")}
          </li>
        )}
        {cards.map((card, index) => (
          <SortableCard
            key={card.id}
            card={card}
            index={index}
            listId={list.id}
          />
        ))}
      </ul>

      <AppButton
        variant="ghost"
        size="md"
        className="w-full justify-start"
        onClick={() => setAddCardOpen(true)}
      >
        <Plus size={16} aria-hidden />
        {t("addCard")}
      </AppButton>

      {/* Dialogs sit outside the menu, so closing the menu doesn't unmount them */}
      <RenameListDialog
        list={list}
        open={renameOpen}
        onOpenChange={setRenameOpen}
      />
      <DeleteListDialog
        list={list}
        cardCount={cards.length}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
      <AddCardDialog
        listId={list.id}
        open={addCardOpen}
        onOpenChange={setAddCardOpen}
      />
    </div>
  );
}
