import type { Project as ProjectType } from "@/types";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import EditProjectDialog from "./EditProjectDialog";
import DeleteProjectDialog from "./DeleteProjectDialog";

type ProjectCardProps = { project: ProjectType; listCount: number };

/** The single prject card which have title projects' lists count and the dropdown */
export default function ProjectCard({ project, listCount }: ProjectCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { t, i18n } = useTranslation("projects");

  return (
    <>
      <div className="relative flex h-full flex-col gap-2 rounded-xl border border-border bg-surface p-4 transition-colors hover:bg-surface-hover has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-accent">
        <div className="flex items-start justify-between gap-2">
          <h2 className="min-w-0 truncate text-base font-semibold" dir="auto">
            {/* The title is a link for the project details */}
            <Link
              to={`/projects/${project.id}`}
              className="after:absolute after:inset-0 focus-visible:outline-none"
            >
              {project.name}
            </Link>
          </h2>

          {/*Dropdown for rename or delete choices */}
          <div className="relative z-10">
            <DropdownMenu dir={i18n.dir()}>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label={t("moreOptions")}
                >
                  <MoreHorizontal aria-hidden />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => setEditOpen(true)}>
                  {t("edit")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-danger focus:text-danger"
                  onSelect={() => setDeleteOpen(true)}
                >
                  {t("delete")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <p
          className="line-clamp-2 min-h-10 text-sm text-foreground-muted"
          dir="auto"
        >
          {project.description}
        </p>
        <span className="mt-auto pt-2 text-xs text-foreground-muted">
          {t("listsCount", { count: listCount })}
        </span>
      </div>

      {/* Edit project dialog opens on choose edit from dropdown */}
      <EditProjectDialog
        project={project}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      {/* Delete project dialog opens on choose edit from dropdown */}
      <DeleteProjectDialog
        project={project}
        listCount={listCount}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}
