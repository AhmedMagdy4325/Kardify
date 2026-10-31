import type { Project as ProjectType } from "@/types";
import { useTranslation } from "react-i18next";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAppDispatch } from "@/store/hooks";
import { deleteProjectCascade } from "@/store/thunks";
import { useNavigate } from "react-router-dom";

type DeleteProjectDialogProps = {
  project: ProjectType;
  listCount: number; // shown in the message so the user knows what they lose
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * Confirmation before deleting a project and everything inside it.
 * It is an AlertDialog (not a normal Dialog): it's meant for destructive
 * actions, and clicking outside doesn't dismiss it by accident.
 * Opened from the project card's menu, which controls `open`.
 */
export default function DeleteProjectDialog({
  project,
  listCount,
  open,
  onOpenChange,
}: DeleteProjectDialogProps) {
  const { t } = useTranslation(["projects", "common"]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("deleteProjectTitle")}</AlertDialogTitle>
          <AlertDialogDescription>
            {/* Zero lists has its own message. Otherwise the base key plus
                `count` lets i18next pick the right plural form per language
                (Arabic has six). */}
            {listCount === 0
              ? t("deleteProjectEmpty", { title: project.name })
              : t("deleteProjectMessage", {
                  title: project.name,
                  count: listCount,
                })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("common:cancel")}</AlertDialogCancel>
          <AlertDialogAction
            // The ! forces these colors over the default button background
            className="bg-danger/90! text-accent-foreground hover:opacity-80"
            onClick={() => {
              // Always the cascade thunk, never deleteProject alone: it deletes
              // each list first (the cards slice removes their cards in response),
              // then the project, so no orphaned lists or cards are left.
              dispatch(deleteProjectCascade(project.id));
              // If the user was viewing this project's board it no longer
              // exists, so leave it. Harmless when already on the Projects page.
              navigate("/projects");
              // AlertDialogAction closes the dialog by itself.
            }}
          >
            {t("projects:delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
