import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Plus } from "lucide-react";
import AppButton from "@/components/ui/AppButton";
import CreateProjectDialog from "@/components/projects/CreateProjectDialog";

export default function Home() {
  const { t } = useTranslation(["home", "projects"]);

  return (
    <div className="relative isolate overflow-hidden bg-[radial-gradient(ellipse_at_top,var(--accent-soft),transparent_65%)]">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 size-96 -translate-x-1/2 rounded-full bg-accent/20 blur-3xl"
      />
      <section className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center gap-6 px-4 py-12 text-center">
        <h1 className="bg-linear-to-r from-foreground to-accent bg-clip-text text-5xl font-bold tracking-tight text-transparent md:text-7xl">
          Kardify
        </h1>
        <p className="text-lg font-medium md:text-xl">{t("tagline")}</p>
        <p className="max-w-xl text-sm text-foreground-muted md:text-base">
          {t("description")}
        </p>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          {/* on click go to projects page */}
          <Link
            to="/projects"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground shadow-sm transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {t("goToProjects")}
            <ArrowRight size={16} aria-hidden className="rtl:rotate-180" />
          </Link>
          {/* on click open create project dialog */}
          <CreateProjectDialog
            trigger={
              <AppButton variant="secondary" className="px-5 py-2.5">
                <Plus size={16} aria-hidden />
                {t("projects:createProject")}
              </AppButton>
            }
          />
        </div>
      </section>
    </div>
  );
}
