import type { Card } from "@/types";

export function moveCard(
  cards: Card[],
  cardId: string,
  toListId: string,
  toIndex: number,
): Card[] {
  const card = cards.find((c) => c.id === cardId);
  if (!card) return cards;

  const fromListId = card.listId;
  // ids of a list in display order, without the moved card
  const idsOf = (listId: string) =>
    cards
      .filter((c) => c.listId === listId && c.id !== cardId)
      .sort((a, b) => a.order - b.order)
      .map((c) => c.id);

  const sourceIds = idsOf(fromListId);
  const destIds = fromListId === toListId ? sourceIds : idsOf(toListId);

  const index = Math.max(0, Math.min(toIndex, destIds.length));
  destIds.splice(index, 0, cardId);

  // new list and order for every card in the two lists
  const updates = new Map<string, { listId: string; order: number }>();
  sourceIds.forEach((id, i) =>
    updates.set(id, { listId: fromListId, order: i }),
  );
  destIds.forEach((id, i) => updates.set(id, { listId: toListId, order: i }));

  return cards.map((c) => {
    const next = updates.get(c.id);
    return next ? { ...c, ...next } : c;
  });
}
