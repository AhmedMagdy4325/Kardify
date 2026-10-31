import type { Project as ProjectType } from "@/types";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAppDispatch } from "@/store/hooks";
import { updateProject } from "@/store/projectsSlice";
import ProjectForm from "./ProjectForm";

type EditProjectDialogProps = {
  project: ProjectType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * Dialog for editing a project's name and description.
 * It has no trigger of its own: the project card's menu opens it by setting
 * `open`. It reuses ProjectForm, so validation matches the create dialog.
 */
export default function EditProjectDialog({
  project,
  open,
  onOpenChange,
}: EditProjectDialogProps) {
  const { t } = useTranslation(["projects", "common"]);
  const dispatch = useAppDispatch();

  function handleUpdate(values: { name: string; description: string }) {
    dispatch(updateProject({ id: project.id, ...values }));
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("editProject")}</DialogTitle>
          <DialogDescription>{t("editDescription")}</DialogDescription>
        </DialogHeader>
        {/* The form is mounted inside DialogContent, so it reads the project's
            current values every time the dialog opens. Cancelling an edit never
            leaves stale text behind for the next time. */}
        <ProjectForm
          initialName={project.name}
          initialDescription={project.description}
          submitLabel={t("common:save")}
          onSubmit={handleUpdate}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
