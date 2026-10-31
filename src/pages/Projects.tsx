import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/store/hooks";
import ProjectCard from "@/components/projects/ProjectCard";
import { Plus } from "lucide-react";
import CreateProjectDialog from "@/components/projects/CreateProjectDialog";

export default function Projects() {
  const { t } = useTranslation("projects");
  const projects = useAppSelector((s) => s.projects);
  const lists = useAppSelector((s) => s.lists);

  {
    /* List counts for the project, saved to avoide over calculate on each render and only changes on lists change  */
  }
  const listCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const l of lists) counts[l.projectId] = (counts[l.projectId] ?? 0) + 1;
    return counts;
  }, [lists]);

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">{t("title")}</h1>
      </div>
      {/* if no projects show create project message */}
      {projects.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-2 text-center">
          <p className="text-lg font-semibold">{t("emptyTitle")}</p>
          <p className="max-w-sm text-sm text-foreground-muted">
            {t("emptyHint")}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <>
              <ProjectCard
                key={p.id}
                project={p}
                listCount={listCounts[p.id] ?? 0}
              />
            </>
          ))}
          {/* create project dialog shows on button click */}
          <CreateProjectDialog
            trigger={
              <button
                type="button"
                className="flex h-full min-h-28 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border p-4 text-foreground-muted transition-colors hover:bg-surface-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <Plus size={20} aria-hidden />
                <span className="text-sm font-medium">
                  {t("createProject")}
                </span>
              </button>
            }
          />
        </div>
      )}
    </div>
  );
}
