import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAppDispatch } from "@/store/hooks";
import { addCard } from "@/store/cardsSlice";
import CardForm, { type CardFormValues } from "./CardForm";

type Props = {
  listId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/** Dialog for adding a card to a list. The list's "Add card" button controls `open`. */
export default function AddCardDialog({ listId, open, onOpenChange }: Props) {
  const { t } = useTranslation(["board", "common"]);
  const dispatch = useAppDispatch();

  function handleAdd(values: CardFormValues) {
    // Only the id is created here; the reducer adds `order` and `completed`
    dispatch(addCard({ id: crypto.randomUUID(), listId, ...values }));
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("addCard")}</DialogTitle>
          <DialogDescription>{t("addCardDescription")}</DialogDescription>
        </DialogHeader>
        {/* The form is mounted inside DialogContent, so it starts empty each time */}
        <CardForm
          submitLabel={t("common:create")}
          onSubmit={handleAdd}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
