import { createSlice } from "@reduxjs/toolkit";

import type { PayloadAction } from "@reduxjs/toolkit";

import type { Card } from "../types";
import { cards as dummyCards } from "../data/dummy";
import { deleteList } from "./listsSlice";

import { current } from "@reduxjs/toolkit";
import { moveCard as moveCardInList } from "@/utils/moveCard";

const initialState: Card[] = dummyCards;

const cardsSlice = createSlice({
  name: "cards",
  initialState,
  reducers: {
    addCard(state, action: PayloadAction<Omit<Card, "order" | "completed">>) {
      const orders = state
        .filter((c) => c.listId === action.payload.listId)
        .map((c) => c.order);
      const nextOrder = Math.max(-1, ...orders) + 1;
      state.push({ ...action.payload, order: nextOrder, completed: false });
    },
    editCard(
      state,
      action: PayloadAction<{
        id: string;
        changes: Partial<Omit<Card, "id" | "listId" | "order">>;
      }>,
    ) {
      const card = state.find((c) => c.id === action.payload.id);
      if (card) Object.assign(card, action.payload.changes);
    },
    deleteCard(state, action: PayloadAction<string>) {
      return state.filter((c) => c.id !== action.payload);
    },
    toggleComplete(state, action: PayloadAction<string>) {
      const card = state.find((c) => c.id === action.payload);
      if (card) card.completed = !card.completed;
    },
    moveCard(
      state,
      action: PayloadAction<{
        cardId: string;
        toListId: string;
        toIndex: number;
      }>,
    ) {
      const { cardId, toListId, toIndex } = action.payload;
      return moveCardInList(current(state), cardId, toListId, toIndex);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(deleteList, (state, action) => {
      return state.filter((c) => c.listId !== action.payload);
    });
  },
});

export const { addCard, editCard, deleteCard, moveCard, toggleComplete } =
  cardsSlice.actions;

export default cardsSlice.reducer;
