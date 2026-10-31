import { useAppDispatch } from "@/store/hooks";
import { addProject } from "@/store/projectsSlice";
import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import ProjectForm from "./ProjectForm";

// The caller supplies the button, so the same dialog can be opened from the
// Projects page, the sidebar and the Home page without duplicating it.
type Props = { trigger: ReactNode };

/** Dialog for creating a project. It owns its open state, so callers only pass a trigger. */
export default function CreateProjectDialog({ trigger }: Props) {
  const { t } = useTranslation(["projects", "common"]);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  function handleCreate(values: { name: string; description: string }) {
    // The id and timestamp are made here, not in the reducer: reducers must be
    // pure, so the same action always produces the same state.
    // The id sits in a variable because it is needed twice: in the new project
    // and in the redirect.
    const id = crypto.randomUUID();
    dispatch(
      addProject({ id, ...values, createdAt: new Date().toISOString() }),
    );
    setOpen(false);
    // Land on the new (empty) board
    navigate(`/projects/${id}`);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* asChild makes the caller's element the trigger. It must be exactly
          one element, not text, a fragment or two siblings. */}
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("createProject")}</DialogTitle>
          {/* Radix warns in the console if a description is missing */}
          <DialogDescription>{t("createDescription")}</DialogDescription>
        </DialogHeader>
        <ProjectForm
          submitLabel={t("common:create")}
          onSubmit={handleCreate}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
