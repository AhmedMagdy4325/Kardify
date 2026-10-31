import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { Plus } from "lucide-react";
import { useAppSelector } from "../../store/hooks";
import CreateProjectDialog from "../projects/CreateProjectDialog";
import AppButton from "../ui/AppButton";

type SidebarProps = {
  open: boolean; // only matters on small screens
  onClose: () => void;
};

/**
 * Project navigation. On desktop (md and up) it is a permanent column next to
 * the content. On small screens it is a drawer that slides in over the page,
 * opened from the hamburger button in the header.
 */
export default function Sidebar({ open, onClose }: SidebarProps) {
  const projects = useAppSelector((s) => s.projects);
  const { t, i18n } = useTranslation();

  // Where the drawer hides depends on the language: off the left edge in
  // English, off the right edge in Arabic (the sidebar sits on the start side).
  // Both full strings are written out because Tailwind only generates classes
  // it can find in the source, so it can't build "max-md:" + a variable.
  // `max-md:` limits this to small screens, and `invisible` also takes the
  // hidden drawer out of the Tab order and away from screen readers.
  const hidden =
    i18n.dir() === "rtl"
      ? "max-md:translate-x-full max-md:invisible"
      : "max-md:-translate-x-full max-md:invisible";

  return (
    <>
      {/* Dark backdrop behind the open drawer, small screens only. It starts
          below the header (top-14) so the header's menu button stays usable,
          and clicking it closes the drawer. */}
      {open && (
        <div
          aria-hidden
          className="fixed inset-x-0 top-14 bottom-0 z-30 bg-overlay md:hidden"
          onClick={onClose}
        />
      )}

      {/* Fixed under the header on small screens. From md up, `md:static`
          puts it back into the normal layout flow (otherwise it would float
          over the page content), and md:translate-x-0 keeps it visible.
          start-0 and border-e are logical, so it flips side in Arabic. */}
      <aside
        className={[
          "fixed top-14 bottom-0 start-0 z-40 flex w-64 flex-col gap-2 border-e border-border bg-surface p-3 transition-transform md:static md:translate-x-0",
          open ? "translate-x-0" : hidden,
        ].join(" ")}
      >
        <h2 className="px-2 text-xs font-semibold uppercase text-foreground-muted">
          {t("projects")}
        </h2>

        <ul className="flex flex-col gap-1">
          {projects.map((p) => (
            <li key={p.id}>
              {/* NavLink knows whether its route is the current one (isActive),
                  which drives the highlight. Selecting a project also closes
                  the drawer on small screens. */}
              <NavLink
                to={`/projects/${p.id}`}
                onClick={onClose}
                className={({ isActive }) =>
                  [
                    "block rounded-md px-2 py-1.5 text-[13px] font-medium transition-colors",
                    isActive
                      ? "bg-surface-hover font-semibold text-foreground"
                      : "text-foreground-muted hover:bg-surface-hover hover:text-foreground",
                  ].join(" ")
                }
                // Project names are user-written, so they pick their own
                // direction; the rest of the sidebar follows the page.
                dir="auto"
              >
                {p.name}
              </NavLink>
            </li>
          ))}

          {/* The dialog keeps its own open state; this button is only its trigger. */}
          <li>
            <CreateProjectDialog
              trigger={
                <AppButton
                  variant="ghost"
                  size="sm"
                  className="w-full justify-between text-foreground-muted"
                >
                  <span className="text-[13px] font-medium">
                    {t("projects:createProject")}
                  </span>
                  <Plus size={16} aria-hidden />
                </AppButton>
              }
            />
          </li>
        </ul>
      </aside>
    </>
  );
}
