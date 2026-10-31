import type { Card } from "@/types";

/**
 * Pure function behind drag and drop: returns a new cards array with one card
 * moved to another position (same list or another list).
 *
 * `toIndex` is the card's FINAL position in the destination list, counted
 * after it has been taken out of its old place. Example: in [a, b, c],
 * moving a to toIndex 2 gives [b, c, a].
 *
 * Both affected lists are renumbered 0, 1, 2... so no two cards in a list
 * ever share an `order`. The input is never mutated, which keeps it safe to
 * call from a reducer and easy to unit-test.
 */
export function moveCard(
  cards: Card[],
  cardId: string,
  toListId: string,
  toIndex: number,
): Card[] {
  const card = cards.find((c) => c.id === cardId);
  if (!card) return cards; // unknown id: change nothing

  const fromListId = card.listId;
  // ids of a list in display order, without the moved card
  // (filter returns a copy, so sorting it doesn't touch the input)
  const idsOf = (listId: string) =>
    cards
      .filter((c) => c.listId === listId && c.id !== cardId)
      .sort((a, b) => a.order - b.order)
      .map((c) => c.id);

  const sourceIds = idsOf(fromListId);
  // Same list: reuse the same array, so there is only one list to renumber
  // and the card can't end up removed and inserted into two different copies.
  const destIds = fromListId === toListId ? sourceIds : idsOf(toListId);

  // Clamp: an index that is too small or too big (or a drop into an empty
  // list) goes to the start or the end instead of breaking.
  const index = Math.max(0, Math.min(toIndex, destIds.length));
  destIds.splice(index, 0, cardId);

  // new list and order for every card in the two lists
  const updates = new Map<string, { listId: string; order: number }>();
  sourceIds.forEach((id, i) =>
    updates.set(id, { listId: fromListId, order: i }),
  );
  // Set after the source list, so for the moved card this entry (with the new
  // list) wins; in the same-list case it simply repeats the same values.
  destIds.forEach((id, i) => updates.set(id, { listId: toListId, order: i }));

  // Cards in other lists are returned as the very same objects, so React and
  // Redux see them as unchanged.
  return cards.map((c) => {
    const next = updates.get(c.id);
    return next ? { ...c, ...next } : c;
  });
}
