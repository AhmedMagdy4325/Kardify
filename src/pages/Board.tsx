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

export default function Board() {
  const { id } = useParams();
  const { t } = useTranslation("board");
  const dispatch = useAppDispatch();
  const projects = useAppSelector((s) => s.projects);
  const lists = useAppSelector((s) => s.lists);
  const cards = useAppSelector((s) => s.cards);
  const [searchParams, setSearchParams] = useSearchParams();
  const openCardId = searchParams.get("card");

  const cardsByList = useMemo(() => {
    const groups: Record<string, Card[]> = {};
    for (const c of [...cards].sort((a, b) => a.order - b.order)) {
      (groups[c.listId] ??= []).push(c);
    }
    return groups;
  }, [cards]);

  const cardsById = useMemo(
    () =>
      Object.fromEntries(cards.map((c) => [c.id, c])) as Record<string, Card>,
    [cards],
  );

  const [draft, setDraft] = useState<Record<string, string[]> | null>(null);
  const draftRef = useRef<Record<string, string[]> | null>(null);

  function updateDraft(next: Record<string, string[]> | null) {
    draftRef.current = next;
    setDraft(next);
  }

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

  const projectLists = lists
    .filter((l) => l.projectId === project.id)
    .sort((a, b) => a.order - b.order);

  function cardsFor(listId: string): Card[] {
    if (!draft) return cardsByList[listId] ?? [];
    return (draft[listId] ?? [])
      .map((cardId) => cardsById[cardId])
      .filter((c): c is Card => Boolean(c));
  }

  const openCard = cards.find((c) => c.id === openCardId);
  const drawerCard =
    openCard && projectLists.some((l) => l.id === openCard.listId)
      ? openCard
      : undefined;

  function closeDrawer() {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete("card");
        return next;
      },
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
          onDragStart={() => {
            const d: Record<string, string[]> = {};
            for (const l of projectLists) {
              d[l.id] = (cardsByList[l.id] ?? []).map((c) => c.id);
            }
            updateDraft(d);
          }}
          onDragOver={(event) => {
            if (!draftRef.current) return;
            updateDraft(move(draftRef.current, event));
          }}
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
                break;
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
