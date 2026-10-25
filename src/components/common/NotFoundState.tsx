import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

type Props = {
  code: string;
  title: string;
  message?: string;
  linkTo: string;
  linkLabel: string;
};

export default function NotFoundState({
  code,
  title,
  message,
  linkTo,
  linkLabel,
}: Props) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 py-8 text-center">
      <p
        aria-hidden
        className="text-7xl font-bold text-foreground-muted md:text-9xl"
      >
        {code}
      </p>
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold md:text-2xl">{title}</h1>
        {message && (
          <p className="max-w-sm text-sm text-foreground-muted">{message}</p>
        )}
      </div>
      <Link
        to={linkTo}
        className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        {linkLabel}
        <ArrowRight size={16} aria-hidden className="rtl:rotate-180" />
      </Link>
    </div>
  );
}
