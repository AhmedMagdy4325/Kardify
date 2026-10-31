import { useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import ListColumn from "../components/board/ListColumn";
import AddListDialog from "@/components/board/AddListDialog";
import CardDrawer from "@/components/board/CardDrawer";
import NotFoundState from "@/components/common/NotFoundState";
import AppButton from "@/components/ui/AppButton";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { moveCard } from "../store/cardsSlice";
import type { Card } from "../types";

/**
 * The kanban board for one project (route: /projects/:id).
 * Reads projects, lists and cards from the store, renders the lists with drag
 * and drop, and shows the card drawer when the URL has ?card=<id>.
 */
export default function Board() {
  const { id } = useParams();
  const { t } = useTranslation("board");
  const dispatch = useAppDispatch();
  const projects = useAppSelector((s) => s.projects);
  const lists = useAppSelector((s) => s.lists);
  const cards = useAppSelector((s) => s.cards);

  // The open card lives in the URL (?card=<id>), not in state: a refresh or the
  // back button keeps working, and no callback has to be passed through
  // ListColumn down to CardItem.
  const [searchParams, setSearchParams] = useSearchParams();
  const openCardId = searchParams.get("card");

  // Cards grouped by list and sorted by `order`, computed once per cards change.
  // The sort works on a copy, because store state is frozen and must not be mutated.
  const cardsByList = useMemo(() => {
    const groups: Record<string, Card[]> = {};
    for (const c of [...cards].sort((a, b) => a.order - b.order)) {
      (groups[c.listId] ??= []).push(c);
    }
    return groups;
  }, [cards]);

  // Lookup by id, used to turn the draft's card ids back into cards while dragging.
  const cardsById = useMemo(
    () =>
      Object.fromEntries(cards.map((c) => [c.id, c])) as Record<string, Card>,
    [cards],
  );

  // --- Drag and drop -------------------------------------------------------
  // While a card is being dragged, the board renders from `draft` (card ids per
  // list) and not from the store. dnd-kit moves the card's DOM node between
  // lists during the drag, and React must render the same arrangement or it
  // crashes on the next update. The store changes only once, on drop.
  // Dispatching on every hover would also save to localStorage on every move.
  // `draft` is null whenever nothing is being dragged.
  const [draft, setDraft] = useState<Record<string, string[]> | null>(null);

  // Mirror of `draft` for the drag handlers. They can fire several times between
  // renders, and a ref always holds the latest value (state captured in a
  // closure can be stale).
  const draftRef = useRef<Record<string, string[]> | null>(null);

  function updateDraft(next: Record<string, string[]> | null) {
    draftRef.current = next;
    setDraft(next);
  }

  // All hooks must stay above this early return: React requires the same hooks
  // to run in the same order on every render.
  const project = projects.find((p) => p.id === id);

  if (!project)
    return (
      <NotFoundState
        code="*o*"
        title={t("projectNotFound")}
        linkTo="/projects"
        linkLabel={t("backToProjects")}
      />
    );

  // filter() already returns a new array, so sorting it doesn't touch the store.
  const projectLists = lists
    .filter((l) => l.projectId === project.id)
    .sort((a, b) => a.order - b.order);

  // The cards to show in a list: the real order normally, the draft order
  // while a drag is in progress.
  function cardsFor(listId: string): Card[] {
    if (!draft) return cardsByList[listId] ?? [];
    return (draft[listId] ?? [])
      .map((cardId) => cardsById[cardId])
      .filter((c): c is Card => Boolean(c));
  }

  // Only open the drawer for a card that belongs to this project. A stale link,
  // a deleted card or a card from another project simply opens nothing.
  const openCard = cards.find((c) => c.id === openCardId);
  const drawerCard =
    openCard && projectLists.some((l) => l.id === openCard.listId)
      ? openCard
      : undefined;

  function closeDrawer() {
    setSearchParams(
      (prev) => {
        // Copy the existing params so any other param is kept; only remove "card".
        const next = new URLSearchParams(prev);
        next.delete("card");
        return next;
      },
      // Replace the history entry, so Back doesn't reopen the drawer.
      { replace: true },
    );
  }

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6">
      <div className="mb-1">
        <h1 className="text-xl font-semibold" dir="auto">
          {project.name}
        </h1>
        {project.description && (
          <p className="mt-1 text-sm text-foreground-muted" dir="auto">
            {project.description}
          </p>
        )}
      </div>

      {projectLists.length === 0 ? (
        // Empty state: a project with no lists yet
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
          <p className="text-lg font-semibold">{t("noListsTitle")}</p>
          <p className="max-w-sm text-sm text-foreground-muted">
            {t("noListsHint")}
          </p>
          <AddListDialog
            projectId={project.id}
            trigger={
              <AppButton variant="primary">
                <Plus size={16} aria-hidden />
                {t("createList")}
              </AppButton>
            }
          />
        </div>
      ) : (
        <DragDropProvider
          // Start: copy the current card ids per list into the draft.
          onDragStart={() => {
            const d: Record<string, string[]> = {};
            for (const l of projectLists) {
              d[l.id] = (cardsByList[l.id] ?? []).map((c) => c.id);
            }
            updateDraft(d);
          }}
          // Over: the `move` helper returns the draft with the dragged card
          // moved to where it is hovering, in the same or another list.
          onDragOver={(event) => {
            if (!draftRef.current) return;
            updateDraft(move(draftRef.current, event));
          }}
          // End: throw the draft away, and if the drag wasn't cancelled (Escape),
          // dispatch one moveCard with the card's final list and index.
          onDragEnd={(event) => {
            const d = draftRef.current;
            updateDraft(null);
            if (event.canceled || !d) return;

            const cardId = String(event.operation.source?.id);
            for (const [listId, ids] of Object.entries(d)) {
              const index = ids.indexOf(cardId);
              if (index !== -1) {
                dispatch(
                  moveCard({ cardId, toListId: listId, toIndex: index }),
                );
                break; // the card is in exactly one list
              }
            }
          }}
        >
          <div className="flex items-start gap-4 overflow-x-auto pb-2">
            {projectLists.map((list) => (
              <ListColumn key={list.id} list={list} cards={cardsFor(list.id)} />
            ))}
            <AddListDialog projectId={project.id} />
          </div>
        </DragDropProvider>
      )}

      <CardDrawer card={drawerCard} onClose={closeDrawer} />
    </div>
  );
}
