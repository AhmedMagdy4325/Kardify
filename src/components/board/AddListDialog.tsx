import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "@/store/hooks";
import { useState, type ReactNode } from "react";
import AppButton from "../ui/AppButton";
import { Plus } from "lucide-react";
import { addList } from "@/store/listsSlice";
import { Input } from "../ui/input";

type AddListDialogProps = {
  projectId: string;
  trigger?: ReactNode; // optional: a default "Add list" button is used without it
};

/** Dialog for adding a list to a project. It owns its open state. */
export default function AddListDialog({
  projectId,
  trigger,
}: AddListDialogProps) {
  const { t } = useTranslation("board");
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  // Single place that opens/closes; closing always clears the fields, however
  // it was closed (Escape, outside click, Cancel or submit)
  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setTitle("");
      setError("");
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!title.trim()) {
      setError(t("titleRequired"));
      return;
    }
    // The reducer computes the list's `order`; only the id is created here
    dispatch(
      addList({ id: crypto.randomUUID(), projectId, title: title.trim() }),
    );
    handleOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {/* asChild needs exactly one element: the given trigger or the default button */}
      <DialogTrigger asChild>
        {trigger ?? (
          <AppButton
            variant="ghost"
            className="w-72 shrink-0 justify-start border border-dashed border-border"
          >
            <Plus />
            <span>{t("addList")}</span>
          </AppButton>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("addList")}</DialogTitle>
          <DialogDescription>{t("addListDescription")}</DialogDescription>
        </DialogHeader>
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
            <AppButton
              variant="ghost"
              type="button"
              onClick={() => handleOpenChange(false)}
            >
              {t("common:cancel")}
            </AppButton>
            <AppButton variant="primary" type="submit">
              {t("common:create")}
            </AppButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
