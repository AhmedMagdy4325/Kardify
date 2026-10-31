import type { List as ListType } from "@/types";
import { useTranslation } from "react-i18next";
import AppButton from "../ui/AppButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { renameList } from "@/store/listsSlice";
import { Input } from "../ui/input";

type RenameListDialogProps = {
  list: ListType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/** Dialog for renaming a list. Opened from the list menu, which controls `open`. */
export default function RenameListDialog({
  list,
  open,
  onOpenChange,
}: RenameListDialogProps) {
  const { t } = useTranslation(["board", "common"]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("renameList")}</DialogTitle>
        </DialogHeader>
        <RenameListForm list={list} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

// Lives inside DialogContent, so it remounts and re-reads list.title every
// time the dialog opens (no stale text after a cancelled edit).
function RenameListForm({
  list,
  onDone,
}: {
  list: ListType;
  onDone: () => void;
}) {
  const { t } = useTranslation(["board", "common"]);
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState(list.title);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = title.trim();
    // Reject empty or whitespace-only titles
    if (!trimmed) return setError(t("titleRequired"));
    dispatch(renameList({ id: list.id, title: trimmed }));
    onDone();
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-5">
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
          dir="auto"
          aria-invalid={!!error}
          aria-describedby={error ? "list-error" : undefined}
          className="border border-border bg-surface rounded-md px-3 py-2 text-sm w-full"
        />
        {error && (
          <p id="list-error" className="text-sm text-danger mt-1">
            {error}
          </p>
        )}
      </div>
      <DialogFooter>
        <AppButton variant="primary" type="submit">
          {t("rename")}
        </AppButton>
        <AppButton
          variant="ghost"
          type="button"
          onClick={() => {
            onDone();
          }}
        >
          {t("common:cancel")}
        </AppButton>
      </DialogFooter>
    </form>
  );
}
